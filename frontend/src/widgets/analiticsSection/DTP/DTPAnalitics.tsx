"use client";
import { useState, useEffect, useMemo, memo } from "react";
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
import DTPLineDiagram from "@/components/Diagrams/DTP/Line";
import DTPPieDiagram from "@/components/Diagrams/DTP/Pie";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, Calendar, Filter, ArrowUpDown } from "lucide-react";

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

// --- Компонент строки таблицы ---
const DTPRow = memo(({ item }: { item: DTP }) => (
  <TableRow className="hover:bg-gray-50/50 transition-colors">
    <TableCell className="font-medium text-sm py-3">{item.year}</TableCell>
    <TableCell className="text-sm py-3 text-right font-mono">
      {monthNames[normalizeMonth(item.month) - 1] || item.month}
    </TableCell>
    <TableCell className="text-sm py-3 text-right">{item.point_FPSR}</TableCell>
    <TableCell className="text-sm py-3">{item.statistical_factor}</TableCell>
    <TableCell className="text-sm py-3 text-right font-mono font-semibold text-green-600">
      {item.count.toFixed(1)}
    </TableCell>
  </TableRow>
));
DTPRow.displayName = "DTPRow";

// --- Основной компонент ---
export default function DTPAnalitics() {
  const [showTable, setShowTable] = useState(true);
  const [allDTP, setAllDTP] = useState<DTP[]>([]);
  const [DTP2024, setDTP2024] = useState<DTP[]>([]);
  const [DTP2025, setDTP2025] = useState<DTP[]>([]);
  const [loading, setLoading] = useState(false);
  const [yearFilter, setYearFilter] = useState("");
  const { addNotification } = useNotificationManager();
  const [monthFilter, setMonthFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [displayedDTP, setDisplayedDTP] = useState<DTP[]>([]);
  const [inputYear, setInputYear] = useState("");

  // --- загрузка данных для графиков ---
  useEffect(() => {
    fetchDTPByYear();
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
    } catch (error) {
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

  // --- загрузка таблицы по году ---
  const fetchDTP = async (year: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (year) params.append("year", year);
      const response = await axi.get(`/analytics/DTP/get?${params}`);
      setAllDTP(response.data);
      setMonthFilter("all");
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

  // --- фильтры и сортировка ---
  useEffect(() => {
    let filtered = [...allDTP];
    if (monthFilter !== "all") {
      filtered = filtered.filter(
        (p) => normalizeMonth(p.month) === Number(monthFilter)
      );
    }
    filtered.sort((a, b) => {
      const dateA = new Date(a.year, normalizeMonth(a.month) - 1).getTime();
      const dateB = new Date(b.year, normalizeMonth(b.month) - 1).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    setDisplayedDTP(filtered);
  }, [allDTP, monthFilter, sortOrder]);

  return (
    <div className="pt-[8rem]  ">
      <div className="space-y-6 p-4 max-w-[1400px] mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900">
          Аналитика ДТП
        </h1>

        {/* Диаграммы */}
        <div className="flex max-w-[1400px] justify-between">
          <DTPLineDiagram DTP2024={DTP2024} DTP2025={DTP2025} />
          <DTPPieDiagram DTP2024={DTP2024} DTP2025={DTP2025} />
        </div>

        {/* загрузка данных */}
        <Card className="w-full">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Просмотр данных</CardTitle>
            <CardDescription>
              Загрузите данные о ДТП с возможностью фильтрации по году
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="grid w-full max-w-sm items-center gap-1.5">
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
                onClick={() => fetchDTP(inputYear)}
                disabled={loading || !inputYear.trim()}
                className="h-10"
              >
                {loading ? "Загрузка..." : "Загрузить данные"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* таблица */}
        {displayedDTP.length > 0 && (
          <Card className="w-full">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl">
                    Данные о ДТП {yearFilter && `за ${yearFilter} год`}
                  </CardTitle>
                  <CardDescription>
                    Всего записей: {displayedDTP.length}
                  </CardDescription>
                </div>
                <div>
                  <Button
                    variant="outline"
                    onClick={() => setShowTable(!showTable)}
                    className="flex items-center gap-2 h-9"
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

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Месяц:</span>
                    <Select value={monthFilter} onValueChange={setMonthFilter}>
                      <SelectTrigger className="w-[140px] h-8">
                        <SelectValue placeholder="Все месяцы" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все месяцы</SelectItem>
                        {monthNames.map((m, idx) => (
                          <SelectItem
                            key={idx + 1}
                            value={(idx + 1).toString()}
                          >
                            {m[0].toUpperCase() + m.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* таблица */}
                <div className="rounded-lg border border-gray-200 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead>Год</TableHead>
                        <TableHead>Месяц</TableHead>
                        <TableHead>Точка ФПСР</TableHead>
                        <TableHead>Фактор</TableHead>
                        <TableHead className="text-right">Значение</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedDTP.map((item) => (
                        <DTPRow key={item.id} item={item} />
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-4 text-sm text-gray-500 text-center">
                  Показано {displayedDTP.length} записей из {allDTP.length}
                </div>
              </CardContent>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
