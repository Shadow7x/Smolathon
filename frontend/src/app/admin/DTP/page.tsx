// app/admin/page.tsx
'use client'

// import { useUser } from "@/hooks/user-context"
// import { useRouter } from "next/navigation"
// import { useEffect, useState } from "react"
// import { Button } from "@/components/ui/button"
import DTPAnalitics from "@/widgets/analiticsSection/DTP/DTPAnalitics"
// import AdminSidebar from "@/components/adminsidebar/adminsidebar"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import AnalyticsSectionEvacuation from "@/widgets/analyticsSectionEvacuation/analyticsSectionEvacuation"
// import Link from "next/link"

export default function Admin() {

  return (
    <div className="container mx-auto px-6">
      <DTPAnalitics />
      
    </div>
  )
}