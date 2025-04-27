import { ErrorCode } from '@dinerito-flow/shared';

import { ErrorMessages } from '@/types/locale';

const esErrors: ErrorMessages = {
  // Authentication errors
  [ErrorCode.LOGIN_FAILED]: 'Error de inicio de sesión.',
  [ErrorCode.INVALID_CREDENTIALS]: 'Nombre de usuario o contraseña inválidos',
  [ErrorCode.EMAIL_ALREADY_EXISTS]: 'El correo electrónico ya existe.',
  [ErrorCode.INVALID_VERIFICATION_CODE]: 'Código de verificación inválido.',
  [ErrorCode.CONFLICTING_VERIFICATION_CODE]: 'Codigo de verificación existe con este email.',
  [ErrorCode.EXPIRED_VERIFICATION_CODE]: 'Código de verificación expirado.',

  // User errors
  [ErrorCode.USER_ALREADY_EXISTS]: 'El usuario ya existe.',

  // Resource errors
  [ErrorCode.RESOURCE_NOT_FOUND]: 'Recurso no encontrado.',
  [ErrorCode.UNAUTHORIZED_ACCESS]: 'Acceso no autorizado.',
  [ErrorCode.FORBIDDEN_ACTION]: 'Acción prohibida.',

  // Server errors
  [ErrorCode.INTERNAL_SERVER_ERROR]: 'Error interno del servidor.',
  [ErrorCode.SERVICE_UNAVAILABLE]: 'Servicio no disponible.',
  [ErrorCode.DATABASE_ERROR]: 'Error de base de datos.',

  // Generic errors
  [ErrorCode.UNKNOWN_ERROR]: 'Ocurrió un error desconocido.',
  [ErrorCode.OPERATION_FAILED]: 'Operación fallida.',

  // Input validation errors
  [ErrorCode.INVALID_INPUT]: 'Entrada inválida.',

  // Email
  [ErrorCode.INVALID_EMAIL]: 'Dirección de correo electrónico inválida.',
  [ErrorCode.REQUIRED_EMAIL]: 'Dirección de correo electrónico es requerida.',
  [ErrorCode.EMAIL_NOT_FOUND]: 'Dirección de correo electrónico no encontrada.',

  // Password
  [ErrorCode.REQUIRED_PASSWORD]: 'Contraseña es requerida.',
  [ErrorCode.REQUIRED_CONFIRM_PASSWORD]: 'Confirmar contraseña es requerida.',
  [ErrorCode.NEW_PASSWORD_MUST_BE_DIFFERENT]: 'La nueva contraseña debe ser diferente de la antigua.',
  [ErrorCode.PASSWORDS_DONT_MATCH]: 'Las contraseñas no coinciden.',
  [ErrorCode.PASSWORD_TOO_SHORT]: 'La contraseña debe tener al menos {{min}} caracteres.',
  [ErrorCode.INVALID_PASSWORD]: 'Contraseña inválida.',
  [ErrorCode.PASSWORD_TOO_WEAK]: 'La contraseña es demasiado débil.',

  // Verification code
  [ErrorCode.REQUIRED_VERIFICATION_CODE]: 'Código de verificación es requerido.',
  [ErrorCode.MIN_VERIFICATION_CODE_LENGTH]: 'El código de verificación debe tener {{min}} dígitos.',

  // Name
  [ErrorCode.REQUIRED_FIRST_NAME]: 'El nombre es requerido.',
  [ErrorCode.REQUIRED_LAST_NAME]: 'El apellido es requerido.',
};

export default esErrors;
