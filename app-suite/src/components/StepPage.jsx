import { useState } from 'react'
import { IconCheck, IconChevronRight, IconChevronLeft } from '@/icons'

export default function StepPage({
  steps = [],
  activeStep,
  onStepChange,
  orientation = 'horizontal',
  variant = 'circles',
  showNav = true,
  className = '',
  ...rest
}) {
  const [localStep, setLocalStep] = useState(0)
  const currentStep = activeStep !== undefined ? activeStep : localStep
  const safeStep = Math.min(currentStep, steps.length - 1)

  const goTo = (i) => {
    const step = Math.max(0, Math.min(i, steps.length - 1))
    if (onStepChange) {
      onStepChange(step)
    } else {
      setLocalStep(step)
    }
  }

  const isPrevDisabled = safeStep === 0
  const isNextDisabled = safeStep >= steps.length - 1

  if (!steps.length) return null

  return (
    <div
      className={`step-page step-page--${orientation} step-page--${variant}${className ? ' ' + className : ''}`}
      {...rest}
    >
      {/* Step indicators */}
      <div className="step-page__indicators" role="tablist" aria-label="Progress steps">
        {steps.map((step, i) => {
          const isActive = i === safeStep
          const isCompleted = i < safeStep
          const isFuture = i > safeStep
          const isLast = i === steps.length - 1
          const disabled = step.disabled || false

          return (
            <div
              key={step.key ?? i}
              className={`step-page__step${isActive ? ' step-page__step--active' : ''}${isCompleted ? ' step-page__step--completed' : ''}${isFuture ? ' step-page__step--future' : ''}${disabled ? ' step-page__step--disabled' : ''}`}
            >
              <div className="step-page__step-row">
                <button
                  type="button"
                  className="step-page__marker"
                  role="tab"
                  aria-selected={isActive}
                  aria-disabled={disabled}
                  aria-label={`Step ${i + 1}: ${step.label || step.title}`}
                  onClick={() => !disabled && (isCompleted || isFuture) && goTo(i)}
                  disabled={disabled}
                >
                  {isCompleted ? (
                    <IconCheck size={16} />
                  ) : (
                    <span className="step-page__marker-num">{i + 1}</span>
                  )}
                </button>
                {!isLast && orientation === 'horizontal' && (
                  <span className="step-page__connector" aria-hidden="true" />
                )}
              </div>
              <div className="step-page__label-wrap">
                <span className="step-page__label">{step.label || step.title}</span>
                {step.description && (
                  <span className="step-page__desc">{step.description}</span>
                )}
              </div>
              {!isLast && orientation === 'vertical' && (
                <span className="step-page__connector step-page__connector--vert" aria-hidden="true" />
              )}
            </div>
          )
        })}
      </div>

      {/* Content panel */}
      <div className="step-page__body">
        <div className="step-page__content" role="tabpanel">
          {steps[safeStep]?.content}
        </div>

        {/* Navigation */}
        {showNav && (
          <div className="step-page__nav">
            <button
              type="button"
              className="step-page__nav-btn step-page__nav-btn--prev"
              disabled={isPrevDisabled}
              onClick={() => goTo(safeStep - 1)}
            >
              <IconChevronLeft size={14} />
              <span>Back</span>
            </button>
            <span className="step-page__nav-info">
              Step {safeStep + 1} of {steps.length}
            </span>
            <button
              type="button"
              className="step-page__nav-btn step-page__nav-btn--next"
              disabled={isNextDisabled}
              onClick={() => goTo(safeStep + 1)}
            >
              <span>{isNextDisabled ? 'Finish' : 'Next'}</span>
              <IconChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
