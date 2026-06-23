export function baht(n: number): string {
  return "฿" + n.toLocaleString("th-TH");
}

/** Stable signature so identical product+options stack into one cart line. */
export function lineSignature(productId: string, optionLabels: string[]): string {
  return productId + "::" + [...optionLabels].sort().join("|");
}
