// src/types/aba-payway.d.ts
export {};

declare global {
  interface Window {
    AbaPayway: {
      checkout: () => void;
    };
  }

  const AbaPayway: {
    checkout: () => void;
  };
}
