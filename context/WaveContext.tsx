"use client";

import { createContext, useContext, useState } from "react";

interface WaveContextValue {
  amplitude: number;
  setAmplitude: (v: number) => void;
}

const WaveContext = createContext<WaveContextValue>({
  amplitude: 4.5,
  setAmplitude: () => {},
});

export function WaveProvider({ children }: { children: React.ReactNode }) {
  const [amplitude, setAmplitude] = useState(4.5);
  return (
    <WaveContext.Provider value={{ amplitude, setAmplitude }}>
      {children}
    </WaveContext.Provider>
  );
}

export function useWave() {
  return useContext(WaveContext);
}
