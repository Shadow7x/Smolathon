"use client";
import { useState, useEffect, memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNotificationManager } from "@/hooks/notification-context";
import axi from "@/utils/api";
import { Eye, EyeOff, Filter, ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- интерфейс записи о светофоре ---
interface TrafficLight {
  id: number;
  location: string;
  type: string;
  year: number;
}

// --- строка таблицы (desktop) ---
const TrafficLightRow = memo(({ item }: { item: TrafficLight }) => (
  <TableRow className="hover:bg-gray-50/50 transition-colors">
    <TableCell className="font-medium text-sm py-3">{item.year}</TableCell>
    <TableCell className="text-sm py-3">{item.location}</TableCell>
    <TableCell className="text-sm py-3">{item.type}</TableCell>
  </TableRow>
));

// --- карточка записи (mobile) ---
const TrafficLightCard = ({ item }: { item: TrafficLight }) => (
  <div className="border rounded-lg p-4 shadow-sm bg-white flex flex-col gap-2 text-sm">
    <div>
      <span className="font-medium text-gray-700">Год: </span>
      {item.year}
    </div>
    <div>
      <span className="font-medium text-gray-700">Адрес: </span>
      {item.location}
    </div>
    <div>
      <span className="font-medium text-gray-700">Тип: </span>
      {item.type}
    </div>
  </div>
);

// --- основной компонент ---
export default function LightRegistry() {
  const [showTable, setShowTable] = useState(true);
  const [allLights, setAllLights] = useState<TrafficLight[]>([]);
  const [displayedLights, setDisplayedLights] = useState<TrafficLight[]>([]);
  const [loading, setLoading] = useState(false);
  const [yearFilter, setYearFilter] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [inputYear, setInputYear] = useState("");
  const { addNotification } = useNotificationManager();

  // --- загрузка данных ---
  const fetchTrafficLights = async (year: string) => {
    setLoading(true);
    try {
      const response = await axi.get(`/analytics/trafficLight/get`);
      let mapped: TrafficLight[] = response.data.map((item: any) => ({
        id: item.id,
        location: item.address,
        type: item.type,
        year: item.year,
      }));

      if (year) {
        mapped = mapped.filter((el) => el.year === Number(year));
      }

      setAllLights(mapped);
      setSortOrder("desc");
      setYearFilter(year);
    } catch (error: any) {
      addNotification({
        id: Date.now().toString(),
        title: "Ошибка",
        description: "Не удалось загрузить данные о светофорах",
        status: error.response?.status || 500,
        createdAt: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  // --- сортировка ---
  useEffect(() => {
    let filtered = [...allLights];
    filtered.sort((a, b) =>
      sortOrder === "asc" ? a.year - b.year : b.year - a.year
    );
    setDisplayedLights(filtered);
  }, [allLights, sortOrder]);

  return (
    <div className="pt-[6rem] px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-6">
          Реестр светофоров
        </h1>

        {/* форма загрузки */}
        <Card className="w-full mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg md:text-xl">Просмотр данных</CardTitle>
            <CardDescription>
              Загрузите данные о светофорах с возможностью фильтрации по году
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="grid w-full sm:max-w-sm items-center gap-1.5">
                <Label htmlFor="year-filter">Год</Label>
                <Input
                  id="year-filter"
                  type="number"
                  placeholder="Например: 2024"
                  value={inputYear}
                  onChange={(e) => setInputYear(e.target.value)}
                  min="2000"
                  max="2030"
                  className="h-10"
                />
              </div>
              <Button
                onClick={() => fetchTrafficLights(inputYear)}
                disabled={loading || !inputYear.trim()}
                className="h-10 w-full sm:w-auto"
              >
                {loading ? "Загрузка..." : "Загрузить данные"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* таблица / карточки */}
        {displayedLights.length > 0 && (
          <Card className="w-full">
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <CardTitle className="text-lg md:text-xl">
                    Данные о светофорах {yearFilter && `за ${yearFilter} год`}
                  </CardTitle>
                  <CardDescription>
                    Всего записей: {displayedLights.length}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowTable(!showTable)}
                  className="flex items-center gap-2 h-9 self-start"
                >
                  {showTable ? (
                    <>
                      <EyeOff className="h-4 w-4" /> Скрыть таблицу
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" /> Показать таблицу
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>

            {showTable && (
              <CardContent>
                {/* фильтры */}
                <div className="flex flex-wrap gap-4 items-center mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Фильтры:
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Сортировка:</span>
                    <Select
                      value={sortOrder}
                      onValueChange={(v) => setSortOrder(v as "asc" | "desc")}
                    >
                      <SelectTrigger className="w-[160px] h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="desc">Сначала новые</SelectItem>
                        <SelectItem value="asc">Сначала старые</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* таблица для десктопа */}
                <div className="hidden md:block rounded-lg border border-gray-200 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead>Год</TableHead>
                        <TableHead>Адрес</TableHead>
                        <TableHead>Тип</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedLights.map((item) => (
                        <TrafficLightRow key={item.id} item={item} />
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* карточки для мобильных */}
                <div className="grid gap-4 md:hidden">
                  {displayedLights.map((item) => (
                    <TrafficLightCard key={item.id} item={item} />
                  ))}
                </div>

                <div className="mt-4 text-sm text-gray-500 text-center">
                  Показано {displayedLights.length} записей из {allLights.length}
                </div>
              </CardContent>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
