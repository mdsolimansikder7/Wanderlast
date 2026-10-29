"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { ArrowRight, Loader2, AlertCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password. Password must be at least 4 characters.");
        setLoading(false);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (err: unknown) {
      console.error(err);
      setError("Failed to sign in. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 bg-white py-10 lg:py-14">
      <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-20">
        {/* Page Header (Matching My Profile) */}
        <div className="mx-auto max-w-[500px] text-center">
          <h1 className="text-[30px] sm:text-[38px] leading-tight font-light tracking-[-0.02em] text-neutral-950">
            Sign In
          </h1>
          <p className="text-[15px] text-neutral-500 mt-1.5">
            Welcome back to Wanderlust. Sign in to your account
          </p>
        </div>

        {/* Form Card (Matching My Profile & Add Destination) */}
        <div className="mx-auto mt-8 w-full max-w-[500px] rounded-[4px] border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm">
          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-[3px] border border-red-200 bg-red-50 p-3 text-xs text-red-600">
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-xs font-semibold text-neutral-900"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="h-10 w-full rounded-[3px] border border-neutral-200 bg-[#f4f7f9] px-3.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/30 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-xs font-semibold text-neutral-900"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-10 w-full rounded-[3px] border border-neutral-200 bg-[#f4f7f9] px-3.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/30 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-[3px] bg-brand text-sm font-medium text-brand-foreground hover:bg-brand/90 transition-colors disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="my-2 flex items-center gap-3">
              <span className="h-px flex-1 bg-neutral-200" />
              <span className="text-xs font-medium text-neutral-400">
                Or continue with
              </span>
              <span className="h-px flex-1 bg-neutral-200" />
            </div>

            {/* Google Login */}
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl })}
              className="flex h-11 w-full items-center justify-center gap-2.5 rounded-[3px] border border-neutral-200 bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                className="size-4"
              />
              <span>Continue with Google</span>
            </button>
          </form>

          {/* Quick Demo Login Box */}
          <div className="mt-5 rounded-[3px] border border-neutral-100 bg-[#f8fafc] p-3 text-xs text-neutral-600">
            <span className="font-semibold text-neutral-800 block mb-0.5">
              Quick Demo Account:
            </span>
            <p className="text-neutral-500">
              Email: <span className="font-mono text-neutral-800">demo@wanderlust.com</span>{" "}
              | Pass: <span className="font-mono text-neutral-800">password123</span>
            </p>
          </div>

          <div className="mt-5 text-center text-xs text-neutral-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-brand hover:underline"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[50vh] flex-1 items-center justify-center bg-white py-14">
          <Loader2 className="size-8 animate-spin text-brand" />
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
