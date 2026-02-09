"use client";

import { createContext, useContext, useReducer, useEffect } from "react";

type CartItem = {
  _id: string;
  nameFR?: string;
  nameEN?: string;
  price: number;
  quantity: number;
  stock?: number;
  itemType: 'card' | 'deck' | 'accessory';
  [key: string]: any;
};

type CartState = {
  items: CartItem[];
};

type Action =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "SET_STOCK"; payload: CartItem[] }
  | { type: "CLEAR_CART" };

const CartContext = createContext<any>(null);

function cartReducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(i => i._id === action.payload._id);

      if (existing) {
        return {
          items: state.items.map(i =>
            i._id === action.payload._id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }

      return {
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    }

    case "REMOVE_ITEM":
      return {
        items: state.items.filter(i => i._id !== action.payload),
      };

    case "UPDATE_QUANTITY":
      return {
        items: state.items.map(i =>
          i._id === action.payload.id
            ? { ...i, quantity: Math.max(0, action.payload.quantity) }
            : i
        ).filter(i => i.quantity > 0),
      };

    case "SET_STOCK":
      return { items: action.payload };

    case "CLEAR_CART":
      return { items: [] };

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.items));
  }, [state.items]);

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      dispatch({
        type: "CLEAR_CART",
      });
      JSON.parse(stored).forEach((item: CartItem) =>
        dispatch({ type: "ADD_ITEM", payload: item })
      );
    }
  }, []);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
