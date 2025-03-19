"use client";

import { useEffect, useState } from "react";

export default function useHydration() {
  const [hydration, setHydration] = useState<Boolean>(false);
  useEffect(() => {
    if (window != undefined) {
      setHydration(true);
    }
  }, []);
  return { hydration };
}
