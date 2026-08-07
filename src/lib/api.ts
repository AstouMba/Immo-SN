import type { Property, PropertyType, SearchFilters, TransactionType } from "@/types/property";

export type UserRole = "user" | "admin";
export type RequestStatus = "pending" | "confirmed" | "completed" | "cancelled";
export type InquiryStatus = "pending" | "contacted" | "closed";

export interface ApiUser {
  id: string;
  email: string;
  fullName: string;
  phone?: string | null;
  role: UserRole;
}

export interface AuthSession {
  accessToken: string;
  user: ApiUser;
}

export interface PropertyRecord extends Property {
  createdAt: string;
  updatedAt: string;
}

export interface InquiryRecord {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  status: InquiryStatus;
  createdAt: string;
  updatedAt: string;
  propertyId?: string | null;
}

export interface VisitRecord {
  id: string;
  propertyId: string;
  name: string;
  email: string;
  phone?: string | null;
  preferredDate?: string | null;
  preferredTime?: string | null;
  notes?: string | null;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  property?: { title: string };
}

export interface ReservationRecord {
  id: string;
  propertyId: string;
  name: string;
  email: string;
  phone?: string | null;
  startDate: string;
  endDate: string;
  numberOfGuests?: number | null;
  notes?: string | null;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  property?: { title: string };
}

interface PropertyApiRecord extends Omit<PropertyRecord, "location" | "images" | "features"> {
  address: string;
  city: string;
  neighborhood?: string | null;
  postalCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  images: string[];
  features: string[];
}

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:4010/api").replace(/\/$/, "");
const API_ORIGIN = new URL(API_URL).origin;
const TOKEN_KEY = "diaspora_mvp_token";

const resolveAssetUrl = (value: string) => {
  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("data:")) return value;
  if (value.startsWith("/uploads/")) return `${API_ORIGIN}${value}`;
  return value;
};

const normalizeUploadPath = (value: string) => {
  if (value.startsWith("/uploads/")) return value;
  if (value.startsWith(`${API_ORIGIN}/uploads/`)) return value.slice(API_ORIGIN.length);
  return value;
};

const appendPropertyFormData = (payload: Partial<PropertyWritePayload>) => {
  const formData = new FormData();
  const scalarEntries: Array<[keyof PropertyWritePayload, string | number | boolean | undefined]> = [
    ["title", payload.title],
    ["description", payload.description],
    ["price", payload.price],
    ["type", payload.type],
    ["transactionType", payload.transactionType],
    ["surface", payload.surface],
    ["rooms", payload.rooms],
    ["bedrooms", payload.bedrooms],
    ["bathrooms", payload.bathrooms],
    ["address", payload.address],
    ["city", payload.city],
    ["neighborhood", payload.neighborhood],
    ["postalCode", payload.postalCode],
    ["latitude", payload.latitude],
    ["longitude", payload.longitude],
    ["available", payload.available],
    ["featured", payload.featured],
  ];

  scalarEntries.forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") formData.append(String(key), String(value));
  });

  if (payload.images) formData.append("images", JSON.stringify(payload.images.map(normalizeUploadPath)));
  if (payload.features) formData.append("features", JSON.stringify(payload.features));
  payload.imageFiles?.forEach((file) => formData.append("imageFiles", file));

  return formData;
};

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error("Impossible de joindre l'API. Vérifie que le backend est démarré sur `http://localhost:4010`.");
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null) as { message?: string | string[] } | null;
    const message = Array.isArray(body?.message) ? body.message.join(", ") : body?.message;
    throw new Error(message || "Une erreur est survenue. Veuillez réessayer.");
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
};

const mapProperty = (property: PropertyApiRecord): PropertyRecord => ({
  id: property.id,
  title: property.title,
  description: property.description,
  price: property.price,
  type: property.type,
  transactionType: property.transactionType,
  surface: property.surface,
  rooms: property.rooms,
  bedrooms: property.bedrooms,
  bathrooms: property.bathrooms,
  location: {
    address: property.address,
    city: property.city,
    neighborhood: property.neighborhood || undefined,
    postalCode: property.postalCode || undefined,
    coordinates: property.latitude !== null && property.latitude !== undefined && property.longitude !== null && property.longitude !== undefined
      ? { lat: property.latitude, lng: property.longitude }
      : undefined,
  },
  images: (property.images || []).map(resolveAssetUrl),
  features: property.features || [],
  available: property.available,
  featured: property.featured,
  createdAt: property.createdAt,
  updatedAt: property.updatedAt,
});

export const authApi = {
  login: (payload: { email: string; password: string }) => request<AuthSession>("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  register: (payload: { email: string; password: string; fullName: string }) => request<AuthSession>("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  me: () => request<ApiUser>("/auth/me"),
};

export const propertiesApi = {
  list: async (filters?: SearchFilters, includeAll = false) => {
    const params = new URLSearchParams();
    if (filters?.city) params.set("city", filters.city);
    if (filters?.propertyType) params.set("type", filters.propertyType);
    if (filters?.transactionType) params.set("transactionType", filters.transactionType);
    if (filters?.minPrice !== undefined) params.set("minPrice", String(filters.minPrice));
    if (filters?.maxPrice !== undefined) params.set("maxPrice", String(filters.maxPrice));
    if (filters?.minSurface !== undefined) params.set("minSurface", String(filters.minSurface));
    if (filters?.rooms !== undefined) params.set("rooms", String(filters.rooms));
    if (filters?.page !== undefined && !includeAll) params.set("page", String(filters.page));
    if (filters?.limit !== undefined && !includeAll) params.set("limit", String(filters.limit));
    if (includeAll) params.set("all", "true");
    const response = await request<{ data: PropertyApiRecord[]; meta: unknown }>(`/properties?${params.toString()}`);
    return { ...response, data: response.data.map(mapProperty) };
  },
  getOne: async (id: string) => mapProperty(await request<PropertyApiRecord>(`/properties/${id}`)),
  create: async (payload: PropertyWritePayload) => mapProperty(await request<PropertyApiRecord>("/properties", { method: "POST", body: appendPropertyFormData(payload) })),
  update: async (id: string, payload: Partial<PropertyWritePayload>) => mapProperty(await request<PropertyApiRecord>(`/properties/${id}`, { method: "PATCH", body: appendPropertyFormData(payload) })),
  remove: (id: string) => request<{ deleted: true; id: string }>(`/properties/${id}`, { method: "DELETE" }),
};

export interface PropertyWritePayload {
  title: string;
  description: string;
  price: number;
  type: PropertyType;
  transactionType: TransactionType;
  surface: number;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  address: string;
  city: string;
  neighborhood?: string;
  postalCode?: string;
  images?: string[];
  features?: string[];
  imageFiles?: File[];
  available?: boolean;
  featured?: boolean;
}

export const inquiriesApi = {
  list: () => request<InquiryRecord[]>("/inquiries"),
  create: (payload: { name: string; email: string; phone?: string; message: string; propertyId?: string }) => request<InquiryRecord>("/inquiries", { method: "POST", body: JSON.stringify(payload) }),
  updateStatus: (id: string, status: InquiryStatus) => request<InquiryRecord>(`/inquiries/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
};

export const visitsApi = {
  list: () => request<VisitRecord[]>("/visits"),
  create: (payload: { propertyId: string; name: string; email: string; phone?: string; preferredDate?: string; preferredTime?: string; notes?: string }) => request<VisitRecord>("/visits", { method: "POST", body: JSON.stringify(payload) }),
  updateStatus: (id: string, status: RequestStatus) => request<VisitRecord>(`/visits/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
};

export const reservationsApi = {
  list: () => request<ReservationRecord[]>("/reservations"),
  create: (payload: { propertyId: string; name: string; email: string; phone?: string; startDate: string; endDate: string; numberOfGuests?: number; notes?: string }) => request<ReservationRecord>("/reservations", { method: "POST", body: JSON.stringify(payload) }),
  updateStatus: (id: string, status: RequestStatus) => request<ReservationRecord>(`/reservations/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
};

export { TOKEN_KEY };
