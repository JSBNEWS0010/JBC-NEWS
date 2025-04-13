import { useState, useEffect } from "react";

type TimeZoneData = {
  name: string;
  offset: number;
  label: string;
};

const timeZones: TimeZoneData[] = [
  { name: "World", offset: 0, label: "UTC" }, // UTC
  { name: "India", offset: 5.5, label: "IST" }, // UTC+5:30
  { name: "Pakistan", offset: 5, label: "PKT" }, // UTC+5:00
];

function getCurrentTimeInZone(offset: number): string {
  const date = new Date();
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  const newDate = new Date(utc + 3600000 * offset);
  return newDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function getCurrentDate(): string {
  const date = new Date();
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function TimeDisplay() {
  const [times, setTimes] = useState<Record<string, string>>({});
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    const updateTimes = () => {
      const newTimes: Record<string, string> = {};
      timeZones.forEach((zone) => {
        newTimes[zone.name] = getCurrentTimeInZone(zone.offset);
      });
      setTimes(newTimes);
      setCurrentDate(getCurrentDate());
    };

    // Initial update
    updateTimes();

    // Update every second
    const intervalId = setInterval(updateTimes, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="bg-neutral-200 dark:bg-neutral-800 py-1 px-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
        <div className="flex space-x-6">
          {timeZones.map((zone) => (
            <div key={zone.name} className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>{zone.name}:</span>
              <span className="clock ml-1 font-medium tabular-nums">
                {times[zone.name] || "00:00:00"} {zone.label}
              </span>
            </div>
          ))}
        </div>
        <div>
          <span className="font-medium">{currentDate}</span>
        </div>
      </div>
    </div>
  );
}
