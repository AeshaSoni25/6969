"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateEntryHash = calculateEntryHash;
exports.createAuditEntry = createAuditEntry;
exports.verifyChainIntegrity = verifyChainIntegrity;
// Cryptographic SHA-256 Merkle Hash Chain for Immutable Tamper-Evident Auditing
const crypto_1 = __importDefault(require("crypto"));
function calculateEntryHash(prevHash, timestamp, actor, action, entityType, entityId, details) {
    const payload = `${prevHash}|${timestamp}|${actor}|${action}|${entityType}|${entityId}|${details}`;
    return crypto_1.default.createHash('sha256').update(payload).digest('hex');
}
function createAuditEntry(actor, role, action, entityType, entityId, details, lastEntry, ipAddress = '127.0.0.1') {
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
function verifyChainIntegrity(entries) {
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
        const recomputed = calculateEntryHash(entry.prevHash, entry.timestamp, entry.actor, entry.action, entry.entityType, entry.entityId, entry.details);
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
