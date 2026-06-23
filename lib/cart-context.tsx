"use client";

import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { CartLine } from "./types";

interface CartState {
  lines: CartLine[];
}

type Action =
  | { type: "add"; line: Omit<CartLine, "qty">; qty: number }
  | { type: "inc"; lineId: string }
  | { type: "dec"; lineId: string }
  | { type: "remove"; lineId: string }
  | { type: "clear" };

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "add": {
      const existing = state.lines.find((l) => l.lineId === action.line.lineId);
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            l.lineId === action.line.lineId
              ? { ...l, qty: l.qty + action.qty }
              : l
          ),
        };
      }
      return { lines: [...state.lines, { ...action.line, qty: action.qty }] };
    }
    case "inc":
      return {
        lines: state.lines.map((l) =>
          l.lineId === action.lineId ? { ...l, qty: l.qty + 1 } : l
        ),
      };
    case "dec":
      return {
        lines: state.lines
          .map((l) =>
            l.lineId === action.lineId ? { ...l, qty: l.qty - 1 } : l
          )
          .filter((l) => l.qty > 0),
      };
    case "remove":
      return { lines: state.lines.filter((l) => l.lineId !== action.lineId) };
    case "clear":
      return { lines: [] };
    default:
      return state;
  }
}

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (line: Omit<CartLine, "qty">, qty: number) => void;
  inc: (lineId: string) => void;
  dec: (lineId: string) => void;
  remove: (lineId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [] });

  const value = useMemo<CartContextValue>(() => {
    const count = state.lines.reduce((s, l) => s + l.qty, 0);
    const subtotal = state.lines.reduce((s, l) => s + l.qty * l.unitPrice, 0);
    return {
      lines: state.lines,
      count,
      subtotal,
      add: (line, qty) => dispatch({ type: "add", line, qty }),
      inc: (lineId) => dispatch({ type: "inc", lineId }),
      dec: (lineId) => dispatch({ type: "dec", lineId }),
      remove: (lineId) => dispatch({ type: "remove", lineId }),
      clear: () => dispatch({ type: "clear" }),
    };
  }, [state.lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
