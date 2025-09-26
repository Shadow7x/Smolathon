"use client";

import { useEffect, useState, memo } from "react";
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
import { Eye, EyeOff, ArrowUpDown, Search, Map, Upload } from "lucide-react";
import axi from "@/utils/api";
import { useNotificationManager } from "@/hooks/notification-context";

// --- интерфейс маршрута ---
interface EvacuationRoute {
  id: number;
  year: number;
  month: string;
  routes: { id: number; street: string }[];
  report?: { id: number; name: string };
}

// --- строка таблицы (desktop) ---
const RouteRow = memo(({ r }: { r: EvacuationRoute }) => (
  <TableRow className="hover:bg-gray-50/50 transition-colors">
    <TableCell className="text-sm py-3">{r.year}</TableCell>
    <TableCell className="text-sm py-3">{r.month}</TableCell>
    <TableCell className="text-sm py-3">
      {r.routes.map((rt) => rt.street).join(" → ")}
    </TableCell>
    <TableCell className="text-sm py-3">{r.report?.name || "—"}</TableCell>
  </TableRow>
));
RouteRow.displayName = "RouteRow";

// --- карточка записи (mobile) ---
const RouteCard = ({ r }: { r: EvacuationRoute }) => (
  <div className="border rounded-lg p-4 shadow-sm bg-white flex flex-col gap-2 text-sm">
    <div className="flex justify-between items-center">
      <span className="font-medium text-gray-800">{r.year}</span>
      <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs">
        {r.month}
      </span>
    </div>
    <div className="text-gray-700">
      <Map className="inline-block h-4 w-4 mr-1 text-gray-500" />
      {r.routes.map((rt) => rt.street).join(" → ")}
    </div>
    <div className="text-gray-500 text-xs">Отчёт: {r.report?.name || "—"}</div>
  </div>
);

export default function EvacuationRoutePage() {
  const [routes, setRoutes] = useState<EvacuationRoute[]>([]);
  const [displayed, setDisplayed] = useState<EvacuationRoute[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showTable, setShowTable] = useState(true);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [search, setSearch] = useState("");
  const { addNotification } = useNotificationManager();

  // загрузка данных
  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const res = await axi.get("/analytics/evacuationRoute/get");
      setRoutes(res.data || []);
    } catch (err: any) {
      addNotification({
        id: Date.now().toString(),
        title: "Ошибка",
        description: "Не удалось загрузить маршруты",
        status: err.response?.status || 500,
        createdAt: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  // загрузка Excel
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    const file = data.get("file") as File;
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await axi.post("/analytics/evacuationRoute/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      addNotification({
        id: Date.now().toString(),
        title: "Успешно",
        description: "Файл загружен",
        status: res.status || 200,
        createdAt: new Date().toISOString(),
      });

      fetchRoutes();
    } catch (err: any) {
      addNotification({
        id: Date.now().toString(),
        title: "Ошибка данных",
        description: err.response?.data || "Не удалось загрузить файл",
        status: err.response?.status || 500,
        createdAt: new Date().toISOString(),
      });
    } finally {
      setUploading(false);
    }
  };

  // сортировка + поиск
  useEffect(() => {
    let tmp = [...routes];
    if (search.trim()) {
      const q = search.toLowerCase();
      tmp = tmp.filter(
        (r) =>
          r.routes.some((rt) => rt.street.toLowerCase().includes(q)) ||
          (r.report?.name || "").toLowerCase().includes(q) ||
          String(r.year).includes(q) ||
          r.month.toLowerCase().includes(q)
      );
    }
    tmp.sort((a, b) => {
      const aKey = `${a.year}-${a.month}`;
      const bKey = `${b.year}-${b.month}`;
      return sortOrder === "asc"
        ? aKey.localeCompare(bKey)
        : bKey.localeCompare(aKey);
    });
    setDisplayed(tmp);
  }, [routes, sortOrder, search]);

  useEffect(() => {
    fetchRoutes();
  }, []);

  return (
    <div className="pt-[6rem] px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-6">
          Маршруты эвакуации
        </h1>

        {/* форма загрузки */}
        <Card className="w-full mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg md:text-xl flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-600" />
            Загрузка данных</CardTitle>
            <CardDescription>
              Добавьте файл маршрутов эвакуации в формате .xlsx
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleUpload}
              className="flex flex-col sm:flex-row gap-4 items-end"
            >
              <Input type="file" name="file" accept=".xlsx" className="h-10" />
              <Button
                type="submit"
                disabled={uploading}
                className="h-10 w-full sm:w-auto flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                {uploading ? "Отправка..." : "Загрузить"}
              </Button>
            </form>
          </CardContent>
        </Card>
{/* таблица / карточки */}
<Card className="w-full">
  <CardHeader className="pb-4">
    <div className="flex flex-col md:flex-row justify-between gap-4">
      <div>
        <CardTitle className="text-lg md:text-xl">Данные о маршрутах</CardTitle>
        <CardDescription>Всего записей: {displayed.length}</CardDescription>
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

  <CardContent>
    {showTable && (
      <>
        {/* фильтры */}
        <div className="flex flex-wrap gap-4 items-center mb-6 p-4 bg-gray-50 rounded-lg">
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
              {sortOrder === "asc" ? "Сначала старые" : "Сначала новые"}
            </Button>
          </div>

          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <Search className="h-4 w-4 text-gray-600" />
            <Input
              placeholder="Поиск по году, месяцу, улице или отчёту..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8"
            />
          </div>
        </div>

        {displayed.length > 0 ? (
          <>
            {/* таблица (desktop) */}
            <div className="hidden md:block rounded-lg border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead>Год</TableHead>
                    <TableHead>Месяц</TableHead>
                    <TableHead>Маршрут</TableHead>
                    <TableHead>Отчёт</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayed.map((r) => (
                    <RouteRow key={r.id} r={r} />
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* карточки (mobile) */}
            <div className="grid gap-4 md:hidden">
              {displayed.map((r) => (
                <RouteCard key={r.id} r={r} />
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
      Показано {displayed.length} маршрутов из {routes.length}
    </div>
  </CardContent>
</Card>

      </div>
    </div>
  );
}
