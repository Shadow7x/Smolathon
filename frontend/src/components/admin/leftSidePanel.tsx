'use client'
import { useState } from "react"
import { Card, CardContent, CardFooter } from "../ui/card"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X } from "lucide-react"

export default function LeftSidePanel() {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (path: string) => pathname === path
  const handleClick = (path: string) => {
    router.push(path)
    setMobileOpen(false) // закрываем меню после перехода на мобилке
  }

  const menuItemClass = `flex items-center gap-1 ${isCollapsed ? "justify-center" : "justify-start"}`

  const MenuItems = () => (
    <>
      {/* Штрафы */}
      <CardContent className={`${menuItemClass} group`}>
        <button
          className={`${isActive("/admin") ? "text-black" : "text-[#636363]"} group-hover:text-black flex items-center gap-2 cursor-pointer`}
          onClick={() => handleClick("/admin")}
        >
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <path 
              d="M7.58341 22.75V19.5H5.41675V17.3333H7.58341V15.1667H5.41675V13H7.58341V3.25H14.6251C16.2862 3.25 17.6945 3.82778 18.8501 4.98333C20.0056 6.13889 20.5834 7.54722 20.5834 9.20833C20.5834 10.8694 20.0056 12.2778 18.8501 13.4333C17.6945 14.5889 16.2862 15.1667 14.6251 15.1667H9.75008V17.3333H14.0834V19.5H9.75008V22.75H7.58341ZM9.75008 13H14.6251C15.6723 13 16.5661 12.6299 17.3063 11.8896C18.0466 11.1493 18.4167 10.2556 18.4167 9.20833C18.4167 8.16111 18.0466 7.26736 17.3063 6.52708C16.5661 5.78681 15.6723 5.41667 14.6251 5.41667H9.75008V13Z" 
              fill={isActive("/admin") ? "black" :"#636363"}
              className="group-hover:fill-black"
            />
          </svg>
          {!isCollapsed && "Штрафы"}
        </button>
      </CardContent>

      {/* Пути эвакуаторов */}
      <CardContent className={`${menuItemClass} group`}>
        <button
          className={`${isActive("/admin/EvacuationRoutes") ? "text-black" : "text-[#636363]"} group-hover:text-black flex items-center gap-2 cursor-pointer`}
          onClick={() => handleClick("/admin/EvacuationRoutes")}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path 
              d="M13.25 19.75L6.75 17.475L1.7125 19.425C1.35139 19.5694 1.01736 19.5288 0.710417 19.3031C0.403472 19.0774 0.25 18.775 0.25 18.3958V3.22917C0.25 2.99444 0.317708 2.78681 0.453125 2.60625C0.588542 2.42569 0.773611 2.29028 1.00833 2.2L6.75 0.25L13.25 2.525L18.2875 0.575C18.6486 0.430556 18.9826 0.471181 19.2896 0.696875C19.5965 0.922569 19.75 1.225 19.75 1.60417V16.7708C19.75 17.0056 19.6823 17.2132 19.5469 17.3937C19.4115 17.5743 19.2264 17.7097 18.9917 17.8L13.25 19.75ZM12.1667 17.0958V4.42083L7.83333 2.90417V15.5792L12.1667 17.0958ZM14.3333 17.0958L17.5833 16.0125V3.175L14.3333 4.42083V17.0958ZM2.41667 16.825L5.66667 15.5792V2.90417L2.41667 3.9875V16.825Z" 
              fill={isActive("/admin/EvacuationRoutes") ? "black" :"#636363"} 
              className="group-hover:fill-black" 
            />
          </svg>
          {!isCollapsed && "Пути эвакуаторов"}
        </button>
      </CardContent>

        {/* Статистика эвакуаций */}
        <CardContent className={`${menuItemClass} group`}>
          <button
            className={`${isActive("/admin/TowTrucks") ? "text-black" : "text-[#636363]"} group-hover:text-black flex items-center gap-2 cursor-pointer`}
            onClick={() => handleClick("/admin/TowTrucks")}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M5.01667 14.3333L8.32083 11.0292L10.4875 13.1958L14.3333 9.37708V11.0833H16.5V5.66667H11.0833V7.83333H12.7896L10.4875 10.1354L8.32083 7.96875L3.5 12.8167L5.01667 14.3333ZM2.41667 19.75C1.82083 19.75 1.31076 19.5378 0.886458 19.1135C0.462153 18.6892 0.25 18.1792 0.25 17.5833V2.41667C0.25 1.82083 0.462153 1.31076 0.886458 0.886458C1.31076 0.462153 1.82083 0.25 2.41667 0.25H17.5833C18.1792 0.25 18.6892 0.462153 19.1135 0.886458C19.5378 1.31076 19.75 1.82083 19.75 2.41667V17.5833C19.75 18.1792 19.5378 18.6892 19.1135 19.1135C18.6892 19.5378 18.1792 19.75 17.5833 19.75H2.41667ZM2.41667 17.5833H17.5833V2.41667H2.41667V17.5833Z" 
                fill={isActive("/admin/TowTrucks") ? "black" :"#636363"} 
                className="group-hover:fill-black" 
              />
            </svg>
            {!isCollapsed && 'Статистика эвакуаций'}
          </button>
        </CardContent>

        {/* Реестр светофоров */}
        <CardContent className={`${menuItemClass} group`}>
          <button
            className={`${isActive("/admin/TrafficLightRegistry") ? "text-black" : "text-[#636363]"} group-hover:text-black flex items-center gap-2 cursor-pointer`}
            onClick={() => handleClick("/admin/TrafficLightRegistry")}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M5.66667 15.4167C5.97361 15.4167 6.2309 15.3128 6.43854 15.1052C6.64618 14.8976 6.75 14.6403 6.75 14.3333C6.75 14.0264 6.64618 13.7691 6.43854 13.5615C6.2309 13.3538 5.97361 13.25 5.66667 13.25C5.35972 13.25 5.10243 13.3538 4.89479 13.5615C4.68715 13.7691 4.58333 14.0264 4.58333 14.3333C4.58333 14.6403 4.68715 14.8976 4.89479 15.1052C5.10243 15.3128 5.35972 15.4167 5.66667 15.4167ZM5.66667 11.0833C5.97361 11.0833 6.2309 10.9795 6.43854 10.7719C6.64618 10.5642 6.75 10.3069 6.75 10C6.75 9.69306 6.64618 9.43576 6.43854 9.22812C6.2309 9.02049 5.97361 8.91667 5.66667 8.91667C5.35972 8.91667 5.10243 9.02049 4.89479 9.22812C4.68715 9.43576 4.58333 9.69306 4.58333 10C4.58333 10.3069 4.68715 10.5642 4.89479 10.7719C5.10243 10.9795 5.35972 11.0833 5.66667 11.0833ZM5.66667 6.75C5.97361 6.75 6.2309 6.64618 6.43854 6.43854C6.64618 6.2309 6.75 5.97361 6.75 5.66667C6.75 5.35972 6.64618 5.10243 6.43854 4.89479C6.2309 4.68715 5.97361 4.58333 5.66667 4.58333C5.35972 4.58333 5.10243 4.68715 4.89479 4.89479C4.68715 5.10243 4.58333 5.35972 4.58333 5.66667C4.58333 5.97361 4.68715 6.2309 4.89479 6.43854C5.10243 6.64618 5.35972 6.75 5.66667 6.75ZM8.91667 15.4167H15.4167V13.25H8.91667V15.4167ZM8.91667 11.0833H15.4167V8.91667H8.91667V11.0833ZM8.91667 6.75H15.4167V4.58333H8.91667V6.75ZM2.41667 19.75C1.82083 19.75 1.31076 19.5378 0.886458 19.1135C0.462153 18.6892 0.25 18.1792 0.25 17.5833V2.41667C0.25 1.82083 0.462153 1.31076 0.886458 0.886458C1.31076 0.462153 1.82083 0.25 2.41667 0.25H17.5833C18.1792 0.25 18.6892 0.462153 19.1135 0.886458C19.5378 1.31076 19.75 1.82083 19.75 2.41667V17.5833C19.75 18.1792 19.5378 18.6892 19.1135 19.1135C18.6892 19.5378 18.1792 19.75 17.5833 19.75H2.41667ZM2.41667 17.5833H17.5833V2.41667H2.41667V17.5833Z" 
                fill={isActive("/admin/TrafficLightRegistry") ? "black" :"#636363"}  
                className="group-hover:fill-black"  
              />
            </svg>
            {!isCollapsed && 'Реестр светофоров'}
          </button>
        </CardContent>

        {/* ДТП МВД */}
        <CardContent className={`${menuItemClass} group`}>
          <button
            className={`${isActive("/admin/DTP") ? "text-black" :"text-[#636363]"} group-hover:text-black flex items-center gap-2 cursor-pointer`}
            onClick={() => handleClick("/admin/DTP")}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M11.0001 21.8332C9.50147 21.8332 8.09314 21.5488 6.77508 20.9801C5.45703 20.4113 4.3105 19.6349 3.3355 18.6509C2.3605 17.6669 1.58862 16.5158 1.01987 15.1978C0.451123 13.8797 0.166748 12.4804 0.166748 10.9999C0.166748 8.16515 1.10564 5.72765 2.98341 3.68737C4.86119 1.64709 7.1723 0.491536 9.91675 0.220703V3.4707C8.05703 3.72348 6.50876 4.55855 5.27196 5.97591C4.03515 7.39327 3.41675 9.06793 3.41675 10.9999C3.41675 13.0943 4.15703 14.8818 5.63758 16.3624C7.11814 17.8429 8.90564 18.5832 11.0001 18.5832C12.1917 18.5832 13.3067 18.3304 14.3449 17.8249C15.3831 17.3193 16.2542 16.6332 16.9584 15.7665L19.7751 17.3915C18.8001 18.7457 17.5452 19.8245 16.0105 20.628C14.4758 21.4315 12.8056 21.8332 11.0001 21.8332ZM20.9126 15.3874L18.0959 13.7624C18.2584 13.329 18.3803 12.8822 18.4615 12.4217C18.5428 11.9613 18.5834 11.4874 18.5834 10.9999C18.5834 9.06793 17.965 7.39327 16.7282 5.97591C15.4914 4.55855 13.9431 3.72348 12.0834 3.4707V0.220703C14.8279 0.491536 17.139 1.64709 19.0167 3.68737C20.8945 5.72765 21.8334 8.16515 21.8334 10.9999C21.8334 11.7943 21.7612 12.5617 21.6167 13.302C21.4723 14.0422 21.2376 14.7374 20.9126 15.3874Z" 
                fill={isActive("/admin/DTP") ? "black" :"#636363"} 
                className="group-hover:fill-black"  />
            </svg>
            {!isCollapsed && 'ДТП МВД'}
          </button>
        </CardContent>
        
        {/* Скачать отчет */}
        <CardContent className={`${menuItemClass} group`}>
          <button 
            className={`${isActive("/admin/Downloadingreport") ? "text-black" : "text-[#636363]"} group-hover:text-black flex items-center gap-2 cursor-pointer`}
            onClick={() => handleClick("/admin/Downloadingreport")}
          >
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M11.9167 17.3333V8.50409L9.1 11.3208L7.58333 9.74992L13 4.33325L18.4167 9.74992L16.9 11.3208L14.0833 8.50409V17.3333H11.9167ZM6.49999 21.6666C5.90416 21.6666 5.39409 21.4544 4.96979 21.0301C4.54548 20.6058 4.33333 20.0958 4.33333 19.4999V16.2499H6.49999V19.4999H19.5V16.2499H21.6667V19.4999C21.6667 20.0958 21.4545 20.6058 21.0302 21.0301C20.6059 21.4544 20.0958 21.6666 19.5 21.6666H6.49999Z" 
                fill={isActive("/admin/Downloadingreport") ? "black" : "#636363"}
                className="group-hover:fill-black"
              />
            </svg>
            {!isCollapsed && 'Скачать отчет'}
          </button>
        </CardContent>

        {/*Карта*/}
        <CardContent className={`${menuItemClass} group`}>
          <button 
            className={`${isActive("/admin/Map") ? "text-black" :"text-[#636363]"} group-hover:text-black flex items-center gap-2 cursor-pointer`}
            onClick={() => handleClick("/admin/Map")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
              <path 
                d="M320-240q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Zm240 240q-17 0-28.5-11.5T520-600q0-17 11.5-28.5T560-640q17 0 28.5 11.5T600-600q0 17-11.5 28.5T560-560Zm0 200q81-69 120.5-127.5T720-596q0-75-48.5-119.5T560-760q-63 0-111.5 44.5T400-596q0 50 39.5 108.5T560-360Z"
                fill={isActive("/admin/Map") ? "black" : "#636363"}
                className="group-hover:fill-black"
              />
            </svg>
            {!isCollapsed && 'Загруженность'}
          </button>
        </CardContent>


        {/* Разделитель */}
        {!isCollapsed && <CardContent className="flex items-center gap-1"><div className="h-[2px] bg-[#636363] w-full"></div></CardContent>}

        {/* Футер */}
        <CardFooter
          className="hidden md:flex items-center gap-1 cursor-pointer"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10.5417 5.66667V14.3333L14.875 10L10.5417 5.66667Z" fill="#636363" />
          </svg>
          {!isCollapsed && <span>Скрыть</span>}
        </CardFooter>
    </>
  )

  return (
    <>
      {/* Бургер только на мобилке */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button
          className="p-2 rounded-md bg-gray-100"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Десктопная панель */}
      <div className={`mt-[6.2rem] ml-[2rem] transition-all hidden md:block ${isCollapsed ? "w-16" : "w-64"}`}>
        <Card>
          {MenuItems()}
        </Card>
      </div>

      {/* Мобильное меню (оверлей) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 md:hidden" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute top-0 left-0 h-full w-64 bg-white shadow-lg p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end p-2">
              <button onClick={() => setMobileOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <Card>
              {MenuItems()}
            </Card>
          </div>
        </div>
      )}
    </>
  )
}
