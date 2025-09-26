"use client";

import { memo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { useState, useEffect } from "react";
import path from "path";
import axi from "@/utils/api";
import { API_URL, MEDIA_URL } from "@/index";

interface Docs{
    name: string
    updated_at: string
    id: number
    file: string
}

const DocsRow = memo(
  ({
    docs,
    formatDate,
    parseFileType,
    parseFileName,
  }: {
    docs: Docs
    formatDate: (date: string) => string
    parseFileType: (n: string) => string
    parseFileName: (n: string) => string
  }) => (
    <TableRow className="hover:bg-gray-50/50 transition-colors">
      <TableCell className="font-medium text-sm py-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          {formatDate(docs.updated_at)}
        </div>
      </TableCell>
      <TableCell className="text-sm py-3 text-right font-mono">
        {parseFileName(docs.name).slice(0, 20) + (parseFileName(docs.name).length > 20 ? '...' : '')}
      </TableCell>
      <TableCell className="text-sm py-3 text-right font-mono">
        {parseFileType(docs.name)}
      </TableCell>
    
      <TableCell className="py-3">
        <div className="flex gap-2 justify-end">
          {/* <EvacuationFormDialog truck={truck} onSuccess={() => {}} />
          <EvacuationDeleteDialog truckId={truck.id} onSuccess={() => {}} /> */}
            <Card className="p-1">
                <a href={`${API_URL}content/docs/get?id=${docs.id}`} download>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 16L7 11L8.4 9.55L11 12.15V4H13V12.15L15.6 9.55L17 11L12 16ZM6 20C5.45 20 4.97917 19.8042 4.5875 19.4125C4.19583 19.0208 4 18.55 4 18V15H6V18H18V15H20V18C20 18.55 19.8042 19.0208 19.4125 19.4125C19.0208 19.8042 18.55 20 18 20H6Z" fill="#636363" />
                    </svg>
                </a>
            </Card>
        </div>
      </TableCell>
    </TableRow>
  )
)
DocsRow.displayName = "DocsRow"


export default function DocsMainSection() {
    const [docs, setDocs] = useState<Docs[]>([])

    useEffect(() => {
        axi.get("content/docs/get").then((res) => {setDocs(res.data)
            console.log(res.data)
        })

    }, [])

    const parseFileName = (file: string) => {
        const arr = file.split("/")
        return arr[arr.length-1]
    }

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString("ru-RU")

    const parseFileType = (file: string) => {
        const arr = file.split(".")
        return arr[arr.length-1]
    }
  return (
    <div className="w-[50%]">
        <h1>Документы</h1>
        <p className="">Здесь вы можете найти все необходимые документы</p>
        <div className="">
            <div className="rounded-lg border border-gray-200 overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead>Дата</TableHead>
                      <TableHead className="text-right">Название</TableHead>
                      <TableHead className="text-right">Тип</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {docs.map((doc) => (
                        <DocsRow key={doc.id} docs={doc} formatDate={formatDate} parseFileType={parseFileType} parseFileName = {parseFileName} />
                    ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    </div>
  );
}
