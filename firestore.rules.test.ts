/**
 * Firestore Security Rules Test Suite for Muebles J&L — Taller OS
 * Verifies that all "Dirty Dozen" payloads return PERMISSION_DENIED.
 */

export interface DirtyDozenTestCase {
  id: number;
  name: string;
  collection: string;
  docId: string;
  operation: 'create' | 'update' | 'get' | 'list';
  auth: { uid: string; email_verified: boolean } | null;
  payload?: Record<string, unknown>;
  expectedResult: 'PERMISSION_DENIED';
}

export const DIRTY_DOZEN_TESTS: DirtyDozenTestCase[] = [
  {
    id: 1,
    name: 'Unauthenticated Write',
    collection: 'cuts',
    docId: 'cut-1',
    operation: 'create',
    auth: null,
    payload: { ownerId: 'user-1', name: 'Tapa', lengthMm: 1200, widthMm: 600, quantity: 1 },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 2,
    name: 'Unverified Email Spoof',
    collection: 'orders',
    docId: 'ord-1',
    operation: 'create',
    auth: { uid: 'user-1', email_verified: false },
    payload: { ownerId: 'user-1', code: '#PED-1084', client: 'Rossi' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 3,
    name: 'Identity Spoofing on Create',
    collection: 'cuts',
    docId: 'cut-1',
    operation: 'create',
    auth: { uid: 'user-1', email_verified: true },
    payload: {
      ownerId: 'victim-uid',
      name: 'Tapa',
      lengthMm: 1200,
      widthMm: 600,
      quantity: 1,
      edgeSpec: '4L',
      respectGrain: true,
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 4,
    name: 'Shadow / Ghost Field Injection on Create',
    collection: 'inventory',
    docId: 'item-1',
    operation: 'create',
    auth: { uid: 'user-1', email_verified: true },
    payload: {
      ownerId: 'user-1',
      title: 'Placa',
      isAdmin: true,
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 5,
    name: 'ID Poisoning Attack',
    collection: 'cuts',
    docId: 'invalid$id!@#',
    operation: 'create',
    auth: { uid: 'user-1', email_verified: true },
    payload: { ownerId: 'user-1', name: 'Tapa' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 6,
    name: 'Oversized String Denial-of-Wallet',
    collection: 'cuts',
    docId: 'cut-1',
    operation: 'create',
    auth: { uid: 'user-1', email_verified: true },
    payload: {
      ownerId: 'user-1',
      name: 'A'.repeat(500),
      lengthMm: 1200,
      widthMm: 600,
      quantity: 1,
      edgeSpec: '4L',
      respectGrain: true,
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 7,
    name: 'Invalid Enum Value',
    collection: 'orders',
    docId: 'ord-1',
    operation: 'create',
    auth: { uid: 'user-1', email_verified: true },
    payload: {
      ownerId: 'user-1',
      status: 'hacked-status',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 8,
    name: 'Client-Forged Timestamp on Create',
    collection: 'movements',
    docId: 'mov-1',
    operation: 'create',
    auth: { uid: 'user-1', email_verified: true },
    payload: {
      ownerId: 'user-1',
      createdAt: '2000-01-01T00:00:00Z',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 9,
    name: 'Owner Hijack on Update',
    collection: 'orders',
    docId: 'ord-1',
    operation: 'update',
    auth: { uid: 'user-1', email_verified: true },
    payload: {
      ownerId: 'attacker-uid',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 10,
    name: 'Immutable createdAt Tampering on Update',
    collection: 'inventory',
    docId: 'item-1',
    operation: 'update',
    auth: { uid: 'user-1', email_verified: true },
    payload: {
      createdAt: '2099-01-01T00:00:00Z',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 11,
    name: 'Unauthorized Field Mutation on Update',
    collection: 'orders',
    docId: 'ord-1',
    operation: 'update',
    auth: { uid: 'user-1', email_verified: true },
    payload: {
      shadowPrivilege: 'superadmin',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 12,
    name: 'Cross-Tenant Document Read',
    collection: 'orders',
    docId: 'victim-order-1',
    operation: 'get',
    auth: { uid: 'user-1', email_verified: true },
    expectedResult: 'PERMISSION_DENIED',
  },
];
