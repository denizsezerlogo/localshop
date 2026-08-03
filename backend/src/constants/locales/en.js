// English message catalog. Mirrors the exact keys of tr.js (verified by tests/i18n.test.js).
export const en = {
  // General
  SERVER_ERROR: 'Server error',
  NOT_FOUND_ROUTE: (method, url) => `Not found: ${method} ${url}`,
  DUPLICATE_RECORD: 'This record already exists',
  INVALID_ID: 'Invalid id format',
  RATE_LIMITED: 'Too many requests, please try again later',
  RATE_LIMITED_AUTH: 'Too many attempts, please try again in 15 minutes',
  RATE_LIMITED_PAYMENT: 'Too many payment attempts, please try again later',
  CONCURRENT_MODIFICATION: 'This record was modified by another operation, please try again',
  INVALID_INPUT: 'Invalid input provided',

  // Auth
  AUTH_REQUIRED: 'You need to sign in',
  AUTH_INVALID_TOKEN: 'Invalid token, please sign in again',
  AUTH_TOKEN_EXPIRED: 'Your session has expired, please sign in again',
  AUTH_USER_GONE: 'The user for this token no longer exists',
  AUTH_FORBIDDEN: 'You are not allowed to perform this action',
  AUTH_EMAIL_TAKEN: 'An account with this email already exists',
  AUTH_BAD_CREDENTIALS: 'Incorrect email or password',
  AUTH_REGISTERED: 'Registration successful',
  AUTH_LOGGED_IN: 'Signed in successfully',

  // Product
  PRODUCT_NOT_FOUND: 'Product not found',
  PRODUCT_NOT_OWNER: 'You are not allowed to modify this product',
  PRODUCT_CREATED: 'Product created',
  PRODUCT_UPDATED: 'Product updated',
  PRODUCT_DELETED: 'Product deleted',

  // Cart
  CART_EMPTY: 'Your cart is empty',
  CART_ITEM_NOT_FOUND: 'Product not found in cart',
  CART_ITEM_ADDED: 'Product added to cart',
  CART_ITEM_UPDATED: 'Quantity updated',
  CART_ITEM_REMOVED: 'Product removed from cart',
  CART_MAX_STOCK: (name, stock) => `Insufficient stock: you can add at most ${stock} of '${name}'`,
  CART_MAX_STOCK_UPDATE: (name, stock) => `Insufficient stock: you can select at most ${stock} of '${name}'`,

  // Order
  ORDER_NOT_FOUND: 'Order not found',
  ORDER_FORBIDDEN: 'You are not allowed to view this order',
  ORDER_CREATED: (count) =>
    count > 1
      ? `Your cart contained items from ${count} different sellers, so ${count} separate orders were created, awaiting payment`
      : 'Order created, awaiting payment',
  ORDER_NO_SELLER_ITEMS: 'This order does not contain any of your products',
  ORDER_BAD_TRANSITION: (from, to) => `Cannot transition from '${from}' to '${to}'`,
  ORDER_STATUS_UPDATED: 'Order status updated',
  ORDER_STOCK_LEFT: (name, left) => `Insufficient stock: only ${left} left for '${name}'`,
  ORDER_STOCK_RACE: (name) => `Insufficient stock: '${name}' just sold out`,

  // Payment
  PAYMENT_NOT_YOURS: 'This order does not belong to you',
  PAYMENT_NOT_PAYABLE: 'This order is not eligible for payment',
  PAYMENT_SUCCESS: 'Payment successful',
  PAYMENT_FAILED: (reason) => `Payment failed: ${reason}`,
  PAYMENT_DECLINED: 'Card declined',

  // Validator messages
  VAL_NAME_LENGTH: 'Name must be 2-60 characters',
  VAL_EMAIL: 'Enter a valid email address',
  VAL_PASSWORD_MIN: 'Password must be at least 6 characters',
  VAL_PASSWORD_REQUIRED: 'Password is required',
  VAL_ROLE: 'Role must be customer or seller',
  VAL_PRODUCT_ID: 'Invalid product id',
  VAL_ORDER_ID: 'Invalid order id',
  VAL_PAGE: 'page must be 1 or greater',
  VAL_LIMIT: 'limit must be between 1 and 50',
  VAL_SEARCH_MAX: 'Search can be at most 100 characters',
  VAL_PRODUCT_NAME: 'Product name must be 2-120 characters',
  VAL_PRODUCT_DESC: 'Description must be 1-2000 characters',
  VAL_PRICE: 'Price must be a number of 0 or greater',
  VAL_STOCK: 'Stock must be an integer of 0 or greater',
  VAL_CATEGORY: 'Select a valid category',
  VAL_QUANTITY: 'Quantity must be an integer between 1 and 999',
  VAL_ORDER_STATUS: 'Status can only be SHIPPED or DELIVERED',
  VAL_CARD_NUMBER: 'Card number must be 13-19 digits',
  VAL_CARD_HOLDER: 'Card holder name must be 2-60 characters',
  VAL_EXPIRY_FORMAT: 'Expiry must be in MM/YY format',
  VAL_EXPIRY_PAST: 'This card has expired',
  VAL_CVV: 'CVV must be 3-4 digits',
};
