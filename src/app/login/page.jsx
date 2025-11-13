import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginForm from "@/components/LoginForm";

export const metadata = {
  title: "লগইন | গোপালগঞ্জ স্বেচ্ছায় রক্তদান সংগঠন",
  description:
    "গোপালগঞ্জ স্বেচ্ছায় রক্তদান সংগঠন প্ল্যাটফর্মে লগইন করুন এবং রক্তদানের সেবায় অংশ নিন।",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-rose-50/40">
      <Navbar />
      <main className="py-12">
        <LoginForm />
      </main>
      <Footer />
    </div>
  );
}

