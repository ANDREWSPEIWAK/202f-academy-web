export const calculators = {
    brewRatio: (coffeeGrams, ratio) => {
        return Number((coffeeGrams * ratio).toFixed(1));
    },
    extractionYield: (dose, beverageWeight, tds) => {
        if (dose === 0)
            return 0;
        return Number(((tds * beverageWeight) / dose).toFixed(2));
    },
    espressoBeverageTarget: (dose, targetRatio) => {
        return Number((dose * targetRatio).toFixed(1));
    },
    parseRatio: (ratioString) => {
        const parts = ratioString.split(':').map(Number);
        if (parts.length === 2 && parts[0] > 0) {
            return parts[1] / parts[0];
        }
        return 1;
    },
};
