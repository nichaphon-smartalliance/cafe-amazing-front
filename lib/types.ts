export type CategoryId =
  | "all"
  | "coffee"
  | "tea"
  | "milk"
  | "frappe"
  | "bakery";

export interface Category {
  id: CategoryId;
  name: string;
  nameEn: string;
  emoji: string;
}

export interface OptionChoice {
  id: string;
  label: string;
  /** price delta in THB */
  delta: number;
}

export interface OptionGroup {
  id: string;
  label: string;
  /** single = radio (required), multi = optional toggles */
  type: "single" | "multi";
  choices: OptionChoice[];
}

export interface Product {
  id: string;
  name: string;
  nameEn: string;
  desc: string;
  basePrice: number;
  category: Exclude<CategoryId, "all">;
  emoji: string;
  /** tailwind gradient stops for the product tile */
  gradient: string;
  badge?: "ฮิต" | "ใหม่" | "แนะนำ";
  options: OptionGroup[];
}

export interface SelectedOptions {
  /** groupId -> choiceId(s) */
  [groupId: string]: string[];
}

export interface CartLine {
  /** unique per cart line (product + option signature) */
  lineId: string;
  productId: string;
  name: string;
  emoji: string;
  gradient: string;
  qty: number;
  unitPrice: number;
  optionLabels: string[];
}
