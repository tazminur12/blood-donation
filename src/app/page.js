import Navbar from "@/components/Navbar";
import Banner from "@/components/Banner";
import Featured from "@/components/Featured";
import RecentRequests from "@/components/RecentRequests";
import OurServices from "@/components/OurServices";
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
      </main>
      <Footer />
    </div>
  );
}
