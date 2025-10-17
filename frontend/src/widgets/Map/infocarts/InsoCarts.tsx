"use client"

interface CarsProp {
    isCars: string
    time: number
    graf: number
}

export default function InfoCarts({
    isCars,
    time,
    graf
}: CarsProp) {
    
    return(
        <div className="w-full max-w-[500px] bg-white rounded-[10px] border border-gray-300 shadow-sm p-6">
            <h1 className="text-2xl font-semibold  mb-6">
                Информация о совместном движении
            </h1>
            
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center w-[150px] justify-between gap-2">
                    <p className="font-medium whitespace-nowrap">
                        Гос. номер выбранного авто:
                    </p>
                    <span className="px-3 py-1 rounded font-bold">
                        {isCars}
                    </span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center w-[250px] justify-around gap-2">
                    <p className="font-medium whitespace-nowrap">
                        Время рейса авто:x
                    </p>
                    <span className="text-gray-800 font-bold">
                        {time} минут
                    </span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <p className="text-gray-600 font-medium whitespace-nowrap">
                        Количество совпавших узлов графа:
                    </p>
                    <span className="text-gray-800 font-semibold px-3 py-1 rounded text-7xl">
                        {graf}
                    </span>
                </div>
            </div>
        </div>
    )
}