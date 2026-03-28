import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'
import { buttonVariants } from '@/lib/button-variants'

// ─── Nav ─────────────────────────────────────────────────────────────────────

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-6">
        <Link href="/" className="font-serif text-lg text-foreground">
          Tin
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/login" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
            로그인
          </Link>
          <Link href="/register" className={buttonVariants({ size: 'sm' })}>
            시작하기
          </Link>
        </div>
      </div>
    </header>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-border px-6 py-8">
      <div className="mx-auto flex max-w-4xl items-center justify-between text-xs text-muted-foreground">
        <span className="font-serif text-sm">Tin</span>
        <div className="flex items-center gap-4">
          <Link href="/terms" className="hover:text-foreground transition-colors">
            이용약관
          </Link>
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            개인정보처리방침
          </Link>
        </div>
      </div>
    </footer>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-2xl px-6 pb-24 pt-28">
        <h1 className="font-serif text-3xl text-foreground sm:text-4xl">개인정보처리방침</h1>
        <p className="mt-2 text-sm text-muted-foreground">최종 수정일: 2026년 3월 28일</p>

        <div className="mt-10 space-y-10 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="font-serif text-xl text-foreground">1. 개인정보의 처리 목적</h2>
            <p className="mt-3">
              Tin(이하 "서비스")은 다음의 목적을 위하여 개인정보를 처리합니다. 처리한 개인정보는
              다음 목적 이외의 용도로는 사용되지 않으며 이용 목적이 변경될 시에는 별도 동의를 받는
              등 필요한 조치를 이행합니다.
            </p>
            <ul className="mt-3 space-y-2 pl-5 list-disc">
              <li>회원 가입 및 관리: 서비스 이용에 따른 본인 식별·인증, 회원자격 유지·관리</li>
              <li>서비스 제공: Tin 작성·조회·수정·삭제 등 핵심 서비스 기능 제공</li>
              <li>서비스 개선: 서비스 이용 현황 분석 및 신규 기능 개발</li>
              <li>공지사항 및 이용 안내: 서비스 변경·종료 등 중요 사항 통보</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground">2. 수집하는 개인정보의 항목</h2>
            <div className="mt-3 space-y-3">
              <div>
                <strong className="text-foreground">필수 수집 항목</strong>
                <ul className="mt-2 space-y-1 pl-5 list-disc">
                  <li>이메일 주소 (계정 식별 및 로그인 용도)</li>
                  <li>비밀번호 (암호화 저장)</li>
                  <li>이름 (서비스 내 표시용)</li>
                </ul>
              </div>
              <div>
                <strong className="text-foreground">자동 수집 항목</strong>
                <ul className="mt-2 space-y-1 pl-5 list-disc">
                  <li>서비스 이용 일시, 접속 로그</li>
                  <li>기기 정보 (브라우저 종류, OS)</li>
                </ul>
              </div>
              <div>
                <strong className="text-foreground">서비스 이용 중 생성 정보</strong>
                <ul className="mt-2 space-y-1 pl-5 list-disc">
                  <li>이용자가 직접 작성한 Tin 내용 (제목, 날짜, 감정 기록)</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground">3. 개인정보의 처리 및 보유 기간</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5">
              <li>서비스는 이용자의 개인정보를 회원 탈퇴 시까지 보유·이용합니다.</li>
              <li>
                회원 탈퇴 요청 시 개인정보는 즉시 파기하며, 관련 법령에 따라 일정 기간 보존이 필요한
                경우에는 해당 기간 동안 별도 보관 후 파기합니다.
              </li>
              <li>
                관련 법령에 의한 정보 보유 기간:
                <ul className="mt-2 space-y-1 pl-5 list-disc">
                  <li>계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래법)</li>
                  <li>접속 로그 기록: 3개월 (통신비밀보호법)</li>
                </ul>
              </li>
            </ol>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground">4. 개인정보의 제3자 제공</h2>
            <p className="mt-3">
              서비스는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 단, 다음의 경우에는
              예외로 합니다.
            </p>
            <ul className="mt-3 space-y-2 pl-5 list-disc">
              <li>이용자가 사전에 동의한 경우</li>
              <li>
                법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의
                요구가 있는 경우
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground">5. 개인정보처리의 위탁</h2>
            <p className="mt-3">
              서비스는 원활한 서비스 제공을 위해 아래와 같이 개인정보 처리 업무를 위탁하고 있습니다.
            </p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-2 pr-6 text-left font-medium text-foreground">수탁 업체</th>
                    <th className="pb-2 text-left font-medium text-foreground">위탁 업무</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-6">클라우드 인프라 제공업체</td>
                    <td className="py-2">서버 운영 및 데이터 보관</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground">
              6. 이용자의 권리·의무 및 행사 방법
            </h2>
            <p className="mt-3">이용자는 언제든지 다음의 권리를 행사할 수 있습니다.</p>
            <ul className="mt-3 space-y-2 pl-5 list-disc">
              <li>개인정보 열람 요구</li>
              <li>오류가 있는 경우 정정 요구</li>
              <li>삭제 요구</li>
              <li>처리 정지 요구</li>
            </ul>
            <p className="mt-3">
              위 권리 행사는 서비스 내 계정 설정 또는 고객 문의를 통해 요청할 수 있으며, 서비스는
              지체 없이 조치합니다.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground">7. 개인정보의 파기</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5">
              <li>
                서비스는 개인정보 보유 기간의 경과, 처리 목적 달성 등 개인정보가 불필요하게 되었을
                때에는 지체없이 해당 개인정보를 파기합니다.
              </li>
              <li>
                전자적 파일 형태로 저장된 개인정보는 복구 불가능한 방법으로 영구 삭제하며, 기록물,
                인쇄물 등은 분쇄 또는 소각합니다.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground">8. 개인정보 보호 책임자</h2>
            <p className="mt-3">
              서비스는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 이용자의 개인정보 관련 불만
              처리 및 피해 구제를 위해 개인정보 보호 책임자를 지정하고 있습니다.
            </p>
            <div className="mt-3 rounded-lg border border-border bg-secondary/30 p-4">
              <p>
                <strong className="text-foreground">개인정보 보호 책임자</strong>
              </p>
              <p className="mt-1">서비스: Tin</p>
              <p>문의: 서비스 내 고객 문의 채널</p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground">9. 쿠키 사용</h2>
            <p className="mt-3">
              서비스는 세션 유지 및 인증을 위해 쿠키를 사용합니다. 이용자는 브라우저 설정을 통해
              쿠키 저장을 거부할 수 있으나, 이 경우 로그인 등 일부 서비스 이용이 제한될 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground">10. 개인정보처리방침 변경</h2>
            <p className="mt-3">
              이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경 내용의 추가·삭제
              및 정정이 있는 경우에는 변경 사항의 시행 7일 전부터 서비스 내 공지사항을 통해
              고지합니다.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
