import type { UserProfileAddress } from "@/types/auth";

const STORAGE_KEY_PREFIX = "profile_addresses_";
const LEGACY_KEY_PREFIX = "profile_address_";

/** API expects: { addressLine, city, state, country, pincode }. Convert from saved/form shape. */
export function toApiAddress(addr: {
  address: string;
  address2?: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}): UserProfileAddress {
  const addressLine = [addr.address, addr.address2].filter(Boolean).join(" ").trim() || undefined;
  return {
    addressLine: addressLine || undefined,
    city: addr.city || undefined,
    state: addr.state || undefined,
    country: addr.country || undefined,
    pincode: addr.zip || undefined,
  };
}

export type SavedAddress = {
  id: string;
  name: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
};

export const ADDRESS_NAMES = ["Home", "Work", "Other"] as const;

function storageKey(uid: string): string {
  return `${STORAGE_KEY_PREFIX}${uid}`;
}

function legacyKey(uid: string): string {
  return `${LEGACY_KEY_PREFIX}${uid}`;
}

const defaultAddressFields = {
  address2: "",
  city: "",
  state: "",
  zip: "",
  country: "United States",
};

function normalizeAddress(item: Record<string, unknown>): SavedAddress {
  return {
    id: typeof item.id === "string" ? item.id : crypto.randomUUID(),
    name: typeof item.name === "string" ? item.name : "Home",
    address: typeof item.address === "string" ? item.address : "",
    address2: typeof item.address2 === "string" ? item.address2 : "",
    city: typeof item.city === "string" ? item.city : "",
    state: typeof item.state === "string" ? item.state : "",
    zip: typeof item.zip === "string" ? item.zip : "",
    country: typeof item.country === "string" ? item.country : "United States",
    latitude:
      typeof item.latitude === "number" && Number.isFinite(item.latitude)
        ? item.latitude
        : null,
    longitude:
      typeof item.longitude === "number" && Number.isFinite(item.longitude)
        ? item.longitude
        : null,
  };
}

function parseAddresses(raw: string | null): SavedAddress[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item: unknown): item is Record<string, unknown> =>
          typeof item === "object" && item !== null && "id" in item && "name" in item && "address" in item
      )
      .map(normalizeAddress);
  } catch {
    return [];
  }
}

/** Migrate from old single-address format to new multi-address list. */
function migrateFromLegacy(uid: string): SavedAddress[] {
  try {
    const raw = localStorage.getItem(legacyKey(uid));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as {
      address?: string;
      latitude?: number;
      longitude?: number;
    };
    const address = typeof parsed.address === "string" ? parsed.address : "";
    const lat =
      typeof parsed.latitude === "number" && Number.isFinite(parsed.latitude)
        ? parsed.latitude
        : null;
    const lng =
      typeof parsed.longitude === "number" && Number.isFinite(parsed.longitude)
        ? parsed.longitude
        : null;
    if (!address && lat == null && lng == null) return [];
    const list: SavedAddress[] = [
      {
        id: crypto.randomUUID(),
        name: "Home",
        address,
        ...defaultAddressFields,
        latitude: lat,
        longitude: lng,
      },
    ];
    localStorage.setItem(storageKey(uid), JSON.stringify(list));
    localStorage.removeItem(legacyKey(uid));
    return list;
  } catch {
    return [];
  }
}

export function getProfileAddresses(uid: string): SavedAddress[] {
  let list = parseAddresses(localStorage.getItem(storageKey(uid)));
  if (list.length === 0) {
    list = migrateFromLegacy(uid);
  }
  return list;
}

export function addProfileAddress(
  uid: string,
  data: Omit<SavedAddress, "id">
): SavedAddress {
  const list = getProfileAddresses(uid);
  const newOne: SavedAddress = {
    ...data,
    id: crypto.randomUUID(),
  };
  list.push(newOne);
  localStorage.setItem(storageKey(uid), JSON.stringify(list));
  return newOne;
}

export function updateProfileAddress(
  uid: string,
  id: string,
  data: Partial<Omit<SavedAddress, "id">>
): SavedAddress | null {
  const list = getProfileAddresses(uid);
  const index = list.findIndex((a) => a.id === id);
  if (index === -1) return null;
  list[index] = { ...list[index], ...data };
  localStorage.setItem(storageKey(uid), JSON.stringify(list));
  return list[index];
}

export function removeProfileAddress(uid: string, id: string): void {
  const list = getProfileAddresses(uid).filter((a) => a.id !== id);
  localStorage.setItem(storageKey(uid), JSON.stringify(list));
}
