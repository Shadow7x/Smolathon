"use client";
import { useState, useEffect, memo } from "react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation"; //
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
import DTPLineDiagram from "@/components/Diagrams/DTP/Line";
import DTPPieDiagram from "@/components/Diagrams/DTP/Pie";
import { Eye, EyeOff, ArrowUpDown, Upload, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";

interface DTP {
  id: number;
  point_FPSR: string;
  statistical_factor: string;
  count: number;
  month: string;
  year: number;
}

const monthNames = [
  "январь",
  "февраль",
  "март",
  "апрель",
  "май",
  "июнь",
  "июль",
  "август",
  "сентябрь",
  "октябрь",
  "ноябрь",
  "декабрь",
];

const normalizeMonth = (m: string): number => {
  const idx = monthNames.findIndex(
    (mm) => mm.toLowerCase() === m.toLowerCase()
  );
  return idx >= 0 ? idx + 1 : 0;
};

// строка таблицы (desktop)
const DTPRow = memo(({ item }: { item: DTP }) => (
  <TableRow className="hover:bg-gray-50/50 transition-colors">
    <TableCell className="text-sm py-3">{item.year}</TableCell>
    <TableCell className="text-sm py-3">{item.month}</TableCell>
    <TableCell className="text-sm py-3">{item.point_FPSR}</TableCell>
    <TableCell className="text-sm py-3">{item.statistical_factor}</TableCell>
    <TableCell className="text-sm py-3 text-right font-semibold text-green-600">
      {item.count.toFixed(1)}
    </TableCell>
  </TableRow>
));
DTPRow.displayName = "DTPRow";

// карточка (mobile)
const DTPCard = ({ item }: { item: DTP }) => (
  <div className="border rounded-lg p-4 shadow-sm bg-white flex flex-col gap-2 text-sm">
    <div className="flex justify-between items-center">
      <span className="font-medium text-gray-800">{item.year}</span>
      <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs">
        {item.month}
      </span>
    </div>
    <div className="text-gray-700">Точка: {item.point_FPSR}</div>
    <div className="text-gray-500 text-xs">Фактор: {item.statistical_factor}</div>
    <div className="text-gray-900 font-bold text-right">{item.count}</div>
  </div>
);

export default function DTPAnalitics() {
  const [showTable, setShowTable] = useState(true);
  const [allDTP, setAllDTP] = useState<DTP[]>([]);
  const [DTP2024, setDTP2024] = useState<DTP[]>([]);
  const [DTP2025, setDTP2025] = useState<DTP[]>([]);
  const [loading, setLoading] = useState(false);
  const [yearFilter, setYearFilter] = useState("");
  const { addNotification } = useNotificationManager();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [monthFilter, setMonthFilter] = useState("");
  const [displayedDTP, setDisplayedDTP] = useState<DTP[]>([]);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const pathname = usePathname(); // текущий маршрут

  useEffect(() => {
    fetchDTPByYear();
    const token = localStorage.getItem("token");
    setIsAuthorized(!!token);
  }, []);

  const fetchDTPByYear = async () => {
    try {
      setLoading(true);
      const [response2024, response2025] = await Promise.all([
        axi.get("/analytics/DTP/get?year=2024").catch(() => ({ data: [] })),
        axi.get("/analytics/DTP/get?year=2025").catch(() => ({ data: [] })),
      ]);
      setDTP2024(response2024?.data || []);
      setDTP2025(response2025?.data || []);
    } catch {
      addNotification({
        id: Date.now().toString(),
        title: "Ошибка",
        description: "Не удалось загрузить данные для диаграммы",
        status: 500,
        createdAt: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDTP = async (year: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (year) params.append("year", year);
      const response = await axi.get(`/analytics/DTP/get?${params}`);
      setAllDTP(response.data || []);
      setSortOrder("desc");
      setYearFilter(year);
    } catch (error: any) {
      addNotification({
        id: Date.now().toString(),
        title: "Ошибка",
        description: "Не удалось загрузить данные",
        status: error.response?.status || 500,
        createdAt: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  // загрузка файла отчёта
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    const file = data.get("file") as File;

    if (!file) {
      addNotification({
        id: Date.now().toString(),
        title: "Ошибка",
        description: "Файл не выбран",
        status: 400,
        createdAt: new Date().toISOString(),
      });
      return;
    }

    try {
      await axi.post("/analytics/DTP/create", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      addNotification({
        id: Date.now().toString(),
        title: "Успешно",
        description: "Файл загружен",
        status: 200,
        createdAt: new Date().toISOString(),
      });
      if (yearFilter) fetchDTP(yearFilter);
      else fetchDTPByYear();
    } catch (err: any) {
      addNotification({
        id: Date.now().toString(),
        title: "Ошибка данных",
        description: err.response?.data || "Не удалось загрузить файл",
        status: err.response?.status || 500,
        createdAt: new Date().toISOString(),
      });
    }
  };

  // сортировка и фильтрация
  useEffect(() => {
    let filtered = [...allDTP];

    if (monthFilter) {
      filtered = filtered.filter(
        (item) => item.month.toLowerCase() === monthFilter.toLowerCase()
      );
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.year, normalizeMonth(a.month) - 1).getTime();
      const dateB = new Date(b.year, normalizeMonth(b.month) - 1).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setDisplayedDTP(filtered);
  }, [allDTP, sortOrder, monthFilter]);

  return (
    <div className="pt-[4rem]">
      <div className="space-y-6 p-4 max-w-[1400px] mx-auto">
{pathname === "/statistics" ? (
  <h1 className="text-3xl font-bold text-center text-gray-900 mt-20">
    Аналитика ДТП
  </h1>
) : (
  <h1 className="text-3xl font-bold text-center text-gray-900">
    Аналитика ДТП
  </h1>
)}

        {/* Диаграммы */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="shadow-md rounded-2xl lg:col-span-2">
            <CardContent>
              <DTPLineDiagram DTP2024={DTP2024} DTP2025={DTP2025} />
            </CardContent>
          </Card>
          <Card className="shadow-md rounded-2xl">
            <CardContent className="flex justify-center">
              <DTPPieDiagram DTP2024={DTP2024} DTP2025={DTP2025} />
            </CardContent>
          </Card>
        </div>

        {/* Добавление новых данных - только для авторизованных */}
        {/* блок загрузки Excel, показывается только если есть токен */}
{typeof window !== "undefined" && localStorage.getItem("token") && (
  <Card className="w-full">
    <CardHeader> 
      <CardTitle className="text-lg flex items-center max-w-[260px] justify-between">
        <Upload className="w-5 h-5 text-blue-600" />
        Добавление новых данных
      </CardTitle>
      <CardDescription>
        Загрузите Excel (.xlsx) файл для добавления в реестр
      </CardDescription>
    </CardHeader>

    <CardContent>
      <form
        onSubmit={handleUpload}
        className="flex flex-col sm:flex-row items-center gap-3"
      >
        <input
          type="file"
          name="file"
          accept=".xlsx"
          className="w-full sm:w-auto border rounded px-3 py-2 text-sm"
        />
        <Button type="submit" className="h-10">
          Загрузить
        </Button>
      </form>
    </CardContent>
  </Card>
)}

            {/* просмотр данных */}
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-lg">Просмотр данных</CardTitle>
                  <CardDescription>
                    Загрузите данные о ДТП с возможностью фильтрации по году
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6 items-end">
                    <div className="w-full md:w-1/3">
                      <label className="block text-sm text-gray-700 mb-1">Год</label>
                      <Input
                        type="number"
                        value={yearFilter}
                        onChange={(e) => setYearFilter(e.target.value)}
                        placeholder="Например: 2024"
                        className="w-full h-10 border rounded px-3 text-sm"
                      />
                    </div>
                    <Button
                      onClick={() => fetchDTP(yearFilter)}
                      className="h-10 w-full sm:w-auto"
                    >
                      Загрузить данные
                    </Button>
                  </div>
                </CardContent>
              </Card>

          
        {/* загрузка отчётов */}


        {/* таблица / карточки */}
        <Card className="w-full">
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <CardTitle className="text-lg md:text-xl">
                  Данные о ДТП{" "}
                  {monthFilter && yearFilter
                    ? `за ${monthFilter} ${yearFilter}`
                    : yearFilter
                    ? `за ${yearFilter} год`
                    : ""}
                </CardTitle>
                <CardDescription>
                  Всего записей: {displayedDTP.length}
                </CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowTable((s) => !s)}
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

          <CardContent>
            {showTable && (
              <>
                {/* сортировка + фильтр по месяцу */}
                <div className="min-w-[267px] flex flex-wrap gap-4 items-center mb-6 p-4 bg-gray-50 rounded-lg">
                  {/* сортировка */}
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Сортировка:</span>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setSortOrder((s) => (s === "asc" ? "desc" : "asc"))
                      }
                      className="h-8"
                    >
                      {sortOrder === "asc"
                        ? "Сначала старые"
                        : "Сначала новые"}
                    </Button>
                  </div>

                  {/* фильтр по месяцу */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Месяц:</span>
                    <select
                      value={monthFilter}
                      onChange={(e) => setMonthFilter(e.target.value)}
                      className="h-8 border rounded px-2 text-sm"
                    >
                      <option value="">Все</option>
                      {monthNames.map((m, i) => (
                        <option key={i} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* данные или сообщение */}
                {displayedDTP.length > 0 ? (
                  <>
                    {/* таблица (desktop) */}
                    <div className="hidden md:block rounded-lg border border-gray-200 overflow-hidden">
                      <Table>
                        <TableHeader className="bg-gray-50">
                          <TableRow>
                            <TableHead>Год</TableHead>
                            <TableHead>Месяц</TableHead>
                            <TableHead>Точка ФПСР</TableHead>
                            <TableHead>Фактор</TableHead>
                            <TableHead className="text-right">
                              Значение
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {displayedDTP.map((item) => (
                            <DTPRow key={item.id} item={item} />
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* карточки (mobile) */}
                    <div className="grid gap-4 md:hidden">
                      {displayedDTP.map((item) => (
                        <DTPCard key={item.id} item={item} />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="w-full min-h-[200px] flex items-center justify-center text-gray-500">
                    Нет записей
                  </div>
                )}
              </>
            )}

            <div className="mt-4 text-sm text-gray-500 text-center">
              Показано {displayedDTP.length} записей из {allDTP.length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
