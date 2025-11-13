import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RegistrationForm from "@/components/RegistrationForm";

export const metadata = {
  title: "নিবন্ধন | গোপালগঞ্জ স্বেচ্ছায় রক্তদান সংগঠন",
  description:
    "গোপালগঞ্জ স্বেচ্ছায় রক্তদান সংগঠনের প্ল্যাটফর্মে স্বেচ্ছাসেবী হিসেবে নিবন্ধন করুন।",
};

export default function RegistrationPage() {
  return (
    <div className="min-h-screen bg-rose-50/40">
      <Navbar />
      <main className="py-4">
        <RegistrationForm />
      </main>
      <Footer />
    </div>
  );
}

