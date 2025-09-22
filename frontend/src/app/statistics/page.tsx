import MapComponent from "@/components/map/MapComponent";

export default function StatisticsPage() {
  return (
    <main className="flex flex-col gap-6 p-6">
      {/* Заголовок */}
      <header>
        <h1 className="text-2xl font-bold text-[#62a744]">
          Статистика дорожного движения
        </h1>
        <p className="text-gray-600">
          На карте показаны ДТП, камеры и светофоры города Смоленска.
        </p>
      </header>

      {/* Карта */}
      <section className="rounded-2xl shadow p-2 border border-gray-200">
        <h2 className="text-lg font-semibold mb-2">Карта Смоленска</h2>
        <MapComponent />
      </section>
    </main>
  );
}
