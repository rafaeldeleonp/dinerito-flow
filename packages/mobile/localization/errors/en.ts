import { ErrorCode } from '@dinerito-flow/shared';

import { ErrorMessages } from '@/types/locale';

const enErrors: ErrorMessages = {
  // Authentication errors
  [ErrorCode.LOGIN_FAILED]: 'Login failed.',
  [ErrorCode.INVALID_CREDENTIALS]: 'Invalid username or password.',
  [ErrorCode.EMAIL_ALREADY_EXISTS]: 'Email already exists.',
  [ErrorCode.INVALID_VERIFICATION_CODE]: 'Invalid verification code.',
  [ErrorCode.CONFLICTING_VERIFICATION_CODE]: 'Conflicting verification code.',
  [ErrorCode.EXPIRED_VERIFICATION_CODE]: 'Expired verification code.',

  // User errors
  [ErrorCode.USER_ALREADY_EXISTS]: 'User already exists.',

  // Resource errors
  [ErrorCode.RESOURCE_NOT_FOUND]: 'Resource not found.',
  [ErrorCode.UNAUTHORIZED_ACCESS]: 'Unauthorized access.',
  [ErrorCode.FORBIDDEN_ACTION]: 'Forbidden action.',

  // Server errors
  [ErrorCode.INTERNAL_SERVER_ERROR]: 'Internal server error.',
  [ErrorCode.SERVICE_UNAVAILABLE]: 'Service unavailable.',
  [ErrorCode.DATABASE_ERROR]: 'Database error.',

  // Generic errors
  [ErrorCode.UNKNOWN_ERROR]: 'An unknown error occurred.',
  [ErrorCode.OPERATION_FAILED]: 'Operation failed.',

  // Input validation errors
  [ErrorCode.INVALID_INPUT]: 'Invalid input.',

  // Email
  [ErrorCode.INVALID_EMAIL]: 'Invalid email address.',
  [ErrorCode.REQUIRED_EMAIL]: 'Email address is required.',
  [ErrorCode.EMAIL_NOT_FOUND]: 'Email address not found.',

  // Password
  [ErrorCode.REQUIRED_PASSWORD]: 'Password is required.',
  [ErrorCode.REQUIRED_CONFIRM_PASSWORD]: 'Confirm password is required.',
  [ErrorCode.NEW_PASSWORD_MUST_BE_DIFFERENT]: 'New password must be different from the old password.',
  [ErrorCode.PASSWORDS_DONT_MATCH]: 'Passwords do not match.',
  [ErrorCode.PASSWORD_TOO_SHORT]: 'Password must be at least {{min}} characters long.',
  [ErrorCode.INVALID_PASSWORD]: 'Invalid password.',
  [ErrorCode.PASSWORD_TOO_WEAK]: 'Password is too weak.',

  // Verification code
  [ErrorCode.REQUIRED_VERIFICATION_CODE]: 'Verification code is required.',
  [ErrorCode.MIN_VERIFICATION_CODE_LENGTH]: 'Verification code must be {{min}} digits long.',

  // Name
  [ErrorCode.REQUIRED_FIRST_NAME]: 'First name is required.',
  [ErrorCode.REQUIRED_LAST_NAME]: 'Last name is required.',
};

export default enErrors;
