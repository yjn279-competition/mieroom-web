export interface EvacueeCapacity {
  total: number;
  current: number;
  male: number;
  female: number;
}

export interface AgeDistribution {
  ageGroup: string;
  count: number;
}

export interface AllergenDistribution {
  allergen: string;
  count: number;
}

export interface DashboardData {
  evacueeCapacity: EvacueeCapacity;
  ageDistribution: AgeDistribution[];
  allergenDistribution: AllergenDistribution[];
}

export interface User {
  id: string;
  name: string;
  gender: string;
  age: number;
  address: string;
}

export const dashboardData: DashboardData = {
  evacueeCapacity: {
    total: 700,
    current: 658,
    male: 326,
    female: 332
  },
  ageDistribution: [
    { ageGroup: '0-', count: 50 },
    { ageGroup: '10-', count: 100 },
    { ageGroup: '20-', count: 150 },
    { ageGroup: '30-', count: 120 },
    { ageGroup: '40-', count: 100 },
    { ageGroup: '50-', count: 80 },
    { ageGroup: '60-', count: 70 },
    { ageGroup: '70-', count: 50 },
    { ageGroup: '80-', count: 30 }
  ],
  allergenDistribution: [
    { allergen: '卵', count: 50 },
    { allergen: '乳', count: 40 },
    { allergen: '小麦', count: 30 },
    { allergen: 'そば', count: 10 },
    { allergen: '落花生', count: 15 },
    { allergen: 'えび', count: 20 },
    { allergen: 'かに', count: 10 }
  ]
};
