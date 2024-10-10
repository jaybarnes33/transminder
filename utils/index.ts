import { MoodLog } from "@/types/global";

export const getDaysOfWeek = () => {
  const currentDate = new Date();
  const currentDay = currentDate.getDay();
  const sunday = new Date(currentDate);
  sunday.setDate(currentDate.getDate() - currentDay);

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + i);
    return {
      dayOfWeek: date.toLocaleDateString("en-US", { weekday: "short" }),
      dayOfMonth: date.getDate(),
    };
  });
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const containsSymbol = (password: string) => {
  return /[^a-zA-Z0-9]/.test(password);
};

export const containsNumber = (password: string) => {
  return /[0-9]/.test(password);
};

export const splitCamelCase = (str: string) => {
  return str.replace(/([a-z])([A-Z])/g, "$1 $2");
};

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getDateRangeForLastNDays = (n: number): string => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - n + 1);

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };

  const startDateString = startDate.toLocaleDateString("en-US", options);
  const endDateString = endDate.toLocaleDateString("en-US", options);

  return `${startDateString} - ${endDateString}`;
};

export const sortTimes = (arr: { taken: boolean; time: string }[]) => {
  const sortedArr = arr.sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
  );

  return sortedArr;
};

export function getLastNDaysWithDayInitials(n: number) {
  const result = [];

  for (let i = 0; i < n; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i); // Subtract i days from current date

    // Get the first letter of the day of the week
    const dayOfWeek = date
      .toLocaleDateString("en-US", { weekday: "short" })
      .charAt(0);

    // Format date as YYYY-MM-DD
    const formattedDate = date.toISOString().split("T")[0];

    result.push({
      date: formattedDate,
      dayOfWeek,
    });
  }

  return result.reverse(); // Reverse to show the oldest date first
}

export function checkLogsForDays(
  logs: MoodLog[],
  days: { date: string; dayOfWeek: string }[]
) {
  // Initialize the result array
  const result = [];

  for (const day of days) {
    // Find if any log matches the current day
    const logForDay = logs.find((log) => {
      // Extract date from the createdAt field (formatted as YYYY-MM-DD)
      const logDate = new Date(log.createdAt).toISOString().split("T")[0];
      return logDate === day.date;
    });

    // Push result with information about whether a log exists and the mood
    result.push({
      dayOfWeek: day.dayOfWeek,
      hasLog: !!logForDay, // true if log exists, false otherwise
      mood: logForDay ? logForDay.mood : null, // Include mood if log exists, otherwise null
    });
  }

  return result;
}

export const filterTimes = (times: string[]): string[] => {
  const currentTime = new Date(); // Get current time

  return times.filter((timeString) => {
    // Parse the time string into a Date object for today
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    const timeDate = new Date();
    timeDate.setHours(hours, minutes, seconds, 0);

    // Get the time difference in milliseconds
    const timeDifference = currentTime.getTime() - timeDate.getTime();

    // Check if the time is in the future or passed less than an hour ago
    return (
      timeDate > currentTime ||
      (timeDifference >= 0 && timeDifference <= 3600000)
    );
  });
};
