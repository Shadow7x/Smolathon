"use client";
import axi from "@/utils/api";
import Image from "next/image";
import { useNotificationManager } from "@/hooks/notification-context";
import { useState, useEffect } from "react";

export default function OPTION() {
    const {addNotification} = useNotificationManager();

    const [reports, setReports] = useState([]);

    useEffect (() => {
      axi.get("/analytics/reports/get").then((res) => {
        setReports(res.data);
        console.log(res.data);
      }).catch(
        (err) => console.log(err)
      );
    }, []);

    function handleSubmit(e: React.FormEvent)  {
        console.log(2)
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    const file_id = data.get("file");
    const format = data.get("format");
    console.log(reports)
    const file = reports.find((report) => Number(report.id)   === Number(file_id)) || undefined;
    console.log(file)
    const id = file.id
    const filename = file.name
    const formData = new FormData();
    console.log(file)
    formData.append("id", id);
    formData.append("format", format);
    
    axi.post("/analytics/reports/download", formData, {
        headers: {
        "Content-Type": "multipart/form-data",
        },
        responseType: "blob"
    }).then((res ) => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      console.log(res)
      link.href = url;
      link.setAttribute('download', `report_${filename}.${format==='xlsx'? 'xlsx'   : 'zip'}`);
      link.click();
      window.URL.revokeObjectURL(url);
      addNotification({
          
          id: Date.now().toString(),
          title: "Успешно",
          description: "Файл успешно скачан",
          status: 200,
          createdAt: new Date().toISOString(),
        });
    })
    .catch((err) => {
      console.log(err)
      addNotification({
        id: Date.now().toString(),
        title: "Ошибка данных",
        description: err.response.data,
        status: err.response.status,
        createdAt: new Date().toISOString(),
    })
  })
    }

  return (
    <div className=" ">
       <form
            onSubmit={(e) => handleSubmit(e)}
            className="flex items-center gap-8 h-[calc(100%-50px)]"
          >
           <label className="block">
             <span className="sr-only">Выберите файл</span>
             <select className="block w-full text-sm text-slate-700" name="file" id="">
               <option value="">Выберите файл</option>
               {reports.map((report) => (
                 <option key={report.id} value={report.id}>
                   {report.name}
                 </option>
               ))}
             </select>
           </label>
           <label className="block">
             <span className="sr-only">Выберите формат</span>
             <select className="block w-full text-sm text-slate-700" name="format" id="">
               <option value="xlsx">xlsx</option>
               <option value="csv">
                csv
                 </option>
              
             </select>
           </label>
           <button
                type="submit"
                className="mt-4 text-black hover:underline text-sm"
            >
                Отправить
            </button>

          </form>
          
    </div>
    
  );
}
