-- Development schema for Marketspace.
-- Drops and recreates all tables. Run this first, then seed.sql.

DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS listing_photos;
DROP TABLE IF EXISTS listings;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;


CREATE TABLE users (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('seller', 'buyer', 'admin'))
);

CREATE TABLE categories (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE listings (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  seller_id INTEGER NOT NULL REFERENCES users (id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL CHECK (price >= 0),
  type TEXT NOT NULL CHECK (type IN ('product', 'service')),
  category_id INTEGER NOT NULL REFERENCES categories (id),
  stock INTEGER CHECK (stock >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE listing_photos (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  listing_id INTEGER NOT NULL REFERENCES listings (id) ON DELETE CASCADE,
  file_path TEXT NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (listing_id, sort_order)
);

CREATE TABLE comments (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  listing_id INTEGER NOT NULL REFERENCES listings (id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users (id),
  body TEXT NOT NULL CHECK (length(trim(body)) > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE reviews (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  listing_id INTEGER NOT NULL REFERENCES listings (id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users (id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  body TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (listing_id, user_id)
);
