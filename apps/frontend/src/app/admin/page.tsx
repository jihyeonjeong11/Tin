'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

type AdminUser = {
  id: string
  name: string
  email: string
  role: string | null
  banned: boolean | null
  createdAt: Date
}

export default function AdminPage() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()
  const qc = useQueryClient()

  useEffect(() => {
    if (!isPending && (!session || session.user.role !== 'admin')) {
      router.replace('/home')
    }
  }, [isPending, session, router])

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const res = await authClient.admin.listUsers({ query: { limit: 100 } })
      return (res.data?.users ?? []) as AdminUser[]
    },
    enabled: session?.user.role === 'admin',
  })

  const banMutation = useMutation({
    mutationFn: (userId: string) =>
      authClient.admin.banUser({ userId, banReason: '관리자에 의해 정지됨' }),
    onSuccess: () => {
      toast.success('유저를 정지했습니다')
      qc.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
    onError: () => toast.error('처리에 실패했습니다'),
  })

  const unbanMutation = useMutation({
    mutationFn: (userId: string) => authClient.admin.unbanUser({ userId }),
    onSuccess: () => {
      toast.success('정지를 해제했습니다')
      qc.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
    onError: () => toast.error('처리에 실패했습니다'),
  })

  if (isPending || !session) return null
  if (session.user.role !== 'admin') return null

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <h1 className="font-serif text-2xl text-foreground">어드민</h1>
      <p className="mt-1 text-sm text-muted-foreground">유저 관리</p>

      <div className="mt-8">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">불러오는 중...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>역할</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>가입일</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role ?? 'user'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.banned ? (
                      <Badge variant="destructive">정지됨</Badge>
                    ) : (
                      <Badge variant="outline">정상</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                  </TableCell>
                  <TableCell>
                    {user.role !== 'admin' &&
                      (user.banned ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => unbanMutation.mutate(user.id)}
                          disabled={unbanMutation.isPending}
                        >
                          정지 해제
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => banMutation.mutate(user.id)}
                          disabled={banMutation.isPending}
                        >
                          정지
                        </Button>
                      ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
