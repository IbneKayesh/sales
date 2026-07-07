/**
 * FormField – Wraps a label and input/select/textarea in the standard form field pattern.
 *
 * @example
 * <FormField label="Name" htmlFor="name">
 *   <Input id="name" value={name} onChange={...} />
 * </FormField>
 */
export default function FormField({
  label,
  htmlFor,
  className = "",
  children,
  required,
  hint,
}) {
  return (
    <div className={`ui-form-field ${className}`.trim()}>
      {label && (
        <label className="ui-form-label" htmlFor={htmlFor}>
          {label}
          {required && <span style={{ color: "var(--error)", marginLeft: 4 }}>*</span>}
        </label>
      )}
      {children}
      {hint && <span className="ui-field-error">{hint}</span>}
    </div>
  );
}
