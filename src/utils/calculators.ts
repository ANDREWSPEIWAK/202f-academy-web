export const calculators = {
  brewRatio: (coffeeGrams: number, ratio: number): number => {
    return Number((coffeeGrams * ratio).toFixed(1));
  },

  extractionYield: (dose: number, beverageWeight: number, tds: number): number => {
    if (dose === 0) return 0;
    return Number(((tds * beverageWeight) / dose).toFixed(2));
  },

  espressoBeverageTarget: (dose: number, targetRatio: number): number => {
    return Number((dose * targetRatio).toFixed(1));
  },

  parseRatio: (ratioString: string): number => {
    const parts = ratioString.split(':').map(Number);
    if (parts.length === 2 && parts[0] > 0) {
      return parts[1] / parts[0];
    }
    return 1;
  },
};
