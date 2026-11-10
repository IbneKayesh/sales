import { useState, useCallback } from 'react';
import Modal, { ModalHeader, ModalTitle, ModalBody, ModalFooter } from './Modal.jsx';
import Button from './Button.jsx';
import { IconInfo } from '../icons';

/**
 * InfoButton — A clean, modular, and fully reusable info button & detail popup modal.
 *
 * Designed to be dropped into any page, table, card, or form across the application.
 *
 * Usage Examples:
 *
 * 1. Simple content / children:
 *    <InfoButton title="Credit Policy">
 *      <p>Credit terms are 30 days net from invoice date.</p>
 *    </InfoButton>
 *
 * 2. Analytical / Calculation details:
 *    <InfoButton
 *      title="Gross Margin"
 *      explanation="Measures profitability before operating expenses..."
 *      formula="(Gross Profit / Revenue) * 100"
 *      breakdown={[
 *        { label: 'Revenue', value: '৳100,000' },
 *        { label: 'COGS', value: '- ৳60,000' },
 *        { label: 'Gross Profit', value: '৳40,000', highlight: true },
 *      ]}
 *      tips="Keep gross margin above 35% for healthy cash flow."
 *    />
 *
 * 3. Arbitrary custom sections:
 *    <InfoButton
 *      title="Shipping Guidelines"
 *      sections={[
 *        { title: 'Standard Courier', content: '2-3 working days across Bangladesh.' },
 *        { title: 'Express Delivery', content: 'Same-day delivery within Dhaka metro.' },
 *      ]}
 *    />
 *
 * 4. Custom trigger button:
 *    <InfoButton title="Help Guide" trigger={<button>Learn More</button>}>
 *      <p>Full instructions here...</p>
 *    </InfoButton>
 */
export default function InfoButton({
  // Modal Header
  title = 'Information',
  subtitle,

  // Body Content Options (can mix or use whichever fits)
  children,
  content,
  explanation,
  formula,
  breakdown,
  tips,
  sections,

  // Localization & Labels
  lang = 'EN',
  closeLabel,
  explanationLabel,
  formulaLabel,
  breakdownLabel,
  tipsLabel,

  // Modal Configuration
  modalSize = 'md',
  closeOnBackdrop = true,
  closeOnEscape = true,

  // Trigger Button Configuration
  trigger,
  triggerText,
  icon,
  size = 13,
  className = '',
  style,
  ariaLabel,

  // Event Callbacks
  onOpen,
  onClose,
}) {
  const [open, setOpen] = useState(false);
  const isBN = lang === 'BN';

  const handleOpen = useCallback(
    (e) => {
      e?.preventDefault();
      e?.stopPropagation();
      setOpen(true);
      onOpen?.();
    },
    [onOpen],
  );

  const handleClose = useCallback(() => {
    setOpen(false);
    onClose?.();
  }, [onClose]);

  // Labels
  const lblClose = closeLabel || (isBN ? 'বন্ধ করুন' : 'Close');
  const lblExplanation = explanationLabel || (isBN ? 'ব্যাখ্যা ও ব্যবসায়িক তাৎপর্য' : 'Concept & Meaning');
  const lblFormula = formulaLabel || (isBN ? 'হিসাবের গাণিতিক সূত্র' : 'Calculation Formula');
  const lblBreakdown = breakdownLabel || (isBN ? 'হিসাবের বিস্তারিত মান' : 'Calculation Breakdown');
  const lblTips = tipsLabel || (isBN ? 'পরামর্শ ও করণীয়:' : 'Actionable Tip:');
  const defaultAria = ariaLabel || title || (isBN ? 'বিস্তারিত তথ্য দেখুন' : 'View details');

  return (
    <>
      {/* TRIGGER ELEMENT */}
      {trigger ? (
        <span
          onClick={handleOpen}
          style={{ display: 'inline-flex', cursor: 'pointer', verticalAlign: 'middle' }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleOpen(e);
          }}
        >
          {trigger}
        </span>
      ) : (
        <button
          type="button"
          className={`info-button-trigger ${className}`}
          onClick={handleOpen}
          title={defaultAria}
          aria-label={defaultAria}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: triggerText ? 'auto' : '20px',
            height: '20px',
            padding: triggerText ? '0 8px' : 0,
            borderRadius: triggerText ? 'var(--radius-sm, 4px)' : '50%',
            border: '1px solid var(--border)',
            background: 'var(--surface-alt)',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            flexShrink: 0,
            verticalAlign: 'middle',
            marginLeft: '6px',
            fontSize: 'var(--fs-xs, 12px)',
            gap: '4px',
            transition: 'all var(--transition-fast, 0.15s ease)',
            outline: 'none',
            ...style,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--primary)';
            e.currentTarget.style.color = 'var(--primary)';
            e.currentTarget.style.background = 'var(--surface)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.background = 'var(--surface-alt)';
          }}
        >
          {icon || <IconInfo size={size} />}
          {triggerText && <span>{triggerText}</span>}
        </button>
      )}

      {/* POPUP MODAL */}
      {open && (
        <Modal
          open={open}
          onClose={handleClose}
          closeOnBackdrop={closeOnBackdrop}
          closeOnEscape={closeOnEscape}
          size={modalSize}
        >
          <ModalHeader>
            <ModalTitle
              title={title}
              subtitle={subtitle}
              onClose={handleClose}
            />
          </ModalHeader>

          <ModalBody>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
              {/* 1. Direct Content or Children */}
              {(children || content) && (
                <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                  {children || content}
                </div>
              )}

              {/* 2. Structured Explanation */}
              {explanation && (
                <div
                  style={{
                    padding: 'var(--sp-3)',
                    background: 'var(--surface-alt)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div
                    style={{
                      fontSize: 'var(--fs-xs)',
                      fontWeight: 'var(--fw-bold)',
                      color: 'var(--primary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: 'var(--sp-1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--sp-1)',
                    }}
                  >
                    <span>💡</span>
                    <span>{lblExplanation}</span>
                  </div>
                  <div
                    style={{
                      fontSize: 'var(--fs-sm)',
                      color: 'var(--text-primary)',
                      lineHeight: 1.6,
                      whiteSpace: typeof explanation === 'string' && explanation.includes('\n') ? 'pre-line' : 'normal',
                    }}
                  >
                    {explanation}
                  </div>
                </div>
              )}

              {/* 3. Mathematical Formula / Code block */}
              {formula && (
                <div
                  style={{
                    padding: 'var(--sp-3)',
                    background: 'var(--surface)',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px dashed var(--primary-light, var(--border))',
                  }}
                >
                  <div
                    style={{
                      fontSize: 'var(--fs-xs)',
                      fontWeight: 'var(--fw-bold)',
                      color: 'var(--text-secondary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: 'var(--sp-1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--sp-1)',
                    }}
                  >
                    <span>📐</span>
                    <span>{lblFormula}</span>
                  </div>
                  <div
                    style={{
                      fontSize: 'var(--fs-sm)',
                      fontWeight: 'var(--fw-semibold)',
                      color: 'var(--text-primary)',
                      fontFamily: 'monospace',
                      background: 'var(--surface-alt)',
                      padding: 'var(--sp-2) var(--sp-3)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)',
                      overflowX: 'auto',
                    }}
                  >
                    {formula}
                  </div>
                </div>
              )}

              {/* 4. Live Calculation / Step-by-Step Breakdown */}
              {breakdown && (
                <div
                  style={{
                    padding: 'var(--sp-3)',
                    background: 'var(--surface-alt)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div
                    style={{
                      fontSize: 'var(--fs-xs)',
                      fontWeight: 'var(--fw-bold)',
                      color: 'var(--text-secondary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: 'var(--sp-2)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--sp-1)',
                    }}
                  >
                    <span>📊</span>
                    <span>{lblBreakdown}</span>
                  </div>

                  {Array.isArray(breakdown) ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-1)' }}>
                      {breakdown.map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: 'var(--sp-2)',
                            background: idx % 2 === 0 ? 'var(--surface)' : 'transparent',
                            borderRadius: 'var(--radius-sm)',
                            borderBottom: '1px solid var(--border-light, var(--border))',
                          }}
                        >
                          <div>
                            <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-primary)', fontWeight: 'var(--fw-medium)' }}>
                              {item.label}
                            </span>
                            {item.note && (
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                {item.note}
                              </div>
                            )}
                          </div>
                          <span
                            style={{
                              fontSize: 'var(--fs-sm)',
                              fontWeight: 'var(--fw-bold)',
                              color: item.highlight ? 'var(--primary)' : 'var(--text-primary)',
                              fontFamily: 'monospace',
                            }}
                          >
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-primary)' }}>
                      {breakdown}
                    </div>
                  )}
                </div>
              )}

              {/* 5. Generic Custom Sections */}
              {Array.isArray(sections) && sections.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                  {sections.map((sec, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: 'var(--sp-3)',
                        background: 'var(--surface-alt)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      {sec.title && (
                        <div
                          style={{
                            fontSize: 'var(--fs-xs)',
                            fontWeight: 'var(--fw-bold)',
                            color: 'var(--text-secondary)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            marginBottom: 'var(--sp-1)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--sp-1)',
                          }}
                        >
                          {sec.icon && <span>{sec.icon}</span>}
                          <span>{sec.title}</span>
                        </div>
                      )}
                      <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                        {sec.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 6. Actionable Tips & Advice */}
              {tips && (
                <div
                  style={{
                    padding: 'var(--sp-2) var(--sp-3)',
                    background: 'rgba(34, 197, 94, 0.08)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--success-border, rgba(34, 197, 94, 0.3))',
                    fontSize: 'var(--fs-xs)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <strong style={{ color: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <span>🎯</span> {lblTips}
                  </strong>{' '}
                  <span>{tips}</span>
                </div>
              )}
            </div>
          </ModalBody>

          <ModalFooter>
            <Button variant="primary" size="sm" onClick={handleClose}>
              {lblClose}
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </>
  );
}
