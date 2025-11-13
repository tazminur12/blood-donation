"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaBell, FaCheckCircle, FaInfoCircle, FaExclamationTriangle, FaExclamationCircle, FaSignOutAlt, FaUser, FaCog } from "react-icons/fa";

export default function Topbar({ onMenuClick }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);

  const { name, initials, roleLabel, email } = useMemo(() => {
    const defaultName = "Guest User";
    const userName =
      session?.user?.name ||
      session?.user?.email?.split("@")[0] ||
      defaultName;

    const safeInitials = userName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("");

    const role = session?.user?.role || "donor";
    const normalizedRole =
      role === "admin"
        ? "Admin"
        : role === "volunteer"
        ? "Volunteer"
        : "Donor";

    return {
      name: userName,
      initials: safeInitials || "BD",
      roleLabel: normalizedRole,
      email: session?.user?.email || "",
    };
  }, [session?.user?.name, session?.user?.email, session?.user?.role]);

  const greetingText =
    status === "loading" ? "Loading..." : `${roleLabel} Dashboard`;
  const welcomeSubtext =
    status === "loading"
      ? "Please wait"
      : email
      ? `Welcome back, ${email}`
      : "Welcome back";

  // Fetch notifications
  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      loadNotifications();
      // Refresh notifications every 30 seconds
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [status, session?.user?.email]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/notifications?limit=10&unreadOnly=false");
      const data = await res.json();
      
      if (res.ok) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId, currentReadStatus) => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notificationId,
          read: !currentReadStatus,
        }),
      });

      if (res.ok) {
        // Update local state
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId
              ? { ...n, read: !currentReadStatus, readAt: !currentReadStatus ? new Date() : null }
              : n
          )
        );
        // Update unread count
        if (!currentReadStatus) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        } else {
          setUnreadCount((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.error("Error updating notification:", error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return FaCheckCircle;
      case "warning":
        return FaExclamationTriangle;
      case "error":
        return FaExclamationCircle;
      default:
        return FaInfoCircle;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "success":
        return "text-emerald-600 bg-emerald-50";
      case "warning":
        return "text-amber-600 bg-amber-50";
      case "error":
        return "text-rose-600 bg-rose-50";
      default:
        return "text-blue-600 bg-blue-50";
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    try {
      const now = new Date();
      const notificationDate = new Date(date);
      const diffInSeconds = Math.floor((now - notificationDate) / 1000);

      if (diffInSeconds < 60) return "এখনই";
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} মিনিট আগে`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ঘণ্টা আগে`;
      if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} দিন আগে`;
      
      return notificationDate.toLocaleDateString("bn-BD", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:border-sky-300 hover:text-sky-600 lg:hidden"
          aria-label="Open navigation menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            {welcomeSubtext}
          </p>
          <p className="text-lg font-semibold text-slate-900">{greetingText}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 shadow-sm sm:flex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-4 w-4 text-slate-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 105.25 5.25a7.5 7.5 0 0011.4 11.4z"
            />
          </svg>
          <input
            type="search"
            placeholder="Search donors, requests..."
            className="bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-sky-300 hover:text-sky-600"
            aria-label="Notifications"
          >
            <FaBell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs font-semibold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-xl z-50 max-h-[500px] overflow-hidden flex flex-col">
              <div className="border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">বিজ্ঞপ্তি</h3>
                {unreadCount > 0 && (
                  <span className="text-xs text-slate-600">
                    {unreadCount} অপঠিত
                  </span>
                )}
              </div>
              
              <div className="overflow-y-auto flex-1">
                {loading ? (
                  <div className="p-8 text-center text-slate-500">
                    লোড হচ্ছে...
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">
                    <FaBell className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                    <p>কোন বিজ্ঞপ্তি নেই</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {notifications.map((notification) => {
                      const Icon = getNotificationIcon(notification.type);
                      return (
                        <div
                          key={notification.id}
                          className={`p-4 hover:bg-slate-50 transition cursor-pointer ${
                            !notification.read ? "bg-blue-50" : ""
                          }`}
                          onClick={() => {
                            if (!notification.read) {
                              handleMarkAsRead(notification.id, notification.read);
                            }
                            if (notification.actionUrl) {
                              window.location.href = notification.actionUrl;
                            }
                            setShowNotifications(false);
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${getNotificationColor(notification.type)}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className={`text-sm font-semibold ${!notification.read ? "text-slate-900" : "text-slate-700"}`}>
                                  {notification.title}
                                </h4>
                                {!notification.read && (
                                  <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0 mt-1"></span>
                                )}
                              </div>
                              <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-slate-400 mt-2">
                                {formatDate(notification.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {notifications.length > 0 && session?.user?.role === "admin" && (
                <div className="border-t border-slate-200 px-4 py-2">
                  <a
                    href="/dashboard/admin/notifications"
                    className="text-sm text-sky-600 hover:text-sky-700 font-medium text-center block"
                    onClick={() => setShowNotifications(false)}
                  >
                    সব বিজ্ঞপ্তি দেখুন
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 rounded-lg px-2 py-1 hover:bg-slate-50 transition"
          >
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-900">
                {status === "loading" ? "Loading..." : name}
              </p>
              <p className="text-xs text-slate-500">
                {status === "loading" ? "..." : roleLabel}
              </p>
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-sky-100 text-base font-semibold text-sky-700">
              {status === "loading" ? "..." : initials}
            </span>
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-xl z-50">
              <div className="p-2">
                <div className="px-3 py-2 border-b border-slate-200">
                  <p className="text-sm font-semibold text-slate-900">{name}</p>
                  <p className="text-xs text-slate-500">{email}</p>
                  <p className="text-xs text-slate-400 mt-1">{roleLabel}</p>
                </div>
                
                <div className="py-1">
                  <a
                    href={
                      session?.user?.role === "admin"
                        ? "/dashboard"
                        : session?.user?.role === "volunteer"
                        ? "/dashboard"
                        : "/dashboard/donor/profile"
                    }
                    className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <FaUser className="text-slate-500" />
                    <span>প্রোফাইল</span>
                  </a>
                  {session?.user?.role === "admin" && (
                    <a
                      href="/dashboard/admin/settings"
                      className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FaCog className="text-slate-500" />
                      <span>সেটিংস</span>
                    </a>
                  )}
                </div>

                <div className="border-t border-slate-200 pt-1 mt-1">
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowUserMenu(false);
                    }}
                    className="flex w-full items-center gap-3 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  >
                    <FaSignOutAlt />
                    <span>লগআউট</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

