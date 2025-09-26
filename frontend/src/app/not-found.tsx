import Link from "next/link";

export const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Страница не найдена</p>
      <Link href="/" className="text-[#62a744] hover:underline">
        Вернуться на главную
      </Link>
    </div>
  );
};

export default NotFound;
