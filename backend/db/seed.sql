-- Development sample data for Marketspace.
-- Run schema.sql first, then run this whole file.

INSERT INTO users (name, role)
VALUES
  ('Mostafa Adel', 'seller'),
  ('Nora Hale', 'seller'),
  ('Lina Ortega', 'buyer'),
  ('Idris Cole', 'admin'),
  ('Amina Yusuf', 'buyer'),
  ('Jules Martin', 'buyer'),
  ('Sana Rahman', 'buyer'),
  ('Owen Price', 'buyer')
ON CONFLICT (name) DO UPDATE
SET role = EXCLUDED.role;

INSERT INTO categories (slug, name)
VALUES
  ('home', 'Home'),
  ('audio', 'Audio'),
  ('wear', 'Wear'),
  ('plants', 'Plants'),
  ('workshop', 'Workshops')
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name;

TRUNCATE TABLE comments, listing_photos, listings RESTART IDENTITY;

INSERT INTO listings (seller_id, title, description, price, type, category_id, stock)
SELECT
  seller.id,
  sample.title,
  sample.description,
  sample.price,
  sample.type,
  category.id,
  sample.stock
FROM (VALUES
  ('Mostafa Adel', 'Walnut headphone stand', 'A solid walnut cradle that keeps a pair of headphones off the desk.', 4800, 'product', 'home', 6),
  ('Mostafa Adel', 'Studio headphones', 'Closed-back pair for late mixing sessions. Comes with a spare cable.', 18900, 'product', 'audio', 4),
  ('Nora Hale', 'Linen field jacket', 'Undyed linen, two patch pockets, cut to wear over a shirt.', 22000, 'product', 'wear', 3),
  ('Nora Hale', 'Ceramic pour-over set', 'Speckled stoneware dripper and a matching 300ml server.', 6400, 'product', 'home', 8),
  ('Mostafa Adel', 'Leather weekender', 'Full-grain leather, brass hardware, fits a weekend and a book.', 34000, 'product', 'wear', 2),
  ('Nora Hale', 'Monstera in a clay pot', 'An established plant in a hand-thrown pot. Local pickup.', 7200, 'product', 'plants', 5),
  ('Mostafa Adel', 'Field watch', 'Brushed steel, leather strap, a quiet face. Ships with a travel pouch.', 27500, 'product', 'wear', 7),
  ('Mostafa Adel', 'Court sneakers', 'Leather upper, gum sole, made to be worn in, not kept in a box.', 12800, 'product', 'wear', 9),
  ('Nora Hale', 'Oak desk lamp', 'A weighted base and a linen shade. Warm bulb included.', 9600, 'product', 'home', 4),
  ('Mostafa Adel', 'Saturday knife sharpening', 'Bring up to four knives. An hour at the bench, edges you can trust.', 4500, 'service', 'workshop', NULL),
  ('Nora Hale', 'Living-room styling hour', 'We rearrange what you already own. One room, one hour, a short list of what to add later.', 8000, 'service', 'workshop', NULL),
  ('Mostafa Adel', 'Film camera lesson', 'Load a roll, meter by eye, and leave with twelve frames you meant.', 6000, 'service', 'workshop', NULL),
  ('Nora Hale', 'Clay bowl throwing', 'A wheel, a lump of stoneware, and a bowl you take home to dry.', 5500, 'service', 'workshop', NULL),
  ('Mostafa Adel', 'Travel speaker', 'Small enough for a bag, loud enough for a kitchen. USB-C.', 7900, 'product', 'audio', 11)
) AS sample(seller_name, title, description, price, type, category_slug, stock)
JOIN users AS seller ON seller.name = sample.seller_name
JOIN categories AS category ON category.slug = sample.category_slug;

INSERT INTO listing_photos (listing_id, file_path, sort_order)
SELECT listing.id, sample.file_path, sample.sort_order
FROM (VALUES
  ('Walnut headphone stand', 'listings/walnut-headphone-stand-01.jpg', 0),
  ('Walnut headphone stand', 'listings/walnut-headphone-stand-02.jpg', 1),
  ('Studio headphones', 'listings/studio-headphones-01.jpg', 0),
  ('Studio headphones', 'listings/studio-headphones-02.jpg', 1),
  ('Linen field jacket', 'listings/linen-field-jacket-01.jpg', 0),
  ('Linen field jacket', 'listings/linen-field-jacket-02.jpg', 1),
  ('Ceramic pour-over set', 'listings/ceramic-pour-over-set-01.jpg', 0),
  ('Ceramic pour-over set', 'listings/ceramic-pour-over-set-02.jpg', 1),
  ('Leather weekender', 'listings/leather-weekender-01.jpg', 0),
  ('Leather weekender', 'listings/leather-weekender-02.jpg', 1),
  ('Monstera in a clay pot', 'listings/monstera-in-a-clay-pot-01.jpg', 0),
  ('Monstera in a clay pot', 'listings/monstera-in-a-clay-pot-02.jpg', 1),
  ('Field watch', 'listings/field-watch-01.jpg', 0),
  ('Field watch', 'listings/field-watch-02.jpg', 1),
  ('Court sneakers', 'listings/court-sneakers-01.jpg', 0),
  ('Court sneakers', 'listings/court-sneakers-02.jpg', 1),
  ('Oak desk lamp', 'listings/oak-desk-lamp-01.jpg', 0),
  ('Oak desk lamp', 'listings/oak-desk-lamp-02.jpg', 1),
  ('Saturday knife sharpening', 'listings/saturday-knife-sharpening-01.jpg', 0),
  ('Saturday knife sharpening', 'listings/saturday-knife-sharpening-02.jpg', 1),
  ('Living-room styling hour', 'listings/living-room-styling-hour-01.jpg', 0),
  ('Living-room styling hour', 'listings/living-room-styling-hour-02.jpg', 1),
  ('Film camera lesson', 'listings/film-camera-lesson-01.jpg', 0),
  ('Film camera lesson', 'listings/film-camera-lesson-02.jpg', 1),
  ('Clay bowl throwing', 'listings/clay-bowl-throwing-01.jpg', 0),
  ('Clay bowl throwing', 'listings/clay-bowl-throwing-02.jpg', 1),
  ('Travel speaker', 'listings/travel-speaker-01.jpg', 0),
  ('Travel speaker', 'listings/travel-speaker-02.jpg', 1)
) AS sample(listing_title, file_path, sort_order)
JOIN listings AS listing ON listing.title = sample.listing_title;

INSERT INTO comments (listing_id, user_id, body)
SELECT listing.id, author.id, sample.body
FROM (VALUES
  ('Walnut headphone stand', 'Lina Ortega', 'The walnut grain looks beautiful on my desk, and the stand feels sturdy.'),
  ('Walnut headphone stand', 'Amina Yusuf', 'Would this fit larger over-ear headphones? The base looks nicely balanced.'),
  ('Studio headphones', 'Jules Martin', 'The closed-back design is great for recording at home.'),
  ('Studio headphones', 'Lina Ortega', 'How long is the included cable? I need enough room to move around.'),
  ('Linen field jacket', 'Sana Rahman', 'The natural linen colour works with almost everything I own.'),
  ('Linen field jacket', 'Amina Yusuf', 'Is the fit relaxed enough for a light jumper underneath?'),
  ('Ceramic pour-over set', 'Lina Ortega', 'The matching dripper and server make a lovely morning coffee set.'),
  ('Ceramic pour-over set', 'Owen Price', 'Does the dripper fit a standard paper filter?'),
  ('Leather weekender', 'Idris Cole', 'The brass details and leather look like they will age really well.'),
  ('Leather weekender', 'Jules Martin', 'Would it fit under an airline seat as a personal item?'),
  ('Monstera in a clay pot', 'Sana Rahman', 'The clay pot is a great touch. How tall is the plant including the pot?'),
  ('Monstera in a clay pot', 'Amina Yusuf', 'I like that this is available for local pickup.'),
  ('Field watch', 'Owen Price', 'The simple dial is exactly what I have been looking for.'),
  ('Field watch', 'Idris Cole', 'Does the travel pouch come with the watch?'),
  ('Court sneakers', 'Lina Ortega', 'The gum sole and clean shape look great together.'),
  ('Court sneakers', 'Sana Rahman', 'Do these fit true to size?'),
  ('Oak desk lamp', 'Jules Martin', 'Would the shade work with a warm white bulb?'),
  ('Oak desk lamp', 'Amina Yusuf', 'This would be perfect on a bedside table.'),
  ('Saturday knife sharpening', 'Lina Ortega', 'Can I bring kitchen knives with different blade lengths?'),
  ('Saturday knife sharpening', 'Jules Martin', 'I have four knives ready. Should I book a time in advance?'),
  ('Living-room styling hour', 'Amina Yusuf', 'I like the idea of making better use of the furniture I already have.'),
  ('Living-room styling hour', 'Sana Rahman', 'Can we focus on a small living room and storage layout?'),
  ('Film camera lesson', 'Idris Cole', 'I have never loaded film before. Is the lesson suitable for a beginner?'),
  ('Film camera lesson', 'Owen Price', 'Do I need to bring my own camera?'),
  ('Clay bowl throwing', 'Lina Ortega', 'This sounds like a fun first pottery class.'),
  ('Clay bowl throwing', 'Jules Martin', 'How long does the session usually take?'),
  ('Travel speaker', 'Sana Rahman', 'USB-C charging is handy. How many hours does the battery last?'),
  ('Travel speaker', 'Amina Yusuf', 'Small enough for a bag but still loud enough for the kitchen sounds ideal.')
) AS sample(listing_title, author_name, body)
JOIN listings AS listing ON listing.title = sample.listing_title
JOIN users AS author ON author.name = sample.author_name;
