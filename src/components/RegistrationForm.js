"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { cloneElement, useContext, useEffect, useMemo, useState } from "react";
import Lottie from "lottie-react";
import {
  BiDroplet,
  BiEnvelope,
  BiHide,
  BiImageAdd,
  BiKey,
  BiPhone,
  BiShow,
  BiUser,
} from "react-icons/bi";
import { GrLocationPin } from "react-icons/gr";
import { SlLocationPin } from "react-icons/sl";
import { FcGoogle } from "react-icons/fc";
import Swal from "sweetalert2";
import { AuthContext } from "@/providers/AuthProvider";

const registerAnimationPath = "/assets/register.json";
const divisionDataPath = "/assets/AllDivision.json";

export default function RegistrationForm() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { createUser, googleSignIn } = useContext(AuthContext);

  const [animationData, setAnimationData] = useState(null);
  const [divisionsData, setDivisionsData] = useState([]);
  const [districtsData, setDistrictsData] = useState([]);
  const [upazilasData, setUpazilasData] = useState([]);

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    mobile: "",
    image: "",
    blood: "",
    division: "",
    district: "",
    upazila: "",
    pass: "",
    confirmPass: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    let mounted = true;

    fetch(registerAnimationPath)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load animation");
        return response.json();
      })
      .then((data) => {
        if (mounted) setAnimationData(data);
      })
      .catch((error) => console.error("Register animation error:", error));

    fetch(divisionDataPath)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load division data");
        return response.json();
      })
      .then((data) => {
        if (mounted) setDivisionsData(data?.Bangladesh ?? []);
      })
      .catch((error) => console.error("Division data error:", error));

    return () => {
      mounted = false;
    };
  }, []);

  const divisionList = useMemo(
    () => divisionsData.map((division) => division.Division),
    [divisionsData],
  );

  useEffect(() => {
    if (!formState.division) {
      setDistrictsData([]);
      return;
    }
    const selectedDivision = divisionsData.find(
      (division) => division.Division === formState.division,
    );
    setDistrictsData(selectedDivision?.Districts ?? []);
  }, [divisionsData, formState.division]);

  useEffect(() => {
    if (!formState.district) {
      setUpazilasData([]);
      return;
    }
    const selectedDistrict = districtsData.find(
      (district) => district.District === formState.district,
    );
    setUpazilasData(selectedDistrict?.Upazilas ?? []);
  }, [districtsData, formState.district]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDivisionChange = (event) => {
    const { value } = event.target;
    setFormState((prev) => ({
      ...prev,
      division: value,
      district: "",
      upazila: "",
    }));
  };

  const handleDistrictChange = (event) => {
    const { value } = event.target;
    setFormState((prev) => ({
      ...prev,
      district: value,
      upazila: "",
    }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      Swal.fire({
        title: "ত্রুটি",
        text: "শুধুমাত্র ছবি ফাইল আপলোড করা যাবে।",
        icon: "error",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        title: "ত্রুটি",
        text: "ছবির সাইজ ৫MB এর বেশি হতে পারবে না।",
        icon: "error",
      });
      return;
    }

    // Show preview immediately
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    // Upload to ImgBB
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Image upload failed");
      }

      // Set the uploaded image URL
      setFormState((prev) => ({
        ...prev,
        image: data.imageUrl,
      }));

      // Clean up preview URL
      URL.revokeObjectURL(previewUrl);
    } catch (error) {
      console.error("Image upload error:", error);
      Swal.fire({
        title: "ত্রুটি",
        text: "ছবি আপলোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
        icon: "error",
      });
      setImagePreview("");
      setFormState((prev) => ({
        ...prev,
        image: "",
      }));
    }
  };

  const resetForm = () => {
    setFormState({
      name: "",
      email: "",
      mobile: "",
      image: "",
      blood: "",
      division: "",
      district: "",
      upazila: "",
      pass: "",
      confirmPass: "",
    });
    setImagePreview("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formState.pass !== formState.confirmPass) {
      Swal.fire({
        title: "ত্রুটি",
        text: "পাসওয়ার্ড মিলছে না!",
        icon: "error",
      });
      return;
    }

    if (formState.pass.length < 6) {
      Swal.fire({
        title: "ত্রুটি",
        text: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে!",
        icon: "error",
      });
      return;
    }

    try {
      setLoading(true);
      await createUser({
        name: formState.name,
        email: formState.email,
        mobile: formState.mobile,
        photoURL: formState.image,
        bloodGroup: formState.blood,
        division: formState.division,
        district: formState.district,
        upazila: formState.upazila,
        password: formState.pass,
      });

      // Wait a bit for session to be established after registration and sign-in
      await new Promise((resolve) => setTimeout(resolve, 600));
      
      // Refresh router to update session
      router.refresh();
      
      // Wait a bit more for session to update
      await new Promise((resolve) => setTimeout(resolve, 400));

      Swal.fire({
        title: "সফল!",
        text: "নিবন্ধন সফলভাবে সম্পন্ন হয়েছে!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      resetForm();
      router.replace("/");
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "ত্রুটি",
        text: error.message === "User already exists with this email"
          ? "এই ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট রয়েছে।"
          : "নিবন্ধন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      const result = await googleSignIn();
      if (result?.error) {
        throw new Error(result.error);
      }

      // Wait a bit for OAuth redirect and session to be established
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Refresh router to update session
      router.refresh();
      
      // Wait a bit more for session to update
      await new Promise((resolve) => setTimeout(resolve, 400));

      Swal.fire({
        title: "সফল!",
        text: "গুগলের মাধ্যমে লগইন সম্পন্ন হয়েছে!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      router.replace("/");
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "ত্রুটি",
        text: "গুগল লগইন সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।",
        icon: "error",
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <header className="text-center">
            <span className="inline-flex items-center justify-center rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-highlighted">
              রক্তদান প্ল্যাটফর্ম
            </span>
            <h1 className="mt-2 text-xl font-bold text-text sm:text-2xl">
              নিবন্ধন করুন
            </h1>
            <p className="mx-auto mt-1 max-w-2xl text-xs text-text/80">
              রক্তদানের এই মহৎ কাজে যোগ দিন। একটি অ্যাকাউন্ট তৈরি করুন এবং জীবন
              বাঁচাতে সাহায্য করুন।
            </p>
          </header>

          <div className="mt-6 flex flex-col items-center gap-4 lg:flex-row lg:items-start lg:justify-between">
            <form
              onSubmit={handleSubmit}
              className="order-2 flex w-full max-w-lg flex-1 flex-col gap-2 rounded-xl border border-border bg-cardBg p-3 shadow-sm lg:order-1 lg:p-5"
            >
              <Field
                label="সম্পূর্ণ নাম"
                required
                icon={<BiUser className="text-sm text-highlighted" />}
              >
                <input
                  type="text"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  placeholder="আপনার সম্পূর্ণ নাম লিখুন"
                  required
                />
              </Field>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-text">
                  প্রোফাইল ছবি <span className="text-text/60">(ঐচ্ছিক)</span>
                </label>

                {imagePreview ? (
                  <div className="relative inline-block h-12 w-12">
                    <img
                      src={imagePreview}
                      alt="প্রিভিউ"
                      className="h-full w-full rounded-lg border border-border object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview("");
                        setFormState((prev) => ({ ...prev, image: "" }));
                      }}
                      className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white transition hover:bg-red-600"
                      aria-label="ছবি মুছে ফেলুন"
                    >
                      ×
                    </button>
                  </div>
                ) : null}

                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    id="profile-image"
                    className="hidden"
                  />
                  <label
                    htmlFor="profile-image"
                    className="flex cursor-pointer items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border bg-background px-2 py-1 text-[10px] text-text transition hover:border-highlighted hover:bg-rose-50"
                  >
                    <BiImageAdd className="text-xs text-highlighted" />
                    <span>
                      {imagePreview ? "ছবি পরিবর্তন করুন" : "ছবি আপলোড করুন"}
                    </span>
                  </label>
                </div>
              </div>

              <Field
                label="ইমেইল"
                required
                icon={<BiEnvelope className="text-sm text-highlighted" />}
              >
                <input
                  type="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  placeholder="আপনার ইমেইল ঠিকানা লিখুন"
                  required
                />
              </Field>

              <Field
                label="মোবাইল নম্বর"
                required
                icon={<BiPhone className="text-sm text-highlighted" />}
              >
                <input
                  type="tel"
                  name="mobile"
                  value={formState.mobile}
                  onChange={handleChange}
                  placeholder="০১XXXXXXXXX"
                  pattern="[0-9]{11}"
                  required
                />
              </Field>

              <Field
                label="রক্তের গ্রুপ"
                required
                icon={<BiDroplet className="text-sm text-highlighted" />}
              >
                <select name="blood" value={formState.blood} onChange={handleChange} required>
                  <option value="">রক্তের গ্রুপ নির্বাচন করুন</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label="বিভাগ"
                required
                icon={<SlLocationPin className="text-sm text-highlighted" />}
              >
                <select
                  name="division"
                  value={formState.division}
                  onChange={handleDivisionChange}
                  required
                >
                  <option value="">বিভাগ নির্বাচন করুন</option>
                  {divisionList.map((division) => (
                    <option key={division} value={division}>
                      {division}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label="জেলা"
                required
                icon={<SlLocationPin className="text-sm text-highlighted" />}
              >
                <select
                  name="district"
                  value={formState.district}
                  onChange={handleDistrictChange}
                  required
                  disabled={!districtsData.length}
                >
                  <option value="">
                    {districtsData.length ? "জেলা নির্বাচন করুন" : "প্রথমে বিভাগ নির্বাচন করুন"}
                  </option>
                  {districtsData.map((district) => (
                    <option key={district.District} value={district.District}>
                      {district.District}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label="উপজেলা"
                required
                icon={<GrLocationPin className="text-sm text-highlighted" />}
              >
                <select
                  name="upazila"
                  value={formState.upazila}
                  onChange={handleChange}
                  required
                  disabled={!upazilasData.length}
                >
                  <option value="">
                    {upazilasData.length ? "উপজেলা নির্বাচন করুন" : "প্রথমে জেলা নির্বাচন করুন"}
                  </option>
                  {upazilasData.map((upazila) => (
                    <option key={upazila} value={upazila}>
                      {upazila}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label="পাসওয়ার্ড"
                required
                icon={<BiKey className="text-sm text-highlighted" />}
                trailing={
                  <ToggleButton
                    active={showPassword}
                    onToggle={() => setShowPassword((prev) => !prev)}
                  />
                }
              >
                <input
                  type={showPassword ? "text" : "password"}
                  name="pass"
                  value={formState.pass}
                  onChange={handleChange}
                  placeholder="পাসওয়ার্ড লিখুন (ন্যূনতম ৬ অক্ষর)"
                  required
                  minLength={6}
                />
              </Field>

              <Field
                label="পাসওয়ার্ড নিশ্চিত করুন"
                required
                icon={<BiKey className="text-sm text-highlighted" />}
                trailing={
                  <ToggleButton
                    active={showConfirmPassword}
                    onToggle={() => setShowConfirmPassword((prev) => !prev)}
                  />
                }
              >
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPass"
                  value={formState.confirmPass}
                  onChange={handleChange}
                  placeholder="পাসওয়ার্ড আবার লিখুন"
                  required
                  minLength={6}
                />
              </Field>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading || googleLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-3 py-3 text-sm text-text font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:border-highlighted hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                <FcGoogle className="text-xl" />
                {googleLoading ? "গুগল দিয়ে নিবন্ধন হচ্ছে..." : "গুগল দিয়ে নিবন্ধন করুন"}
              </button>

              <div className="flex justify-center gap-2 text-xs text-text/80">
                <span>ইতিমধ্যে অ্যাকাউন্ট আছে?</span>
                <Link href="/login" className="font-medium text-highlighted transition hover:underline">
                  লগইন করুন
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full rounded-xl bg-cta px-4 py-3 text-sm font-semibold text-btn-text shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading ? "নিবন্ধন হচ্ছে..." : "নিবন্ধন করুন"}
              </button>
            </form>

            <div className="order-1 hidden w-full max-w-lg flex-1 lg:order-2 lg:block">
              <div className="flex items-center justify-center">
                {animationData ? (
                  <Lottie animationData={animationData} loop className="h-auto w-full max-w-md" />
                ) : (
                  <div className="aspect-square w-full max-w-md animate-pulse rounded-3xl bg-rose-100/60" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, required, icon, trailing, children }) {
  const baseClasses =
    "w-full rounded-lg border border-border bg-background py-1.5 pl-8 pr-2.5 text-xs text-text transition duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-highlighted";
  const element = cloneElement(children, {
    className: `${baseClasses} ${trailing ? "pr-9" : ""} ${children.props.className ?? ""}`,
  });
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-text">
        {label} {required ? <span className="text-highlighted">*</span> : null}
      </label>
      <div className="relative flex items-center">
        <span className="pointer-events-none absolute left-2">{icon}</span>
        {element}
        {trailing ? <span className="absolute right-2">{trailing}</span> : null}
      </div>
    </div>
  );
}

function ToggleButton({ active, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="text-highlighted transition hover:text-highlighted/80"
      aria-label={active ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখান"}
    >
      {active ? <BiHide className="text-lg" /> : <BiShow className="text-lg" />}
    </button>
  );
}

