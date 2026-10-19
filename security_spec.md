# Security Specification — Muebles J&L (Taller OS)

## 1. Data Invariants

1. **Identity & Ownership Invariant (`ownerId`)**:
   - Every document in `/cuts/{cutId}`, `/orders/{orderId}`, `/inventory/{itemId}`, `/movements/{movementId}`, and `/catalogMeta/{modelId}` MUST belong to the authenticated, email-verified user (`ownerId == request.auth.uid`).
   - `ownerId` and `createdAt` are immutable after creation (`incoming().ownerId == existing().ownerId && incoming().createdAt == existing().createdAt`).
2. **Email Verification Invariant**:
   - All read and write operations require `request.auth != null && request.auth.token.email_verified == true`.
3. **Temporal Integrity Invariant**:
   - `createdAt` MUST equal `request.time` on creation.
   - `updatedAt` MUST equal `request.time` on both creation and update.
4. **Schema & Volumetric Bounds Invariant**:
   - Every document write (`create` and `update`) is validated through a dedicated `isValid[Entity](data)` helper enforcing exact key allowlists (`hasAll` + `hasOnly`), types, enums, regexes, and string/number boundaries matching `firebase-blueprint.json`.
5. **Query Isolation Invariant**:
   - `allow list` rules explicitly enforce `resource.data.ownerId == request.auth.uid` so queries cannot read documents belonging to other users.

## 2. The "Dirty Dozen" Payloads

1. **Unauthenticated Write**: Creating a cut in `/cuts/cut-1` with `auth = null`.
2. **Unverified Email Spoof**: Creating an order in `/orders/ord-1` with `email_verified = false`.
3. **Identity Spoofing on Create**: Creating `/cuts/cut-1` where `ownerId` is `"victim-uid"` instead of `request.auth.uid`.
4. **Shadow / Ghost Field Injection on Create**: Creating `/inventory/item-1` with an extra undeclared property `"isAdmin": true`.
5. **ID Poisoning Attack**: Creating `/cuts/invalid$id!@#` with non-alphanumeric path characters.
6. **Oversized String Denial-of-Wallet**: Creating `/cuts/cut-1` with `name` of 500 characters (exceeding `maxLength: 120`).
7. **Invalid Enum Value**: Creating `/orders/ord-1` with `status: "hacked-status"` outside `["en-proceso", "terminado", "embalado", "entregado"]`.
8. **Client-Forged Timestamp on Create**: Creating `/movements/mov-1` with a past or future `createdAt` not matching `request.time`.
9. **Owner Hijack on Update**: Updating `/orders/ord-1` to change `ownerId` to another UID.
10. **Immutable `createdAt` Tampering on Update**: Updating `/inventory/item-1` while modifying `createdAt`.
11. **Unauthorized Field Mutation on Update**: Updating `/orders/ord-1` with an unallowed key not in `affectedKeys().hasOnly(...)`.
12. **Cross-Tenant List Scraping**: Listing `/orders` without filtering by `ownerId == request.auth.uid` or reading another user's document.
