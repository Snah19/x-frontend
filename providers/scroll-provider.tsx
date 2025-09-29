"use client";

import { createContext, useContext, useRef, ReactNode, RefObject } from "react";

const ScrollContext = createContext<RefObject<Record<string, number>> | null>(null);

export const ScrollProvider = ({ children }: { children: ReactNode }) => {
  const scrollStore = useRef<Record<string, number>>({});
  return (
    <ScrollContext.Provider value={scrollStore}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScrollStore = () => {
  const context = useContext(ScrollContext);
  if (!context) throw new Error("useScrollStore must be used within a ScrollProvider");
  return context;
};
