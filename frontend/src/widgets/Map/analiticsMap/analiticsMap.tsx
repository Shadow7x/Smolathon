"use client";
import { useState } from "react";
import { IconCloud } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function EmptyOutline() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    // Проверяем расширение
    if (!selected.name.endsWith(".xlsx")) {
      alert("Можно загружать только файлы .xlsx");
      e.target.value = ""; // очищаем input
      return;
    }

    setFile(selected);
  };

  const handleUpload = () => {
    if (!file) return;

    // TODO: здесь делаем загрузку на сервер, например через axios/fetch
    console.log("Загружаем файл:", file.name);
    alert(`Файл ${file.name} готов к загрузке!`);
    setFile(null);
  };

  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconCloud size={48} stroke={2} />
        </EmptyMedia>
        <EmptyTitle>Cloud Storage Empty</EmptyTitle>
        <EmptyDescription>
          Upload files to your cloud storage to access them anywhere.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex flex-col gap-2">
        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-gray-300 file:text-sm file:font-semibold file:bg-gray-50 hover:file:bg-gray-100"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleUpload}
          disabled={!file}
        >
          Upload File
        </Button>
      </EmptyContent>
    </Empty>
  );
}
