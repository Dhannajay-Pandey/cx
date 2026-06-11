"use client";

import React from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {WEBSITE_REGISTER,WEBSITE_FORGOT_PASSWORD} from "@/routes/websiteRoutes"
import ButtonLoading from "@/components/application/buttonLoading";
import { showToast } from "@/lib/showToast";
import { Eye, EyeOff } from "lucide-react";
import OtpVarification from "@/components/application/otpvarification";
import { useDispatch } from "react-redux";
import { login } from "@/store/reducer/authReducer";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import Link from "next/link";
import { useEffect } from "react";

export const ROUTES = {
  REGISTER: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgot-password",
};
// Zod schema
export const formSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address"),
    
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
});

const LoginPage = () => {
  const dispatch = useDispatch();

  // Auto-redirect if already logged in via JWT session
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((result) => {
        if (result.ok && result.data) {
          dispatch(login(result.data));
          window.location.href = "/";
        }
      })
      .catch(() => {}); // ignore — user is not logged in
  }, [dispatch]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [loading, setLoading] = React.useState(false);
  const [istypePassword, setIsTypePassword] = React.useState(true);
  const [otpmail, setOtpMail] = React.useState("");
  const [error, setError] = React.useState("");

  const heandotpVarification = async (data: { otp: string }) => {
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: otpmail,
          otp: data.otp,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.message || "Invalid OTP");
      }

      showToast("success", result?.message || "OTP verified successfully.");
      dispatch(login(result?.data?.user || { email: otpmail }));
      window.location.href = "/";
    } catch (err) {
      const message = err instanceof Error ? err.message : "OTP verification failed";
      showToast("error", message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (data: { email: string; password: string }) => {

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // const rawText = await res.text();
      // const result = rawText ? JSON.parse(rawText) : null;
      const rawText = await res.text();
      const result = rawText ? JSON.parse(rawText) : null;

      if (!res.ok) {
        throw new Error(result?.message || "Login failed");
      }
      setOtpMail(data.email);
      form.reset();
     //console.log("Login Success:", result);
      showToast("success", result?.message || "Login successful.");

      // ✅ Redirect
     // window.location.href = "/dashboard";

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed";
      //console.error("Login Error:", message);
      setError(message);
      showToast("error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-sm">
        
        {!otpmail ? (
              <>
              <CardHeader>
          <div className="flex justify-center mb-4">
            <Image
              src="/assets/images/logo-black1.png"
              alt="E-commerce Logo"
              width={200}
              height={100}
              priority
              style={{ height: "auto" }}
            />
          </div>
           
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">
              Login into Account
            </h1>
            <p>Enter your credentials to access your account.</p>
          </div>
        </CardHeader>
               <CardContent>
          <form
            onSubmit={form.handleSubmit(handleLoginSubmit)}
            className="space-y-4 relative"
          >
            {/* Email */}
            <label>Email</label>
            <input
              type="email"
              placeholder="Example@example.com"
              {...form.register("email")}
              className="w-full border p-2 rounded"
            />

            {/* Password */}
            <label>Password</label>
            <input
              type={istypePassword ? "password" : "text"}
              placeholder="Password"
              {...form.register("password")}
              className="w-full border p-2 rounded"
            />
            <button
              type="button"
              onClick={() => setIsTypePassword(!istypePassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 my-[-9px]"
            >
              {istypePassword ? <EyeOff /> : <Eye />}
            </button>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <ButtonLoading
              type="submit"
              loading={loading}
              text="Login"
              className="cursor-pointer"
               />

            {/* <button
              type="submit"
              disabled={loading}
              className="w-full bg-ring text-white p-2 rounded"
            >
              {loading ? "Logging in..." : "Login"}
            </button> */}
            <div className="text-center">
            <div className="flex justify-center items-center gap-1">
              <p>Don&apos;t have account?</p>
              <Link href={WEBSITE_REGISTER} className="text-secondary underline">
                Create account!
              </Link>
            </div>
            <div className="flex justify-center items-center gap-1 mt-2">
              <p>Forgot password?</p>
              <Link href={WEBSITE_FORGOT_PASSWORD} className="text-secondary underline ">
                Reset here!
              </Link>
            </div>
          </div>
          </form>
        </CardContent>
              </>
            ) : (
              <>
              <div className="w-[380px] max-w-sm">
               <CardHeader>
          <div className="flex justify-center mb-4">
            <Image
              src="/assets/images/logo-black1.png"
              alt="E-commerce Logo"
              width={200}
              height={100}
              priority
              style={{ height: "auto" }}
            />
          </div>
           
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">
              Please Complate otp Verification
            </h1>
            <p>We have sent an OTP to your email. Please enter it to verify your account.</p>
          </div>
              </CardHeader>
              <OtpVarification email={otpmail} onSubmit={heandotpVarification} loading={loading} />
              </div>
              </>
            ) 
            }
       
      </Card>
    </div>
  );
};

export default LoginPage;