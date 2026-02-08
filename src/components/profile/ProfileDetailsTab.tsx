import { useState, useEffect } from "react";
import type { User } from "firebase/auth";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPicker } from "@/components/profile/MapPicker";
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
} from "@/lib/geolocation";
import { MapPin, Pencil, Plus, Trash2, Locate } from "lucide-react";

type ProfileDetailsTabProps = {
  user: User;
};

export function ProfileDetailsTab({ user }: ProfileDetailsTabProps) {
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("Home");
  const [editNameCustom, setEditNameCustom] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editLat, setEditLat] = useState<number | null>(null);
  const [editLng, setEditLng] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const refreshAddresses = () => setAddresses(getProfileAddresses(user.uid));

  useEffect(() => {
    refreshAddresses();
  }, [user.uid]);

  const openFormToAdd = () => {
    setEditingId(null);
    setEditName("Home");
    setEditNameCustom("");
    setEditAddress("");
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
    if (editingId) {
      updateProfileAddress(user.uid, editingId, {
        name,
        address: editAddress.trim(),
        latitude: editLat,
        longitude: editLng,
      });
    } else {
      addProfileAddress(user.uid, {
        name,
        address: editAddress.trim(),
        latitude: editLat,
        longitude: editLng,
      });
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

  const handleLocationChange = (lat: number, lng: number) => {
    setEditLat(lat);
    setEditLng(lng);
    setLocationError(null);
  };

  const handleUseBrowserLocation = async () => {
    setLocationLoading(true);
    setLocationError(null);
    const result = await getBrowserLocation();
    setLocationLoading(false);
    if (result.ok) {
      setEditLat(result.latitude);
      setEditLng(result.longitude);
    } else {
      setLocationError(getLocationErrorMessage(result.reason));
    }
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
          <div className="grid gap-2">
            <Label htmlFor="profile-name">Display name</Label>
            <Input
              id="profile-name"
              value={user.displayName ?? ""}
              readOnly
              className="bg-muted/50"
            />
          </div>
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
                  <div className="space-y-2">
                    <Label htmlFor="edit-address">Address</Label>
                    <Input
                      id="edit-address"
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                      placeholder="Street, city, state, PIN"
                    />
                  </div>
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
                  <MapPicker
                    latitude={editLat}
                    longitude={editLng}
                    onLocationChange={handleLocationChange}
                    height="220px"
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
                          <p className="mt-2 flex items-start gap-2 text-sm text-foreground">
                            <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                            <span className={addr.address ? "" : "text-muted-foreground italic"}>
                              {addr.address || "No address line set"}
                            </span>
                          </p>
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
