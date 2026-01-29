/**
 * Generic API response type for server actions
 * Provides consistent success/error handling across all actions
 */
export interface ApiResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * API response with field-level validation errors
 * Used for form submissions
 */
export interface ApiResponseWithFieldErrors<T = void> extends ApiResponse<T> {
  fieldErrors?: Record<string, string[]>;
}

/**
 * Helper type for actions that return a URL on success
 */
export type UrlResponse = ApiResponse<{ url: string }>;

/**
 * Helper type for actions that return an ID on success
 */
export type IdResponse = ApiResponse<{ id: string }>;
