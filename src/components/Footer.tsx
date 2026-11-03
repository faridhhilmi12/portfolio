import { useT } from '../i18n/LangProvider'

export function Footer() {
  const t = useT()
  return (
    <footer className="mx-auto flex w-full max-w-[1120px] flex-wrap justify-between gap-2 px-[clamp(16px,4vw,40px)] py-7 text-sm text-muted">
      <p>© {new Date().getFullYear()} Muhammad Farid Hilmi</p>
      <p>{t('footer.made')}</p>
    </footer>
  )
}
