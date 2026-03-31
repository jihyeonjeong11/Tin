'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'

export function DeleteAccountButton() {
  const router = useRouter()
  const [confirm, setConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm) {
      setConfirm(true)
      return
    }
    setIsDeleting(true)
    await api.delete('/api/v1/me')
    await authClient.signOut()
    router.replace('/')
  }

  return (
    <div className="mt-4 flex items-center gap-2">
      <Button variant="destructive" disabled={isDeleting} onClick={handleDelete}>
        {confirm ? '정말 탈퇴할게요' : '회원 탈퇴'}
      </Button>
      {confirm && (
        <Button variant="ghost" onClick={() => setConfirm(false)}>
          취소
        </Button>
      )}
    </div>
  )
}
