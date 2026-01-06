export const SPECIALTY_ICONS: Record<string, string> = {
  'tim-mach': 'heart',
  cardiology: 'heart',
  'noi-khoa': 'body',
  'internal-medicine': 'body',
  'da-lieu': 'sparkles',
  dermatology: 'sparkles',
  'than-kinh': 'pulse',
  neurology: 'pulse',
  'nhi-khoa': 'happy',
  pediatrics: 'happy',
  'san-phu-khoa': 'female',
  'obstetrics-gynecology': 'female',
  'mat-khoa': 'eye',
  ophthalmology: 'eye',
  'rang-ham-mat': 'medical',
  dentistry: 'medical',
  'co-xuong-khop': 'fitness',
  orthopedics: 'fitness',
  'tai-mui-hong': 'ear',
  ent: 'ear',
  default: 'medkit',
};

export const SPECIALTY_COLORS: string[][] = [
  ['#3B82F6', '#2563EB'],
  ['#22C55E', '#16A34A'],
  ['#F97316', '#EA580C'],
  ['#8B5CF6', '#7C3AED'],
  ['#EC4899', '#DB2777'],
  ['#14B8A6', '#0D9488'],
  ['#F59E0B', '#D97706'],
  ['#6366F1', '#4F46E5'],
];

export const getSpecialtyIcon = (name?: string): string => {
  if (!name) return SPECIALTY_ICONS.default;
  const key = name.toLowerCase().replace(/\s+/g, '-');
  return SPECIALTY_ICONS[key] || SPECIALTY_ICONS.default;
};

export const getSpecialtyColor = (index: number): string[] => {
  return SPECIALTY_COLORS[index % SPECIALTY_COLORS.length];
};

