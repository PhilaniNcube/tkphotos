import type { Metadata } from "next";
import { UpdatePasswordForm } from "@/components/update-password-form";

export const metadata: Metadata = {
  title: "Update Password | TK Media",
  description:
    "Update your password for your TK Media account to maintain secure access to your photo galleries.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Update Password | TK Media",
    description:
      "Update your password for secure access to your photo galleries.",
    type: "website",
  },
  alternates: {
    canonical: "/auth/update-password",
  },
};

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <UpdatePasswordForm />
      </div>
    </div>
  );
}
