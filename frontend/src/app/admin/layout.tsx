import LeftSidePanel from "@/components/admin/leftSidePanel";
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen">
      {/* Левая панель */}
      <LeftSidePanel />

      {/* Контент */}
      <main className="flex-1">{children}</main>
    </div>
  );
}