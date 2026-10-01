/* PetLuxo — CategorySelector
 * Seletor de categoria para mobile: um botão fechado que mostra a categoria
 * atualmente selecionada (ou "Todos"). Ao tocar, abre um bottom sheet com todas
 * as categorias disponíveis. A lógica de filtragem continua viva em Products.jsx
 * — este componente só expondo `value` e chamando `onSelect`.
 */

import React from 'react';
import { Icon } from '../../icons.jsx';
import styles from './CategorySelector.module.css';

const TOP_OPTIONS = [{ id: null, label: 'Todos' }];

export function CategorySelector({ categories, value, onSelect, placeholder = 'Filtrar categorias' }) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef(null);

  const options = React.useMemo(
    () => TOP_OPTIONS.concat(categories),
    [categories]
  );

  const selectedLabel = React.useMemo(() => {
    if (!value) return 'Todos';
    const cat = categories.find(c => c.id === value);
    return cat ? cat.label : placeholder;
  }, [value, categories, placeholder]);

  // Fecha com Escape e devolve o foco ao botão que abriu
  React.useEffect(() => {
    if (!open) return;
    const onKeydown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeydown);
    return () => document.removeEventListener('keydown', onKeydown);
  }, [open]);

  // Bloqueia scroll da página enquanto o sheet está aberto.
  // `overflow:hidden` só no body/html não é suficiente no Chromium (com
  // `scroll-behavior: smooth` global) nem no mobile Safari. Técnica
  // robusta: congelar o body com position:fixed preservando scrollY.
  React.useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const body = document.body;
    const scrollY = window.scrollY;
    const prev = {
      rootOverflow: root.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyWidth: body.style.width,
    };
    root.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';
    return () => {
      root.style.overflow = prev.rootOverflow;
      body.style.overflow = prev.bodyOverflow;
      body.style.position = prev.bodyPosition;
      body.style.top = prev.bodyTop;
      body.style.width = prev.bodyWidth;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function handleSelect(catId) {
    onSelect(catId);
    close();
  }

  function handleBackdrop(e) {
    if (e.target === e.currentTarget) close();
  }

  // Com o sheet fullscreen, o backdrop não é diretamente clicável;
  // cliques no "vazio" do sheet (fora da lista, do X e do handle) fecham.
  function handleSheetClick(e) {
    if (e.target === e.currentTarget) close();
  }

  return (
    <div className={styles.root}>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Filtrar por categoria"
        onClick={() => setOpen(true)}
      >
        <span className={[styles.triggerLabel, value && styles.triggerLabelSelected].filter(Boolean).join(' ')}>
          {selectedLabel}
        </span>
        <Icon.Chevron className={[styles.triggerChevron, open && styles.triggerChevronOpen].filter(Boolean).join(' ')} />
      </button>

      {open && (
        <div
          className={styles.backdrop}
          role="dialog"
          aria-modal="true"
          aria-label="Selecionar categoria"
          onClick={handleBackdrop}
        >
         <div className={styles.sheet} onClick={handleSheetClick}>
            <div className={styles.handle} aria-hidden="true" />
            <button
              type="button"
              className={styles.closeBtn}
              aria-label="Fechar"
              onClick={close}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="18" height="18">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
            <div className={styles.optionsScroll}>
              <ul className={styles.optionsList}>
                {options.map((cat) => {
                  const isActive = value === cat.id;
                  return (
                    <li key={cat.id === null ? 'todos' : cat.id}>
                      <button
                        type="button"
                        className={[styles.option, isActive && styles.optionActive].filter(Boolean).join(' ')}
                        onClick={() => handleSelect(cat.id)}
                      >
                        {cat.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
