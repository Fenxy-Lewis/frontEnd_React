// export type OrderType = {
//     id: number;
//     discount: number;
// }
export type OrderPayload = {
  discount: number;
  items: {
    productId: number;
    qty: number;
  }[];
};
