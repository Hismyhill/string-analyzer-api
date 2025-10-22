# 🧠 String Analyzer API — HNGXIII Backend Stage 1 Task

This project is a **RESTful API** built with **Node.js and Express** that analyzes strings, computes their properties, and stores the results in-memory.

It supports **CRUD operations**, **query filtering**, and **natural language-based filtering**.

---

## 🚀 Features

- Analyze and store strings
- Check if a string is a palindrome
- Count words and unique characters
- Generate SHA-256 hash for identification
- Filter stored strings with query parameters
- Use natural language (e.g. “palindromic strings containing the letter a”)
- Delete stored strings
- In-memory storage (no database yet)

---

## 🧩 Endpoints

## 📖 API Endpoints

### 1️⃣ Create/Analyze String

### 1. Create/Analyze a String

**POST** `/strings`
`POST /strings`

Analyzes a new string and stores its properties.

**Request Body**

```json
{
  "value": "madam"
}
```

**Response (201 Created)**

```json
{
  "id": "sha256_hash_value",
  "value": "madam",
  "properties": {
    "length": 5,
    "is_palindrome": true,
    "unique_characters": 3,
    "word_count": 1,
    "sha256_hash": "abc123...",
    "character_frequency_map": {
      "m": 2,
      "a": 2,
      "d": 1
    }
  },
  "created_at": "2025-08-27T10:00:00Z"
}
```

### 2️⃣ Get Specific String

**GET ** `/strings/{string_value}`

**Response (200 OK)**

```json
{
  "id": "sha256_hash_value",
  "value": "madam",
  "properties": {
    "length": 5,
    "is_palindrome": true,
    "unique_characters": 3,
    "word_count": 1,
    "sha256_hash": "abc123...",
    "character_frequency_map": {
      "m": 2,
      "a": 2,
      "d": 1
    }
  },
  "created_at": "2025-08-27T10:00:00Z"
}
```

### 3️⃣ Get All Strings (with optional filters)

**GET ** `/strings?is_palindrome=true&min_length=5&max_length=20&word_count=2&contains_character=a`

**Response (200 OK)**

```json
{
  "data": [ /* filtered strings */ ],
  "count": 2,
  "filters_applied": { ... }
}
```

### 4️⃣ Natural Language Filtering

**GET ** `/strings/filter-by-natural-language?query=all%20single%20word%20palindromic%20strings`

**Response (200 Created)**

```json
{
  "data": [ /* filtered strings */ ],
  "count": 2,
  "filters_applied": { ... }
}
```

### 5️⃣ Delete String

**DELETE ** `/strings/{string_value}`

**Response (204 OK)**

```json
{}
```

## ⚙️ Setup & Installation

### 1. Clone this repository

```bash
git clone https://github.com/Hismyhill/string-analyzer-api.git

```

```bash
cd string-analyzer-api
```

### 2. Install dependencies

```bash
  npm install

```

### 3. Start the server

```bash
   npm start
```

### Your server will start at:

```arduino
http://localhost:3000
```

# 🧑‍💻 Author

###\*\*\* Name: Ismaeel Owolabi

### Email: owolabismaeel@gmail.com

### Stack: Node.js / Express

## 🧪 Notes

### Data is stored in-memory (resets when the server restarts).

### No external database required.

### Natural language interpretation supports flexible phrases such as:

### “single word palindromic strings”

### “strings longer than 10 characters”

### “strings containing the letter a”

### “strings with at least 2 words”

### For production or persistent storage, a database like MongoDB or PostgreSQL can be added later.

# Thank you
