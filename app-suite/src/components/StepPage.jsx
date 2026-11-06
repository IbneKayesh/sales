import { Children, useState } from 'react'
import { IconCheck, IconChevronRight, IconChevronLeft } from '@/icons'

/**
 * StepPage — Step wizard with a compound (Modal/SidePanel style) API.
 *
 * Usage:
 *   <StepPage orientation="horizontal" variant="circles" showNav defaultStep={0}>
 *     <StepPageStep label="Account" description="Basic info">
 *       Enter your email and create a password.
 *     </StepPageStep>
 *     <StepPageStep label="Profile" description="Personal details">
 *       Fill in your name and contact information.
 *     </StepPageStep>
 *   </StepPage>
 *
 * The step's `label`, `description` and `disabled` drive the indicator; its
 * children render in the content panel while it is the active step. Pass
 * `activeStep` + `onStepChange` to control the selection, or leave them out and
 * the component keeps its own state (starting at `defaultStep`).
 */

export default function StepPage({
  defaultStep = 0,
  activeStep,
  onStepChange,
  orientation = 'horizontal',   // horizontal | vertical
  variant = 'circles',
  showNav = true,
  className = '',
  children,
  ...rest
}) {
  const steps = Children.toArray(children)
  const [localStep, setLocalStep] = useState(defaultStep)
  const currentStep = activeStep !== undefined ? activeStep : localStep
  const safeStep = Math.max(0, Math.min(currentStep, steps.length - 1))

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
      <div
        className="step-page__indicators"
        role="tablist"
        aria-label="Progress steps"
      >
        {steps.map((step, i) => {
          const { label, title, description, disabled = false } =
            step.props ?? {}
          const isActive = i === safeStep
          const isCompleted = i < safeStep
          const isFuture = i > safeStep
          const isLast = i === steps.length - 1

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
                  aria-label={`Step ${i + 1}: ${label || title}`}
                  onClick={() => !disabled && isCompleted && goTo(i)}
                  disabled={disabled}
                >
                  {isCompleted ? (
                    <IconCheck size={16} />
                  ) : (
                    <span className="step-page__marker-num">{i + 1}</span>
                  )}
                </button>
                {!isLast && orientation === 'horizontal' && (
                  <span
                    className="step-page__connector"
                    aria-hidden="true"
                  />
                )}
              </div>
              <div className="step-page__label-wrap">
                <span className="step-page__label">{label || title}</span>
                {description && (
                  <span className="step-page__desc">{description}</span>
                )}
              </div>
              {!isLast && orientation === 'vertical' && (
                <span
                  className="step-page__connector step-page__connector--vert"
                  aria-hidden="true"
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Content panel */}
      <div className="step-page__body">
        {steps[safeStep]}

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

/* ---------- Step (indicator metadata + content panel) ---------- */

export function StepPageStep({ children, className = '', ...rest }) {
  // `label`, `title`, `description` and `disabled` are read by StepPage for the
  // indicator, so they must not be forwarded to the DOM element.
  const domProps = { ...rest }
  delete domProps.label
  delete domProps.title
  delete domProps.description
  delete domProps.disabled

  return (
    <div
      className={`step-page__content${className ? ' ' + className : ''}`}
      role="tabpanel"
      {...domProps}
    >
      {children}
    </div>
  )
}
