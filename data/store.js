// Simple in-memory storage
const store = new Map();

/**
 * Save analyzed string data
 * @param {string} hash - The SHA-256 hash as the unique ID
 * @param {object} data - The analyzed string data
 */
export function saveString(hash, data) {
  store.set(hash, data);
}

/**
 * Get analyzed string data by its hash
 * @param {string} hash
 * @returns {object|null}
 */
export function getStringByHash(hash) {
  return store.get(hash) || null;
}

/**
 * Get all stored strings
 * @returns {Array}
 */
export function getAllStrings() {
  return Array.from(store.values());
}

/**
 * Check if a string already exists by hash
 * @param {string} hash
 * @returns {boolean}
 */
export function stringExists(hash) {
  return store.has(hash);
}

/**
 * Delete a string from the store by hash
 * @param {string} hash
 * @returns {boolean}
 */
export function deleteString(hash) {
  return store.delete(hash);
}
