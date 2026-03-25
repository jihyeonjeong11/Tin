import { createAuthClient } from 'better-auth/react'

// Export authClient directly — destructuring individual methods causes
// pnpm type portability errors due to better-auth's complex return types.
// Use authClient.signIn(), authClient.useSession(), etc. at call sites.
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000',
})
