"use client"
import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import Link from "next/link"
import Authentication from "../auth/page"
export default function Register() {
  return (  
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Регистрация</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] ">
          <DialogHeader>
            <DialogTitle>Hello...</DialogTitle>
            <DialogDescription>
              Register
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Email</Label>
              <Input type="email" placeholder="Email" />
            </div>
            <div className="grid gap-4">
              <Label htmlFor="name-1">Username</Label>
              <Input type="name" placeholder="Name"/>
            </div>
            <div className="grid gap-4">
              <Label htmlFor="name-1">Password</Label>
              <Input type="password" placeholder="Password" />
            </div>
            <div className="grid gap-4">
              <Label htmlFor="name-1">Confirm password</Label>
              <Input type="password" placeholder="Password" />
            </div>
          </div>
          <DialogFooter className="flex items-center">
            <Button type="submit" className="w-[375px] h-[30px] hover:bg-[#050522] hover:text-[#FFDE69]">Регистрация</Button>
          </DialogFooter>
            <div className="flex justify-evenly items-center">
              У Вас уже есть аккаунт?
            <DialogClose asChild>
                <Button data-slot="dialog-close" className="hover:bg-[#050522] hover:text-[#FFDE69]"><Authentication/>
                </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  )
}
