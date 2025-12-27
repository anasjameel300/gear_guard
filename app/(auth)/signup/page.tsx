"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Wrench } from "lucide-react"

export default function SignupPage() {
    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary rounded-xl">
                        <Wrench className="w-8 h-8 text-primary-foreground" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold tracking-tighter">Create Account</h1>
                <p className="text-muted-foreground">Join the maintenance crew</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Sign up page</CardTitle>
                    <CardDescription>Enter your details to create a new portal user</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="John Doe" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email id</Label>
                        <Input id="email" type="email" placeholder="name@example.com" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" placeholder="••••••••" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Re-Enter password</Label>
                        <Input id="confirmPassword" type="password" placeholder="••••••••" required />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button className="w-full" size="lg">Sign Up</Button>
                    <div className="text-sm text-center text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="hover:text-primary underline underline-offset-4 font-semibold text-primary">
                            Log in
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
