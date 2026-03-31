const AUTH_ERROR_MAP: Record<string, string> = {
  INVALID_EMAIL: '올바른 이메일 형식이 아닙니다.',
  INVALID_PASSWORD: '비밀번호가 올바르지 않습니다.',
  INVALID_EMAIL_OR_PASSWORD: '이메일 또는 비밀번호가 올바르지 않습니다.',
  USER_NOT_FOUND: '존재하지 않는 계정입니다.',
  USER_ALREADY_EXISTS: '이미 사용 중인 이메일입니다.',
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: '이미 사용 중인 이메일입니다.',
  PASSWORD_TOO_SHORT: '비밀번호가 너무 짧습니다.',
  PASSWORD_TOO_LONG: '비밀번호가 너무 깁니다.',
  SESSION_EXPIRED: '세션이 만료됐습니다. 다시 로그인해주세요.',
}

export function getAuthErrorMessage(code: string | undefined, fallback: string): string {
  if (!code) return fallback
  return AUTH_ERROR_MAP[code] ?? fallback
}
