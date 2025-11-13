import Link from "next/link";

const highlightCards = [
  {
    title: "রক্তের আবেদন করুন",
    description:
      "জরুরি রক্তের প্রয়োজন হলে তাৎক্ষণিকভাবে অনুরোধ পাঠান। আমাদের স্বেচ্ছাসেবক দাতারা দ্রুত আপনার সঙ্গে যোগাযোগ করবে।",
    actionLabel: "অনুরোধ পাঠান",
    href: "/request",
    accent: "bg-rose-100 text-highlighted",
  },
  {
    title: "দাতা হিসেবে নিবন্ধন",
    description:
      "আপনার রক্ত হতে পারে কারও নতুন জীবন শুরু করার আশ্বাস। আমাদের ডাটাবেজে যুক্ত হয়ে প্রয়োজনমতো সাহায্যের হাত বাড়ান।",
    actionLabel: "দাতা হোন",
    href: "/registration",
    accent: "bg-emerald-100 text-emerald-700",
  },
];

export default function Featured() {
  return (
    <section className="py-16">
      <div className="container mx-auto flex max-w-5xl flex-col gap-10 px-4 text-center sm:px-6 md:text-left lg:px-8">
        <div className="space-y-4 text-center md:text-left">
          <span className="inline-flex items-center justify-center rounded-full bg-rose-100 px-4 py-1 text-sm font-semibold text-highlighted">
            রক্ত দিন, জীবন বাঁচান ❤️
          </span>
          <h2 className="text-3xl font-bold text-slate-800 sm:text-4xl">
            মানবতার সেবায় আপনার অংশগ্রহণ সবচেয়ে গুরুত্বপূর্ণ
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-slate-600 md:mx-0">
            একটি ব্যাগ রক্ত তিনজন মানুষের জীবন বাঁচাতে পারে। আপনার মানবিক উদ্যোগে
            কেউ নতুন করে বেঁচে উঠতে পারে। আমাদের এই স্বেচ্ছাসেবী প্ল্যাটফর্মে আমাকে,
            আপনাকে এবং আমাদের সবাইকে একসাথে কাজ করতে হবে।
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {highlightCards.map(({ title, description, actionLabel, href, accent }) => (
            <article
              key={href}
              className="group flex h-full flex-col justify-between rounded-3xl bg-white/80 p-8 shadow-lg ring-1 ring-white/70 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="space-y-4">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${accent}`}
                >
                  {title}
                </span>
                <p className="text-base leading-7 text-slate-600">{description}</p>
              </div>
              <div className="mt-6">
                <Link
                  href={href}
                  className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-5 py-2 text-sm font-semibold text-white transition group-hover:bg-rose-600"
                >
                  {actionLabel}
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArrowRightIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}
