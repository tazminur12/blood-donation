"use client";

import { useContext, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthContext } from "@/providers/AuthProvider";

const menu = [
  { name: "Home", path: "/" },
  { name: "All Donor", path: "/donors" },
  { name: "Request", path: "/request" },
  { name: "Blog", path: "/blog" },
];

const createIsActive = (pathname) => (targetPath) => {
  if (targetPath === "/") {
    return pathname === "/";
  }
  return pathname.startsWith(targetPath);
};

export default function Navbar() {
  const { user, logOut } = useContext(AuthContext);
  const pathname = usePathname();
  const isActive = useMemo(() => createIsActive(pathname), [pathname]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const handleNavLinkClick = () => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isUserMenuOpen &&
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-nav shadow-nav">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between pl-2 pr-4 sm:pl-3 sm:pr-6 lg:h-20 lg:pl-4 lg:pr-8">
        <Link href="/" className="flex items-center gap-2 group" onClick={handleNavLinkClick}>
          <span className="text-xl font-black tracking-tight text-red-600 transition-transform duration-200 group-hover:scale-105 lg:text-2xl">
            গোবিন্দগঞ্জ স্বেচ্ছায় রক্তদান সংগঠন (G.S.R.S)
          </span>
          <span className="text-2xl transition-transform duration-200 group-hover:rotate-180">
            🩸
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {menu.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 xl:text-base ${
                isActive(item.path)
                  ? "bg-rose-100 text-highlighted shadow-sm"
                  : "text-text hover:bg-rose-50 hover:text-highlighted"
              }`}
              onClick={handleNavLinkClick}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-4 lg:flex">
          {user && user.email ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                className="flex items-center gap-3 rounded-full bg-white/80 px-2 py-1 pr-3 text-text shadow ring-1 ring-border transition hover:bg-rose-50"
                aria-haspopup="menu"
                aria-expanded={isUserMenuOpen}
              >
                {user.photoURL ? (
                  <span className="relative">
                    <img
                      src={user.photoURL}
                      alt={user.displayName || "User avatar"}
                      className="h-10 w-10 rounded-full border-2 border-border object-cover shadow-sm transition-colors duration-200 hover:border-rose-500"
                    />
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-green-500" />
                  </span>
                ) : null}
                <span className="text-sm font-medium">
                  {user.displayName || "User"}
                </span>
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-cardBg shadow-sm">
                  <ChevronDownIcon
                    className={`h-3 w-3 text-gray-600 transition-transform duration-200 ${
                      isUserMenuOpen ? "rotate-180" : "rotate-0"
                    }`}
                    aria-hidden="true"
                  />
                </span>
              </button>

              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-cardBg py-1 shadow-lg"
                  role="menu"
                >
                  <Link
                    href="/dashboard"
                    onClick={handleNavLinkClick}
                    className={`block px-4 py-2 text-sm transition ${
                      isActive("/dashboard")
                        ? "bg-rose-50 text-highlighted"
                        : "text-text hover:bg-rose-50 hover:text-highlighted"
                    }`}
                    role="menuitem"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logOut?.();
                    }}
                    className="block w-full px-4 py-2 text-left text-sm text-highlighted transition hover:bg-red-50"
                    role="menuitem"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-text transition duration-200 hover:bg-rose-50 hover:text-highlighted"
              >
                Login
              </Link>
              <Link
                href="/registration"
                className="rounded-lg bg-cta px-4 py-2 text-sm font-medium text-btn-text transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="rounded-lg p-2 text-gray-700 transition duration-200 hover:bg-rose-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <aside
        className={`fixed right-0 top-0 z-50 h-full w-80 max-w-[85vw] transform border-l border-border bg-cardBg transition-transform duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Mobile navigation menu"
        aria-hidden={!isMenuOpen}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border bg-nav px-6 py-4">
            <Link
              href="/"
              onClick={handleNavLinkClick}
              className="flex items-center gap-2"
            >
              <span className="text-lg font-black tracking-tight text-red-600">
                গোবিন্দগঞ্জ স্বেচ্ছায় রক্তদান সংগঠন
              </span>
              <span className="text-xl">🩸</span>
            </Link>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="rounded-lg p-2 text-gray-700 transition duration-200 hover:bg-rose-50 hover:text-red-700"
              aria-label="Close menu"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          {user && user.email && (
            <div className="border-b border-border bg-rose-50/50 px-6 py-4">
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <span className="relative">
                    <img
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      className="h-12 w-12 rounded-full border-2 border-highlighted object-cover shadow-sm"
                    />
                    <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-green-500" />
                  </span>
                ) : null}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-highlighted">
                    {user.displayName || "User"}
                  </p>
                  <p className="truncate text-xs text-text opacity-70">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          <nav className="flex-1 overflow-y-auto py-4">
            <div className="space-y-1 px-4">
              {menu.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={handleNavLinkClick}
                  className={`flex items-center border-l-4 px-4 py-3 text-base font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? "border-red-500 bg-rose-100 text-highlighted shadow-sm"
                      : "border-transparent text-text hover:border-red-200 hover:bg-rose-50 hover:text-highlighted"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="my-4 px-4">
              <div className="border-t border-border" />
            </div>

            <div className="space-y-2 px-4">
              {user && user.email ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={handleNavLinkClick}
                    className={`flex items-center border-l-4 px-4 py-3 text-base font-medium transition-all duration-200 ${
                      isActive("/dashboard")
                        ? "border-red-500 bg-rose-100 text-highlighted shadow-sm"
                        : "border-transparent text-text hover:border-red-200 hover:bg-rose-50 hover:text-highlighted"
                    }`}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logOut?.();
                      setIsMenuOpen(false);
                    }}
                    className="flex w-full items-center border-l-4 border-transparent px-4 py-3 text-base font-medium text-highlighted transition duration-200 hover:border-red-300 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={handleNavLinkClick}
                    className="block w-full rounded-lg border border-border px-4 py-3 text-center text-base font-medium text-text transition duration-200 hover:bg-rose-50 hover:text-highlighted"
                  >
                    Login
                  </Link>
                  <Link
                    href="/registration"
                    onClick={handleNavLinkClick}
                    className="block w-full rounded-lg bg-cta px-4 py-3 text-center text-base font-medium text-btn-text transition duration-200 hover:shadow-md"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </nav>

        </div>
      </aside>
    </nav>
  );
}

function MenuIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      className={className}
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      className={className}
    >
      <path d="m6 6 12 12M6 18 18 6" />
    </svg>
  );
}

function ChevronDownIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

