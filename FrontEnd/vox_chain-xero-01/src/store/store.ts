import { DataCreatePolling } from "@/lib/types";
import { create } from "zustand";

// Define the shape of the store state and actions
interface PollingStore {
  polling: DataCreatePolling[];
  newPolling: (dataPolling: DataCreatePolling) => void;
  removeAllBears: () => void;
  updateBears: (newBears: number) => void;
  bears?: number; // optional if you want to track bears
}

const usePollingStore = create<PollingStore>((set) => ({
  polling: [],
  bears: 0,
  newPolling: (dataPolling) =>
    set((state) => ({
      polling: [
        ...state.polling,
        {
          namePolling: dataPolling.namePolling,
          candidate1: dataPolling.candidate1,
          candidate2: dataPolling.candidate2,
          candidate3: dataPolling.candidate3,
          description: dataPolling.description,
          maxVotes: dataPolling.maxVotes,
          duration: dataPolling.duration,
          isCompleted: dataPolling.isCompleted,
        },
      ],
    })),
  removeAllBears: () => set({ bears: 0 }),
  updateBears: (newBears) => set({ bears: newBears }),
}));

export default usePollingStore;
