"use client";

import { MEDIA_URL } from "@/index";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/hooks/user-context";

import { useState, useRef } from "react";
import axi from "@/utils/api";

interface Merit {
  id: number;
  images_first_block: { id: number; image: string; preview?: string }[];
  images_second_block: { id: number; image: string; preview?: string }[];
  logo_first_block: string;
  logo_second_block: string;
  title: string;
  decode: string;
  purposes: string;
  parents_name: string;
  parents_phone: string;
  parents_email: string;
  address: string;
}
import { useNotificationManager } from "@/hooks/notification-context";
export default function MeritCreate() {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isEditing, setIsEditing] = useState(true);

  // Заполняем пустыми данными
  const [editable, setEditable] = useState<Merit>({
    id: 0,
    images_first_block: [{ id: 0, image: "" }, { id: 1, image: "" }],
    images_second_block: [{ id: 0, image: "" }, { id: 1, image: "" }],
    logo_first_block: "",
    logo_second_block: "",
    title: "",
    decode: "",
    purposes: "",
    parents_name: "",
    parents_phone: "",
    parents_email: "",
    address: "",
  });

  const [images, setImages] = useState<any[]>(editable.images_first_block);
  const [images2, setImages2] = useState<any[]>(editable.images_second_block);
  const [newFiles, setNewFiles] = useState<{ [key: string]: File }>({});
  const { notifications, addNotification} = useNotificationManager();
  const logo1Ref = useRef<HTMLInputElement>(null);
  const logo2Ref = useRef<HTMLInputElement>(null);

  const bringToFront = (index: number) => {
    const newImages = [...images];
    const [clicked] = newImages.splice(index, 1);
    newImages.push(clicked);
    setImages(newImages);
  };
  const bringToFront2 = (index: number) => {
    const newImages = [...images2];
    const [clicked] = newImages.splice(index, 1);
    newImages.push(clicked);
    setImages2(newImages);
  };

  const handleChange = (field: keyof Merit, value: string) => {
    setEditable((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "logo_first_block" | "logo_second_block"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setEditable((prev) => ({ ...prev, [field]: preview }));
      setNewFiles((prev) => ({ ...prev, [field]: file }));
    }
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    block: "first" | "second"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      if (block === "first") {
        const newImages = [...images];
        newImages[index] = { ...newImages[index], preview };
        setImages(newImages);
        setNewFiles((prev) => ({ ...prev, [`first-${index}`]: file }));
      } else {
        const newImages = [...images2];
        newImages[index] = { ...newImages[index], preview };
        setImages2(newImages);
        setNewFiles((prev) => ({ ...prev, [`second-${index}`]: file }));
      }
    }
  };

  const handleSubmit = () => {
    console.log("Создание Merit", editable, newFiles);

    const form = new FormData();
    form.append("title", editable.title || "");
    form.append("decode", editable.decode || "");
    form.append("purposes", editable.purposes || "");
    form.append("parents_name", editable.parents_name || "");
    form.append("parents_phone", editable.parents_phone || "");
    form.append("parents_email", editable.parents_email || "");
    form.append("address", editable.address || "");

    if (newFiles.logo_first_block)
      form.append("logo_first_block", newFiles.logo_first_block);
    if (newFiles.logo_second_block)
      form.append("logo_second_block", newFiles.logo_second_block);

    Object.keys(newFiles).forEach((key) => {
      if (key.startsWith("first-")) {
        form.append("images_first_block[]", newFiles[key]);
      }
      if (key.startsWith("second-")) {
        form.append("images_second_block[]", newFiles[key]);
      }
    });

    axi.post("/content/merits/create", form, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(() => {
        console.log("Merit создан");
        addNotification({id: Date.now().toString(), title: "Успешно", description: "Merit создан", status: 200, createdAt: new Date().toISOString(),})
        window.location.reload()
        setIsEditing(false);
      })
      .catch((e) => {
        console.log(e);
        addNotification({id: Date.now().toString(), title: "Ошибка", description: "Merit не создан", status: 400, createdAt: new Date().toISOString(),})
      });
  };

  return (
    <div className="min-w-[80%]">
      {user && (
        <div className="flex flex-row gap-2 mb-4">
          {/* Редактирование */}
          <Card
            className="p-1 cursor-pointer"
            onClick={() => setIsEditing(!isEditing)}
          >
            ✏️
          </Card>

          {isEditing && (
            <Button
              className="bg-green-600 text-white"
              onClick={handleSubmit}
            >
              Создать
            </Button>
          )}
        </div>
      )}

      {/* Первый блок */}
      <div className="flex flex-row items-center justify-between gap-[5%] w-full">
        {/* Лого 1 */}
        <div className="w-[20%] flex justify-center">
          <div
            className="w-[80%] h-auto cursor-pointer border border-dashed border-gray-400 flex items-center justify-center"
            onClick={() => isEditing && logo1Ref.current?.click()}
          >
            {editable.logo_first_block ? (
              <img
                src={editable.logo_first_block}
                alt="Лого"
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-gray-400">+ Лого</span>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            ref={logo1Ref}
            className="hidden"
            onChange={(e) => handleLogoChange(e, "logo_first_block")}
          />
        </div>

        {/* Текст */}
        <div className="w-[30%] text-center flex flex-col justify-center">
          <Input
            value={editable.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Название"
            className="text-[2vw] text-center font-bold mb-[1%]"
          />
          <Input
            value={editable.decode}
            onChange={(e) => handleChange("decode", e.target.value)}
            placeholder="Описание"
            className="text-[1.2vw] text-gray-600"
          />
        </div>

        {/* Картинки 1 блока */}
        <div className="relative w-[40%] h-[22vw]">
          {images.map((image, index) => (
            <div
              key={index}
              className="absolute top-0 left-0 w-[100%] h-[90%] flex items-center justify-center border border-dashed border-gray-300 bg-gray-50"
              style={{
                zIndex: index,
                transform: `translate(${index * 15}%, ${index * 5}%)`,
              }}
              onClick={() =>
                isEditing &&
                document.getElementById(`file-input-first-${index}`)?.click()
              }
            >
              {image.preview || image.image ? (
                <img
                  src={image.preview || `${MEDIA_URL}${image.image}`}
                  className="w-full h-full object-cover rounded-lg"
                  alt="Фото"
                />
              ) : (
                <span className="text-gray-400">+ Фото</span>
              )}

              <input
                type="file"
                accept="image/*"
                id={`file-input-first-${index}`}
                className="hidden"
                onChange={(e) => handleImageChange(e, index, "first")}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Второй блок */}
      <div className="flex flex-row items-center justify-between gap-6 py-12 w-full">
        <Card className="w-[70%] shadow-md border border-gray-200">
          <CardContent className="p-[5%] min-h-[180px] flex">
            <textarea
              value={editable.purposes}
              onChange={(e) => handleChange("purposes", e.target.value)}
              placeholder="Цели проекта..."
              className="w-full h-full resize-none text-[1.2vw] text-gray-700 rounded-md border border-gray-300 p-2"
            />
          </CardContent>
        </Card>

        {/* Лого 2 */}
        <div className="w-[25%] flex justify-center">
          <div
            className="w-[60%] h-auto cursor-pointer border border-dashed border-gray-400 flex items-center justify-center"
            onClick={() => isEditing && logo2Ref.current?.click()}
          >
            {editable.logo_second_block ? (
              <img
                src={editable.logo_second_block}
                alt="Лого 2"
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-gray-400">+ Лого</span>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            ref={logo2Ref}
            className="hidden"
            onChange={(e) => handleLogoChange(e, "logo_second_block")}
          />
        </div>
      </div>

      {/* Третий блок */}
      <div className="flex flex-row items-center justify-between gap-[5%] py-[5%] w-full">
        {/* Картинки */}
        <div className="relative w-[45%] h-[20vw]">
          {images2.map((image, index) => (
            <div
              key={index}
              className="absolute top-0 left-0 w-[100%] h-[100%] flex items-center justify-center border border-dashed border-gray-300 bg-gray-50"
              style={{
                zIndex: index,
                transform: `translate(${index * 15}%, ${index * 5}%)`,
              }}
              onClick={() =>
                isEditing &&
                document.getElementById(`file-input-second-${index}`)?.click()
              }
            >
              {image.preview || image.image ? (
                <img
                  src={image.preview || `${MEDIA_URL}${image.image}`}
                  className="w-full h-full object-cover rounded-lg"
                  alt="Фото"
                />
              ) : (
                <span className="text-gray-400">+ Фото</span>
              )}

              <input
                type="file"
                accept="image/*"
                id={`file-input-second-${index}`}
                className="hidden"
                onChange={(e) => handleImageChange(e, index, "second")}
              />
            </div>
          ))}
        </div>

        {/* Контакты */}
        <div className="w-[45%] flex flex-col gap-2">
          <p className="text-[2vw] font-bold mb-[1vw]">Контакты</p>
          <Input
            value={editable.parents_name}
            onChange={(e) => handleChange("parents_name", e.target.value)}
            placeholder="ФИО"
          />
          <Input
            value={editable.parents_phone}
            onChange={(e) => handleChange("parents_phone", e.target.value)}
            placeholder="Телефон"
          />
          <Input
            value={editable.parents_email}
            onChange={(e) => handleChange("parents_email", e.target.value)}
            placeholder="Email"
          />
          <Input
            value={editable.address}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="Адрес"
          />
        </div>
      </div>
    </div>
  );
}
