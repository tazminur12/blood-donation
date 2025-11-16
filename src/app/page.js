import Navbar from "@/components/Navbar";
import Banner from "@/components/Banner";
import Featured from "@/components/Featured";
import RecentRequests from "@/components/RecentRequests";
import OurServices from "@/components/OurServices";
import VolunteerSection from "@/components/VolunteerSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-rose-50/40">
      <Navbar />
      <main className="space-y-16">
        <Banner />
        <RecentRequests />
        <Featured />
        <OurServices />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <VolunteerSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
