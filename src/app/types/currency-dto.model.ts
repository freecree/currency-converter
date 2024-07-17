type CurrencyData = {
  code: string,
  value: number,
};

export type CurrencyDTO = {
  data: {
    [key: string]: CurrencyData,
  }
};
