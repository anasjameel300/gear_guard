"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wrench, AlertCircle, Info } from "lucide-react";
import { loginAction, AuthActionResult } from "@/actions/auth";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [state, formAction, isPending] = useActionState<AuthActionResult | null, FormData>(
    loginAction,
    null
  );

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-primary rounded-xl">
            <Wrench className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tighter">Welcome Back</h1>
        <p className="text-muted-foreground">
          Sign in to your Gear Guard account
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the portal
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-4">
            {/* Demo Credentials Helper */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-semibold mb-1">Demo Credentials:</p>
                <div className="space-y-1">
                  <p className="flex items-center">
                    <span className="w-20 text-blue-500/80 text-xs uppercase tracking-wider font-semibold">
                      Email:
                    </span>
                    <span className="font-mono font-medium select-all">
                      admin@gearguard.com
                    </span>
                  </p>
                  <p className="flex items-center">
                    <span className="w-20 text-blue-500/80 text-xs uppercase tracking-wider font-semibold">
                      Password:
                    </span>
                    <span className="font-mono font-medium select-all">
                      admin123
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {state?.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2 text-red-700 text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{state.error}</span>
              </div>
            )}

            <input type="hidden" name="callbackUrl" value={callbackUrl} />

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="name@example.com"
                type="email"
                required
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                disabled={isPending}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full" size="lg" type="submit" disabled={isPending}>
              {isPending ? "Signing in..." : "Sign in"}
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              <Link
                href="#"
                className="hover:text-primary underline underline-offset-4"
              >
                Forgot Password?
              </Link>
              <span className="mx-2">|</span>
              <Link
                href="/signup"
                className="hover:text-primary underline underline-offset-4 font-semibold text-primary"
              >
                Sign Up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>

      <div className="text-xs text-center text-muted-foreground mt-4 px-8">
        By signing in, you agree to our Terms of Service and Privacy Policy.
      </div>
    </div>
  );
}
