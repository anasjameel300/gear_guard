import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wrench, Shield, Activity, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between mx-auto px-4">
          <div className="flex items-center gap-2 font-bold text-xl text-primary">
            <Wrench className="h-6 w-6" />
            <span>Gear Guard</span>
          </div>
          <nav className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 bg-gradient-to-b from-background to-secondary/20">
        <div className="container px-4 md:px-6 mx-auto max-w-4xl space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl text-primary">
              The Ultimate Maintenance Tracker
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Streamline your equipment lifecycle, manage maintenance requests, and track team performance in one powerful platform.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="h-12 px-8 text-base">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                Access Portal
              </Button>
            </Link>
          </div>

          {/* Feature Highlight */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 text-left">
            <div className="flex flex-col space-y-2 p-6 border rounded-xl bg-card shadow-sm">
              <div className="p-3 bg-blue-100 w-fit rounded-lg text-blue-600">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Asset Protection</h3>
              <p className="text-muted-foreground">Keep complete track of your equipment inventory and warranty status.</p>
            </div>
            <div className="flex flex-col space-y-2 p-6 border rounded-xl bg-card shadow-sm">
              <div className="p-3 bg-amber-100 w-fit rounded-lg text-amber-600">
                <Wrench className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Smart Maintenance</h3>
              <p className="text-muted-foreground">Schedule preventative maintenance and manage breakdown tickets efficiently.</p>
            </div>
            <div className="flex flex-col space-y-2 p-6 border rounded-xl bg-card shadow-sm">
              <div className="p-3 bg-green-100 w-fit rounded-lg text-green-600">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Live Activity</h3>
              <p className="text-muted-foreground">Real-time updates on repairs, assignments, and team availability.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 md:px-8 border-t">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row mx-auto text-sm text-center md:text-left text-muted-foreground">
          <p>© 2024 Gear Guard Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
