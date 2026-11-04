export function Field({ label, htmlFor, required = false, error, hint, full = false, children }) {
  return (
    <div className={`field${full ? " field--full" : ""}`}>
      {label ? (
        <label className="field__label" htmlFor={htmlFor}>
          {label}
          {required ? <span className="field__required"> *</span> : null}
        </label>
      ) : null}

      {children}

      {error ? <span className="field__error">{error}</span> : null}
      {!error && hint ? <span className="field__hint">{hint}</span> : null}
    </div>
  );
}

export function Input({ className = "", mono = false, ...props }) {
  const classes = ["input"];
  if (mono) classes.push("input--mono");
  if (className) classes.push(className);

  return <input className={classes.join(" ")} {...props} />;
}

export function Select({ className = "", children, ...props }) {
  return (
    <select className={`select${className ? ` ${className}` : ""}`} {...props}>
      {children}
    </select>
  );
}

export function Textarea({ className = "", ...props }) {
  return <textarea className={`textarea${className ? ` ${className}` : ""}`} {...props} />;
}
