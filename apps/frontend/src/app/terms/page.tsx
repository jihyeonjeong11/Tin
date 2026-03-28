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

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-2xl px-6 pb-24 pt-28">
        <h1 className="font-serif text-3xl text-foreground sm:text-4xl">이용약관</h1>
        <p className="mt-2 text-sm text-muted-foreground">최종 수정일: 2026년 3월 28일</p>

        <div className="mt-10 space-y-10 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="font-serif text-xl text-foreground">제1조 (목적)</h2>
            <p className="mt-3">
              이 약관은 Tin(이하 "서비스")이 제공하는 마음 챙김 기록 서비스의 이용과 관련하여
              서비스와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로
              합니다.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground">제2조 (정의)</h2>
            <ul className="mt-3 space-y-2">
              <li>
                <strong className="text-foreground">서비스</strong>: Tin이 운영하는 마음 챙김 기록
                플랫폼 및 이와 관련된 제반 서비스를 의미합니다.
              </li>
              <li>
                <strong className="text-foreground">이용자</strong>: 이 약관에 따라 서비스에
                가입하여 서비스를 이용하는 개인을 말합니다.
              </li>
              <li>
                <strong className="text-foreground">Tin</strong>: 이용자가 서비스 내에서 작성하는
                개별 기록 단위를 의미합니다.
              </li>
              <li>
                <strong className="text-foreground">계정</strong>: 이용자가 서비스 이용을 위해
                생성한 이메일·비밀번호 조합의 인증 정보를 말합니다.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground">제3조 (약관의 효력 및 변경)</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5">
              <li>이 약관은 서비스를 이용하고자 하는 모든 이용자에 대하여 효력을 발생합니다.</li>
              {/* TODO: 공지/이메일 기능 구현 후 활성화
              <li>
                서비스는 필요하다고 인정되는 경우 이 약관을 변경할 수 있으며, 변경된 약관은 서비스
                내 공지 또는 이메일을 통해 7일 전 고지합니다.
              </li>
              */}
              <li>
                이용자가 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단하고 탈퇴할 수 있습니다.
                {/* TODO: 공지/이메일 기능 구현 후 추가 — 변경 고지 이후에도 서비스를 계속 이용하면 변경 약관에 동의한 것으로 간주합니다. */}
              </li>
            </ol>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground">제4조 (서비스 이용)</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5">
              <li>서비스는 만 14세 이상이면 누구나 가입하여 이용할 수 있습니다.</li>
              <li>
                이용자는 정확한 정보를 제공하여 계정을 생성해야 하며, 허위 정보 등록으로 인한
                불이익은 이용자 본인이 부담합니다.
              </li>
              <li>
                계정 및 비밀번호의 관리 책임은 이용자에게 있으며, 타인에게 양도·대여할 수 없습니다.
              </li>
              <li>
                서비스는 연중무휴 24시간 제공을 원칙으로 하나, 점검·장애 등으로 일시 중단될 수
                있습니다.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground">제5조 (이용자의 의무)</h2>
            <p className="mt-3">이용자는 다음 행위를 해서는 안 됩니다.</p>
            <ul className="mt-3 space-y-2 pl-5 list-disc">
              <li>타인의 계정을 도용하거나 서비스를 무단으로 이용하는 행위</li>
              <li>서비스의 정상적인 운영을 방해하거나 서버에 과부하를 주는 행위</li>
              <li>타인의 개인정보를 수집·저장·공개하는 행위</li>
              <li>관련 법령에 위반되는 내용을 기록하거나 유포하는 행위</li>
              <li>서비스의 지적 재산권을 침해하는 행위</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground">제6조 (콘텐츠 및 데이터 소유권)</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5">
              <li>이용자가 서비스 내에서 작성한 모든 Tin의 저작권은 이용자 본인에게 귀속됩니다.</li>
              <li>
                서비스는 이용자의 콘텐츠를 서비스 운영 목적 외에 활용하지 않으며, 이용자의 동의 없이
                제3자에게 제공하지 않습니다.
              </li>
              <li>
                서비스 탈퇴 시 이용자의 모든 데이터는 즉시 삭제되며, 삭제된 데이터는 복구되지
                않습니다.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground">제7조 (서비스 변경 및 중단)</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5">
              <li>
                서비스는 운영상·기술상 필요에 의해 서비스의 전부 또는 일부를 변경하거나 중단할 수
                있습니다.
              </li>
              {/* TODO: 공지/이메일 기능 구현 후 활성화
              <li>
                서비스 종료 시에는 최소 30일 전 서비스 내 공지 또는 이메일을 통해 이용자에게
                안내합니다.
              </li>
              */}
            </ol>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground">제8조 (면책 조항)</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5">
              <li>
                서비스는 천재지변, 불가항력, 해킹 등 불가피한 사유로 서비스를 제공할 수 없는 경우
                책임을 지지 않습니다.
              </li>
              <li>
                이용자가 서비스를 이용하여 기대하는 효과를 얻지 못하거나 서비스 이용으로 발생한
                손해에 대해 서비스는 책임을 지지 않습니다.
              </li>
              <li>
                이용자 간 또는 이용자와 제3자 간에 발생한 분쟁에 대해 서비스는 개입하지 않으며
                책임을 지지 않습니다.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground">제9조 (준거법 및 관할)</h2>
            <p className="mt-3">
              이 약관의 해석 및 이용자와의 분쟁에 대해서는 대한민국 법을 적용하며, 분쟁이 발생한
              경우 민사소송법상의 관할 법원에 제소합니다.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
