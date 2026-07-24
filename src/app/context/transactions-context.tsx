import { createContext, ReactNode, useContext, useState } from "react";

interface TransactionsContextType {
  refreshKey: number;
  bump: () => void;
}

const TransactionsContext = createContext<TransactionsContextType | null>(null);

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const bump = () => setRefreshKey((k) => k + 1);

  return (
    <TransactionsContext.Provider value={{ refreshKey, bump }}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactionsRefresh() {
  const ctx = useContext(TransactionsContext);
  if (!ctx)
    throw new Error(
      "useTransactionsRefresh, TransactionsProvider içinde kullanılmalı",
    );
  return ctx;
}
