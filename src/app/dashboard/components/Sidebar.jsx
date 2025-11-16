"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  FaUsers,
  FaUser,
  FaUserShield,
  FaFileAlt,
  FaCog,
  FaBell,
  FaHistory,
  FaCheckCircle,
  FaUserTie,
  FaSearch,
  FaBriefcase,
  FaEdit,
  FaAward,
  FaConciergeBell,
  FaImage,
  FaUsersCog,
  FaClipboardList,
} from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";
import { HiOutlineDocumentText } from "react-icons/hi";
import { BiMessageSquareDots } from "react-icons/bi";
import { RiTeamLine } from "react-icons/ri";
import { IoMdAnalytics } from "react-icons/io";
import { TbPackage } from "react-icons/tb";
import { AiOutlinePlusCircle } from "react-icons/ai";

const NavItem = ({ href, label, icon: Icon, onClick }) => {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${
        active
          ? "bg-sky-100 text-sky-700 shadow-sm ring-1 ring-sky-200"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      {Icon ? <Icon className="w-5 h-5" /> : null}
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
};

export default function Sidebar({ variant = "desktop", onNavigate }) {
  const { data: session } = useSession();
  const role = session?.user?.role || "user";

  const isAdmin = role === "admin";
  const isVolunteer = role === "volunteer";
  const isDonor = role === "donor" || (!isAdmin && !isVolunteer);

  const [adminStats, setAdminStats] = useState({
    users: 0,
    donors: 0,
    requests: 0,
    volunteers: 0,
  });

  const [donorStats, setDonorStats] = useState({
    donations: 0,
    appointments: 0,
    history: 0,
    requests: 0,
  });

  const [volunteerStats, setVolunteerStats] = useState({
    events: 0,
    hours: 0,
    campaigns: 0,
  });

  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    // Load stats based on role
    async function loadStats() {
      if (!session?.user?.email) return;

      setStatsLoading(true);
      try {
        if (isAdmin) {
          // Load admin stats
          const res = await fetch("/api/admin/stats", { cache: "no-store" });
          if (res.ok) {
            const data = await res.json();
            const s = data?.stats || {};
            setAdminStats({
              users: s.users || 0,
              donors: s.donors || 0,
              requests: s.requests || 0,
              volunteers: s.volunteers || 0,
            });
          }
        } else if (isVolunteer) {
          // Load volunteer stats
          const res = await fetch("/api/volunteer/stats", { cache: "no-store" });
          if (res.ok) {
            const data = await res.json();
            const s = data?.stats || {};
            setVolunteerStats({
              events: s.events || 0,
              hours: s.hours || 0,
              campaigns: s.campaigns || 0,
            });
          }
        } else {
          // Load donor stats (default users are donors)
          const res = await fetch("/api/donor/stats", { cache: "no-store" });
          if (res.ok) {
            const data = await res.json();
            const s = data?.stats || {};
            setDonorStats({
              donations: s.donations || 0,
              appointments: s.appointments || 0,
              history: s.history || 0,
              requests: s.requests || 0,
            });
          }
        }
      } catch (e) {
        // Silent fail for sidebar
      } finally {
        setStatsLoading(false);
      }
    }

    loadStats();
  }, [session?.user?.email, isAdmin, isDonor, isVolunteer]);

  const containerClass =
    variant === "mobile"
      ? "w-72 shrink-0 bg-white h-full flex flex-col"
      : "w-60 shrink-0 border-r border-slate-200 bg-white h-screen sticky top-0 hidden md:flex flex-col";

  const itemClick = () => {
    if (variant === "mobile" && typeof onNavigate === "function") onNavigate();
  };

  return (
    <aside className={containerClass}>
      <div className="px-4 py-4 border-b border-slate-200">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500 text-white font-bold text-lg shadow-lg">
              BD
            </div>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-rose-600">Blood Donation</h1>
              <p className="text-[10px] text-slate-500 -mt-1 font-light">
                জীবন রক্ষাকারী প্ল্যাটফর্ম
              </p>
            </div>
          </div>
        </Link>
      </div>

      <nav className="px-2 py-4 space-y-1 overflow-y-auto flex-1">
        <div className="text-xs uppercase px-4 mb-1 text-slate-500">সারসংক্ষেপ</div>
        <NavItem
          href="/dashboard"
          label="ড্যাশবোর্ড"
          icon={MdSpaceDashboard}
          onClick={itemClick}
        />
        <NavItem
          href="/dashboard/service"
          label="সব সেবা"
          icon={FaConciergeBell}
          onClick={itemClick}
        />

        {/* Admin Navigation */}
        {isAdmin && (
          <>
            <div className="text-xs uppercase px-4 mt-4 mb-1 text-slate-500">
              ব্যবহারকারী ব্যবস্থাপনা
            </div>
            <NavItem
              href="/dashboard/admin/users"
              label="সব ব্যবহারকারী"
              icon={FaUsers}
              onClick={itemClick}
            />
            <NavItem
              href="/dashboard/admin/donors"
              label="রক্তদাতা"
              icon={FaUser}
              onClick={itemClick}
            />
            <NavItem
              href="/dashboard/admin/volunteers"
              label="স্বেচ্ছাসেবক"
              icon={RiTeamLine}
              onClick={itemClick}
            />
            <NavItem
              href="/dashboard/admin/roles"
              label="ভূমিকা ব্যবস্থাপনা"
              icon={FaUserShield}
              onClick={itemClick}
            />
            <NavItem
              href="/dashboard/admin/committee"
              label="কমিটি"
              icon={FaUsersCog}
              onClick={itemClick}
            />
            <NavItem
              href="/dashboard/admin/member-applications"
              label="সদস্য আবেদন"
              icon={FaClipboardList}
              onClick={itemClick}
            />

            <div className="text-xs uppercase px-4 mt-4 mb-1 text-slate-500">
              রক্ত ব্যবস্থাপনা
            </div>
            <NavItem
              href="/dashboard/admin/requests"
              label="রক্ত অনুরোধ"
              icon={HiOutlineDocumentText}
              onClick={itemClick}
            />
            <NavItem
              href="/dashboard/admin/inventory"
              label="সামগ্রী"
              icon={TbPackage}
              onClick={itemClick}
            />
            <NavItem
              href="/dashboard/admin/appointments"
              label="নিয়োগ"
              icon={FaCheckCircle}
              onClick={itemClick}
            />

            <div className="text-xs uppercase px-4 mt-4 mb-1 text-slate-500">
              ক্যাম্পেইন এবং ইভেন্ট
            </div>
            <NavItem
              href="/dashboard/admin/campaigns"
              label="ক্যাম্পেইন"
              icon={AiOutlinePlusCircle}
              onClick={itemClick}
            />
            <NavItem
              href="/dashboard/admin/drives"
              label="রক্তদান অভিযান"
              icon={FaBriefcase}
              onClick={itemClick}
            />

            <div className="text-xs uppercase px-4 mt-4 mb-1 text-slate-500">
              বিশ্লেষণ এবং প্রতিবেদন
            </div>
            <NavItem
              href="/dashboard/admin/analytics"
              label="বিশ্লেষণ"
              icon={IoMdAnalytics}
              onClick={itemClick}
            />
            <NavItem
              href="/dashboard/admin/reports"
              label="প্রতিবেদন"
              icon={FaFileAlt}
              onClick={itemClick}
            />

            <div className="text-xs uppercase px-4 mt-4 mb-1 text-slate-500">
              কনটেন্ট ব্যবস্থাপনা
            </div>
            <NavItem
              href="/dashboard/admin/blogs"
              label="ব্লগ"
              icon={FaFileAlt}
              onClick={itemClick}
            />
            <NavItem
              href="/dashboard/admin/media"
              label="মিডিয়া"
              icon={FaImage}
              onClick={itemClick}
            />

            <div className="text-xs uppercase px-4 mt-4 mb-1 text-slate-500">
              সিস্টেম
            </div>
            <NavItem
              href="/dashboard/admin/settings"
              label="সিস্টেম সেটিংস"
              icon={FaCog}
              onClick={itemClick}
            />
            <NavItem
              href="/dashboard/admin/notifications"
              label="বিজ্ঞপ্তি"
              icon={FaBell}
              onClick={itemClick}
            />
          </>
        )}

        {/* Donor Navigation */}
        {isDonor && (
          <>
            <div className="text-xs uppercase px-4 mt-4 mb-1 text-slate-500">
              দান
            </div>
            <NavItem
              href="/dashboard/donor/profile"
              label="আমার প্রোফাইল"
              icon={FaUserTie}
              onClick={itemClick}
            />
            <NavItem
              href="/dashboard/donor/appointments"
              label="আমার নিয়োগ"
              icon={FaCheckCircle}
              onClick={itemClick}
            />
            <NavItem
              href="/dashboard/donor/history"
              label="দানের ইতিহাস"
              icon={FaHistory}
              onClick={itemClick}
            />
            <NavItem
              href="/dashboard/donor/book-appointment"
              label="নিয়োগ বুক করুন"
              icon={AiOutlinePlusCircle}
              onClick={itemClick}
            />
            <NavItem
              href="/dashboard/donor/certificates"
              label="সনদপত্র"
              icon={FaAward}
              onClick={itemClick}
            />

            <div className="text-xs uppercase px-4 mt-4 mb-1 text-slate-500">
              তথ্য
            </div>
            <NavItem
              href="/dashboard/donor/requests"
              label="রক্ত অনুরোধ"
              icon={HiOutlineDocumentText}
              onClick={itemClick}
            />
            <NavItem
              href="/dashboard/donor/campaigns"
              label="ক্যাম্পেইন"
              icon={FaBriefcase}
              onClick={itemClick}
            />

            <div className="text-xs uppercase px-4 mt-4 mb-1 text-slate-500">
              সেটিংস
            </div>
            <NavItem
              href="/dashboard/donor/settings"
              label="অ্যাকাউন্ট সেটিংস"
              icon={FaCog}
              onClick={itemClick}
            />
          </>
        )}

        {/* Volunteer Navigation */}
        {isVolunteer && (
          <>
            <div className="text-xs uppercase px-4 mt-4 mb-1 text-slate-500">
              স্বেচ্ছাসেবক
            </div>
            <NavItem
              href="/dashboard/volunteer/profile"
              label="আমার প্রোফাইল"
              icon={FaUserTie}
              onClick={itemClick}
            />
            <NavItem
              href="/dashboard/volunteer/events"
              label="ইভেন্ট"
              icon={FaBriefcase}
              onClick={itemClick}
            />
            <NavItem
              href="/dashboard/volunteer/campaigns"
              label="ক্যাম্পেইন"
              icon={AiOutlinePlusCircle}
              onClick={itemClick}
            />
            <NavItem
              href="/dashboard/volunteer/history"
              label="কার্যক্রমের ইতিহাস"
              icon={FaHistory}
              onClick={itemClick}
            />

            <div className="text-xs uppercase px-4 mt-4 mb-1 text-slate-500">
              যোগাযোগ
            </div>
            <NavItem
              href="/dashboard/volunteer/messages"
              label="বার্তা"
              icon={BiMessageSquareDots}
              onClick={itemClick}
            />
            <NavItem
              href="/dashboard/volunteer/notifications"
              label="বিজ্ঞপ্তি"
              icon={FaBell}
              onClick={itemClick}
            />

            <div className="text-xs uppercase px-4 mt-4 mb-1 text-slate-500">
              সেটিংস
            </div>
            <NavItem
              href="/dashboard/volunteer/settings"
              label="অ্যাকাউন্ট সেটিংস"
              icon={FaCog}
              onClick={itemClick}
            />
          </>
        )}

      </nav>

      <div className="mt-auto p-4 border-t border-slate-200">
        <div className="text-xs text-slate-500 mb-2">দ্রুত পরিসংখ্যান</div>
        <div className="mt-2 space-y-2 text-sm">
          {isAdmin ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">মোট ব্যবহারকারী</span>
                <span className="px-2 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-semibold">
                  {statsLoading ? "-" : adminStats.users}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">রক্তদাতা</span>
                <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                  {statsLoading ? "-" : adminStats.donors}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">অনুরোধ</span>
                <span className="px-2 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold">
                  {statsLoading ? "-" : adminStats.requests}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">স্বেচ্ছাসেবক</span>
                <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                  {statsLoading ? "-" : adminStats.volunteers}
                </span>
              </div>
            </>
          ) : isVolunteer ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">ইভেন্ট</span>
                <span className="px-2 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-semibold">
                  {statsLoading ? "-" : volunteerStats.events}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">ঘণ্টা</span>
                <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                  {statsLoading ? "-" : volunteerStats.hours}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">ক্যাম্পেইন</span>
                <span className="px-2 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold">
                  {statsLoading ? "-" : volunteerStats.campaigns}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">দান</span>
                <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                  {statsLoading ? "-" : donorStats.donations}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">নিয়োগ</span>
                <span className="px-2 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-semibold">
                  {statsLoading ? "-" : donorStats.appointments}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">অনুরোধ</span>
                <span className="px-2 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold">
                  {statsLoading ? "-" : donorStats.requests}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">ইতিহাস</span>
                <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                  {statsLoading ? "-" : donorStats.history}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
