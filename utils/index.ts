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
