import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "carpet-recently-viewed";
const MAX_IDS = 5;

function load(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function save(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

type RecentlyViewedContextValue = {
  variantIds: string[];
  addViewed: (variantId: string) => void;
};

const RecentlyViewedContext = createContext<RecentlyViewedContextValue | null>(null);

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [variantIds, setVariantIds] = useState<string[]>(load);

  const addViewed = useCallback((variantId: string) => {
    setVariantIds((prev) => {
      const next = [variantId, ...prev.filter((id) => id !== variantId)].slice(0, MAX_IDS);
      save(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ variantIds, addViewed }),
    [variantIds, addViewed]
  );

  return (
    <RecentlyViewedContext.Provider value={value}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const ctx = useContext(RecentlyViewedContext);
  if (!ctx) throw new Error("useRecentlyViewed must be used within RecentlyViewedProvider");
  return ctx;
}
