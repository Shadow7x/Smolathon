"use client";
import axi from "@/utils/api";
import Image from "next/image";
import { useNotificationManager } from "@/hooks/notification-context";

export default function Foth() {
    const {addNotification} = useNotificationManager();
    function handleSubmit(e: React.FormEvent)  {
        console.log(2)
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    const file = data.get("file") as File;
    const formData = new FormData();
    formData.append("file", file);
    axi.post("/analytics/trafficLight/createFromExcel", formData, {
        headers: {
        "Content-Type": "multipart/form-data",
        }
    }).then((res ) =>{
      addNotification({
          
          id: Date.now().toString(),
          title: "Успешно",
          description: res.response?.data,
          status: res.response?.status ? res.response.status : 200 ,
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
           Добавте Сфетофоры.xlsx
            <input type="file" name="file" id="" />
            <button
                type="submit"
                className="text-black hover:underline text-sm"
            >
                Отправить
            </button>

          </form>
          
    </div>
    
  );
}
