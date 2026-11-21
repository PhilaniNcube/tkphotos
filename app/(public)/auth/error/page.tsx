import { Suspense } from "react";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Authentication Error | TK Media",
  description:
    "An error occurred during authentication. Please try again or contact support if the issue persists.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Authentication Error | TK Media",
    description: "An error occurred during authentication. Please try again.",
    type: "website",
  },
  alternates: {
    canonical: "/auth/error",
  },
};

type AuthErrorPageProps = {
  searchParams: Promise<{ error: string }>;
};

export default function Page({ searchParams }: AuthErrorPageProps) {
  return (
    <Suspense fallback={<AuthErrorCard />}>
      <AuthErrorContent searchParams={searchParams} />
    </Suspense>
  );
}

async function AuthErrorContent({ searchParams }: AuthErrorPageProps) {
  const params = await searchParams;

  return <AuthErrorCard error={params?.error} />;
}

function AuthErrorCard({ error }: { error?: string }) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Sorry, something went wrong.
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error ? (
                <p className="text-sm text-muted-foreground">
                  Code error: {error}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  An unspecified error occurred.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
