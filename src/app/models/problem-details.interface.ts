/**
 * Problem Details interface (RFC 7807)
 * Standard format for HTTP API error responses
 */
export interface ProblemDetails {
  /**
   * A URI reference that identifies the problem type
   */
  type: string;

  /**
   * A short, human-readable summary of the problem type
   */
  title: string;

  /**
   * A human-readable explanation specific to this occurrence of the problem
   */
  detail: string;

  /**
   * The HTTP status code
   */
  status: number;

  /**
   * A URI reference that identifies the specific occurrence of the problem
   */
  instance: string;

  /**
   * Validation errors mapping field names to arrays of error messages
   * Optional field used for validation failures
   */
  errors?: Record<string, string[]>;
}
