import { useState, useEffect } from "react";
import type { User } from "firebase/auth";
import { updateProfile } from "firebase/auth";
import type { AppUser } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/context/ToastContext";
import { haptic } from "@/lib/haptic";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LocationMap } from "@/components/profile/LocationMap";
import {
  getProfileAddresses,
  addProfileAddress,
  updateProfileAddress,
  removeProfileAddress,
  ADDRESS_NAMES,
  type SavedAddress,
} from "@/lib/profileAddress";
import {
  getBrowserLocation,
  getLocationErrorMessage,
  reverseGeocode,
} from "@/lib/geolocation";
import { MapPicker, STREET_ZOOM } from "@/components/profile/MapPicker";
import { MapPin, Pencil, Plus, Trash2, Locate, LogOut, UserMinus } from "lucide-react";

function isFirebaseUser(u: AppUser): u is User {
  return !u.uid.startsWith("backend-");
}

type ProfileDetailsTabProps = {
  user: AppUser;
};

export function ProfileDetailsTab({ user }: ProfileDetailsTabProps) {
  const { signOut, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("Home");
  const [editNameCustom, setEditNameCustom] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editAddress2, setEditAddress2] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editState, setEditState] = useState("");
  const [editZip, setEditZip] = useState("");
  const [editCountry, setEditCountry] = useState("United States");
  const [editLat, setEditLat] = useState<number | null>(null);
  const [editLng, setEditLng] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [geocodeLoading, setGeocodeLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  /** When 17, map flies to street level (e.g. after "Use current location"). */
  const [mapFlyToZoom, setMapFlyToZoom] = useState<number | null>(null);
  const [editingDisplayName, setEditingDisplayName] = useState(false);
  const [displayNameValue, setDisplayNameValue] = useState(user.displayName ?? "");
  const [savingName, setSavingName] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const refreshAddresses = () => setAddresses(getProfileAddresses(user.uid));

  useEffect(() => {
    refreshAddresses();
  }, [user.uid]);

  useEffect(() => {
    setDisplayNameValue(user.displayName ?? "");
  }, [user.displayName]);

  const handleSaveDisplayName = async () => {
    if (!isFirebaseUser(user)) return;
    const trimmed = displayNameValue.trim();
    if (trimmed === (user.displayName ?? "")) {
      setEditingDisplayName(false);
      return;
    }
    setSavingName(true);
    try {
      await updateProfile(user, { displayName: trimmed || null });
      toast("Display name updated");
      setEditingDisplayName(false);
    } catch (e) {
      toast("Failed to update name");
    } finally {
      setSavingName(false);
    }
  };

  const handleSignOut = async () => {
    haptic();
    await signOut();
    toast("Signed out");
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    if (!isFirebaseUser(user)) return;
    if (!confirm("Permanently delete your account? This cannot be undone.")) return;
    haptic();
    setDeleting(true);
    try {
      await deleteAccount();
      toast("Account deleted");
      navigate("/");
    } catch (e) {
      toast("Could not delete account. You may need to sign in again first.");
    } finally {
      setDeleting(false);
    }
  };

  const openFormToAdd = () => {
    setEditingId(null);
    setEditName("Home");
    setEditNameCustom("");
    setEditAddress("");
    setEditAddress2("");
    setEditCity("");
    setEditState("");
    setEditZip("");
    setEditCountry("United States");
    setEditLat(null);
    setEditLng(null);
    setLocationError(null);
    setFormOpen(true);
  };

  const openFormToEdit = (a: SavedAddress) => {
    setEditingId(a.id);
    const isCustom = !ADDRESS_NAMES.includes(a.name as (typeof ADDRESS_NAMES)[number]);
    setEditName(isCustom ? "Other" : a.name);
    setEditNameCustom(isCustom ? a.name : "");
    setEditAddress(a.address);
    setEditAddress2(a.address2 ?? "");
    setEditCity(a.city ?? "");
    setEditState(a.state ?? "");
    setEditZip(a.zip ?? "");
    setEditCountry(a.country ?? "United States");
    setEditLat(a.latitude);
    setEditLng(a.longitude);
    setLocationError(null);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingId(null);
    setLocationError(null);
  };

  const handleSave = () => {
    setSaving(true);
    const name = editName === "Other" ? (editNameCustom.trim() || "Other") : editName;
    const payload = {
      name,
      address: editAddress.trim(),
      address2: editAddress2.trim(),
      city: editCity.trim(),
      state: editState.trim(),
      zip: editZip.trim(),
      country: editCountry.trim() || "United States",
      latitude: editLat,
      longitude: editLng,
    };
    if (editingId) {
      updateProfileAddress(user.uid, editingId, payload);
    } else {
      addProfileAddress(user.uid, payload);
    }
    refreshAddresses();
    setSaving(false);
    closeForm();
  };

  const handleDelete = (id: string) => {
    if (confirm("Remove this address?")) {
      removeProfileAddress(user.uid, id);
      refreshAddresses();
    }
  };

  const applyReverseGeocode = async (lat: number, lng: number) => {
    setGeocodeLoading(true);
    const parsed = await reverseGeocode(lat, lng);
    setGeocodeLoading(false);
    if (parsed) {
      setEditAddress(parsed.address);
      if (parsed.address2) setEditAddress2(parsed.address2);
      setEditCity(parsed.city);
      setEditState(parsed.state);
      setEditZip(parsed.zip);
      setEditCountry(parsed.country || editCountry);
    }
  };

  const handleLocationChange = (lat: number, lng: number) => {
    setEditLat(lat);
    setEditLng(lng);
    setLocationError(null);
    setMapFlyToZoom(null); // User chose by pin; don't force street zoom
    applyReverseGeocode(lat, lng);
  };

  const handleUseBrowserLocation = async () => {
    setLocationLoading(true);
    setLocationError(null);
    const result = await getBrowserLocation();
    if (result.ok) {
      setEditLat(result.latitude);
      setEditLng(result.longitude);
      setMapFlyToZoom(STREET_ZOOM); // Zoom to street level for better view
      await applyReverseGeocode(result.latitude, result.longitude);
    } else {
      setLocationError(getLocationErrorMessage(result.reason));
    }
    setLocationLoading(false);
  };

  const isFormOpen = formOpen;

  return (
    <div className="space-y-8">
      {/* Profile info card */}
      <Card>
        <CardHeader>
          <CardTitle>Profile details</CardTitle>
          <CardDescription>
            Your account information from sign-in
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt=""
                className="size-24 rounded-full object-cover ring-2 ring-border"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex size-24 items-center justify-center rounded-full bg-muted text-2xl font-medium text-muted-foreground">
                {user.displayName?.trim()
                  ? user.displayName[0].toUpperCase()
                  : user.email?.[0]?.toUpperCase() ?? "?"}
              </div>
            )}
          </div>
          {isFirebaseUser(user) && (
            <div className="grid gap-2">
              <Label htmlFor="profile-name">Display name</Label>
              {editingDisplayName ? (
                <div className="flex gap-2">
                  <Input
                    id="profile-name"
                    value={displayNameValue}
                    onChange={(e) => setDisplayNameValue(e.target.value)}
                    placeholder="Your name"
                    className="flex-1"
                  />
                  <Button size="sm" onClick={handleSaveDisplayName} disabled={savingName}>
                    {savingName ? "Saving…" : "Save"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setDisplayNameValue(user.displayName ?? "");
                      setEditingDisplayName(false);
                    }}
                    disabled={savingName}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    id="profile-name"
                    value={user.displayName ?? ""}
                    readOnly
                    className="bg-muted/50 flex-1"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setDisplayNameValue(user.displayName ?? "");
                      setEditingDisplayName(true);
                    }}
                  >
                    <Pencil className="size-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="profile-email">Email</Label>
            <Input
              id="profile-email"
              type="email"
              value={user.email ?? ""}
              readOnly
              className="bg-muted/50"
            />
          </div>
          {user.phoneNumber && (
            <div className="grid gap-2">
              <Label htmlFor="profile-phone">Phone</Label>
              <Input
                id="profile-phone"
                value={user.phoneNumber}
                readOnly
                className="bg-muted/50"
              />
            </div>
          )}
          <div className="flex flex-col gap-2 pt-4 border-t">
            <Button variant="outline" className="w-full sm:w-auto" onClick={handleSignOut}>
              <LogOut className="mr-2 size-4" />
              Sign out
            </Button>
            {isFirebaseUser(user) && (
              <Button
                variant="outline"
                className="w-full sm:w-auto text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleDeleteAccount}
                disabled={deleting}
              >
                <UserMinus className="mr-2 size-4" />
                {deleting ? "Deleting…" : "Delete account"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Addresses section */}
      <Card>
        <CardHeader>
          <CardTitle>Addresses</CardTitle>
          <CardDescription>
            Add home, work, or other addresses. Use your current location or set a pin on the map.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Inline add/edit form */}
          {isFormOpen ? (
            <Card className="border-primary/20 bg-muted/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  {editingId ? "Edit address" : "Add address"}
                </CardTitle>
                <CardDescription>
                  Name the place, enter the address, and set the location from your browser or by dropping a pin.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Select value={editName} onValueChange={setEditName}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ADDRESS_NAMES.map((n) => (
                          <SelectItem key={n} value={n}>
                            {n}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {editName === "Other" && (
                      <Input
                        placeholder="e.g. Grandma's, Gym"
                        value={editNameCustom}
                        onChange={(e) => setEditNameCustom(e.target.value)}
                      />
                    )}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-address">Address line 1</Label>
                  <Input
                    id="edit-address"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    placeholder="Street address"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-address2">Address line 2 (optional)</Label>
                  <Input
                    id="edit-address2"
                    value={editAddress2}
                    onChange={(e) => setEditAddress2(e.target.value)}
                    placeholder="Apartment, suite, etc."
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-city">City</Label>
                    <Input
                      id="edit-city"
                      value={editCity}
                      onChange={(e) => setEditCity(e.target.value)}
                      placeholder="City"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-state">State / Province</Label>
                    <Input
                      id="edit-state"
                      value={editState}
                      onChange={(e) => setEditState(e.target.value)}
                      placeholder="State"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-zip">ZIP / Postal code</Label>
                    <Input
                      id="edit-zip"
                      value={editZip}
                      onChange={(e) => setEditZip(e.target.value)}
                      placeholder="ZIP"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-country">Country</Label>
                  <Input
                    id="edit-country"
                    value={editCountry}
                    onChange={(e) => setEditCountry(e.target.value)}
                    placeholder="Country"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Label>Location</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleUseBrowserLocation}
                      disabled={locationLoading}
                    >
                      <Locate className="mr-2 size-4" />
                      {locationLoading ? "Getting location…" : "Use my location"}
                    </Button>
                  </div>
                  {locationError && (
                    <p className="text-xs text-destructive">{locationError}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Use your browser&apos;s location, or click the map to drop a pin if location isn&apos;t available.
                  </p>
                  {geocodeLoading && (
                    <p className="text-xs text-muted-foreground">
                      Looking up address…
                    </p>
                  )}
                  <MapPicker
                    latitude={editLat}
                    longitude={editLng}
                    onLocationChange={handleLocationChange}
                    height="220px"
                    flyToZoom={mapFlyToZoom}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? "Saving…" : editingId ? "Update address" : "Save address"}
                  </Button>
                  <Button type="button" variant="outline" onClick={closeForm}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Button type="button" size="sm" onClick={openFormToAdd}>
              <Plus className="mr-2 size-4" />
              Add address
            </Button>
          )}

          {/* Address list */}
          {addresses.length === 0 ? (
            !isFormOpen && (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
                <MapPin className="size-10 text-muted-foreground/50" />
                <p className="mt-2 text-sm font-medium">No addresses yet</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Add one for delivery or directions
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={openFormToAdd}
                >
                  <Plus className="mr-2 size-4" />
                  Add address
                </Button>
              </div>
            )
          ) : (
            <ul className="grid gap-4">
              {addresses.map((addr) => (
                <li key={addr.id}>
                  <Card className="overflow-hidden border bg-card">
                    <CardContent className="p-0">
                      <div className="flex flex-col">
                        <div className="flex flex-1 flex-col p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <Badge variant="secondary" className="w-fit">
                              {addr.name}
                            </Badge>
                            <div className="flex gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-8"
                                onClick={() => openFormToEdit(addr)}
                                aria-label="Edit address"
                              >
                                <Pencil className="size-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-8 text-destructive hover:text-destructive"
                                onClick={() => handleDelete(addr.id)}
                                aria-label="Delete address"
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="mt-2 flex items-start gap-2 text-sm text-foreground">
                            <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                            <div className="min-w-0">
                              {addr.address ? (
                                <>
                                  <p>{addr.address}</p>
                                  {addr.address2 && <p>{addr.address2}</p>}
                                  <p className="text-muted-foreground">
                                    {[addr.city, addr.state, addr.zip].filter(Boolean).join(", ")}
                                    {addr.country ? ` · ${addr.country}` : ""}
                                  </p>
                                </>
                              ) : (
                                <span className="text-muted-foreground italic">
                                  No address set
                                </span>
                              )}
                            </div>
                          </div>
                          {addr.latitude != null && addr.longitude != null && (
                            <div className="mt-3">
                              <LocationMap
                                latitude={addr.latitude}
                                longitude={addr.longitude}
                                label={addr.address || addr.name}
                                height="140px"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
