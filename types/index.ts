/**
 * The {@link PriceHistoryItem} `type` holds the price history for a product
 * item.
 * 
 * Property available:
 * @property price: number
 */
export type PriceHistoryItem = {
  price: number;
};

/**
 * The {@link User} `type` holds the email address for a user.
 * 
 * Property available:
 * @property email: string
 */
export type User = {
  email: string;
};

/**
 * The {@link Product} `type` holds the product information for a product.
 * 
 * Properties available:
 * @property _id: string
 * @property url: string
 * @property currency: string
 * @property image: string
 * @property title: string
 * @property currentPrice: number
 * @property originalPrice: number
 * @property priceHistory: {@link PriceHistoryItem}[] | []
 * @property highestPrice: number
 * @property lowestPrice: number
 * @property averagePrice: number
 * @property discountRate: number
 * @property description: string
 * @property category: string
 * @property reviewsCount: number
 * @property stars: number
 * @property isOutOfStock: Boolean
 * @property users: {@link User}[]
 */
export type Product = {
  _id?: string;
  url: string;
  currency: string;
  image: string;
  title: string;
  currentPrice: number;
  originalPrice: number;
  priceHistory: PriceHistoryItem[] | [];
  highestPrice: number;
  lowestPrice: number;
  averagePrice: number;
  discountRate: number;
  description: string;
  category: string;
  reviewsCount: number;
  stars: number;
  isOutOfStock: Boolean;
  users?: User[];
};

/**
 * The {@link NotificationType} `type` holds the notification types
 * for emails that can be sent.
 * 
 * Notification types available: `'WELCOME'`, `'CHANGE_OF_STOCK'`,
 * `'LOWEST_PRICE'`, `'THRESHOLD_MET'`.
 */
export type NotificationType =
  | "WELCOME"
  | "CHANGE_OF_STOCK"
  | "LOWEST_PRICE"
  | "THRESHOLD_MET";

/**
 * The {@link EmailContent} `type` holds the email content for an email.
 * 
 * Property available:
 * @property subject: string
 * @property body: string
 */
export type EmailContent = {
  subject: string;
  body: string;
};

/**
 * The {@link EmailProductInfo} `type` holds the email product information
 * for an email.
 * 
 * Property available:
 * @property title: string
 * @property url: string
 */
export type EmailProductInfo = {
  title: string;
  url: string;
};
