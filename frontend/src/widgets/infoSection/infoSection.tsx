import Image from 'next/image';

export default function InfoSection() {
    return(
        <div className='flex flex-col lg:flex-row items-center justify-around w-full px-4 sm:px-6 lg:px-8 py-10 lg:py-20 gap-8 lg:gap-12'>
            {/* Текстовая часть */}
            <div className='flex flex-col w-full lg:w-[810px] gap-6 lg:gap-8'>
                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                    <div className='flex-shrink-0'>
                        <Image src="/images/infoSection/infoSection1.svg" alt="Иконка 1" 
                            width={70} 
                            height={70}
                            className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20"
                        />
                    </div>
                    <p className='w-full sm:w-[calc(100%-100px)] lg:w-[720px] text-base lg:text-lg text-gray-700'>
                        Мы обслуживаем светофорные объекты в Смоленске и районных центрах.
                    </p>
                </div>
                
                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                    <div className='flex-shrink-0'>
                        <Image src="/images/infoSection/infoSection2.svg" alt="Иконка 2" 
                            width={70} 
                            height={70}
                            className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20"
                        />
                    </div>
                    <p className='w-full sm:w-[calc(100%-100px)] lg:w-[720px] text-base lg:text-lg text-gray-700'>
                        Мы обеспечиваем работоспособность комплексов фото-видеофиксации административных правонарушений на дорогах общего пользования Смоленской области.
                    </p>
                </div>
                
                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                    <div className='flex-shrink-0'>
                        <Image src="/images/infoSection/infoSection3.svg" alt="Иконка 3" 
                            width={70} 
                            height={70}
                            className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20"
                        />
                    </div>
                    <p className='w-full sm:w-[calc(100%-100px)] lg:w-[720px] text-base lg:text-lg text-gray-700'>
                        Мы создали и развиваем автоматизированную систему управления дорожным движением в Смоленске.
                    </p>
                </div>
                
                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                    <div className='flex-shrink-0'>
                        <Image src="/images/infoSection/infoSection4.svg" alt="Иконка 4" 
                            width={70} 
                            height={70}
                            className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20"
                        />
                    </div>
                    <p className='w-full sm:w-[calc(100%-100px)] lg:w-[720px] text-base lg:text-lg text-gray-700'>
                        Мы внедряем интеллектуальную транспортную систему.
                    </p>
                </div>
            </div>
            {/* Изображение */}
            <div className='flex-shrink-0 w-full sm:w-80 lg:w-96 xl:w-[500px]'>
                <Image src="/images/infoSection/infoSection.svg" alt="Инфографика" 
                    width={500} 
                    height={500}
                    className="w-full h-auto"
                />
            </div>
        </div>
    )
}