export const formatDateV2 = (dateStr: string | undefined): string => {
  if (!dateStr) return "";

  const months: string[] = [
    "Января",
    "Февраля",
    "Марта",
    "Апреля",
    "Мая",
    "Июня",
    "Июля",
    "Августа",
    "Сентября",
    "Октября",
    "Ноября",
    "Декабря",
  ];

  const [year, month, day] = dateStr.split("-");

  if (!year || !month || !day) return "";

  return `${months[Number(month) - 1]} ${Number(day)}, ${year}`;
};
