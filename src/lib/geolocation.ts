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

/** Parsed address from reverse geocoding (Nominatim). */
export type ReverseGeocodeResult = {
  address: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

const NOMINATIM_USER_AGENT = "CarpetCompany-Profile-Address/1.0";

/**
 * Reverse geocode lat/lng to address components using Nominatim (OSM).
 * Populates address form fields when user pins the map or uses current location.
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<ReverseGeocodeResult | null> {
  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("lat", String(latitude));
  url.searchParams.set("lon", String(longitude));
  url.searchParams.set("format", "json");
  url.searchParams.set("addressdetails", "1");

  try {
    const res = await fetch(url.toString(), {
      headers: { "Accept-Language": "en", "User-Agent": NOMINATIM_USER_AGENT },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      address?: Record<string, string>;
      display_name?: string;
    };
    const addr = data?.address;
    if (!addr || typeof addr !== "object") return null;

    const road = [addr.road, addr.house_number].filter(Boolean).join(" ").trim();
    const suburb = addr.suburb ?? addr.neighbourhood ?? addr.borough ?? "";
    const city =
      addr.city ?? addr.town ?? addr.village ?? addr.municipality ?? addr.county ?? "";
    const state = addr.state ?? addr.state_district ?? "";
    const postcode = addr.postcode ?? "";
    const country = addr.country ?? "";

    const addressLine1 = road || suburb || data.display_name?.split(",")[0]?.trim() || "";

    return {
      address: addressLine1,
      address2: suburb && suburb !== city ? suburb : "",
      city,
      state,
      zip: postcode,
      country,
    };
  } catch {
    return null;
  }
}
