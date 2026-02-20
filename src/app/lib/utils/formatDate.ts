export function formatDate(date: string | Date, includeRelative = false) {
  const targetDate =
    typeof date === "string" ? new Date(date.includes("T") ? date : `${date}T00:00:00`) : date;
  const now = new Date();

  // Полная дата украинской локалью
  const fullDate = targetDate.toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (!includeRelative) return fullDate;

  const diffMs = now.getTime() - targetDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let relative = "";

  if (diffDays <= 0) {
    relative = "Сьогодні";
  } else if (diffDays === 1) {
    relative = "Вчора";
  } else if (diffDays < 30) {
    relative = `${diffDays} ${pluralizeDays(diffDays)} тому`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    relative = `${months} ${pluralizeMonths(months)} тому`;
  } else {
    const years = Math.floor(diffDays / 365);
    relative = `${years} ${pluralizeYears(years)} тому`;
  }

  return `${fullDate} (${relative})`;
}

function pluralizeDays(n: number) {
  if (n % 10 === 1 && n % 100 !== 11) return "день";
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return "дні";
  return "днів";
}

function pluralizeMonths(n: number) {
  if (n % 10 === 1 && n % 100 !== 11) return "місяць";
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return "місяці";
  return "місяців";
}

function pluralizeYears(n: number) {
  if (n % 10 === 1 && n % 100 !== 11) return "рік";
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return "роки";
  return "років";
}
