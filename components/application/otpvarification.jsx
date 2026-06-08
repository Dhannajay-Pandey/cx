import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import ButtonLoading from "@/components/application/buttonLoading";
import { CardContent } from "@/components/ui/card";

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits").regex(/^\d+$/, "OTP must contain only numbers"),
  email: z.string().email("Invalid email"),
});

const OtpVarification = ({ email = "", onSubmit, loading = false }) => {
  const form = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
      email: email || "",
    },
  });

  const handleOtpSubmit = async (data) => {
    if (typeof onSubmit === "function") {
      await onSubmit({ ...data, email: email || data.email });
    }
  };

  return (
    <CardContent>
      <form onSubmit={form.handleSubmit(handleOtpSubmit)} className="space-y-4 relative">
        <div className="space-y-2 text-center">
          <p className="text-sm text-gray-600">We sent a 6-digit code to</p>
          <p className="font-semibold text-gray-900">{email}</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Enter OTP</label>
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={form.watch("otp")}
              onChange={(value) => form.setValue("otp", value, { shouldValidate: true })}
            >
              <InputOTPGroup>
                {Array.from({ length: 6 }).map((_, index) => (
                  <InputOTPSlot key={index} index={index} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
          {form.formState.errors.otp && (
            <p className="text-red-500 text-xs text-center">{form.formState.errors.otp.message}</p>
          )}
        </div>

        <ButtonLoading
          type="submit"
          loading={loading}
          text="Verify OTP"
          className="cursor-pointer"
        />
      </form>
    </CardContent>
  );
};

export default OtpVarification;