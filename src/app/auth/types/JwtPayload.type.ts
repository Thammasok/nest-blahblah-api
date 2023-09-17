export type JwtPayload = {
  accountId: string
  email: string
  sub: 'access_token' | 'refresh_token'
}
