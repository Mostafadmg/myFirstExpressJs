DROP TABLE IF EXISTS listings;
DROP TABLE IF EXISTS categories;


CREATE table categories(
    id text primary key ,
    name text unique not null
);

CREATE table listings(
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price INTEGER NOT NULL CHECK (price >= 0),
    type text NOT NULL CHECK (type IN ('product', 'service')),
    category_id text NOT NULL REFERENCES categories (id),
    stock INTEGER  CHECK (stock >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

