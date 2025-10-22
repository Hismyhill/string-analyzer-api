import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { analyzeString } from "./utils/analyzer.js";
import {
  saveString,
  getStringByHash,
  getAllStrings,
  stringExists,
  deleteString,
} from "./data/store.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

const strings = [];

/**
 * @route POST /strings
 * @desc Analyze and store a string
 */
app.post("/strings", (req, res) => {
  const { value } = req.body;

  if (!value) {
    return res.status(400).json({ error: 'Missing "value" field' });
  }

  if (typeof value !== "string") {
    return res.status(422).json({ error: '"value" must be a string' });
  }

  try {
    const properties = analyzeString(value);
    const { sha256_hash } = properties;

    if (stringExists(sha256_hash)) {
      return res.status(409).json({ error: "String already exists" });
    }

    const data = {
      id: sha256_hash,
      value,
      properties,
      created_at: new Date().toISOString(),
    };

    strings.push(data);
    saveString(sha256_hash, data);
    return res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * @route GET /strings
 * @desc Get all strings with optional filtering
 */
app.get("/strings", (req, res) => {
  const {
    is_palindrome,
    min_length,
    max_length,
    word_count,
    contains_character,
  } = req.query;

  let data = getAllStrings();

  // Apply filters
  if (is_palindrome !== undefined) {
    data = data.filter(
      (s) => s.properties.is_palindrome === (is_palindrome === "true")
    );
  }

  if (min_length) {
    data = data.filter((s) => s.properties.length >= Number(min_length));
  }

  if (max_length) {
    data = data.filter((s) => s.properties.length <= Number(max_length));
  }

  if (word_count) {
    data = data.filter((s) => s.properties.word_count === Number(word_count));
  }

  if (contains_character) {
    data = data.filter((s) => s.value.includes(contains_character));
  }

  return res.status(200).json({
    data,
    count: data.length,
    filters_applied: {
      is_palindrome,
      min_length,
      max_length,
      word_count,
      contains_character,
    },
  });
});

/**
 * @route GET /strings/filter-by-natural-language
 * @desc Filter strings based on a simple natural language query
 */
app.get("/strings/filter-by-natural-language", (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: "Missing query parameter" });

  const lower = query.toLowerCase();
  const filters = {};

  // Palindrome detection
  if (lower.includes("palindromic")) filters.is_palindrome = true;

  // Word count conditions
  if (lower.includes("single word")) filters.word_count = 1;

  const minWordMatch = lower.match(/at least (\d+) words?/);
  if (minWordMatch) filters.min_word_count = parseInt(minWordMatch[1]);

  const maxWordMatch = lower.match(/at most (\d+) words?/);
  if (maxWordMatch) filters.max_word_count = parseInt(maxWordMatch[1]);

  // Length conditions
  const longerMatch = lower.match(/longer than (\d+) characters?/);
  if (longerMatch) filters.min_length = parseInt(longerMatch[1]) + 1;

  const shorterMatch = lower.match(/shorter than (\d+) characters?/);
  if (shorterMatch) filters.max_length = parseInt(shorterMatch[1]) - 1;

  // Contains character
  const containsMatch = lower.match(/containing the letter (\w)/);
  if (containsMatch) filters.contains_character = containsMatch[1];

  if (Object.keys(filters).length === 0)
    return res
      .status(400)
      .json({ error: "Unable to parse natural language query" });

  // Apply filters
  let results = strings;

  if (filters.is_palindrome !== undefined)
    results = results.filter(
      (s) => s.properties.is_palindrome === filters.is_palindrome
    );

  if (filters.word_count !== undefined)
    results = results.filter(
      (s) => s.properties.word_count === filters.word_count
    );

  if (filters.min_word_count !== undefined)
    results = results.filter(
      (s) => s.properties.word_count >= filters.min_word_count
    );

  if (filters.max_word_count !== undefined)
    results = results.filter(
      (s) => s.properties.word_count <= filters.max_word_count
    );

  if (filters.min_length !== undefined)
    results = results.filter((s) => s.properties.length >= filters.min_length);

  if (filters.max_length !== undefined)
    results = results.filter((s) => s.properties.length <= filters.max_length);

  if (filters.contains_character !== undefined)
    results = results.filter((s) =>
      s.value.includes(filters.contains_character)
    );

  return res.json({
    data: results,
    count: results.length,
    interpreted_query: {
      original: query,
      parsed_filters: filters,
    },
  });
});

/**
 * @route GET /strings/:value
 * @desc Retrieve a specific analyzed string by its raw value
 */
app.get("/strings/:value", (req, res) => {
  const { value } = req.params;
  const properties = analyzeString(value);
  const { sha256_hash } = properties;

  const data = getStringByHash(sha256_hash);
  if (!data) {
    return res.status(404).json({ error: "String not found" });
  }

  return res.status(200).json(data);
});

/**
 * @route DELETE /strings/:value
 * @desc Delete a string by its raw value
 */
app.delete("/strings/:value", (req, res) => {
  const { value } = req.params;
  const properties = analyzeString(value);
  const { sha256_hash } = properties;

  const deleted = deleteString(sha256_hash);
  if (!deleted) {
    return res.status(404).json({ error: "String not found" });
  }

  const index = strings.findIndex((s) => s.value === value);
  // Remove from array
  strings.splice(index, 1);

  return res.status(204).send();
});

/**
 * Default route
 */
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to String Analyzer API 🚀",
    endpoints: {
      analyze: "POST /strings",
      get_one: "GET /strings/:value",
      get_all: "GET /strings",
      delete: "DELETE /strings/:value",
    },
  });
});

app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
