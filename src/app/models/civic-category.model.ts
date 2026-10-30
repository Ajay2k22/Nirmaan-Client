// src/app/models/civic-category.model.ts
// Single source of truth - matches your C# enum exactly
// namespace Nirmaan.Api.Enums

export enum CivicCategory {
  ROADS = 1,
  GARBAGE_WASTE = 2,
  DRAINAGE_SEWAGE = 3,
  STREET_LIGHT = 4,
  WATER_SUPPLY = 5,
  PUBLIC_TOILET = 6,
  ENCROACHMENT = 7,
  PARK_GARDEN = 8,
  TRAFFIC_SIGNAL = 9,
  STRAY_ANIMALS = 10,
  NOISE_POLLUTION = 11,
  OTHER = 99,
}

export interface CivicCategoryUI {
  key: keyof typeof CivicCategory; // e.g. 'ROADS'
  value: CivicCategory; // e.g. 1
  label: string; // Readable Name e.g. 'Roads'
  subLabel: string; // e.g. 'Potholes, Footpath'
  icon: string; // ion-icon name
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'red' | 'orange';
}

export const CIVIC_CATEGORIES: CivicCategoryUI[] = [
  {
    key: 'ROADS',
    value: CivicCategory.ROADS,
    label: 'Roads',
    subLabel: 'Potholes, Footpath',
    icon: 'construct-outline',
    color: 'blue',
  },
  {
    key: 'GARBAGE_WASTE',
    value: CivicCategory.GARBAGE_WASTE,
    label: 'Garbage & Waste',
    subLabel: 'Waste Management',
    icon: 'trash-outline',
    color: 'green',
  },
  {
    key: 'DRAINAGE_SEWAGE',
    value: CivicCategory.DRAINAGE_SEWAGE,
    label: 'Drainage & Sewa',
    subLabel: 'Gutter, Drainage',
    icon: 'water-outline',
    color: 'blue',
  },
  {
    key: 'STREET_LIGHT',
    value: CivicCategory.STREET_LIGHT,
    label: 'Street Light',
    subLabel: 'Lights, Poles',
    icon: 'bulb-outline',
    color: 'yellow',
  },
  {
    key: 'WATER_SUPPLY',
    value: CivicCategory.WATER_SUPPLY,
    label: 'Water Supply',
    subLabel: 'Leakage, Pipeline',
    icon: 'water',
    color: 'blue',
  },
  {
    key: 'PUBLIC_TOILET',
    value: CivicCategory.PUBLIC_TOILET,
    label: 'Public Toilet',
    subLabel: 'Toilet, Sanitation',
    icon: 'man-outline',
    color: 'purple',
  },
  {
    key: 'ENCROACHMENT',
    value: CivicCategory.ENCROACHMENT,
    label: 'Encroachment',
    subLabel: 'Illegal Construction',
    icon: 'business-outline',
    color: 'red',
  },
  {
    key: 'PARK_GARDEN',
    value: CivicCategory.PARK_GARDEN,
    label: 'Park & Garden',
    subLabel: 'Tree, Garden',
    icon: 'leaf-outline',
    color: 'green',
  },
  {
    key: 'TRAFFIC_SIGNAL',
    value: CivicCategory.TRAFFIC_SIGNAL,
    label: 'Traffic Signal',
    subLabel: 'Signal, Signage',
    icon: 'car-outline',
    color: 'orange',
  },
  {
    key: 'STRAY_ANIMALS',
    value: CivicCategory.STRAY_ANIMALS,
    label: 'Stray Animals',
    subLabel: 'Dogs, Animals',
    icon: 'paw-outline',
    color: 'yellow',
  },
  {
    key: 'NOISE_POLLUTION',
    value: CivicCategory.NOISE_POLLUTION,
    label: 'Noise Pollution',
    subLabel: 'Noise, Air Pollution',
    icon: 'volume-high-outline',
    color: 'red',
  },
  {
    key: 'OTHER',
    value: CivicCategory.OTHER,
    label: 'Other',
    subLabel: 'Other Issues',
    icon: 'ellipsis-horizontal-outline',
    color: 'blue',
  },
];

// Helper to get readable name from value
export function getCivicCategoryByValue(
  value: number,
): CivicCategoryUI | undefined {
  return CIVIC_CATEGORIES.find((c) => c.value === value);
}
export function getCivicCategoryByKey(
  key: string,
): CivicCategoryUI | undefined {
  return CIVIC_CATEGORIES.find((c) => c.key === key);
}
