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
