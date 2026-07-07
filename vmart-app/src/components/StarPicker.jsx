import { useState } from "react";

export default function StarPicker({ value, onChange, size = 24 }) {
  const [hover, setHover] = useState(0);
  return (
    <span className="shop-star-picker">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          onClick={() => onChange(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          className="shop-star-picker-star"
          style={{
            fontSize: size,
            color: i <= (hover || value) ? "#f59e0b" : "var(--border)",
            transform: hover >= i ? "scale(1.15)" : "scale(1)",
          }}
        >
          ★
        </span>
      ))}
    </span>
  );
}
