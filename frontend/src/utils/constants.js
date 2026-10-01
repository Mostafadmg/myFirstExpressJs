// Central place for fixed values so nothing is a "magic string" scattered
// across components. When your Express backend defines these same values
// (e.g. an enum column, a role check in middleware), keep them in sync.

export const ROLES = {
  BUYER: "buyer",
  SELLER: "seller",
  ADMIN: "admin",
};

export const ORDER_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  SHIPPED: "shipped",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const BOOKING_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
};

export const LISTING_TYPE = {
  PRODUCT: "product", // physical item, has stock/inventory
  SERVICE: "service", // bookable, has availability slots instead of stock
};

export const DEFAULT_PAGE_SIZE = 12;
