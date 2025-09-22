"use client";
import axi from "@/utils/api";
import Image from "next/image";

export default function Home() {

    function handleSubmit(e: React.FormEvent)  {
        console.log(2)
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    const file = data.get("file") as File;
    const formData = new FormData();
    formData.append("file", file);
    axi.post("/analytics/createPenalties", formData, {
        headers: {
        "Content-Type": "multipart/form-data",
        }
    }).then((res) => console.log(res.data))
    .catch((err) => console.log(err));
    }

  return (
    <div className=" ">
       <form
            onSubmit={(e) => handleSubmit(e)}
            className="flex items-center gap-8 h-[calc(100%-50px)]"
          >
           
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
