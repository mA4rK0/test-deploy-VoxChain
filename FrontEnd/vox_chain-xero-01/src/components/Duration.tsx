import React, { ChangeEventHandler, useEffect, useState } from "react";

interface ITimes {
  hours: number | undefined;
  minutes: number | undefined;
  seconds: number | undefined;
}
const Duration = () => {
  const [countdownTarget, setCountdownTarget] = useState<number | null>(null);

  const [times, setTimes] = useState<ITimes>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const handleStart = () => {
    const totalSeconds =
      (times.hours ?? 0) * 3600 +
      (times.minutes ?? 0) * 60 +
      (times.seconds ?? 0);
    const targetTime = Date.now() + totalSeconds * 1000;
    setCountdownTarget(targetTime);
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const target = e.target as HTMLInputElement;
    const id = target.id as keyof ITimes;
    const value = target.value;
    // Hapus nol di depan
    const cleanedValue = value.replace(/^0+/, "") || "0"; // fallback ke '0' biar nggak jadi empty string

    const duration = parseInt(cleanedValue);

    if (isNaN(duration)) {
      setTimes({ ...times, [id]: 0 });
      return;
    }

    const maxValues = { hours: 48, minutes: 59, seconds: 59 };
    // ❌ Tolak jika semua karakter 0 dan panjangnya > 2
    if (/^0+$/.test(value) && value.length > 2) {
      return;
    }
    // ❌ Tolak jika melebihi batas atau kurang dari 0
    if (duration < 0 || duration > maxValues[id]) {
      return;
    }

    setTimes({ ...times, [id]: duration });
  };

  useEffect(() => {
    console.log(times);
  }, [times]);

  return (
    <div className="mt-2 ">
      <div className="grid grid-cols-[1fr_1px_1fr] gap-3  border-t-4 border-white  ">
        <div className="flex-1">
          <h2 className="text-center font-bold">Max Votes</h2>
          <input
            type="number"
            placeholder="0"
            className="w-full text-center outline-0 "
          />
        </div>
        <div className="h-full bg-white w-1 "></div>
        <div className="flex-1 relative">
          <h2 className="text-center font-bold">Duration</h2>
          <div className="flex gap-1   w-[7.5rem] font-light  absolute">
            <label htmlFor="hours" className="flex gap-1 ">
              <input
                min={0}
                max={48}
                type="number"
                id="hours"
                placeholder="00"
                value={times.hours !== undefined ? times.hours : undefined}
                onChange={handleChange}
                className="outline-0 w-full countdown  text-center"
              />
              h
            </label>
            <label htmlFor="minutes" className="flex gap-1">
              <input
                min={0}
                max={59}
                type="number"
                id="minutes"
                placeholder="00"
                value={times.minutes !== undefined ? times.minutes : ""}
                onChange={handleChange}
                className="outline-0 w-full countdown text-center"
              />
              m
            </label>
            <label htmlFor="seconds" className="flex gap-1">
              <input
                min={0}
                max={59}
                type="number"
                id="seconds"
                placeholder="00"
                value={times.seconds !== undefined ? times.seconds : ""}
                onChange={handleChange}
                className="outline-0 w-full countdown text-center"
              />
              s
            </label>
          </div>
          <span className="absolute -bottom-3  text-white text-[0.6rem] whitespace-nowrap text-nowrap">
            {"*) max duration is 48h 59m 59s "}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Duration;
