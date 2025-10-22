import crypto from "crypto";

/**
 * Analyze a given string and return its computed properties
 * @param {string} value - The string to analyze
 * @returns {object} properties - Computed properties of the string
 */
export function analyzeString(value) {
  if (typeof value !== "string") {
    throw new Error("Value must be a string");
  }

  // Trim whitespace
  const trimmedValue = value.trim();

  // Compute properties
  const length = trimmedValue.length;

  const reversed = trimmedValue.split("").reverse().join("");
  const is_palindrome = trimmedValue.toLowerCase() === reversed.toLowerCase();

  const unique_characters = new Set(trimmedValue).size;

  const word_count = trimmedValue.split(/\s+/).filter(Boolean).length;

  const sha256_hash = crypto
    .createHash("sha256")
    .update(trimmedValue)
    .digest("hex");

  // Character frequency map
  const character_frequency_map = {};
  for (const char of trimmedValue) {
    character_frequency_map[char] = (character_frequency_map[char] || 0) + 1;
  }

  return {
    length,
    is_palindrome,
    unique_characters,
    word_count,
    sha256_hash,
    character_frequency_map,
  };
}
