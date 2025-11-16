import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MemberApplicationForm from "@/components/MemberApplicationForm";

export const metadata = {
  title: "সদস্যের আবেদন ফরম | গোবিন্দগঞ্জ স্বেচ্ছায় রক্তদান সংগঠন",
  description:
    "গোবিন্দগঞ্জ স্বেচ্ছায় রক্তদান সংগঠনের সদস্য হিসেবে আবেদন করুন।",
};

export default function MemberApplicationPage() {
  return (
    <div className="min-h-screen bg-rose-50/40">
      <Navbar />
      <main className="py-8">
        <MemberApplicationForm />
      </main>
      <Footer />
    </div>
  );
}

