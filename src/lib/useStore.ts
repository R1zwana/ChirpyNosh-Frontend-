import { useEffect, useState } from "react";
import { getStore, subscribeStore } from "./store";
import type { Store } from "./types";

export function useStore(): Store {
  const [s, setS] = useState<Store>(getStore());

  useEffect(() => {
    const unsub = subscribeStore(() => setS(getStore()));
    return () => unsub();
  }, []);

  return s;
}
