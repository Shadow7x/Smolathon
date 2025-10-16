// app/admin/page.tsx
'use client'

import AnaliticsSection from "@/widgets/analyticsSectionPenalties/analyticsSectionPenalties"
export default function Admin() {
  

  return (
    <div className="container mx-auto p-6">
      <AnaliticsSection />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      </div>
    </div>
  )
}