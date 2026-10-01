// In-browser stand-in for the Express API. Every path matches a comment in
// src/api/*.js. Nothing here is a server — flip USE_PLACEHOLDER_API off in
// config.js when your own backend is answering those routes.

const KEY = "marketspace_placeholder_v1";

const photo = (id, extra = "") =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80${extra}`;

function seed() {
  const users = [
    {
      id: "u1",
      name: "Mostafa Adel",
      email: "mostafa@marketspace.test",
      password: "password",
      role: "seller",
      bio: "I make small-batch goods and teach Saturday workshops.",
      location: "Cairo",
      avatarUrl: photo("photo-1500648767791-00dcc994a43e"),
      coverPhotoUrl: photo("photo-1441986300917-64674bd600d8"),
    },
    {
      id: "u2",
      name: "Lina Ortega",
      email: "lina@marketspace.test",
      password: "password",
      role: "buyer",
      bio: "Collecting objects that will still look right in ten years.",
      location: "Lisbon",
      avatarUrl: photo("photo-1494790108377-be9c29b29330"),
      coverPhotoUrl: photo("photo-1500534314209-a25ddb2bd429"),
    },
    {
      id: "u3",
      name: "Idris Cole",
      email: "admin@marketspace.test",
      password: "password",
      role: "admin",
      bio: "Keeps the floor honest.",
      location: "London",
      avatarUrl: photo("photo-1507003211169-0a1dd7228f2d"),
      coverPhotoUrl: photo("photo-1449247709967-d4461a6a6103"),
    },
    {
      id: "u4",
      name: "Nora Hale",
      email: "nora@marketspace.test",
      password: "password",
      role: "seller",
      bio: "Ceramics, slow mornings, and one-hour lessons.",
      location: "Portland",
      avatarUrl: photo("photo-1438761681033-6461ffad8d80"),
      coverPhotoUrl: photo("photo-1519710164239-da123dc03ef4"),
    },
  ];

  const categories = [
    { id: "home", name: "Home" },
    { id: "audio", name: "Audio" },
    { id: "wear", name: "Wear" },
    { id: "plants", name: "Plants" },
    { id: "workshop", name: "Workshops" },
  ];

  const listings = [
    item("l1", "u1", "Walnut headphone stand", "A solid walnut cradle that keeps a pair of headphones off the desk.", 4800, "home", "Home", "product", 6, 4.8, ["photo-1526170375885-4d8ecf77b99f", "photo-1505740420928-5e560c06d30e"]),
    item("l2", "u1", "Studio headphones", "Closed-back pair for late mixing sessions. Comes with a spare cable.", 18900, "audio", "Audio", "product", 4, 4.6, ["photo-1505740420928-5e560c06d30e", "photo-1484704849700-f032a568e944"]),
    item("l3", "u4", "Linen field jacket", "Undyed linen, two patch pockets, cut to wear over a shirt.", 22000, "wear", "Wear", "product", 3, 4.9, ["photo-1521572163474-6864f9cf17ab", "photo-1489987707025-afc232f7ea0f"]),
    item("l4", "u4", "Ceramic pour-over set", "Speckled stoneware dripper and a matching 300ml server.", 6400, "home", "Home", "product", 8, 4.7, ["photo-1514228742587-6b1558fcca3d", "photo-1442512595331-e89e73853f31"]),
    item("l5", "u1", "Leather weekender", "Full-grain leather, brass hardware, fits a weekend and a book.", 34000, "wear", "Wear", "product", 2, 4.4, ["photo-1547949003-9792a18a2601", "photo-1473188588951-666fce8e7c68"]),
    item("l6", "u4", "Monstera in a clay pot", "A established plant in a hand-thrown pot. Local pickup.", 7200, "plants", "Plants", "product", 5, 4.5, ["photo-1485955900006-10f4d324d411", "photo-1463320726281-696a485928c7"]),
    item("l7", "u1", "Field watch", "Brushed steel, leather strap, a quiet face. Ships with a travel pouch.", 27500, "wear", "Wear", "product", 7, 4.3, ["photo-1523275335684-37898b6baf30", "photo-1524805444758-089113d48a6d"]),
    item("l8", "u1", "Court sneakers", "Leather upper, gum sole, made to be worn in, not kept in a box.", 12800, "wear", "Wear", "product", 9, 4.2, ["photo-1542291026-7eec264c27ff", "photo-1491553895911-0055eca6402d"]),
    item("l9", "u4", "Oak desk lamp", "A weighted base and a linen shade. Warm bulb included.", 9600, "home", "Home", "product", 4, 4.8, ["photo-1507473885765-e6ed057f782c", "photo-1513506003901-1e6a229e2d15"]),
    item("l10", "u1", "Saturday knife sharpening", "Bring up to four knives. An hour at the bench, edges you can trust.", 4500, "workshop", "Workshops", "service", null, 5, ["photo-1452860606245-08befc0ff44b", "photo-1414235077428-338989a2e8c0"]),
    item("l11", "u4", "Living-room styling hour", "We rearrange what you already own. One room, one hour, a short list of what to add later.", 8000, "workshop", "Workshops", "service", null, 4.9, ["photo-1519710164239-da123dc03ef4", "photo-1493663284031-b7e3aefcae8e"]),
    item("l12", "u1", "Film camera lesson", "Load a roll, meter by eye, and leave with twelve frames you meant.", 6000, "workshop", "Workshops", "service", null, 4.7, ["photo-1452780212940-6f5c0d14d848", "photo-1495121553079-4c61bcce1894"]),
    item("l13", "u4", "Clay bowl throwing", "A wheel, a lump of stoneware, and a bowl you take home to dry.", 5500, "workshop", "Workshops", "service", null, 4.6, ["photo-1565193566173-7a0ee3dbe261", "photo-1610701596007-11502861dcfa"]),
    item("l14", "u1", "Travel speaker", "Small enough for a bag, loud enough for a kitchen. USB-C.", 7900, "audio", "Audio", "product", 11, 4.1, ["photo-1608043152269-423dbba4e7e1", "photo-1545454675-3531b543be5d"]),
  ];

  return {
    users,
    categories,
    listings,
    reviews: [
      { id: "r1", listingId: "l1", rating: 5, comment: "Sits exactly where I wanted it. The grain is the whole point." },
      { id: "r2", listingId: "l1", rating: 4, comment: "Heavier than the photo suggests, in a good way." },
      { id: "r3", listingId: "l4", rating: 5, comment: "Coffee tastes the same. The table looks better." },
      { id: "r4", listingId: "l10", rating: 5, comment: "Left with four knives that actually cut tomatoes." },
    ],
    comments: [
      { id: "c1", listingId: "l1", text: "Does this fit a pair of HD 600s?" },
      { id: "c2", listingId: "l1", text: "Yes — the cradle is wide enough." },
      { id: "c3", listingId: "l6", text: "How tall is the plant, pot included?" },
    ],
    carts: {
      u2: [{ listingId: "l4", quantity: 1 }],
    },
    orders: [
      {
        id: "o1",
        userId: "u2",
        status: "pending",
        createdAt: "2026-09-18T14:10:00.000Z",
        totalInCents: 7900,
        items: [{ listingId: "l14", title: "Travel speaker", quantity: 1, price: 7900 }],
      },
      {
        id: "o2",
        userId: "u2",
        status: "shipped",
        createdAt: "2026-09-02T09:00:00.000Z",
        totalInCents: 4800,
        items: [{ listingId: "l1", title: "Walnut headphone stand", quantity: 1, price: 4800 }],
      },
    ],
    bookings: [
      {
        id: "b1",
        userId: "u2",
        listingId: "l10",
        listingTitle: "Saturday knife sharpening",
        start: "2026-09-26T09:00:00.000Z",
        end: "2026-09-26T10:00:00.000Z",
        status: "confirmed",
      },
    ],
    follows: [
      { followerId: "u2", userId: "u1" },
      { followerId: "u2", userId: "u4" },
    ],
    favorites: [{ userId: "u2", listingId: "l6" }],
    conversations: [
      {
        id: "cv1",
        participantIds: ["u2", "u1"],
        otherFor: { u2: "u1", u1: "u2" },
        updatedAt: "2026-09-20T16:40:00.000Z",
        lastMessagePreview: "I can hold the jacket until Friday.",
      },
    ],
    messages: {
      cv1: [
        { id: "m1", senderId: "u2", senderName: "Lina Ortega", text: "Is the field jacket still in a medium?" },
        { id: "m2", senderId: "u1", senderName: "Mostafa Adel", text: "I can hold the jacket until Friday." },
      ],
    },
    notifications: [
      { id: "n1", userId: "u2", message: "Your travel speaker order is still pending.", createdAt: "2026-09-19T08:00:00.000Z", isRead: false },
      { id: "n2", userId: "u2", message: "Mostafa replied in your inbox.", createdAt: "2026-09-20T16:40:00.000Z", isRead: false },
      { id: "n3", userId: "u1", message: "Lina booked Saturday knife sharpening.", createdAt: "2026-09-21T11:00:00.000Z", isRead: true },
      { id: "n4", userId: "u3", message: "Two new listings are waiting for a look.", createdAt: "2026-09-22T09:30:00.000Z", isRead: false },
    ],
    seq: 100,
  };
}

function item(id, sellerId, title, description, priceInCents, categoryId, category, type, stock, averageRating, photoIds) {
  const sellers = {
    u1: ["Mostafa Adel", photo("photo-1500648767791-00dcc994a43e")],
    u4: ["Nora Hale", photo("photo-1438761681033-6461ffad8d80")],
  };
  const photos = photoIds.map((pid) => photo(pid));
  return {
    id,
    sellerId,
    sellerName: sellers[sellerId][0],
    sellerAvatarUrl: sellers[sellerId][1],
    title,
    description,
    priceInCents,
    categoryId,
    category,
    type,
    stock,
    averageRating,
    photoUrl: photos[0],
    photos,
    createdAt: `2026-08-${String(10 + photoIds.length).padStart(2, "0")}T12:00:00.000Z`,
    removed: false,
  };
}

function load() {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* use the seed */
  }
  return seed();
}

let db = load();

function save() {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(db));
  } catch {
    /* a large uploaded photo can exceed sessionStorage; memory still has it */
  }
}

function nextId(prefix) {
  db.seq += 1;
  return `${prefix}${db.seq}`;
}

function requireUser(token) {
  const user = userFromToken(token);
  if (!user) {
    const error = new Error("You need to log in.");
    error.status = 401;
    throw error;
  }
  return user;
}

function userFromToken(token) {
  if (!token || !token.startsWith("ph-")) return null;
  return db.users.find((user) => user.id === token.slice(3)) || null;
}

function publicUser(user) {
  if (!user) return null;
  const { password, ...rest } = user;
  return rest;
}

function listingOrThrow(id) {
  const listing = db.listings.find((entry) => entry.id === id && !entry.removed);
  if (!listing) throw new Error("Listing not found.");
  return listing;
}

async function fileToDataUrl(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

function cartView(userId) {
  const items = (db.carts[userId] || []).map((line) => {
    const listing = db.listings.find((entry) => entry.id === line.listingId);
    return {
      listingId: line.listingId,
      title: listing?.title || "Removed listing",
      price: listing?.priceInCents || 0,
      quantity: line.quantity,
    };
  });
  const total = items.reduce((sum, line) => sum + line.price * line.quantity, 0);
  return { items, total };
}

function paginate(list, page, limit) {
  const start = (page - 1) * limit;
  return {
    slice: list.slice(start, start + limit),
    total: list.length,
    page,
    totalPages: Math.max(1, Math.ceil(list.length / limit)),
  };
}

export async function handlePlaceholderRequest(path, { method = "GET", body, isFormData = false, token } = {}) {
  await new Promise((resolve) => setTimeout(resolve, 160));

  const url = new URL(path, "http://placeholder.local");
  const parts = url.pathname.split("/").filter(Boolean);
  const q = url.searchParams;
  const [root, a, b, c] = parts;

  if (root === "auth" && a === "register" && method === "POST") {
    if (db.users.some((user) => user.email === body.email)) throw new Error("That email is already registered.");
    const user = {
      id: nextId("u"),
      name: body.name,
      email: body.email,
      password: body.password,
      role: "buyer",
      bio: "",
      location: "",
      avatarUrl: "",
      coverPhotoUrl: "",
    };
    db.users.push(user);
    save();
    return { user: publicUser(user), token: `ph-${user.id}` };
  }

  if (root === "auth" && a === "login" && method === "POST") {
    const user = db.users.find((entry) => entry.email === body.email && entry.password === body.password);
    if (!user) throw new Error("Email or password is wrong.");
    if (user.isBanned) throw new Error("This account is banned.");
    return { user: publicUser(user), token: `ph-${user.id}` };
  }

  if (root === "auth" && a === "logout" && method === "POST") return { ok: true };
  if (root === "auth" && a === "me" && method === "GET") return publicUser(requireUser(token));
  if (root === "auth" && a === "forgot-password" && method === "POST") return { ok: true };
  if (root === "auth" && a === "reset-password" && method === "POST") return { ok: true };

  if (root === "categories" && method === "GET") return db.categories;

  if (root === "listings" && a === "mine" && method === "GET") {
    const user = requireUser(token);
    return db.listings.filter((listing) => listing.sellerId === user.id && !listing.removed);
  }

  if (root === "listings" && !a && method === "GET") {
    let list = db.listings.filter((listing) => !listing.removed);
    const category = q.get("category");
    const type = q.get("type");
    const search = (q.get("q") || "").trim().toLowerCase();
    const minPrice = q.get("minPrice");
    const maxPrice = q.get("maxPrice");
    const sort = q.get("sort");
    if (category) list = list.filter((listing) => listing.categoryId === category);
    if (type) list = list.filter((listing) => listing.type === type);
    if (search) {
      list = list.filter((listing) => `${listing.title} ${listing.description} ${listing.category}`.toLowerCase().includes(search));
    }
    if (minPrice) list = list.filter((listing) => listing.priceInCents >= Number(minPrice) * 100);
    if (maxPrice) list = list.filter((listing) => listing.priceInCents <= Number(maxPrice) * 100);
    if (sort === "price_asc") list.sort((x, y) => x.priceInCents - y.priceInCents);
    if (sort === "price_desc") list.sort((x, y) => y.priceInCents - x.priceInCents);
    if (sort === "rating_desc") list.sort((x, y) => y.averageRating - x.averageRating);
    if (sort === "newest") list.sort((x, y) => new Date(y.createdAt) - new Date(x.createdAt));
    const page = Number(q.get("page") || 1);
    const limit = Number(q.get("limit") || 12);
    const paged = paginate(list, page, limit);
    return { listings: paged.slice, total: paged.total, page: paged.page, totalPages: paged.totalPages };
  }

  if (root === "listings" && !a && method === "POST") {
    // The Express POST /api/listings handler is still empty. While the
    // placeholder is on, a listing has to land in this same in-memory list
    // the home page reads — even if nobody is logged in — or it can never
    // show up on Browse.
    const user = userFromToken(token) || {
      id: "guest",
      name: "You",
      avatarUrl: "",
    };
    const category = db.categories.find((entry) => entry.id === body.category);
    const listing = {
      id: nextId("l"),
      sellerId: user.id,
      sellerName: user.name,
      sellerAvatarUrl: user.avatarUrl,
      title: body.title,
      description: body.description,
      priceInCents: body.priceInCents,
      categoryId: body.category,
      category: category?.name || body.category,
      type: body.type,
      stock: body.stock,
      averageRating: 0,
      photoUrl: "",
      photos: [],
      createdAt: new Date().toISOString(),
      removed: false,
    };
    db.listings.unshift(listing);
    save();
    return listing;
  }

  if (root === "listings" && a && b === "reviews" && method === "GET") return db.reviews.filter((review) => review.listingId === a);
  if (root === "listings" && a && b === "reviews" && method === "POST") {
    requireUser(token);
    const review = { id: nextId("r"), listingId: a, rating: body.rating, comment: body.comment };
    db.reviews.push(review);
    save();
    return review;
  }
  if (root === "listings" && a && b === "comments" && method === "GET") return db.comments.filter((comment) => comment.listingId === a);
  if (root === "listings" && a && b === "comments" && method === "POST") {
    requireUser(token);
    const comment = { id: nextId("c"), listingId: a, text: body.text };
    db.comments.push(comment);
    save();
    return comment;
  }
  if (root === "listings" && a && b === "availability" && method === "GET") {
    listingOrThrow(a);
    const date = q.get("date");
    const hours = [9, 10, 11, 13, 14, 15, 16];
    const slots = hours.map((hour) => {
      const start = new Date(`${date}T${String(hour).padStart(2, "0")}:00:00`);
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      const taken = db.bookings.some(
        (booking) => booking.listingId === a && booking.status !== "cancelled" && booking.start === start.toISOString()
      );
      return { start: start.toISOString(), end: end.toISOString(), isAvailable: !taken };
    });
    return { slots };
  }
  if (root === "listings" && a && b === "photos" && method === "POST") {
    const listing = listingOrThrow(a);
    const files = [...(body?.getAll("photos") || [])];
    const urls = [];
    for (const file of files) urls.push(await fileToDataUrl(file));
    listing.photos = [...listing.photos, ...urls];
    listing.photoUrl = listing.photos[0] || "";
    save();
    return listing;
  }
  if (root === "listings" && a && !b && method === "GET") return listingOrThrow(a);
  if (root === "listings" && a && !b && method === "PATCH") {
    requireUser(token);
    const listing = listingOrThrow(a);
    Object.assign(listing, body);
    save();
    return listing;
  }
  if (root === "listings" && a && !b && method === "DELETE") {
    requireUser(token);
    listingOrThrow(a).removed = true;
    save();
    return { ok: true };
  }

  if (root === "cart" && !a && method === "GET") return cartView(requireUser(token).id);
  if (root === "cart" && !a && method === "DELETE") {
    db.carts[requireUser(token).id] = [];
    save();
    return { ok: true };
  }
  if (root === "cart" && a === "items" && !b && method === "POST") {
    const user = requireUser(token);
    const lines = db.carts[user.id] || [];
    const existing = lines.find((line) => line.listingId === String(body.listingId));
    if (existing) existing.quantity += body.quantity || 1;
    else lines.push({ listingId: String(body.listingId), quantity: body.quantity || 1 });
    db.carts[user.id] = lines;
    save();
    return cartView(user.id);
  }
  if (root === "cart" && a === "items" && b && method === "PATCH") {
    const user = requireUser(token);
    const line = (db.carts[user.id] || []).find((entry) => entry.listingId === b);
    if (line) line.quantity = body.quantity;
    save();
    return cartView(user.id);
  }
  if (root === "cart" && a === "items" && b && method === "DELETE") {
    const user = requireUser(token);
    db.carts[user.id] = (db.carts[user.id] || []).filter((entry) => entry.listingId !== b);
    save();
    return cartView(user.id);
  }

  if (root === "orders" && a === "checkout" && method === "POST") {
    const user = requireUser(token);
    const view = cartView(user.id);
    if (view.items.length === 0) throw new Error("Your cart is empty.");
    for (const line of view.items) {
      const listing = listingOrThrow(line.listingId);
      if (listing.type === "product" && listing.stock < line.quantity) {
        throw new Error(`${listing.title} does not have enough stock.`);
      }
    }
    for (const line of view.items) {
      const listing = listingOrThrow(line.listingId);
      if (listing.type === "product") listing.stock -= line.quantity;
    }
    const order = {
      id: nextId("o"),
      userId: user.id,
      status: "pending",
      createdAt: new Date().toISOString(),
      totalInCents: view.total,
      items: view.items,
      shippingAddress: body.shippingAddress,
    };
    db.orders.unshift(order);
    db.carts[user.id] = [];
    save();
    return order;
  }
  if (root === "orders" && !a && method === "GET") {
    const user = requireUser(token);
    const mine = db.orders.filter((order) => order.userId === user.id);
    const paged = paginate(mine, Number(q.get("page") || 1), Number(q.get("limit") || 10));
    return { orders: paged.slice, total: paged.total, page: paged.page, totalPages: paged.totalPages };
  }
  if (root === "orders" && a && b === "cancel" && method === "POST") {
    const user = requireUser(token);
    const order = db.orders.find((entry) => entry.id === a && entry.userId === user.id);
    if (!order) throw new Error("Order not found.");
    order.status = "cancelled";
    save();
    return order;
  }
  if (root === "orders" && a && !b && method === "GET") {
    const user = requireUser(token);
    const order = db.orders.find((entry) => entry.id === a && entry.userId === user.id);
    if (!order) throw new Error("Order not found.");
    return order;
  }

  if (root === "bookings" && !a && method === "POST") {
    const user = requireUser(token);
    const listing = listingOrThrow(String(body.listingId));
    const clash = db.bookings.some(
      (booking) => booking.listingId === listing.id && booking.status !== "cancelled" && booking.start === body.start
    );
    if (clash) throw new Error("That time was just taken.");
    const booking = {
      id: nextId("b"),
      userId: user.id,
      listingId: listing.id,
      listingTitle: listing.title,
      start: body.start,
      end: body.end,
      status: "confirmed",
    };
    db.bookings.unshift(booking);
    save();
    return booking;
  }
  if (root === "bookings" && a === "mine" && method === "GET") {
    const user = requireUser(token);
    return db.bookings.filter((booking) => booking.userId === user.id);
  }
  if (root === "bookings" && a && b === "cancel" && method === "POST") {
    const user = requireUser(token);
    const booking = db.bookings.find((entry) => entry.id === a && entry.userId === user.id);
    if (!booking) throw new Error("Booking not found.");
    booking.status = "cancelled";
    save();
    return booking;
  }

  if (root === "favorites" && !a && method === "GET") {
    const user = requireUser(token);
    return db.favorites.filter((favorite) => favorite.userId === user.id);
  }
  if (root === "favorites" && !a && method === "POST") {
    const user = requireUser(token);
    db.favorites.push({ userId: user.id, listingId: String(body.listingId) });
    save();
    return { ok: true };
  }
  if (root === "favorites" && a && method === "DELETE") {
    const user = requireUser(token);
    db.favorites = db.favorites.filter((favorite) => !(favorite.userId === user.id && favorite.listingId === a));
    save();
    return { ok: true };
  }

  if (root === "conversations" && !a && method === "GET") {
    const user = requireUser(token);
    return db.conversations
      .filter((conversation) => conversation.participantIds.includes(user.id))
      .map((conversation) => {
        const otherId = conversation.participantIds.find((id) => id !== user.id);
        const other = db.users.find((entry) => entry.id === otherId);
        return {
          id: conversation.id,
          otherUserName: other?.name || "Someone",
          lastMessagePreview: conversation.lastMessagePreview,
          updatedAt: conversation.updatedAt,
        };
      });
  }
  if (root === "conversations" && !a && method === "POST") {
    const user = requireUser(token);
    const conversation = {
      id: nextId("cv"),
      participantIds: [user.id, String(body.recipientId)],
      updatedAt: new Date().toISOString(),
      lastMessagePreview: "",
    };
    db.conversations.unshift(conversation);
    db.messages[conversation.id] = [];
    save();
    return conversation;
  }
  if (root === "conversations" && a && b === "messages" && method === "GET") {
    requireUser(token);
    return db.messages[a] || [];
  }
  if (root === "conversations" && a && b === "messages" && method === "POST") {
    const user = requireUser(token);
    const message = { id: nextId("m"), senderId: user.id, senderName: user.name, text: body.text };
    db.messages[a] = [...(db.messages[a] || []), message];
    const conversation = db.conversations.find((entry) => entry.id === a);
    if (conversation) {
      conversation.lastMessagePreview = body.text;
      conversation.updatedAt = new Date().toISOString();
    }
    save();
    return message;
  }

  if (root === "notifications" && a === "read-all" && method === "PATCH") {
    const user = requireUser(token);
    db.notifications.forEach((note) => {
      if (note.userId === user.id) note.isRead = true;
    });
    save();
    return { ok: true };
  }
  if (root === "notifications" && !a && method === "GET") {
    const user = requireUser(token);
    return db.notifications.filter((note) => note.userId === user.id);
  }
  if (root === "notifications" && a && b === "read" && method === "PATCH") {
    requireUser(token);
    const note = db.notifications.find((entry) => entry.id === a);
    if (note) note.isRead = true;
    save();
    return note;
  }

  if (root === "users" && a && b === "followers" && method === "GET") {
    return db.follows
      .filter((follow) => follow.userId === a)
      .map((follow) => publicUser(db.users.find((user) => user.id === follow.followerId)));
  }
  if (root === "users" && a && b === "following" && method === "GET") {
    return db.follows
      .filter((follow) => follow.followerId === a)
      .map((follow) => publicUser(db.users.find((user) => user.id === follow.userId)));
  }
  if (root === "users" && a && b === "follow" && method === "POST") {
    const user = requireUser(token);
    db.follows.push({ followerId: user.id, userId: a });
    save();
    return { ok: true };
  }
  if (root === "users" && a && b === "follow" && method === "DELETE") {
    const user = requireUser(token);
    db.follows = db.follows.filter((follow) => !(follow.followerId === user.id && follow.userId === a));
    save();
    return { ok: true };
  }
  if (root === "users" && a && b === "avatar" && method === "POST") {
    const user = requireUser(token);
    const target = db.users.find((entry) => entry.id === a);
    const file = body?.get("avatar");
    if (file) target.avatarUrl = await fileToDataUrl(file);
    save();
    return publicUser(target);
  }
  if (root === "users" && a && b === "cover-photo" && method === "POST") {
    const user = requireUser(token);
    const target = db.users.find((entry) => entry.id === a);
    const file = body?.get("coverPhoto");
    if (file) target.coverPhotoUrl = await fileToDataUrl(file);
    save();
    return publicUser(target);
  }
  if (root === "users" && a && !b && method === "GET") {
    const user = db.users.find((entry) => entry.id === a);
    if (!user) throw new Error("User not found.");
    return publicUser(user);
  }
  if (root === "users" && a && !b && method === "PATCH") {
    requireUser(token);
    const user = db.users.find((entry) => entry.id === a);
    Object.assign(user, body);
    save();
    return publicUser(user);
  }

  if (root === "search" && method === "GET") {
    const needle = (q.get("q") || "").toLowerCase();
    return {
      listings: db.listings.filter((listing) => listing.title.toLowerCase().includes(needle) && !listing.removed),
      users: db.users.filter((user) => user.name.toLowerCase().includes(needle)).map(publicUser),
    };
  }

  if (root === "reviews" && a && method === "DELETE") {
    requireUser(token);
    db.reviews = db.reviews.filter((review) => review.id !== a);
    save();
    return { ok: true };
  }
  if (root === "comments" && a && method === "DELETE") {
    requireUser(token);
    db.comments = db.comments.filter((comment) => comment.id !== a);
    save();
    return { ok: true };
  }

  if (root === "admin" && a === "stats" && method === "GET") {
    const user = requireUser(token);
    if (user.role !== "admin") throw new Error("Admins only.");
    const revenueCents = db.orders
      .filter((order) => order.status !== "cancelled")
      .reduce((sum, order) => sum + order.totalInCents, 0);
    return {
      totalUsers: db.users.length,
      totalListings: db.listings.filter((listing) => !listing.removed).length,
      totalOrders: db.orders.length,
      revenueCents,
    };
  }
  if (root === "admin" && a === "users" && !b && method === "GET") {
    const user = requireUser(token);
    if (user.role !== "admin") throw new Error("Admins only.");
    const paged = paginate(db.users.map(publicUser), Number(q.get("page") || 1), Number(q.get("limit") || 20));
    return { users: paged.slice, total: paged.total, page: paged.page, totalPages: paged.totalPages };
  }
  if (root === "admin" && a === "users" && c === "ban" && method === "PATCH") {
    requireUser(token);
    const target = db.users.find((entry) => entry.id === b);
    target.isBanned = true;
    save();
    return publicUser(target);
  }
  if (root === "admin" && a === "users" && c === "role" && method === "PATCH") {
    requireUser(token);
    const target = db.users.find((entry) => entry.id === b);
    target.role = body.role;
    save();
    return publicUser(target);
  }
  if (root === "admin" && a === "listings" && !b && method === "GET") {
    requireUser(token);
    const rows = db.listings.filter((listing) => !listing.removed);
    const paged = paginate(rows, Number(q.get("page") || 1), Number(q.get("limit") || 20));
    return { listings: paged.slice, total: paged.total, page: paged.page, totalPages: paged.totalPages };
  }
  if (root === "admin" && a === "listings" && b && method === "DELETE") {
    requireUser(token);
    const listing = db.listings.find((entry) => entry.id === b);
    if (listing) listing.removed = true;
    save();
    return { ok: true };
  }

  throw new Error(`No placeholder for ${method} ${path}`);
}
