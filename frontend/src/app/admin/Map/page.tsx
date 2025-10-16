"use client"
import AnaliticsMap from "@/widgets/Map/analiticsMap/analiticsMap"
import Carsine from "@/widgets/Map/carsine/carsine"
export default function Map(){
    return(
        <div>
            <Carsine />
            <AnaliticsMap />
            <h1>MAP</h1>
        </div>
    )
}