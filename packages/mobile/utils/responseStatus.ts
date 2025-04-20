export function isErrorStatusCode(statusCode: number): boolean {
  return statusCode >= 400 && statusCode < 500;
}

export function isSuccessStatusCode(statusCode: number): boolean {
  return statusCode >= 200 && statusCode < 300;
}

export function isConflictStatusCode(statusCode: number): boolean {
  return statusCode === 409;
}

export function isServerErrorStatusCode(statusCode: number): boolean {
  return statusCode >= 500 && statusCode < 600;
}
