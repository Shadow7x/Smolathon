export default function formatTimeInterval(interval: [number, number]) {
  const [start, end] = interval;

  const timeStart =
    start === 24 ? "23:59" : start < 10 ? `0${start}:00` : `${start}:00`;
  const timeEnd = end === 24 ? "23:59" : end < 10 ? `0${end}:00` : `${end}:00`;

  return { timeStart, timeEnd };
}
