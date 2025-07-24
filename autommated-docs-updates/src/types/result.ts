/**
 * Result type for handling success and error outcomes
 * Similar to Rust's Result<T, E> or functional programming patterns
 */
export type Result<S, E> = Success<S> | Error<E>;

/**
 * Success variant of Result
 */
export interface Success<S> {
  kind: 'success';
  value: S;
}

/**
 * Error variant of Result
 */
export interface Error<E> {
  kind: 'error';
  message: E;
}

/**
 * Helper functions for working with Result types
 */
export namespace Result {
  /**
   * Creates a success result
   */
  export function success<S>(value: S): Success<S> {
    return { kind: 'success', value };
  }

  /**
   * Creates an error result
   */
  export function error<E>(message: E): Error<E> {
    return { kind: 'error', message };
  }

  /**
   * Checks if a result is successful
   */
  export function isSuccess<S, E>(result: Result<S, E>): result is Success<S> {
    return result.kind === 'success';
  }

  /**
   * Checks if a result is an error
   */
  export function isError<S, E>(result: Result<S, E>): result is Error<E> {
    return result.kind === 'error';
  }

  /**
   * Maps a success value to a new value
   */
  export function map<S, E, T>(result: Result<S, E>, fn: (value: S) => T): Result<T, E> {
    if (isSuccess(result)) {
      return success(fn(result.value));
    }
    return result;
  }

  /**
   * Maps an error message to a new error message
   */
  export function mapError<S, E, F>(result: Result<S, E>, fn: (error: E) => F): Result<S, F> {
    if (isError(result)) {
      return error(fn(result.message));
    }
    return result;
  }

  /**
   * Unwraps a result, throwing if it's an error
   */
  export function unwrap<S, E>(result: Result<S, E>): S {
    if (isSuccess(result)) {
      return result.value;
    }
    throw new Error(`Attempted to unwrap error result: ${result.message}`);
  }

  /**
   * Unwraps a result with a default value for errors
   */
  export function unwrapOr<S, E>(result: Result<S, E>, defaultValue: S): S {
    if (isSuccess(result)) {
      return result.value;
    }
    return defaultValue;
  }

  /**
   * Unwraps an error, throwing if it's a success
   */
  export function unwrapError<S, E>(result: Result<S, E>): E {
    if (isError(result)) {
      return result.message;
    }
    throw new Error(`Attempted to unwrap error from success result: ${JSON.stringify(result.value)}`);
  }
} 