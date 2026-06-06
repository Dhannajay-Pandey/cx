"use client";

import React from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {WEBSITE_REGISTER,WEBSITE_FORGOT_PASSWORD} from "@/routes/websiteRoutes"
import ButtonLoading from "@/components/application/buttonLoading";
import { Eye, EyeOff } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import Link from "next/dist/client/link";

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
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [loading, setLoading] = React.useState(false);
  const [istypePassword, setIsTypePassword] = React.useState(true);
  const [error, setError] = React.useState("");

  const handleLoginSubmit = async (data: { email: string; password: string }) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const rawText = await res.text();
      const result = rawText ? JSON.parse(rawText) : null;

      if (!res.ok) {
        throw new Error(result?.message || "Login failed");
      }

      console.log("Login Success:", result);

      // ✅ Redirect
      window.location.href = "/dashboard";

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed";
      console.error("Login Error:", message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-sm">
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
              <Link href={WEBSITE_REGISTER} className="text-primary underline">
                Create account!
              </Link>
            </div>
            <div className="flex justify-center items-center gap-1 mt-2">
              <p>Forgot password?</p>
              <Link href={WEBSITE_FORGOT_PASSWORD} className="text-primary underline ">
                Reset here!
              </Link>
            </div>
          </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;