"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Button } from "@/app/components/ui/button"
import { Checkbox } from "@/app/components/ui/checkbox"
import Link from "next/link"

export default function Authentication() {
  return (
    <div className="min-h-[932px] flex items-center justify-center bg-black">
      <Card className="w-full max-w-sm shadow-lg rounded-2xl bg-yellow-100">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Welcome Back!!!
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Username / Email</Label>
            <Input id="email" type="email" placeholder="info@example.com" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="********" />
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember">Remember me</Label>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <Button className="w-full">Login</Button>
          <p className="text-sm text-center">
            Don’t have an account?{" "}
            <Link href="/register" className="text-red-600 hover:underline">
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
