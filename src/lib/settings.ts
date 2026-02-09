const SETTINGS_KEY = "profile_settings";

export type SavedSettings = {
  notifyOrders: boolean;
  notifyMarketing: boolean;
  region: string;
};

const defaults: SavedSettings = {
  notifyOrders: true,
  notifyMarketing: false,
  region: "USD · English",
};

export function getSettings(): SavedSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Partial<SavedSettings>;
    return { ...defaults, ...parsed };
  } catch {
    return defaults;
  }
}

export function saveSettings(settings: SavedSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
