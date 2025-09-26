// app/admin/page.tsx
'use client'

import { useUser } from "@/hooks/user-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import AnaliticsSection from "@/widgets/analyticsSectionPenalties/analyticsSectionPenalties"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AnalyticsSectionEvacuation from "@/widgets/analyticsSectionEvacuation/analyticsSectionEvacuation"
import Link from "next/link"

export default function Admin() {
  

  return (
    <div className="container mx-auto p-6">
      <AnaliticsSection />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/penalties">
          <Button className="w-full h-32 text-lg">Штрафы</Button>
        </Link>
        <Link href="/admin/evacuationRoutes">
          <Button className="w-full h-32 text-lg">Маршруты эвакуации</Button>
        </Link>
        <Link href="/admin/users">
          <Button className="w-full h-32 text-lg">Пользователи</Button>
        </Link>
      </div>
    </div>
  )
}