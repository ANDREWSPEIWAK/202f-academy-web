export const coffeeConstants = {
  brewMethods: {
    V60: {
      id: 'V60',
      name: 'V60',
      bloomTime: 35,
      targetTime: 165,
      targetWater: 300.6,
      defaultDose: 18,
      defaultRatio: 16.7,
    },
    KALITA_185: {
      id: 'KALITA_185',
      name: 'Kalita 185',
      bloomTime: 30,
      targetTime: 180,
      targetWater: 300,
      defaultDose: 18,
      defaultRatio: 16.7,
    },
    AEROPRESS: {
      id: 'AEROPRESS',
      name: 'AeroPress',
      bloomTime: 0,
      targetTime: 180,
      targetWater: 200,
      defaultDose: 15,
      defaultRatio: 13.3,
    },
    ESPRESSO: {
      id: 'ESPRESSO',
      name: 'Espresso',
      bloomTime: 0,
      targetTime: 27,
      targetWater: 36,
      defaultDose: 18,
      defaultRatio: 2,
    },
  },

  passingScores: {
    JUNIOR: 80,
    SKILLED: 85,
    PRO: 90,
  },

  levelRequirements: {
    JUNIOR: { requiredProgress: 0, requiredTestsPassed: 0, requiredLessonsCompleted: 0 },
    SKILLED: { requiredProgress: 60, requiredTestsPassed: 5, requiredLessonsCompleted: 20 },
    PRO: { requiredProgress: 90, requiredTestsPassed: 15, requiredLessonsCompleted: 50 },
  },

  tdsReferences: {
    espresso: { min: 1.0, max: 2.0, ideal: 1.35 },
    filterCoffee: { min: 1.0, max: 1.8, ideal: 1.35 },
  },

  extractionYieldReferences: {
    espresso: { min: 18, max: 22, ideal: 20 },
    filterCoffee: { min: 18, max: 22, ideal: 20 },
  },
};
