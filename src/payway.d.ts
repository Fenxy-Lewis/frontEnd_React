interface AbaPaywayCheckout {
  checkout: () => void;
}

interface Window {
  AbaPayway?: AbaPaywayCheckout;
}
