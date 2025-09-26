export const formatDate = (dateStr: string | undefined): string => {
  if (!dateStr) return "";

  const months: string[] = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ];

  const [year, month, day] = dateStr.split("-");

  if (!year || !month || !day) return "";

  return `${Number(day)} ${months[Number(month) - 1]} ${year}`;
};
