/* PetLuxo — PolicyLayout (páginas de política)
 * Moldura comum das 4 políticas. Abaixo de 768px: MobilePolicyLayout.
 * Desktop: MinimalNavbar, coluna lateral fixa ao rolar (título, as 4
 * políticas como links de rota com aria-current e o cartão "Ficou com
 * dúvida?") e a coluna de leitura (h1, data, cartões de prazos quando a
 * página passa `highlights`, e o corpo). O texto de cada política vive em
 * sua página (children) e não muda. */

import { Link, NavLink } from 'react-router-dom';
import { MinimalNavbar } from '../layout/MinimalNavbar.jsx';
import { Footer } from '../layout/Footer.jsx';
import { Icon } from '../../icons.jsx';
import { wa } from '../../lib/whatsapp.js';
import { CONTACT, FOOTER, POLICY_LINKS, POLICY_TEXT, WA_MESSAGES } from '../../data/siteContent.js';
import { useIsMobile } from '../../hooks/useMediaQuery.js';
import { MobilePolicyLayout, MobileSection } from '../mobile/policy/MobilePolicyLayout.jsx';
import styles from './PolicyLayout.module.css';

const cx = (...c) => c.filter(Boolean).join(' ');

export default function PolicyLayout({ title, updated, highlights, children }) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobilePolicyLayout title={title} updated={updated} highlights={highlights}>{children}</MobilePolicyLayout>;
  }

  return (
    <>
      <MinimalNavbar />
      <main className={styles.page}>
        <div className={cx('wrap', styles.inner)}>
          <Link to="/" className={styles.back}>
            <Icon.ArrowL/>
            {POLICY_TEXT.back}
          </Link>

          <div className={styles.layout}>
            <aside className={styles.aside}>
              <div className={styles.asideHead}>
                <p className={styles.eyebrow}>{POLICY_TEXT.eyebrow}</p>
                <p className={styles.asideTitle}>
                  {POLICY_TEXT.titleStart} <em>{POLICY_TEXT.titleAccent}</em>
                </p>
              </div>

              <nav aria-label={POLICY_TEXT.navLabel} className={styles.nav}>
                {POLICY_LINKS.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    className={({ isActive }) => cx(styles.navLink, isActive && styles.navLinkOn)}
                  >
                    {l.label}
                  </NavLink>
                ))}
              </nav>

              <div className={styles.help}>
                <p className={styles.helpTitle}>{POLICY_TEXT.helpTitle}</p>
                <a href={`mailto:${FOOTER.email}`} className={styles.helpLink}>{FOOTER.email}</a>
                <a href={wa(WA_MESSAGES.general)} target="_blank" rel="noopener noreferrer" className={styles.helpLink}>
                  {POLICY_TEXT.whatsappPrefix} {CONTACT.phoneDisplay}
                </a>
              </div>
            </aside>

            <article className={styles.article}>
              <header className={styles.head}>
                <h1 className={styles.title}>{title}</h1>
                <p className={styles.updated}>{POLICY_TEXT.updatedPrefix} {updated}</p>
              </header>

              {highlights && (
                <div className={styles.highlights}>
                  {highlights.map((h) => (
                    <div key={h.num} className={styles.highlight}>
                      <span className={styles.highlightNum}>{h.num}</span>
                      <span className={styles.highlightText}>{h.text}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className={styles.body}>{children}</div>
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export function Section({ title, children }) {
  const isMobile = useIsMobile();
  if (isMobile) return <MobileSection title={title}>{children}</MobileSection>;
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.sectionBody}>{children}</div>
    </section>
  );
}
