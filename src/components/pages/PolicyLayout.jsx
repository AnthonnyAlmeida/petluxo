/* PetLuxo — PolicyLayout (páginas de política)
 * Moldura comum das 4 políticas. Acima de 768px: Navbar, o bloco de leitura
 * de 800px (estilos inline de sempre) e Footer. Abaixo: MobilePolicyLayout.
 * O texto de cada política vive em sua página (children) e não muda. */

import { Navbar } from '../layout/Navbar.jsx';
import { Footer } from '../layout/Footer.jsx';
import { useIsMobile } from '../../hooks/useMediaQuery.js';
import { MobilePolicyLayout, MobileSection } from '../mobile/policy/MobilePolicyLayout.jsx';

export default function PolicyLayout({ title, updated, highlights, children }) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobilePolicyLayout title={title} updated={updated} highlights={highlights}>{children}</MobilePolicyLayout>;
  }

  return (
    <>
      <Navbar />
      <main>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: 'clamp(48px, 8vw, 96px) var(--pad)',
          fontFamily: 'var(--sans)',
          color: 'var(--ink)',
        }}>
          <h1 style={{
            fontFamily: 'var(--serif)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 600,
            color: 'var(--vinho)',
            marginBottom: '0.5rem',
            lineHeight: 1.2,
          }}>
            {title}
          </h1>
          <p style={{
            color: 'var(--ink-soft)',
            fontSize: '0.875rem',
            marginBottom: '2.5rem',
            borderBottom: '1px solid var(--bege)',
            paddingBottom: '1.5rem',
          }}>
            Última atualização: {updated}
          </p>
          {children}
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
    <section style={{ marginBottom: '2.5rem' }}>
      <h2 style={{
        fontFamily: 'var(--serif)',
        fontSize: 'clamp(1.25rem, 2.5vw, 1.6rem)',
        fontWeight: 600,
        color: 'var(--vinho)',
        marginBottom: '0.75rem',
        lineHeight: 1.3,
      }}>
        {title}
      </h2>
      <div style={{
        lineHeight: 1.8,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}>
        {children}
      </div>
    </section>
  );
}
