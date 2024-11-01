import { DayObj, Intake, MoodLog } from "@/types/global";
import { differenceInMinutes, format, parse } from "date-fns";
import { Platform } from "react-native";

export const transformDate = (date: Date) => {
  return {
    dayOfWeek: date.toLocaleDateString("en-US", { weekday: "short" }),
    dayOfMonth: date.getDate(),
    date: date.toISOString(),
  };
};

export const getDaysOfWeek = () => {
  const currentDate = new Date();
  const currentDay = currentDate.getDay();
  const sunday = new Date(currentDate);
  sunday.setDate(currentDate.getDate() - currentDay);

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + i);
    date.setHours(0, 0, 0, 0);
    return transformDate(date);
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

    date.setHours(0, 0, 0, 0);

    // Format date as YYYY-MM-DD

    result.push(transformDate(date));
  }

  return result.reverse(); // Reverse to show the oldest date first
}

export function checkLogsForDays(logs: MoodLog[], days: DayObj[]) {
  // Initialize the result array
  const result = [];

  for (const day of days) {
    // Find if any log matches the current day
    const logForDay =
      logs &&
      logs.length &&
      logs.find((log) => {
        // Extract date from the createdAt field (formatted as YYYY-MM-DD)
        const logDate = new Date(log.date).toISOString().split("T")[0];
        return logDate === day.date.split("T")[0];
      });

    // Push result with information about whether a log exists and the mood
    result.push({
      ...day,
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

export const convertColor = (hexCode: string, type: string) => {
  return `${type}-[${hexCode}]`;
};

const getDayOfWeek = (dateString?: string) => {
  const date = dateString ? new Date(dateString) : new Date();
  return format(date, "EEEE"); // Returns the full day name (e.g., "Monday")
};

export const formatDrugTimes = (
  times: string[],
  startDate: string,
  frequency: "weekly" | "everyday" | "monthly" | "once",
  interval: number
) => {
  console.log(interval);
  const dayOfWeek = getDayOfWeek(startDate); // Get the day of the week for the startDate

  // Format the times
  const formattedTimes = times
    .map((time) => {
      const splitTime = time.split(":").map((t) => Number.parseInt(t));
      const date = new Date().setHours(splitTime[0], splitTime[1]);
      return format(date, "hh:mm aa"); // Format time as 'hh:mm AM/PM'
    })
    .join(", ");

  // Handle the frequency with intervals
  switch (frequency) {
    case "everyday":
      return `Every day at ${formattedTimes}`;
    case "weekly":
      return interval === 1 || !interval
        ? `Every ${dayOfWeek} at ${formattedTimes}`
        : `Every ${interval} weeks on ${dayOfWeek} at ${formattedTimes}`;
    case "monthly":
      const dayOfMonth = new Date(startDate || Date.now()).getDate();
      return interval === 1 || !interval
        ? `Every month on the ${dayOfMonth} at ${formattedTimes}`
        : `Every ${interval} months on the ${dayOfMonth} at ${formattedTimes}`;
    case "once":
      return `Once on ${format(
        new Date(startDate),
        "MMMM do, yyyy"
      )} at ${formattedTimes}`;
    default:
      return formattedTimes; // If no frequency, just return the times
  }
};

export const getDrugStatus = (
  drugStatus: string | null,
  time: string
): string => {
  // Parse the time string (e.g., "14:30" -> "2:30 PM") and compare it with the current time
  const currentTime = new Date();

  const splitTime = time.split(":").map((i) => Number.parseInt(i));
  const drugTime = new Date().setHours(splitTime[0], splitTime[1]); // Assumes the time format is 24-hour (e.g., "14:30")

  // Calculate the time difference in minutes between the current time and the drug time
  const timeDifference = differenceInMinutes(currentTime, drugTime);

  // If the drug has already been marked as taken or skipped, return the current status
  if (
    drugStatus === "taken" ||
    drugStatus === "skipped" ||
    drugStatus === "missed"
  ) {
    return drugStatus;
  }

  // If the time difference is more than 60 minutes and not taken, it's missed
  if (timeDifference > 60) {
    return "missed";
  }

  // Otherwise, it's still pending
  return "pending";
};

const thresholds: { [key: number]: [string, string] } = {
  1.5: ["Need a break?", "Mostly Terrible"],
  2.5: ["Find support", "Mostly Bad"],
  3.5: ["Maintain balance", "Mostly Okay"],
  4.5: ["Keep building", "Mostly Good"],
  5.0: ["Share the joy", "Mostly Awesome"],
};

export function getAverageMood(moodScore: number): [string, string] {
  // Get the threshold keys and find the appropriate threshold
  const threshold = Object.keys(thresholds)
    .map(Number)
    .sort((a, b) => a - b) // Ensure the keys are sorted in ascending order
    .find((key) => moodScore <= key);

  // If no threshold is found, handle it appropriately
  if (threshold === undefined) {
    return ["No data", "Mood score too high"];
  }

  return thresholds[threshold];
}
export const getMonth = (date: Date = new Date()): number => {
  return date.getMonth() + 1; // getMonth() returns 0-indexed month, so add 1
};

export function checkIntakeForDays(
  intakes: Pick<Intake, "createdAt" | "status">[],
  days: DayObj[]
) {
  // Initialize the result array
  const result = [];

  for (const day of days) {
    // Get all intakes for the current day
    const intakesForDay = intakes.filter((intake) => {
      // Extract date from the createdAt field (formatted as YYYY-MM-DD)
      const intakeDate = new Date(intake.createdAt).toISOString().split("T")[0];
      return intakeDate === day.date.split("T")[0];
    });

    // If there are no intakes for the day, push default values
    if (intakesForDay.length === 0) {
      result.push({
        ...day,
        hasIntake: false,
        status: null,
      });
      continue;
    }

    // Count statuses
    const statusCount = {
      taken: 0,
      missed: 0,
      skipped: 0,
      pending: 0, // Add pending status count
    };

    for (const intake of intakesForDay) {
      if (intake.status === "taken") {
        statusCount.taken++;
      } else if (intake.status === "missed") {
        statusCount.missed++;
      } else if (intake.status === "skipped") {
        statusCount.skipped++;
      } else if (intake.status === "pending") {
        statusCount.pending++;
      }
    }

    // Determine majority status
    let majorityStatus = "taken"; // Default status
    if (
      statusCount.missed > statusCount.taken &&
      statusCount.missed > statusCount.skipped &&
      statusCount.missed > statusCount.pending
    ) {
      majorityStatus = "missed";
    } else if (
      statusCount.skipped > statusCount.taken &&
      statusCount.skipped > statusCount.missed &&
      statusCount.skipped > statusCount.pending
    ) {
      majorityStatus = "skipped";
    } else if (
      statusCount.pending > statusCount.taken &&
      statusCount.pending > statusCount.missed &&
      statusCount.pending > statusCount.skipped
    ) {
      majorityStatus = "pending";
    }

    // Push result with majority status
    result.push({
      ...day,
      hasIntake: true,
      status: majorityStatus,
    });
  }

  return result;
}

export function getIntakeStatus(
  completedIntakes: number,
  totalIntakes: number
): [string, string] {
  if (totalIntakes === 0) {
    return ["no intake planned", "text-gray-500"];
  }

  const completionRate = (completedIntakes / totalIntakes) * 100;

  const statusMap: { [key: number]: [string, string] } = {
    100: ["completed", "text-green-500"],
    50: ["partial", "text-yellow-500"],
    0: ["missed", "text-red-400"],
  };

  return completionRate === 100
    ? statusMap[100]
    : completionRate >= 50
    ? statusMap[50]
    : statusMap[0];
}

export const toSentenceCase = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getResourceImage = (slug: string) => {
  return slug.startsWith("http")
    ? slug
    : process.env.EXPO_PUBLIC_ENV !== "production"
    ? `${
        Platform.OS !== "android"
          ? process.env.EXPO_PUBLIC_BASE
          : process.env.EXPO_PUBLIC_ANDROID_BASE
      }${slug}`
    : `${process.env.EXPO_PUBLIC_API_BASE}${slug}`;
};
