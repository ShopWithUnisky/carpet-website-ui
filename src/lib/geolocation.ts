export type GeolocationResult =
  | { ok: true; latitude: number; longitude: number }
  | { ok: false; reason: "unsupported" | "denied" | "unavailable" | "timeout" };

const REASONS = ["unsupported", "denied", "unavailable", "timeout"] as const;
export type GeolocationReason = (typeof REASONS)[number];

export function getBrowserLocation(): Promise<GeolocationResult> {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return Promise.resolve({ ok: false, reason: "unsupported" });
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          ok: true,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        const reason: GeolocationReason =
          error.code === 1
            ? "denied"
            : error.code === 2
              ? "unavailable"
              : error.code === 3
                ? "timeout"
                : "unavailable";
        resolve({ ok: false, reason });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  });
}

export function getLocationErrorMessage(reason: GeolocationReason): string {
  switch (reason) {
    case "unsupported":
      return "Location is not supported in this browser.";
    case "denied":
      return "Location access was denied. Please set a pin on the map.";
    case "unavailable":
      return "Location is unavailable. Please set a pin on the map.";
    case "timeout":
      return "Location request timed out. Please set a pin on the map.";
    default:
      return "Please set a pin on the map to assign a location.";
  }
}
