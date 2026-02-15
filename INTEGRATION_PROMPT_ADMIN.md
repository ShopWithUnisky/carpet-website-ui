# API integration prompt for admin app

Use this prompt in your **admin** project so the integration matches the same structure as the customer-facing app. Replace placeholders like `[ADMIN_BASE_URL]` and `[YOUR_ADMIN_ENDPOINTS]` with your actual values.

---

## Prompt (copy below)

---

Integrate the backend API in this admin app using the **same structure** as the customer app. Follow these layers exactly.

### 1. Environment

Create or update **`src/apiActions/environment.ts`** (or equivalent):

- Export **`base_url`**: the API base URL (e.g. `"https://tcc-backend-tkku.onrender.com/api/v1"` or an admin-specific base).
- Export **`endpoints`**: a single object mapping logical names to path strings, e.g.  
  `send_email_otp: "/auth/send-email-otp"`,  
  `get_user_profile: "/users/profile"`,  
  `update_user_profile: "/users/profile"`.  
  Add all admin endpoints (e.g. admin login, get users, get orders, products CRUD, etc.) as needed.
- Build full URLs in services as: **`base_url + endpoints.some_endpoint`**. For dynamic segments use `.replace(":id", id)` (e.g. `endpoints.get_product.replace(":id", id)`).

### 2. API layer

Create or update **`src/apiActions/api-actions.ts`** (or equivalent):

- **`apiCall<T, P, B>(method, url, params?, body?)`**  
  - Uses axios. No auth.  
  - `method`: `"GET" | "POST" | "PUT" | "DELETE"`.  
  - Returns `Promise<T>` (response body).  
  - On error: read `error.response.data` for `error`, `msg`, or `message`; throw `new Error(message)`.

- **`apiCallWithAuth<T, P, B>(method, url, params?, body?, options?)`**  
  - Same as above but:  
    - Reads token from **localStorage key `"token"`**.  
    - Sends **`Authorization: "Bearer " + token`** (or your backend’s expected format).  
    - If no token, throw before the request.  
  - `method` can include `"PATCH"` if needed.  
  - `options` can include `responseType` for file downloads, etc.

- **`apiCallWithFormData<T, P>(method, url, params?, body?)`** (optional)  
  - For multipart uploads.  
  - Same token as above.  
  - `body: FormData`.  
  - `Content-Type: "multipart/form-data"`.

- Error handling: normalize server errors (e.g. `error`, `msg`, `message`) into one string and **throw `new Error(message)`**. Do not return error payloads as success.

### 3. Types

Create or update **`src/types/auth.ts`** (and any domain types, e.g. `src/types/product.ts`):

- **Request/response types per endpoint**, e.g.:  
  `SendEmailOtpRequest`, `SendEmailOtpResponse`,  
  `VerifyEmailOtpRequest`, `VerifyEmailOtpResponse` (include `token?: string` if login returns it),  
  `GetUserProfileResponse`, `UpdateUserProfileRequest`, `UpdateUserProfileResponse`,  
  `UserProfile`, `BackendSession`, `UserProfileAddress` (e.g. `addressLine`, `city`, `state`, `country`, `pincode`).
- Use these types in the **api layer** and **services** (request body and response generics).

### 4. Auth store (Zustand)

Create or update **`src/store/auth-store.ts`** (or equivalent):

- State: `isLoading`, `error`, `emailSentTo` (for OTP flow), `backendSession: { email, token } | null`, `userProfile: UserProfile | null`, `profileLoading`.
- Helpers: **`getStoredToken()`**, **`setStoredToken(token)`**, **`clearStoredBackendSession()`** — all use localStorage key **`"token"`** (same as in api-actions).
- Single Zustand store; services call `useAuthStore.setState(...)` to update loading/error/session/profile.

### 5. Services (singleton classes)

Create **service** files (e.g. **`src/services/auth-service.ts`**), one per domain (auth, users, products, orders, etc.):

- Each service is a **singleton** (e.g. `getInstance()`).
- Methods:
  - Build URL: **`const url = base_url + endpoints.xyz`** (or with `.replace(":id", id)`).
  - Call **`apiCall`** for public endpoints (e.g. send OTP, verify OTP).  
  - Call **`apiCallWithAuth`** for protected endpoints (e.g. get/update profile, admin-only routes).
  - Use the **types** from `src/types/...` as generics:  
    `apiCall<ResponseType, ParamsType, BodyType>(...)` and `apiCallWithAuth<...>(...)`.
  - Update **auth store** where relevant: e.g. on success set `backendSession`, `userProfile`, clear `error`; on request start set `isLoading`/`profileLoading`; on failure set `error` and rethrow.
- Auth service should expose at least: **`sendEmailOtp`**, **`verifyEmailOtp`**, **`resetOtpState`**, **`setAuthError`**, **`clearBackendSession`**, **`hydrateFromStorage`** (restore token from localStorage into store), **`getUserProfile`**, **`updateUserProfile`** (payload: e.g. `name`, `phoneNumber`, `address` with shape `{ addressLine?, city?, state?, country?, pincode? }`).

### 6. Auth context / app bootstrap

- On app load: call **`authService.hydrateFromStorage()`** so the store has the token if user was previously logged in.
- Provide an **AuthContext** (or equivalent) that:
  - Exposes **user** (e.g. Firebase user or a synthetic “backend user” with `uid: "backend-{email}"`, `email`, `displayName`, etc.), **loading**, **signOut** (clear token, clear store, redirect if needed), and optionally **deleteAccount**.
  - For backend-only login: when **verifyEmailOtp** returns a token, call **`setStoredToken(token)`** and set **`backendSession`** in the store; then treat the user as logged in (e.g. synthetic user from email).
  - After login, optionally call **`getUserProfile()`** and store result in **`userProfile`** in the store so the app can show name, address, etc.
- Route guard: for admin-only routes, check that the user is logged in (and optionally has an admin role if your API provides it); otherwise redirect to login.

### 7. Address shape for API

When sending address to the backend (e.g. profile update), use this shape:

```ts
{
  address: {
    addressLine: "123 Main Street",  // single line; can combine address + address2 from UI
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    pincode: "400001"
  }
}
```

- In types: **`UserProfileAddress`** with optional **`addressLine`, `city`, `state`, `country`, `pincode`**.
- **`UpdateUserProfileRequest`** should have **`address?: UserProfileAddress`**.
- If the UI uses different field names (e.g. `address` + `address2`, `zip`), add a helper that maps to **`addressLine`** and **`pincode`** before calling the API.

### 8. Checklist

- [ ] **environment.ts**: `base_url` + `endpoints` object; URLs = `base_url + endpoints.x`.
- [ ] **api-actions.ts**: `apiCall` (no auth), `apiCallWithAuth` (Bearer token from localStorage `"token"`), optional `apiCallWithFormData`; errors thrown as `Error` with message from API body.
- [ ] **types**: Request/response and domain types used in api and services.
- [ ] **auth-store**: Token get/set/clear + session/profile state; same `"token"` key as api-actions.
- [ ] **auth-service** (and other services): Singleton, use `base_url` + `endpoints`, typed `apiCall`/`apiCallWithAuth`, update store on success/loading/error.
- [ ] **Auth context**: `hydrateFromStorage()` on load; after OTP verify set token and session; expose user, signOut, loading; optional profile fetch after login.
- [ ] **Address**: API payload uses `addressLine`, `city`, `state`, `country`, `pincode`; helper if UI uses different fields.

Implement the above in the admin app so auth, profile, and any admin endpoints follow this same integration structure.

---

## End of prompt

---

## Quick reference: file layout

| Layer        | Path (example)              | Role |
|-------------|-----------------------------|------|
| Environment | `apiActions/environment.ts`  | `base_url`, `endpoints` |
| API         | `apiActions/api-actions.ts` | `apiCall`, `apiCallWithAuth`, optional `apiCallWithFormData` |
| Types       | `types/auth.ts`, etc.        | Request/response and domain types |
| Store       | `store/auth-store.ts`       | Token helpers + Zustand auth state |
| Services    | `services/auth-service.ts`  | Singleton, URLs from env, typed API calls, store updates |
| Context     | `context/AuthContext.tsx`    | Hydrate, user, signOut, loading |
