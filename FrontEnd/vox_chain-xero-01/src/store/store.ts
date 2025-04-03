import { DataCreatePolling } from "@/lib/types";
import { create } from "zustand";

const usePollingStore = create((set) => ({
  polling: [] as DataCreatePolling[],
  newPolling: (dataPolling: DataCreatePolling) =>
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
