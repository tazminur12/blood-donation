import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const stats = [
  { label: "স্বেচ্ছাসেবী সদস্য", value: "৮৫০+" },
  { label: "সম্পন্ন রক্তদান", value: "১২,৫০০+" },
  { label: "সক্রিয় জেলা", value: "২১" },
  { label: "জরুরি সাড়া", value: "৩,২০০+" },
];

const values = [
  {
    title: "মানবিকতা",
    description:
      "প্রত্যেকটি প্রাণমূল্যবান। আমাদের প্রথম অঙ্গীকার দ্রুততম সময়ে রক্ত সংগ্রহ করে রোগীর কাছে পৌঁছে দেওয়া।",
  },
  {
    title: "স্বচ্ছতা",
    description:
      "প্রতিটি রক্তদান, প্রতিটি অনুদান এবং প্রতিটি কার্যক্রম সঠিক তথ্যসহ সংরক্ষণ ও প্রকাশ করা হয়।",
  },
  {
    title: "প্রযুক্তির প্রয়োগ",
    description:
      "রক্তদাতাদের দ্রুত খুঁজে পেতে, যোগাযোগ করতে এবং সাড়া দিতে আধুনিক প্রযুক্তির ব্যবহার।",
  },
  {
    title: "সম্প্রীতি",
    description:
      "ধর্ম, বর্ণ, পেশা নির্বিশেষে সবাইকে সাথে নিয়ে একসাথে কাজ করার মাঝেই আমাদের শক্তি।",
  },
];

const milestones = [
  {
    year: "২০১৬",
    title: "যাত্রা শুরু",
    details: "গোপালগঞ্জের কিছু তরুণ রক্তদাতার হাত ধরে স্বেচ্ছায় রক্তদান কার্যক্রমের সূচনা।",
  },
  {
    year: "২০১৮",
    title: "ডিজিটাল প্ল্যাটফর্ম",
    details:
      "ফেসবুক গ্রুপ এবং হটলাইন চালু করে রক্তদাতাদের সাথে দ্রুত যোগাযোগের ব্যবস্থা করা হয়।",
  },
  {
    year: "২০২১",
    title: "জেলা সম্প্রসারণ",
    details: "গোপালগঞ্জের বাইরে পার্শ্ববর্তী জেলাগুলোতেও স্বেচ্ছাসেবীর সংখ্যা উল্লেখযোগ্যভাবে বৃদ্ধি পায়।",
  },
  {
    year: "২০২৪",
    title: "নতুন রূপ",
    details:
      "নতুন ওয়েব প্ল্যাটফর্ম, ডোনার ডাটাবেস এবং ইমার্জেন্সি রেসপন্স টিমের মাধ্যমে সেবা আরও সহজ করা হয়।",
  },
];

export const metadata = {
  title: "আমাদের সম্পর্কে | গোপালগঞ্জ স্বেচ্ছায় রক্তদান সংগঠন",
  description:
    "গোপালগঞ্জ স্বেচ্ছায় রক্তদান সংগঠনের নেপথ্যে থাকা স্বেচ্ছাসেবী, লক্ষ্য ও উদ্যোগ সম্পর্কে জানুন।",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-rose-50/40">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <section className="grid gap-10 rounded-3xl bg-white/70 p-6 shadow-sm backdrop-blur-md sm:p-10 lg:grid-cols-2">
          <div className="space-y-6">
            <span className="inline-flex w-fit items-center rounded-full bg-rose-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-rose-600">
              আমাদের গল্প
            </span>
            <h1 className="text-3xl font-bold text-rose-900 sm:text-4xl">
              রক্তদানে সমন্বিত এক পরিবার
            </h1>
            <p className="text-base leading-relaxed text-rose-900/80 sm:text-lg">
              গোপালগঞ্জ স্বেচ্ছায় রক্তদান সংগঠন একটি অলাভজনক উদ্যোগ যা জরুরি মুহূর্তে
              রক্তের প্রয়োজন মেটাতে সাড়াজাগানো ভূমিকা রাখছে। আমরা বিশ্বাস করি প্রত্যেকটি প্রাণই
              মূল্যবান এবং রক্তদান একটি মহৎ মানবিক দায়িত্ব। দ্রুত তথ্যপ্রযুক্তি ব্যবহারের মাধ্যমে
              দাতা ও গ্রহীতার মাঝে সেতুবন্ধন তৈরি করাই আমাদের লক্ষ্য।
            </p>
            <p className="text-base leading-relaxed text-rose-900/70">
              প্রতিদিন নতুন নতুন চ্যালেঞ্জ আসে—কখনো দুর্ঘটনা, কখনো জটিল অপারেশন অথবা
              শিশুর আকস্মিক রোগ। আমাদের স্বেচ্ছাসেবীরা চব্বিশ ঘণ্টাই প্রস্তুত থাকেন যেন
              সময়মতো নিরাপদ রক্ত সরবরাহ করা যায়। আমরা শুধু রক্তদান নয়, সচেতনতা,
              পরামর্শ এবং দাতাদের সঠিক তথ্য সংরক্ষণে গুরুত্ব দিই।
            </p>
          </div>
          <div className="rounded-3xl bg-gradient-to-br from-rose-500/90 via-rose-400 to-rose-500 text-white shadow-lg">
            <div className="grid grid-cols-2 gap-6 px-6 py-8 sm:px-10 sm:py-12">
              {stats.map((item) => (
                <div key={item.label} className="space-y-2">
                  <p className="text-3xl font-bold sm:text-4xl">{item.value}</p>
                  <p className="text-sm uppercase tracking-wide text-white/80">{item.label}</p>
                </div>
              ))}
            </div>
            <div className="rounded-3xl bg-white/15 px-6 py-4 text-sm text-white/90 sm:px-10">
              <p>
                “রক্তের প্রয়োজন যখন, তখনই পাশে থাকা–এটাই আমাদের অঙ্গীকার। মানবিকতার আলোয়
                পথচলা আমাদের এই পরিবার ক্রমেই বড় হচ্ছে, শুধু রক্তই নয়, ছড়িয়ে দিচ্ছে আশা।”
              </p>
            </div>
          </div>
        </section>

        <section className="mt-12 rounded-3xl bg-white/70 p-6 shadow-sm backdrop-blur sm:p-10">
          <h2 className="text-2xl font-semibold text-rose-900 sm:text-3xl">আমাদের মূল্যবোধ</h2>
          <p className="mt-3 max-w-3xl text-sm text-rose-900/70 sm:text-base">
            টিমের প্রত্যেক সদস্য একই আদর্শে বিশ্বাসী। নৈতিকতা, সচ্ছতা, প্রযুক্তি ও
            সম্প্রীতির মেলবন্ধনই আমাদের অগ্রযাত্রাকে গতিশীল করে।
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border border-rose-100 bg-gradient-to-br from-white via-white to-rose-50/60 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-rose-900">{value.title}</h3>
                <p className="mt-2 text-sm text-rose-900/70">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-3xl bg-white/70 p-6 shadow-sm backdrop-blur sm:p-10">
          <h2 className="text-2xl font-semibold text-rose-900 sm:text-3xl">যাত্রাপথের বাঁক</h2>
          <p className="mt-3 max-w-3xl text-sm text-rose-900/70 sm:text-base">
            শুরু থেকে বর্তমান—ধাপে ধাপে আমরা এগিয়ে চলেছি স্বেচ্ছাসেবার নতুন মান তৈরি করতে।
          </p>
          <div className="mt-8 space-y-6 border-l-2 border-dashed border-rose-200 pl-6 sm:pl-8">
            {milestones.map((milestone) => (
              <div
                key={milestone.year}
                className="relative rounded-2xl border border-rose-100 bg-gradient-to-br from-white via-white to-rose-50/70 p-5 shadow-sm"
              >
                <span className="absolute -left-9 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 font-semibold text-white">
                  {milestone.year}
                </span>
                <h3 className="text-lg font-semibold text-rose-900">{milestone.title}</h3>
                <p className="mt-2 text-sm text-rose-900/70">{milestone.details}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-3xl bg-rose-500/90 p-6 text-white shadow-lg sm:p-10">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold sm:text-3xl">আপনার সাথে আমাদের পথচলা</h2>
              <p className="text-sm leading-relaxed text-rose-50/90 sm:text-base">
                আমরা চাই স্বেচ্ছাসেবীরা শুধু রক্তদানই নয়, বরং দীর্ঘমেয়াদি সম্পর্কের মাধ্যমে
                মানবিকতার চর্চা করুক। স্বেচ্ছাসেবী প্রশিক্ষণ, স্বাস্থ্য সচেতনতা ও সামাজিক কার্যক্রম
                নিয়ে নিয়মিত উদ্যোগ চলমান রয়েছে। যে কেউ ইচ্ছুক হলে সহজেই আমাদের প্ল্যাটফর্মে
                যুক্ত হতে পারেন।
              </p>
            </div>
            <div className="rounded-2xl bg-white/15 p-5 text-sm text-rose-50/90 sm:text-base">
              <p>
                স্বেচ্ছায় রক্তদান সংগঠনকে আরও শক্তিশালী করতে আপনার কাছে আমাদের আহ্বান। আপনি হতে
                পারেন স্বেচ্ছাসেবী, রক্তদাতা কিংবা সংগঠনের শুভাকাঙ্ক্ষী—আপনার সহযোগিতায়ই সম্ভব
                আরও বেশি মানুষের কাছে নিরাপদ রক্ত পৌঁছে দেওয়া।
              </p>
              <a
                href="/registration"
                className="mt-5 inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-rose-600 shadow-sm transition hover:bg-rose-100"
              >
                আমাদের সাথে যোগ দিন
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}


