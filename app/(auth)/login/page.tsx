"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Wrench } from "lucide-react"

export default function LoginPage() {
    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary rounded-xl">
                        <Wrench className="w-8 h-8 text-primary-foreground" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold tracking-tighter">Welcome Back</h1>
                <p className="text-muted-foreground">Sign in to your Gear Guard account</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Login Page</CardTitle>
                    <CardDescription>Enter your credentials to access the portal</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email id</Label>
                        <Input id="email" placeholder="name@example.com" type="email" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" placeholder="••••••••" required />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button className="w-full" size="lg">Sign in</Button>
                    <div className="text-sm text-center text-muted-foreground">
                        <Link href="#" className="hover:text-primary underline underline-offset-4">Forgot Password?</Link>
                        <span className="mx-2">|</span>
                        <Link href="/signup" className="hover:text-primary underline underline-offset-4 font-semibold text-primary">Sign Up</Link>
                    </div>
                </CardFooter>
            </Card>

            {/* Footer Text from Wireframe logic */}
            <div className="text-xs text-center text-muted-foreground mt-4 px-8">
                By signing in, you agree to our Terms of Service and Privacy Policy.
            </div>
        </div>
    )
}
