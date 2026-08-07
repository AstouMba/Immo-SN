export type PropertyType = "apartment" | "house" | "villa" | "office" | "land";
export type TransactionType = "rent" | "sale";

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  type: PropertyType;
  transactionType: TransactionType;
  surface: number;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  location: {
    address: string;
    city: string;
    neighborhood?: string;
    postalCode?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  images: string[];
  features: string[];
  available: boolean;
  featured?: boolean;
}

export interface SearchFilters {
  transactionType?: TransactionType;
  propertyType?: PropertyType;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minSurface?: number;
  rooms?: number;
  page?: number;
  limit?: number;
}
