"use client";

import { useContext, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthContext } from "@/providers/AuthProvider";

const menu = [
  { name: "হোম", path: "/" },
  { name: "সকল রক্তদাতা", path: "/donors" },
  { name: "অনুরোধ", path: "/request" },
  { name: "ব্লগ", path: "/blog" },
  { name: "আমাদের গোবিন্দগঞ্জ", path: "/service" },
  {
    name: "আমাদের-সম্পর্কে",
    path: "/about",
    subMenu: [
      { name: "আমাদের সম্পর্কে", path: "/about" },
      { name: "বিধি মালা", path: "/about/rules" },
      { name: "লক্ষ ও উদ্দেশ্য", path: "/about/objectives" },
      { name: "প্রয়োজনীয় প্রশ্ন ও উত্তর", path: "/about/faq" },
    ],
  },
  {
    name: "মিডিয়া",
    path: "/media",
    subMenu: [
      { name: "ফটো গ্যালারী", path: "/gallery/photo" },
      { name: "ভিডিও গ্যালারী", path: "/gallery/video" },
      { name: "সর্বশেষ বিজ্ঞপ্তী", path: "/notices" },
      { name: "বিভিন্ন পত্রিকায় প্রকাশিত সংবাদ", path: "/news" },
      { name: "প্রাপ্ত পুরষ্কার সমূহ", path: "/awards" },
    ],
  },
  {
    name: "দান",
    path: "/donate",
    subMenu: [
      { name: "দান করুন", path: "/donate" },
      { name: "দানের ব্যাখ্যা", path: "/donate/explanation" },
      { name: "স্পন্সর করুন", path: "/donate/sponsor" },
      { name: "Sponsor A Child", path: "/donate/sponsor-child" },
    ],
  },
  { name: "কমিটি", path: "/committee" },
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
  const [isMediaMenuOpen, setIsMediaMenuOpen] = useState(false);
  const [isAboutMenuOpen, setIsAboutMenuOpen] = useState(false);
  const [isDonateMenuOpen, setIsDonateMenuOpen] = useState(false);
  const [isMobileMediaMenuOpen, setIsMobileMediaMenuOpen] = useState(false);
  const [isMobileAboutMenuOpen, setIsMobileAboutMenuOpen] = useState(false);
  const [isMobileDonateMenuOpen, setIsMobileDonateMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const mediaMenuRef = useRef(null);
  const aboutMenuRef = useRef(null);
  const donateMenuRef = useRef(null);

  const handleNavLinkClick = () => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
    setIsMediaMenuOpen(false);
    setIsAboutMenuOpen(false);
    setIsDonateMenuOpen(false);
    setIsMobileMediaMenuOpen(false);
    setIsMobileAboutMenuOpen(false);
    setIsMobileDonateMenuOpen(false);
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
      if (
        isMediaMenuOpen &&
        mediaMenuRef.current &&
        !mediaMenuRef.current.contains(event.target)
      ) {
        setIsMediaMenuOpen(false);
      }
      if (
        isAboutMenuOpen &&
        aboutMenuRef.current &&
        !aboutMenuRef.current.contains(event.target)
      ) {
        setIsAboutMenuOpen(false);
      }
      if (
        isDonateMenuOpen &&
        donateMenuRef.current &&
        !donateMenuRef.current.contains(event.target)
      ) {
        setIsDonateMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen, isMediaMenuOpen, isAboutMenuOpen, isDonateMenuOpen]);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-nav shadow-nav">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between pl-2 pr-4 sm:pl-3 sm:pr-6 lg:h-20 lg:pl-4 lg:pr-8">
        <Link href="/" className="flex items-center gap-2 group" onClick={handleNavLinkClick}>
          <span className="text-xl font-black tracking-tight text-red-600 transition-transform duration-200 group-hover:scale-105 lg:text-2xl">
            G.S.R.S
          </span>
          <span className="text-2xl transition-transform duration-200 group-hover:rotate-180">
            🩸
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {menu.map((item) => {
            if (item.subMenu) {
              const isSubMenuActive = item.subMenu.some((subItem) =>
                isActive(subItem.path)
              );
              const isOpen = item.name === "মিডিয়া" ? isMediaMenuOpen : item.name === "আমাদের-সম্পর্কে" ? isAboutMenuOpen : item.name === "দান" ? isDonateMenuOpen : false;
              const setIsOpen = item.name === "মিডিয়া" ? setIsMediaMenuOpen : item.name === "আমাদের-সম্পর্কে" ? setIsAboutMenuOpen : item.name === "দান" ? setIsDonateMenuOpen : () => {};
              const menuRef = item.name === "মিডিয়া" ? mediaMenuRef : item.name === "আমাদের-সম্পর্কে" ? aboutMenuRef : item.name === "দান" ? donateMenuRef : null;
              
              return (
                <div key={item.path} className="relative" ref={menuRef}>
                  <button
                    onClick={() => setIsOpen((prev) => !prev)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 xl:text-sm flex items-center gap-1 ${
                      isSubMenuActive
                        ? "bg-rose-100 text-highlighted shadow-sm"
                        : "text-text hover:bg-rose-50 hover:text-highlighted"
                    }`}
                  >
                    {item.name}
                    <ChevronDownIcon
                      className={`h-3 w-3 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="absolute left-0 mt-1 w-56 rounded-lg border border-border bg-cardBg py-2 shadow-lg z-50">
                      {item.subMenu.map((subItem) => (
                        <Link
                          key={subItem.path}
                          href={subItem.path}
                          onClick={handleNavLinkClick}
                          className={`block px-4 py-2 text-xs transition ${
                            isActive(subItem.path)
                              ? "bg-rose-50 text-highlighted"
                              : "text-text hover:bg-rose-50 hover:text-highlighted"
                          }`}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 xl:text-sm ${
                  isActive(item.path)
                    ? "bg-rose-100 text-highlighted shadow-sm"
                    : "text-text hover:bg-rose-50 hover:text-highlighted"
                }`}
                onClick={handleNavLinkClick}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-4 lg:flex">
          {user && user.email ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                className="relative rounded-full transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                aria-haspopup="menu"
                aria-expanded={isUserMenuOpen}
              >
                {user.photoURL ? (
                  <>
                    <img
                      src={user.photoURL}
                      alt={user.displayName || "User avatar"}
                      className="h-12 w-12 rounded-full border-2 border-pink-300 object-cover shadow-sm transition-colors duration-200"
                    />
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-green-500" />
                    <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-rose-100 shadow-sm">
                      <ChevronDownIcon
                        className={`h-3 w-3 text-gray-600 transition-transform duration-200 ${
                          isUserMenuOpen ? "rotate-180" : "rotate-0"
                        }`}
                        aria-hidden="true"
                      />
                    </span>
                  </>
                ) : null}
              </button>

              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-cardBg py-1 shadow-lg"
                  role="menu"
                >
                  <Link
                    href="/dashboard"
                    onClick={handleNavLinkClick}
                    className={`block px-4 py-2 text-xs transition ${
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
                    className="block w-full px-4 py-2 text-left text-xs text-highlighted transition hover:bg-red-50"
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
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-text transition duration-200 hover:bg-rose-50 hover:text-highlighted"
              >
                Login
              </Link>
              <Link
                href="/registration"
                className="rounded-lg bg-cta px-3 py-1.5 text-xs font-medium text-btn-text transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
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
              <span className="text-base font-black tracking-tight text-red-600">
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
                  <p className="truncate text-xs font-semibold text-highlighted">
                    {user.displayName || "User"}
                  </p>
                  <p className="truncate text-[10px] text-text opacity-70">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          <nav className="flex-1 overflow-y-auto py-4">
            <div className="space-y-1 px-4">
              {menu.map((item) => {
                if (item.subMenu) {
                  const isSubMenuActive = item.subMenu.some((subItem) =>
                    isActive(subItem.path)
                  );
                  const isMobileOpen = item.name === "মিডিয়া" ? isMobileMediaMenuOpen : item.name === "আমাদের-সম্পর্কে" ? isMobileAboutMenuOpen : item.name === "দান" ? isMobileDonateMenuOpen : false;
                  const setIsMobileOpen = item.name === "মিডিয়া" ? setIsMobileMediaMenuOpen : item.name === "আমাদের-সম্পর্কে" ? setIsMobileAboutMenuOpen : item.name === "দান" ? setIsMobileDonateMenuOpen : () => {};
                  
                  return (
                    <div key={item.path}>
                      <button
                        onClick={() => setIsMobileOpen((prev) => !prev)}
                        className={`flex w-full items-center justify-between border-l-4 px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                          isSubMenuActive
                            ? "border-red-500 bg-rose-100 text-highlighted shadow-sm"
                            : "border-transparent text-text hover:border-red-200 hover:bg-rose-50 hover:text-highlighted"
                        }`}
                      >
                        <span>{item.name}</span>
                        <ChevronDownIcon
                          className={`h-4 w-4 transition-transform duration-200 ${
                            isMobileOpen ? "rotate-180" : "rotate-0"
                          }`}
                        />
                      </button>
                      {isMobileOpen && (
                        <div className="ml-4 space-y-1 border-l-2 border-red-200 pl-2">
                          {item.subMenu.map((subItem) => (
                            <Link
                              key={subItem.path}
                              href={subItem.path}
                              onClick={handleNavLinkClick}
                              className={`flex items-center border-l-4 px-4 py-2 text-xs font-medium transition-all duration-200 ${
                                isActive(subItem.path)
                                  ? "border-red-500 bg-rose-100 text-highlighted shadow-sm"
                                  : "border-transparent text-text hover:border-red-200 hover:bg-rose-50 hover:text-highlighted"
                              }`}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={handleNavLinkClick}
                    className={`flex items-center border-l-4 px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                      isActive(item.path)
                        ? "border-red-500 bg-rose-100 text-highlighted shadow-sm"
                        : "border-transparent text-text hover:border-red-200 hover:bg-rose-50 hover:text-highlighted"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
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
                    className={`flex items-center border-l-4 px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
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
                    className="flex w-full items-center border-l-4 border-transparent px-4 py-2.5 text-sm font-medium text-highlighted transition duration-200 hover:border-red-300 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={handleNavLinkClick}
                    className="block w-full rounded-lg border border-border px-4 py-2.5 text-center text-sm font-medium text-text transition duration-200 hover:bg-rose-50 hover:text-highlighted"
                  >
                    Login
                  </Link>
                  <Link
                    href="/registration"
                    onClick={handleNavLinkClick}
                    className="block w-full rounded-lg bg-cta px-4 py-2.5 text-center text-sm font-medium text-btn-text transition duration-200 hover:shadow-md"
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

