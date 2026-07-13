import { useState, useCallback } from 'react';
import Modal from './Modal';
import { useToast } from './Toast';

/**
 * Multi-step wizard modal with progress indicator and navigation.
 *
 * @param {Object} props
 * @param {boolean} props.open
 * @param {Function} props.onClose
 * @param {string} props.title — Modal title
 * @param {Array<{title: string, description?: string, content: (ReactNode|Function)}>} props.steps
 * @param {Function} props.onComplete — Called with all step data when wizard finishes
 * @param {string} props.size — Modal size (default: 'md')
 * @param {string} props.finishLabel — Finish button text (default: 'Finish')
 * @param {Object} props.initialData — Optional initial data per step
 */
export default function WizardModal({
  open, onClose, title, steps = [], onComplete, size = 'md',
  finishLabel = 'Finish', initialData = {},
  successMessage, errorMessage,
}) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  // Reset on open
  const handleClose = useCallback(() => {
    setCurrentStep(0);
    setData(initialData);
    setLoading(false);
    onClose();
  }, [onClose, initialData]);

  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;
  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = async () => {
    if (step?.onNext) {
      const canProceed = await step.onNext(data, setData);
      if (canProceed === false) return;
    }
    if (isLast) {
      setLoading(true);
      try {
        await onComplete?.(data);
        toast.success(successMessage || `${title || 'Process'} completed successfully`);
        setLoading(false);
        handleClose();
      } catch {
        toast.error(errorMessage || 'An error occurred. Please try again.');
        setLoading(false);
      }
    } else {
      setCurrentStep(s => s + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(s => s - 1);
  };

  // If step.content is a function, call it with { data, setData }
  const renderContent = () => {
    if (!step) return null;
    if (typeof step.content === 'function') {
      return step.content({ data, setData, currentStep });
    }
    return step.content;
  };

  const footer = (
    <div className="wizard-footer">
      <div className="wizard-footer-left">
        <button className="wizard-btn wizard-btn-skip" onClick={handleClose} disabled={loading}>
          Cancel
        </button>
      </div>
      <div className="wizard-footer-right">
        {!isFirst && (
          <button className="wizard-btn wizard-btn-back" onClick={handleBack} disabled={loading}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back
          </button>
        )}
        <button className="wizard-btn wizard-btn-next" onClick={handleNext} disabled={loading}>
          {loading ? (
            <span className="btn-loading"><span className="spinner" /> Saving...</span>
          ) : isLast ? (
            <>
              {finishLabel}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </>
          ) : (
            <>
              Next
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <Modal open={open} onClose={handleClose} title={title} size={size} footer={footer}>
      <div className="wizard-container">
        {/* Progress bar */}
        <div className="wizard-progress-bar">
          <div className="wizard-progress-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* Step indicators */}
        <div className="wizard-steps">
          {steps.map((s, i) => (
            <div key={i} className={`wizard-step-dot ${i === currentStep ? 'active' : i < currentStep ? 'completed' : ''}`}>
              <div className="wizard-step-circle">
                {i < currentStep ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                ) : (
                  <span>{i + 1}</span>
                )}
              </div>
              <div className="wizard-step-label">
                <span className="wizard-step-title">{s.title}</span>
                {s.description && <span className="wizard-step-desc">{s.description}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="wizard-content" key={currentStep}>
          {renderContent()}
        </div>
      </div>
    </Modal>
  );
}
