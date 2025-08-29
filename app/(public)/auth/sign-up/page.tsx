import type { Metadata } from "next";
import { SignUpForm } from "@/components/sign-up-form";

export const metadata: Metadata = {
  title: "Sign Up | TK Media",
  description:
    "Create an account to access your private photo galleries and downloads from TK Media photography services.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Sign Up | TK Media",
    description:
      "Create an account to access your private photo galleries and downloads.",
    type: "website",
  },
  alternates: {
    canonical: "/auth/sign-up",
  },
};

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignUpForm />
      </div>
    </div>
  );
}
