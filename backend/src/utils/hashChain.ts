// Cryptographic SHA-256 Merkle Hash Chain for Immutable Tamper-Evident Auditing
import crypto from 'crypto';
import { AuditLogEntry, UserRole } from '../types/index.js';

export function calculateEntryHash(
  prevHash: string,
  timestamp: string,
  actor: string,
  action: string,
  entityType: string,
  entityId: string,
  details: string
): string {
  const payload = `${prevHash}|${timestamp}|${actor}|${action}|${entityType}|${entityId}|${details}`;
  return crypto.createHash('sha256').update(payload).digest('hex');
}

export function createAuditEntry(
  actor: string,
  role: UserRole,
  action: string,
  entityType: string,
  entityId: string,
  details: string,
  lastEntry?: AuditLogEntry,
  ipAddress: string = '127.0.0.1'
): AuditLogEntry {
  const timestamp = new Date().toISOString();
  const prevHash = lastEntry ? lastEntry.sha256Hash : '0000000000000000000000000000000000000000000000000000000000000000';
  const sha256Hash = calculateEntryHash(prevHash, timestamp, actor, action, entityType, entityId, details);

  return {
    id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    actor,
    role,
    action,
    entityType,
    entityId,
    timestamp,
    ipAddress,
    sha256Hash,
    prevHash,
    details,
  };
}

export function verifyChainIntegrity(entries: AuditLogEntry[]): {
  valid: boolean;
  brokenIndex?: number;
  totalEntries: number;
  genesisHash: string;
  headHash: string;
} {
  if (entries.length === 0) {
    return {
      valid: true,
      totalEntries: 0,
      genesisHash: 'EMPTY',
      headHash: 'EMPTY',
    };
  }

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const expectedPrev = i === 0 ? '0000000000000000000000000000000000000000000000000000000000000000' : entries[i - 1].sha256Hash;

    if (entry.prevHash !== expectedPrev) {
      return {
        valid: false,
        brokenIndex: i,
        totalEntries: entries.length,
        genesisHash: entries[0].sha256Hash,
        headHash: entries[entries.length - 1].sha256Hash,
      };
    }

    const recomputed = calculateEntryHash(
      entry.prevHash,
      entry.timestamp,
      entry.actor,
      entry.action,
      entry.entityType,
      entry.entityId,
      entry.details
    );

    if (recomputed !== entry.sha256Hash) {
      return {
        valid: false,
        brokenIndex: i,
        totalEntries: entries.length,
        genesisHash: entries[0].sha256Hash,
        headHash: entries[entries.length - 1].sha256Hash,
      };
    }
  }

  return {
    valid: true,
    totalEntries: entries.length,
    genesisHash: entries[0].sha256Hash,
    headHash: entries[entries.length - 1].sha256Hash,
  };
}
