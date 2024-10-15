export type TPaymentReserve = {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
};

export type TPaymentWebhook = {
  data: {
    id: string;
  };
  id: number;
  action: string;
  type: string;
};
