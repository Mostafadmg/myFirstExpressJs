import { z } from "zod";

const priceInDollarsQuery = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.coerce
    .number()
    .finite()
    .nonnegative()
    .refine((value) => Math.abs(value * 100 - Math.round(value * 100)) < 1e-7, {
      message: "Price may have at most two decimal places.",
    })
    .optional(),
);

const listingSchema = z
  .object({
    title: z.string().trim().min(1),
    description: z.string().trim().min(10),
    priceInCents: z.number().int().nonnegative(),
    category: z.string().trim().min(1),
    type: z.enum(["product", "service"]),
    stock: z.number().int().nonnegative().optional(),
  })

  .refine((listing) => listing.type !== "product" || listing.stock !== undefined, {
    path: ["stock"],
    message: "Stock is required for products.",
  });

// for updateListing, PATCH request

const updateListingSchema = z
  .object({
    title: z.string().trim().min(1).optional(),
    description: z.string().trim().min(10).optional(),
    priceInCents: z.number().int().nonnegative().optional(),
    category: z.string().trim().min(1).optional(),
    type: z.enum(["product", "service"]).optional(),
    stock: z.number().int().nonnegative().optional().nullable(),
  })
  .refine((listing) => Object.keys(listing).length > 0, {
    message: "Provide at least one field to update.",
  });

const listingQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(12),
    category: z.string().trim().min(1).optional(),
    q: z.string().trim().min(1).optional(),
    minPrice: priceInDollarsQuery,
    maxPrice: priceInDollarsQuery,
    sort: z.enum(["price_asc", "price_desc", "rating_desc", "newest"]).default("newest"),
  })
  .refine(
    (query) =>
      query.minPrice === undefined ||
      query.maxPrice === undefined ||
      query.minPrice <= query.maxPrice,
    {
      path: ["maxPrice"],
      message: "Maximum price must be greater than or equal to minimum price.",
    },
  );

const searchQuerySchema = z.object({
  q: z.string().trim().min(1, "Enter a search term.").max(100, "Search terms must be 100 characters or fewer."),
});

export function validatePage(req, res, next) {
  const result = listingQuerySchema.safeParse(req.query);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid query parameters.",
      errors: result.error.issues,
    });
  }

  req.validatedQuery = result.data;

  next();
}

export function validateListing(req, res, next) {
  const result = listingSchema.safeParse(req.body);

  if (result.success) {
    req.body = result.data;
    return next();
  }

  return res.status(400).json({
    message: "Invalid listing data.",
    errors: result.error.issues,
  });
}

export function validateUpdateListing(req, res, next) {
  const result = updateListingSchema.safeParse(req.body);

  if (result.success) {
    req.body = result.data;
    return next();
  }

  return res.status(400).json({
    message: "Invalid listing update.",
    errors: result.error.issues,
  });
}

export function validateId(req, res, next) {
  const id = req.params.id;
  const onlyDigits = /^\d+$/.test(id) && Number.isSafeInteger(Number(id)) && Number(id) > 0;

  if (!onlyDigits) {
    return res.status(400).json({ message: "ID must contain only digits." });
  }

  return next();
}

export function validateSearchQuery(req, res, next) {
  const result = searchQuerySchema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({
      message: "Invalid search query.",
      errors: result.error.issues,
    });
  }

  req.validatedQuery = result.data;
  return next();
}
