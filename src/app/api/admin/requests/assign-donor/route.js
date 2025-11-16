import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";
import { sendDonorAssignmentEmail } from "@/lib/email";

const DB_NAME = process.env.DB_NAME || "blood-donation";

// POST - Assign donor to blood request (admin only)
export async function POST(request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const users = db.collection("users");
    
    const user = await users.findOne({ email: session.user.email });
    const userRole = user?.role || session?.user?.role;

    if (userRole !== "admin") {
      return NextResponse.json(
        { 
          error: "Unauthorized - Admin access required",
          currentRole: userRole,
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { requestId, donorEmail } = body;

    if (!requestId || !donorEmail) {
      return NextResponse.json(
        { error: "Request ID and donor email are required" },
        { status: 400 }
      );
    }

    const requestsCollection = db.collection("bloodRequests");
    const { ObjectId } = await import("mongodb");

    // Get the request
    const bloodRequest = await requestsCollection.findOne({
      _id: new ObjectId(requestId),
    });

    if (!bloodRequest) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    // Check if request is already fulfilled
    if (bloodRequest.status === "fulfilled") {
      return NextResponse.json(
        { error: "This request has already been fulfilled" },
        { status: 400 }
      );
    }

    // Check if request is cancelled
    if (bloodRequest.status === "cancelled") {
      return NextResponse.json(
        { error: "This request has been cancelled" },
        { status: 400 }
      );
    }

    // Get donor information
    const donor = await users.findOne(
      { email: donorEmail, role: "donor" },
      { projection: { password: 0 } }
    );

    if (!donor) {
      return NextResponse.json(
        { error: "Donor not found" },
        { status: 404 }
      );
    }

    // Check if donor has matching blood group
    if (donor.bloodGroup !== bloodRequest.bloodGroup) {
      return NextResponse.json(
        { error: "Donor blood group does not match request" },
        { status: 400 }
      );
    }

    // Update request status to fulfilled
    const updateResult = await requestsCollection.updateOne(
      { _id: new ObjectId(requestId) },
      {
        $set: {
          status: "fulfilled",
          fulfilledBy: donorEmail,
          fulfilledAt: new Date(),
          donorInfo: {
            name: donor.name || null,
            email: donor.email || null,
            mobile: donor.mobile || null,
            bloodGroup: donor.bloodGroup || null,
            division: donor.division || null,
            district: donor.district || null,
            upazila: donor.upazila || null,
          },
          updatedAt: new Date(),
        },
      }
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    // Create donation record
    const donationsCollection = db.collection("donations");
    await donationsCollection.insertOne({
      requestId: new ObjectId(requestId),
      donorEmail: donorEmail,
      donorName: donor.name || null,
      donorBloodGroup: donor.bloodGroup || null,
      patientName: bloodRequest.patientName || null,
      bloodGroup: bloodRequest.bloodGroup || null,
      units: bloodRequest.units || 1,
      hospital: bloodRequest.hospital || null,
      donationDate: new Date(),
      status: "completed",
      assignedBy: session.user.email,
      createdAt: new Date(),
    });

    // Update donor's donation count
    await users.updateOne(
      { email: donorEmail },
      {
        $inc: { totalDonations: 1 },
        $set: { lastDonation: new Date() },
      }
    );

    // Create notification for requester
    if (bloodRequest.requesterEmail) {
      const notificationsCollection = db.collection("notifications");
      await notificationsCollection.insertOne({
        recipientEmail: bloodRequest.requesterEmail,
        type: "success",
        title: "রক্তের অনুরোধ পূরণ হয়েছে",
        message: `আপনার রক্তের অনুরোধের জন্য একজন রক্তদাতা নির্ধারণ করা হয়েছে। রক্তদাতার তথ্য আপনার email এ পাঠানো হয়েছে।`,
        read: false,
        createdAt: new Date(),
        actionUrl: `/request/${requestId}`,
      });
    }

    // Send email to requester with donor information
    if (bloodRequest.requesterEmail) {
      try {
        // Get requester name if available
        let requesterName = bloodRequest.requesterName;
        if (!requesterName) {
          const requesterUser = await users.findOne(
            { email: bloodRequest.requesterEmail },
            { projection: { name: 1 } }
          );
          requesterName = requesterUser?.name || null;
        }

        // Prepare donor info
        const donorInfo = {
          name: donor.name || "নাম নেই",
          mobile: donor.mobile || "প্রদান করা হয়নি",
          email: donor.email || "প্রদান করা হয়নি",
          bloodGroup: donor.bloodGroup || "নির্ধারিত নয়",
          location: [
            donor.division,
            donor.district,
            donor.upazila,
          ].filter(Boolean).join(", ") || "নির্ধারিত নয়",
          totalDonations: donor.totalDonations || 0,
        };

        // Prepare request info
        const requestInfo = {
          bloodGroup: bloodRequest.bloodGroup || "নির্ধারিত নয়",
          units: bloodRequest.units || 1,
          hospital: bloodRequest.hospital || null,
        };

        // Send email
        const emailResult = await sendDonorAssignmentEmail({
          to: bloodRequest.requesterEmail,
          requesterName: requesterName,
          patientName: bloodRequest.patientName,
          donorInfo: donorInfo,
          requestInfo: requestInfo,
        });

        if (emailResult.success) {
          console.log("Email sent successfully to:", bloodRequest.requesterEmail);
        } else {
          console.warn("Email sending failed:", emailResult.error);
        }

      } catch (emailError) {
        console.error("Error sending email:", emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "রক্তদাতা সফলভাবে নির্ধারণ করা হয়েছে এবং Requester এর email এ তথ্য পাঠানো হয়েছে",
        request: {
          id: requestId,
          status: "fulfilled",
        },
        donor: {
          name: donor.name,
          email: donor.email,
          mobile: donor.mobile,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error assigning donor:", error);
    return NextResponse.json(
      { error: "Failed to assign donor", details: error.message },
      { status: 500 }
    );
  }
}

