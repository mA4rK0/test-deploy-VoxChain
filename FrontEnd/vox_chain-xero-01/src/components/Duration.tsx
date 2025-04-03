import { ITimes } from "@/lib/types";
import React, { ChangeEventHandler, useEffect, useState } from "react";

type DurationProps = {
  times: ITimes;
  handleChangeDuration: ChangeEventHandler<HTMLInputElement>;
  isDone?: boolean;
};
const Duration = (props: DurationProps) => {
  const { isDone, handleChangeDuration, times } = props;

  return (
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
            value={times.hours != undefined ? times.hours : undefined}
            onChange={handleChangeDuration}
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
            onChange={handleChangeDuration}
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
            onChange={handleChangeDuration}
            className="outline-0 w-full countdown text-center"
          />
          s
        </label>
      </div>
      <span className="absolute -bottom-3  text-white text-[0.6rem] whitespace-nowrap text-nowrap">
        {"*) max duration is 48h 59m 59s "}
      </span>
    </div>
  );
};

export default Duration;
