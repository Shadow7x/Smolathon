"use client";

import { MEDIA_URL } from "@/index";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


interface Merit{
    id: number,
    images_first_block: {
        id: number,
        image: string
    }[],
    images_second_block: {
        id: number,
        image: string
    }[],
    logo_first_block: string,
    logo_second_block: string,
    title: string,
    decode: string,
    purposes: string,
    parents_name: string,
    parents_phone: string,
    parents_email: string,
    address: string


}

interface Props {
  merit: Merit
}

import { useState, useEffect } from "react";

export default function MeritsMainSection( merit: Props | null) {
    console.log(merit?.merit)
    const merits = merit?.merit

    const [images, setImages] = useState([]);
    const [images2, setImages2] = useState([]);

    useEffect(() => {
    if (merits?.images_first_block?.length) {
      setImages(merits?.images_first_block);
      setImages2(merits?.images_second_block);
    }
  }, [merits]);

  const bringToFront = (index) => {
    const newImages = [...images];
    const [clicked] = newImages.splice(index, 1);
    newImages.push(clicked); // кликнутая уходит вперёд (в конец массива)
    setImages(newImages);
  };
  const bringToFront2 = (index) => {
    const newImages = [...images2];
    const [clicked] = newImages.splice(index, 1);
    newImages.push(clicked); // кликнутая наверх
    setImages2(newImages);
  };


  return (
    <div className="">
        <div className="flex flex-row items-center justify-between gap-[5%]  w-full">
          {/* Логотип */}
          <div className="w-[20%] flex justify-center">
            <img
              src={`${MEDIA_URL}${merits?.logo_first_block}`}
              alt="Логотип"
              className="w-[80%] h-auto object-contain"
            />
          </div>

          {/* Текст */}
          <div className="w-[30%] text-center">
            <p className="text-[2vw] font-bold mb-[2%]">{merits?.title}</p>
            <p className="text-[1.2vw] text-gray-600 leading-relaxed">{merits?.decode}</p>
          </div>

          {/* Галерея картинок (стопка) */}
          <div className="relative w-[40%] h-[22vw]">
            {images.map((image, index) => (
              <img
                key={index}
                src={`${MEDIA_URL}${image.image}`}
                alt={`img-${index}`}
                onClick={() => bringToFront(index)}
                className="absolute top-0 left-0 w-[100%] h-[90%] object-cover rounded-lg shadow-lg cursor-pointer transition-transform duration-500 hover:scale-105"
                style={{
                  zIndex: index,
                  transform: `translate(${index * 15}%, ${index * 5}%)`, // смещение слоя в %
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-row items-center justify-between gap-6 py-12 w-full">
          {/* Текстовая карточка */}
          <Card className="w-[70%] shadow-md border border-gray-200">
            <CardContent className="p-[5%]">
              <p className="text-[1.2vw] leading-relaxed text-gray-700">
                {merits?.purposes}
              </p>
            </CardContent>
          </Card>

          {/* Логотип/иконка */}
          <div className="w-[25%] flex justify-center">
            <img
              src={`${MEDIA_URL}${merits?.logo_second_block}`}
              alt="Логотип второго блока"
              className="w-[60%] h-auto object-contain"
            />
          </div>
        </div>
        <div className="flex flex-row items-center justify-between gap-[5%] py-[5%] w-full">
          {/* Фото (стопка) */}
          <div className="relative w-[45%] h-[20vw]">
            {images2.map((image, index) => (
              <img
                key={index}
                src={`${MEDIA_URL}${image.image}`}
                alt={`contact-img-${index}`}
                onClick={() => bringToFront2(index)}
                className="absolute top-0 left-0 w-[100%] h-[100%] object-cover rounded-lg shadow-lg cursor-pointer transition-transform duration-500 hover:scale-105"
                style={{
                  zIndex: index,
                  transform: `translate(${index * 15}%, ${index * 5}%)`, // смещение в процентах
                }}
              />
            ))}
          </div>

          {/* Контакты */}
          <div className="w-[45%] flex flex-row items-center justify-between">
            {/* Текст */}
            <div className="w-[70%]">
              <p className="text-[2vw] font-bold mb-[1vw]">Контакты</p>
              <p className="text-[1.2vw]">{merits?.parents_name}</p>
              <p className="text-[1.2vw]">{merits?.parents_phone}</p>
              <p className="text-[1.2vw]">{merits?.parents_email}</p>
              <p className="text-[1.2vw]">{merits?.address}</p>
            </div>

            {/* Иконка телефона */}
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
