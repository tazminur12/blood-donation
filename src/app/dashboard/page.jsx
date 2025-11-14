export default function DashboardPage() {
  const stats = [
    { label: "Active Donors", value: "1,284", change: "+12%" },
    { label: "Pending Requests", value: "47", change: "-5%" },
    { label: "Scheduled Drives", value: "9", change: "+2" },
  ];

  const upcomingDrives = [
    {
      title: "University Pop-Up",
      date: "18 Nov 2025",
      location: "Dhaka University Campus",
      volunteers: 18,
    },
    {
      title: "Community Health Day",
      date: "24 Nov 2025",
      location: "Chittagong Medical Center",
      volunteers: 26,
    },
    {
      title: "Corporate Giving",
      date: "30 Nov 2025",
      location: "Tech Park Banani",
      volunteers: 14,
    },
  ];

  const recentActivities = [
    {
      id: 1,
      name: "Sadia Rahman",
      action: "confirmed a donation slot",
      time: "2 hours ago",
    },
    {
      id: 2,
      name: "Amirul Islam",
      action: "updated contact information",
      time: "5 hours ago",
    },
    {
      id: 3,
      name: "Ayesha Khatun",
      action: "requested O+ plasma",
      time: "Yesterday",
    },
  ];

  return (
    <div className="space-y-6 text-slate-900">
      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-sky-200 hover:shadow-md"
          >
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">
              {stat.value}
            </p>
            <p className="mt-2 text-xs font-medium text-emerald-500">
              {stat.change} this week
            </p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Activity Pulse
              </p>
              <h2 className="text-2xl font-semibold text-slate-900">
                Weekly Progress
              </h2>
            </div>
            <button className="rounded-full border border-sky-200 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-sky-600 transition hover:bg-sky-50">
              View Report
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {upcomingDrives.map((drive) => (
              <div
                key={drive.title}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  {drive.date}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">
                  {drive.title}
                </h3>
                <p className="mt-1 text-sm text-slate-600">{drive.location}</p>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <span className="inline-flex items-center rounded-full bg-sky-100 px-3 py-1 font-semibold text-sky-700">
                    {drive.volunteers} volunteers
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-500">Ready for follow-up</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Recent Activity
            </h2>
            <button className="text-xs font-semibold text-sky-600 hover:text-sky-500">
              See all
            </button>
          </div>

          <ul className="mt-6 space-y-5">
            {recentActivities.map((activity) => (
              <li key={activity.id} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400"></span>
                <div>
                  <p className="text-sm text-slate-600">
                    <span className="font-semibold text-slate-900">
                      {activity.name}
                    </span>{" "}
                    {activity.action}
                  </p>
                  <p className="text-xs text-slate-500">{activity.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Priority Requests
            </h2>
            <button className="rounded-full border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-50">
              Manage
            </button>
          </div>
          <div className="mt-5 space-y-4">
            {["A+", "B-", "O-"].map((group) => (
              <div
                key={group}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <div>
                  <p className="text-sm text-slate-500">Blood Group</p>
                  <p className="text-xl font-semibold text-slate-900">
                    {group}
                  </p>
                </div>
                <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-rose-600">
                  urgent
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Outreach Tasks
            </h2>
            <button className="rounded-full border border-sky-200 px-3 py-1 text-xs font-semibold text-sky-600 hover:bg-sky-50">
              Assign
            </button>
          </div>
          <ul className="mt-5 space-y-4">
            <li className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Follow up with last week&apos;s donors for plasma donation.
            </li>
            <li className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Prepare awareness materials for campus campaign.
            </li>
            <li className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Send thank-you notes to recent volunteers.
            </li>
          </ul>
        </div>
      </section>

    </div>
  );
}

