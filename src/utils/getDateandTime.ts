export const getDateandTime = (etTimestamp: string) => {
  const date = new Date(etTimestamp);

  const istOptions: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  return date.toLocaleString("en-IN", istOptions);
};
