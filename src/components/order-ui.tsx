"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type OrderUi = {
  checkoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;
};

const OrderUiContext = createContext<OrderUi | null>(null);

export function OrderUiProvider({ children }: { children: ReactNode }) {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  return (
    <OrderUiContext
      value={{
        checkoutOpen,
        openCheckout: () => setCheckoutOpen(true),
        closeCheckout: () => setCheckoutOpen(false),
      }}
    >
      {children}
    </OrderUiContext>
  );
}

export function useOrderUi(): OrderUi {
  const ui = useContext(OrderUiContext);
  if (!ui) throw new Error("useOrderUi must be used inside OrderUiProvider");
  return ui;
}
