/* PetLuxo — TrustBadges */

import React from 'react';

const LockIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <rect x="3" y="8" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.4" fill="none"/>
    <path d="M6 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
    <circle cx="9" cy="13" r="1.2" fill="currentColor"/>
  </svg>
);

const ReturnIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M3.5 9A5.5 5.5 0 1 0 9 3.5H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
    <path d="M6 1.5 L6 5.5 L2 5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

const BoxIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M9 2L2 5.5V12.5L9 16L16 12.5V5.5L9 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" fill="none"/>
    <path d="M9 2V16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M2 5.5L9 9L16 5.5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
  </svg>
);

const ChatIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M2 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H5l-3 3V3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" fill="none"/>
    <path d="M5.5 7h7M5.5 10h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

const BADGES_BANNER = [
  { Icon: LockIcon,   label: 'Compra Segura' },
  { Icon: ReturnIcon, label: 'Troca em 7 dias' },
  { Icon: BoxIcon,    label: 'Entrega Rastreada' },
  { Icon: ChatIcon,   label: 'Atendimento Humanizado' },
];

const BADGES_MODAL = [
  { Icon: LockIcon,   label: 'Compra Segura' },
  { Icon: ReturnIcon, label: 'Troca em 7 dias' },
  { Icon: BoxIcon,    label: 'Entrega Rastreada' },
];

export function TrustBadges({ variant = 'banner' }) {
  if (variant === 'modal') {
    return (
      <div className="trust-modal">
        {BADGES_MODAL.map(({ Icon, label }, i) => (
          <React.Fragment key={label}>
            {i > 0 && <span className="trust-modal__sep" aria-hidden="true">·</span>}
            <span className="trust-modal__item">
              <Icon size={14} />
              <span>{label}</span>
            </span>
          </React.Fragment>
        ))}
      </div>
    );
  }

  return (
    <div className="trust-banner" role="list" aria-label="Garantias de compra">
      {BADGES_BANNER.map(({ Icon, label }, i) => (
        <React.Fragment key={label}>
          {i > 0 && <span className="trust-banner__sep" aria-hidden="true" />}
          <div className="trust-banner__item" role="listitem">
            <Icon size={18} />
            <span>{label}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
