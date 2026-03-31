'use client'

import { authClient } from '@/lib/auth-client'
import { DeleteAccountButton } from './delete-account-button'

export default function ProfilePage() {
  const { data: session } = authClient.useSession()

  return (
    <div className="max-w-sm">
      <h1 className="font-serif text-2xl text-foreground">프로필</h1>

      <div className="mt-8 flex flex-col gap-4">
        <div>
          <p className="text-xs text-muted-foreground">이름</p>
          <p className="mt-1 text-sm text-foreground">{session?.user?.name}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">이메일</p>
          <p className="mt-1 text-sm text-foreground">{session?.user?.email}</p>
        </div>
      </div>

      <div className="mt-16 border-t border-border pt-8">
        <p className="text-sm text-muted-foreground">
          탈퇴하면 모든 기록이 삭제되며 복구할 수 없어요.
        </p>
        <DeleteAccountButton />
      </div>
    </div>
  )
}
