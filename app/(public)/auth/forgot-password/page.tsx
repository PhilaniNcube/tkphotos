import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/forgot-password-form";

export const metadata: Metadata = {
  title: "Reset Password | TK Media",
  description:
    "Reset your password to regain access to your private photo galleries from TK Media.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Reset Password | TK Media",
    description:
      "Reset your password to regain access to your private photo galleries.",
    type: "website",
  },
  alternates: {
    canonical: "/auth/forgot-password",
  },
};

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
