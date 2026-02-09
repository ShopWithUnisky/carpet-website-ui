const PAYMENT_METHODS_KEY = "profile_payment_methods";

export type SavedPaymentMethod = {
  id: string;
  label: string;
  last4: string;
  brand: string;
};

function parseList(raw: string | null): SavedPaymentMethod[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item: unknown): item is SavedPaymentMethod =>
        typeof item === "object" &&
        item !== null &&
        "id" in item &&
        "last4" in item &&
        "brand" in item
    );
  } catch {
    return [];
  }
}

export function getPaymentMethods(): SavedPaymentMethod[] {
  return parseList(localStorage.getItem(PAYMENT_METHODS_KEY));
}

export function addPaymentMethod(
  data: Omit<SavedPaymentMethod, "id">
): SavedPaymentMethod {
  const list = getPaymentMethods();
  const one: SavedPaymentMethod = { ...data, id: crypto.randomUUID() };
  list.push(one);
  localStorage.setItem(PAYMENT_METHODS_KEY, JSON.stringify(list));
  return one;
}

export function removePaymentMethod(id: string): void {
  const list = getPaymentMethods().filter((m) => m.id !== id);
  localStorage.setItem(PAYMENT_METHODS_KEY, JSON.stringify(list));
}
