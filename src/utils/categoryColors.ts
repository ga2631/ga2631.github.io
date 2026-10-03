/**
 * Flowbite-supported category color system.
 * Stores color as standard Flowbite color identifiers (e.g., 'blue', 'green', 'yellow', 'purple', etc.)
 * and dynamically renders corresponding Tailwind CSS classes for badges, borders, icons, and chips.
 */

export type FlowbiteCategoryColor =
  | 'blue'
  | 'green'
  | 'yellow'
  | 'purple'
  | 'pink'
  | 'red'
  | 'indigo'
  | 'cyan'
  | 'teal'
  | 'gray';

export interface CategoryColorOption {
  id: FlowbiteCategoryColor;
  nameVi: string;
  nameEn: string;
  dotBg: string;
  badge: string;
  borderTop: string;
  iconBg: string;
  text: string;
}

export const FLOWBITE_CATEGORY_COLORS: CategoryColorOption[] = [
  {
    id: 'blue',
    nameVi: 'Xanh dương (Blue)',
    nameEn: 'Blue (Primary)',
    dotBg: 'bg-blue-500',
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    borderTop: 'border-t-blue-500',
    iconBg: 'bg-blue-100 text-blue-600',
    text: 'text-blue-600',
  },
  {
    id: 'green',
    nameVi: 'Xanh lá (Green)',
    nameEn: 'Green (Success)',
    dotBg: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    borderTop: 'border-t-emerald-500',
    iconBg: 'bg-emerald-100 text-emerald-600',
    text: 'text-emerald-600',
  },
  {
    id: 'yellow',
    nameVi: 'Vàng hổ phách (Yellow)',
    nameEn: 'Yellow (Warning)',
    dotBg: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    borderTop: 'border-t-amber-500',
    iconBg: 'bg-amber-100 text-amber-600',
    text: 'text-amber-600',
  },
  {
    id: 'purple',
    nameVi: 'Tím (Purple)',
    nameEn: 'Purple',
    dotBg: 'bg-purple-500',
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
    borderTop: 'border-t-purple-500',
    iconBg: 'bg-purple-100 text-purple-600',
    text: 'text-purple-600',
  },
  {
    id: 'pink',
    nameVi: 'Hồng (Pink)',
    nameEn: 'Pink',
    dotBg: 'bg-pink-500',
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    borderTop: 'border-t-rose-500',
    iconBg: 'bg-rose-100 text-rose-600',
    text: 'text-rose-600',
  },
  {
    id: 'red',
    nameVi: 'Đỏ (Red)',
    nameEn: 'Red (Danger)',
    dotBg: 'bg-red-500',
    badge: 'bg-red-50 text-red-700 border-red-200',
    borderTop: 'border-t-red-500',
    iconBg: 'bg-red-100 text-red-600',
    text: 'text-red-600',
  },
  {
    id: 'indigo',
    nameVi: 'Chàm (Indigo)',
    nameEn: 'Indigo',
    dotBg: 'bg-indigo-500',
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    borderTop: 'border-t-indigo-500',
    iconBg: 'bg-indigo-100 text-indigo-600',
    text: 'text-indigo-600',
  },
  {
    id: 'cyan',
    nameVi: 'Xanh lơ (Cyan)',
    nameEn: 'Cyan',
    dotBg: 'bg-cyan-500',
    badge: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    borderTop: 'border-t-cyan-500',
    iconBg: 'bg-cyan-100 text-cyan-600',
    text: 'text-cyan-600',
  },
  {
    id: 'teal',
    nameVi: 'Xanh mòng két (Teal)',
    nameEn: 'Teal',
    dotBg: 'bg-teal-500',
    badge: 'bg-teal-50 text-teal-700 border-teal-200',
    borderTop: 'border-t-teal-500',
    iconBg: 'bg-teal-100 text-teal-600',
    text: 'text-teal-600',
  },
  {
    id: 'gray',
    nameVi: 'Xám (Gray)',
    nameEn: 'Gray (Alternative)',
    dotBg: 'bg-gray-500',
    badge: 'bg-gray-100 text-gray-700 border-gray-200',
    borderTop: 'border-t-gray-500',
    iconBg: 'bg-gray-100 text-gray-600',
    text: 'text-gray-600',
  },
];

const HEX_TO_FLOWBITE_MAP: Record<string, FlowbiteCategoryColor> = {
  '#3b82f6': 'blue',
  '#2563eb': 'blue',
  '#10b981': 'green',
  '#059669': 'green',
  '#22c55e': 'green',
  '#f59e0b': 'yellow',
  '#d97706': 'yellow',
  '#eab308': 'yellow',
  '#8b5cf6': 'purple',
  '#7c3aed': 'purple',
  '#ec4899': 'pink',
  '#db2777': 'pink',
  '#ef4444': 'red',
  '#dc2626': 'red',
  '#6366f1': 'indigo',
  '#4f46e5': 'indigo',
  '#06b6d4': 'cyan',
  '#0891b2': 'cyan',
  '#14b8a6': 'teal',
  '#0d9488': 'teal',
  '#6b7280': 'gray',
  '#4b5563': 'gray',
};

const COLOR_MAP: Record<FlowbiteCategoryColor, CategoryColorOption> = FLOWBITE_CATEGORY_COLORS.reduce(
  (acc, item) => {
    acc[item.id] = item;
    return acc;
  },
  {} as Record<FlowbiteCategoryColor, CategoryColorOption>
);

/**
 * Normalizes any color input (Flowbite color name or legacy hex code)
 * into a valid FlowbiteCategoryColor name.
 */
export function normalizeCategoryColor(color?: string | null): FlowbiteCategoryColor {
  if (!color) return 'blue';
  const trimmed = color.trim().toLowerCase();
  if (trimmed in COLOR_MAP) {
    return trimmed as FlowbiteCategoryColor;
  }
  if (HEX_TO_FLOWBITE_MAP[trimmed]) {
    return HEX_TO_FLOWBITE_MAP[trimmed];
  }
  return 'blue';
}

/**
 * Retrieves the dynamic CSS classes corresponding to the given category color.
 */
export function getCategoryColorClasses(color?: string | null): CategoryColorOption {
  const norm = normalizeCategoryColor(color);
  return COLOR_MAP[norm] || COLOR_MAP.blue;
}
