import { Dispatch } from "react";
interface ITimes {
  hours: number | undefined;
  minutes: number | undefined;
  seconds: number | undefined;
}

interface DataCreatePolling {
  namePolling: string;
  candidate1: string;
  candidate2: string;
  candidate3?: string;
  description: string;
  maxVotes: number;
  duration: number;
  isCompleted?: boolean;
}

export type { ITimes, DataCreatePolling };
