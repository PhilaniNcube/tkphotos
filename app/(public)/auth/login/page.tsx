import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "Login | TK Media",
  description:
    "Login to access your private photo galleries and downloads from TK Media photography services.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Login | TK Media",
    description: "Login to access your private photo galleries and downloads.",
    type: "website",
  },
  alternates: {
    canonical: "/auth/login",
  },
};

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
