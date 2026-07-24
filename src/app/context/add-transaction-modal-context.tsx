import { createContext, ReactNode, useContext, useState } from "react";

interface AddTransactionModalContextType {
  visible: boolean;
  open: () => void;
  close: () => void;
}

const AddTransactionModalContext =
  createContext<AddTransactionModalContextType | null>(null);

export function AddTransactionModalProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <AddTransactionModalContext.Provider
      value={{
        visible,
        open: () => setVisible(true),
        close: () => setVisible(false),
      }}
    >
      {children}
    </AddTransactionModalContext.Provider>
  );
}

export function useAddTransactionModal() {
  const ctx = useContext(AddTransactionModalContext);
  if (!ctx)
    throw new Error(
      "useAddTransactionModal, AddTransactionModalProvider içinde kullanılmalı",
    );
  return ctx;
}
