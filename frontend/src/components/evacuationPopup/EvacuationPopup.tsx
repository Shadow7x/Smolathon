"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function EvacuationPopup({
  triggerClass,
}: {
  triggerClass?: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className={triggerClass}>
          Услуги
          {triggerClass?.includes("group") && (
            <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-[#62A744] group-hover:w-full transition-all duration-300 origin-left"></span>
          )}
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Наши услуги</DialogTitle>
        </DialogHeader>
        <div className="text-gray-700 space-y-4">
          <p>
            Здесь можно разместить описание услуг, инструкции по эвакуации или
            форму для обратной связи.
          </p>
          <a
            href="/services"
            className="inline-block px-4 py-2 bg-[#62A744] text-white rounded-xl hover:bg-[#4a8536] transition-colors"
          >
            Подробнее
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
