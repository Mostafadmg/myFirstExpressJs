import { z, ZodLazy } from "zod";

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
    limit: z.coerce.number().int().positive().optional().default(12),
    category: z.string().trim().min(1).optional(),
    q: z.string().trim().min(1).optional(),
    minPrice: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.coerce.number().nonnegative().optional(),
    ),
    maxPrice: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.coerce.number().nonnegative().optional(),
    ),
    sort: z.enum(["price_asc", "price_desc", "rating_desc", "newest"]).optional(),
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
