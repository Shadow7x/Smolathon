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

import { useState, useEffect, useRef } from "react";

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

interface Props {
  merit: Merit;
}

export default function MeritsMainSection({ merit }: Props) {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editable, setEditable] = useState<Merit | null>(null);

  const [images, setImages] = useState<any[]>([]);
  const [images2, setImages2] = useState<any[]>([]);
  const [newFiles, setNewFiles] = useState<{ [key: string]: File }>({});

  const logo1Ref = useRef<HTMLInputElement>(null);
  const logo2Ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (merit) {
      setEditable(merit);
      if (merit.images_first_block?.length) {
        setImages(merit.images_first_block);
        setImages2(merit.images_second_block);
      }
    }
  }, [merit]);

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
    setEditable((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleLogoChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "logo_first_block" | "logo_second_block"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setEditable((prev) =>
        prev ? { ...prev, [field]: preview } : prev
      );
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

  if (!editable) return null;

  return (
    <div className="min-w-[80%]">
      {user && (
        <div className="flex flex-row gap-2 mb-4">
          {/* Удаление */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Card className="p-1 cursor-pointer">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.5 31.5C9.675 31.5 8.96875 31.2063 8.38125 30.6188C7.79375 30.0313 7.5 29.325 7.5 28.5V9H6V6H13.5V4.5H22.5V6H30V9H28.5V28.5C28.5 29.325 28.2063 30.0313 27.6188 30.6188C27.0312 31.2063 26.325 31.5 25.5 31.5H10.5ZM25.5 9H10.5V28.5H25.5V9ZM13.5 25.5H16.5V12H13.5V25.5ZM19.5 25.5H22.5V12H19.5V25.5Z" fill="#636363" />
                </svg>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Вы уверены, что хотите удалить запись?</DialogTitle>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="destructive"
                  onClick={() => console.log("delete", editable.id)}
                  disabled={loading}
                >
                  {loading ? "Удаляем..." : "Удалить"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Редактирование */}
          <Card
            className="p-1 cursor-pointer"
            onClick={() => setIsEditing(!isEditing)}
          >
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 28.5H9.6375L24.3 13.8375L22.1625 11.7L7.5 26.3625V28.5ZM4.5 31.5V25.125L24.3 5.3625C24.6 5.0875 24.9312 4.875 25.2937 4.725C25.6562 4.575 26.0375 4.5 26.4375 4.5C26.8375 4.5 27.225 4.575 27.6 4.725C27.975 4.875 28.3 5.1 28.575 5.4L30.6375 7.5C30.9375 7.775 31.1562 8.1 31.2937 8.475C31.4312 8.85 31.5 9.225 31.5 9.6C31.5 10 31.4312 10.3812 31.2937 10.7437C31.1562 11.1062 30.9375 11.4375 30.6375 11.7375L10.875 31.5H4.5ZM23.2125 12.7875L22.1625 11.7L24.3 13.8375L23.2125 12.7875Z" fill="#636363" />
            </svg>
          </Card>

          {isEditing && (
            <Button
              className="bg-green-600 text-white"
              onClick={() => console.log("сохранить на бекенд", editable, newFiles)}
            >
              Сохранить
            </Button>
          )}
        </div>
      )}

      {/* Первый блок */}
      <div className="flex flex-row items-center justify-between gap-[5%] w-full">
        <div className="w-[20%] flex justify-center">
          <img
            src={
              editable.logo_first_block.startsWith("blob:")
                ? editable.logo_first_block
                : `${MEDIA_URL}${editable.logo_first_block}`
            }
            alt="Логотип"
            className="w-[80%] h-auto object-contain cursor-pointer"
            onClick={() => isEditing && logo1Ref.current?.click()}
          />
          <input
            type="file"
            accept="image/*"
            ref={logo1Ref}
            className="hidden"
            onChange={(e) => handleLogoChange(e, "logo_first_block")}
          />
        </div>

        <div className="w-[30%] text-center flex flex-col justify-center">
          {isEditing ? (
            <div className="flex flex-col min-h-[200px]">
              <Input
                value={editable.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="text-[2vw] text-center font-bold mb-[1%]"
              />
              <Input
                value={editable.decode}
                onChange={(e) => handleChange("decode", e.target.value)}
                className="text-[1.2vw] text-gray-600 leading-relaxed"
              />
            </div>
          ) : (
            <>
              <p className="text-[2vw] font-bold mb-[2%]">{editable.title}</p>
              <p className="text-[1.2vw] text-gray-600 leading-relaxed">
                {editable.decode}
              </p>
            </>
          )}
        </div>

        <div className="relative w-[40%] h-[22vw]">
          {images.map((image, index) => (
            <div
              key={index}
              className="absolute top-0 left-0 w-[100%] h-[90%]"
              style={{
                zIndex: index,
                transform: `translate(${index * 15}%, ${index * 5}%)`,
              }}
            >
              <img
                src={
                  image.preview
                    ? image.preview
                    : `${MEDIA_URL}${image.image}`
                }
                alt={`img-${index}`}
                onClick={() =>
                  isEditing
                    ? document
                        .getElementById(`file-input-first-${index}`)
                        ?.click()
                    : bringToFront(index)
                }
                className="w-full h-full object-cover rounded-lg shadow-lg cursor-pointer transition-transform duration-500 hover:scale-105"
              />
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
            {isEditing ? (
              <textarea
                value={editable.purposes}
                onChange={(e) => handleChange("purposes", e.target.value)}
                className="w-[100%] h-[100%] resize-none text-[1.2vw] leading-relaxed text-gray-700 rounded-md border border-gray-300 p-2"
              />
            ) : (
              <p className="text-[1.2vw] leading-relaxed text-gray-700 w-full">
                {editable.purposes}
              </p>
            )}
          </CardContent>
        </Card>

        <div className="w-[25%] flex justify-center">
          <img
            src={
              editable.logo_second_block.startsWith("blob:")
                ? editable.logo_second_block
                : `${MEDIA_URL}${editable.logo_second_block}`
            }
            alt="Логотип второго блока"
            className="w-[60%] h-auto object-contain cursor-pointer"
            onClick={() => isEditing && logo2Ref.current?.click()}
          />
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
        <div className="relative w-[45%] h-[20vw]">
          {images2.map((image, index) => (
            <div
              key={index}
              className="absolute top-0 left-0 w-[100%] h-[100%]"
              style={{
                zIndex: index,
                transform: `translate(${index * 15}%, ${index * 5}%)`,
              }}
            >
              <img
                src={
                  image.preview
                    ? image.preview
                    : `${MEDIA_URL}${image.image}`
                }
                alt={`contact-img-${index}`}
                onClick={() =>
                  isEditing
                    ? document
                        .getElementById(`file-input-second-${index}`)
                        ?.click()
                    : bringToFront2(index)
                }
                className="w-full h-full object-cover rounded-lg shadow-lg cursor-pointer transition-transform duration-500 hover:scale-105"
              />
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

        <div className="w-[45%] flex flex-row items-center justify-between">
          <div className="w-[70%] min-h-[200px] flex flex-col justify-center">
            <p className="text-[2vw] font-bold mb-[1vw]">Контакты</p>
            {isEditing ? (
              <div className="flex flex-col gap-2">
                <Input
                  value={editable.parents_name}
                  onChange={(e) => handleChange("parents_name", e.target.value)}
                  className="w-full"
                />
                <Input
                  value={editable.parents_phone}
                  onChange={(e) => handleChange("parents_phone", e.target.value)}
                  className="w-full"
                />
                <Input
                  value={editable.parents_email}
                  onChange={(e) => handleChange("parents_email", e.target.value)}
                  className="w-full"
                />
                <Input
                  value={editable.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  className="w-full"
                />
              </div>
            ) : (
              <>
                <p className="text-[1.2vw]">{editable.parents_name}</p>
                <p className="text-[1.2vw]">{editable.parents_phone}</p>
                <p className="text-[1.2vw]">{editable.parents_email}</p>
                <p className="text-[1.2vw]">{editable.address}</p>
              </>
            )}
          </div>
          <div className="w-[20%] flex justify-end">
            <img
              src="/images/phone.png"
              alt="Телефон"
              className="w-[100%] h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
