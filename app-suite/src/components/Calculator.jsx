import { useEffect, useRef, useState } from "react";
import Modal, { ModalHeader } from "@/components/Modal";
import { IconClose, IconCollapse, IconExpand } from "@/icons";

const CALC_WIDTH = 272;
const HISTORY_MAX = 10;

const compute = (a, b, op) => {
  switch (op) {
    case "+":
      return a + b;
    case "−":
      return a - b;
    case "×":
      return a * b;
    case "÷":
      return b === 0 ? NaN : a / b;
    default:
      return b;
  }
};

const format = (n) => {
  if (!isFinite(n)) return "Error";
  return String(parseFloat(n.toPrecision(12)));
};

// Map a physical keyboard key to the keypad label that should light up.
const keyToLabel = (k) => {
  if (/^[0-9]$/.test(k)) return k;
  if (k === ".") return ".";
  if (k === "Enter" || k === "=") return "=";
  if (k === "+") return "+";
  if (k === "-") return "−";
  if (k === "*") return "×";
  if (k === "/") return "÷";
  if (k === "%") return "%";
  if (k.toLowerCase() === "c") return "C";
  if (k.toLowerCase() === "n" || k === "F9") return "±"; // toggle sign
  if (k === "Backspace") return "⌫";
  return null;
};

const keyStyles = {
  digit: {
    background: "var(--surface-alt)",
    color: "var(--text-primary)",
    borderColor: "var(--border-light)",
  },
  op: {
    background: "var(--primary-bg)",
    color: "var(--primary)",
    borderColor: "var(--primary-border)",
  },
  fn: {
    background: "transparent",
    color: "var(--text-secondary)",
    borderColor: "transparent",
  },
  equals: {
    background: "var(--primary)",
    color: "var(--primary-on)",
    borderColor: "var(--primary)",
  },
};

/* Keypad button with hover + pressed feedback (inline styles, no CSS).
   `active` lights it up for keyboard input. */
const Key = ({ variant, label, onClick, span, active, title }) => {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const base = keyStyles[variant] || keyStyles.digit;
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onBlur={() => {
        setHovered(false);
        setPressed(false);
      }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "10px 0",
        fontSize: 15,
        fontWeight: 600,
        borderRadius: "var(--radius-md)",
        border: "1px solid",
        cursor: "pointer",
        fontFamily: "var(--font-sans)",
        boxShadow: hovered ? "var(--shadow-xs)" : "none",
        transition: "all 0.08s ease",
        ...base,
        ...(hovered ? { filter: "brightness(0.94)" } : {}),
        ...(pressed || active
          ? { transform: "scale(0.94)", filter: "brightness(0.85)" }
          : {}),
        ...(span ? { gridColumn: `span ${span}` } : {}),
      }}
    >
      {label}
    </button>
  );
};

/**
 * Standalone calculator with its own draggable modal. Renders as a
 * non-blocking floating window (transparent overlay, page stays usable
 * behind it). Shows the current equation above the result and keeps the
 * last 10 calculations in a history panel (click an entry to reuse its
 * result). Supports direct keyboard input while open. Drag the header to
 * move it; close via the X, Escape or the keyboard.
 */
export default function Calculator({ open, onClose }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState(null);
  const [op, setOp] = useState(null);
  const [eq, setEq] = useState(""); // full equation chain typed so far
  const [overwrite, setOverwrite] = useState(true);
  const [lastEq, setLastEq] = useState(null);
  const [history, setHistory] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [activeKey, setActiveKey] = useState(null); // keypad button lit by keyboard
  const dragRef = useRef(null);
  const keyHandlerRef = useRef(null);
  const keyTimerRef = useRef(null); // clears the keyboard blink

  const pushHistory = (expression, result) => {
    setHistory((h) =>
      [{ id: Date.now(), expression, result }, ...h].slice(0, HISTORY_MAX),
    );
  };

  const inputDigit = (d) => {
    if (overwrite) {
      setDisplay(d);
      setOverwrite(false);
    } else {
      setDisplay((cur) =>
        cur.length >= 12 ? cur : cur === "0" ? d : cur + d,
      );
    }
  };

  const inputDot = () => {
    if (overwrite) {
      setDisplay("0.");
      setOverwrite(false);
    } else {
      setDisplay((cur) => (cur.includes(".") ? cur : cur + "."));
    }
  };

  const backspace = () => {
    if (display === "Error" || overwrite) {
      setDisplay("0");
      setOverwrite(true);
    } else {
      setDisplay((cur) => (cur.length > 1 ? cur.slice(0, -1) : "0"));
    }
  };

  const clearAll = () => {
    setDisplay("0");
    setPrev(null);
    setOp(null);
    setOverwrite(true);
    setLastEq(null);
    setEq("");
  };

  const clearHistory = () => setHistory([]);

  const setOperator = (nextOp) => {
    const cur = parseFloat(display);
    if (op != null && prev != null && !overwrite) {
      // Chaining: evaluate the pending pair, then keep typing.
      const result = format(compute(prev, cur, op));
      pushHistory(`${format(prev)} ${op} ${display}`, result);
      setDisplay(result);
      setPrev(parseFloat(result)); // keep numeric so chained ops don't concat
      setEq((e) => `${e}${display} ${nextOp} `);
    } else if (op != null && overwrite) {
      // Operator pressed twice in a row: just replace the pending one.
      setEq((e) => `${e.slice(0, -2)} ${nextOp} `);
      setPrev(cur);
    } else {
      setPrev(cur);
      setEq((e) => `${e}${display} ${nextOp} `);
    }
    setLastEq(null);
    setOp(nextOp);
    setOverwrite(true);
  };

  const equals = () => {
    if (op == null || prev == null) return;
    const expression = `${eq}${display}`;
    const result = format(compute(prev, parseFloat(display), op));
    pushHistory(expression, result);
    setDisplay(result);
    setPrev(null);
    setOp(null);
    setOverwrite(true);
    setLastEq(`${expression} =`);
    setEq("");
  };

  const toggleSign = () => {
    if (display === "0" || display === "Error") return;
    setDisplay(format(-parseFloat(display)));
  };

  const percent = () => {
    if (display === "Error") return;
    setDisplay(format(parseFloat(display) / 100));
  };

  // Expression shown above the result: the full pending chain, or the last
  // completed equation right after "=".
  const expressionText =
    lastEq && op == null && prev == null && overwrite
      ? `${lastEq} ${display}` // finished: e.g. "5 + 3 = 8"
      : overwrite
        ? eq
        : `${eq}${display}`;

  // Always append the live result of the pending equation (e.g. typing "7"
  // after "5 + 3" shows "5 + 3 = 8" immediately, updating each keystroke).
  const liveOperand = op != null && prev != null && !overwrite;
  const equationText = liveOperand
    ? `${expressionText} = ${format(compute(prev, parseFloat(display), op))}`
    : expressionText;

  // Select a history entry: reuse its result, reset the calculator to its
  // default (collapsed) size and close the history panel.
  const reuseHistory = (entry) => {
    setDisplay(entry.result);
    setPrev(null);
    setOp(null);
    setOverwrite(true);
    setLastEq(null);
    setEq("");
    setExpanded(false);
  };

  // Keep the latest key handler (always uses current state/closures).
  useEffect(() => {
    keyHandlerRef.current = (e) => {
      const t = e.target;
      if (
        t.tagName === "INPUT" ||
        t.tagName === "TEXTAREA" ||
        t.isContentEditable
      ) {
        return; // don't steal keys while the user types in a field
      }
      const k = e.key;
      // Light up the matching keypad button for a moment.
      const label = keyToLabel(k);
      if (label) {
        setActiveKey(label);
        clearTimeout(keyTimerRef.current);
        keyTimerRef.current = setTimeout(() => setActiveKey(null), 180);
      }
      if (/^[0-9]$/.test(k)) {
        inputDigit(k);
        e.preventDefault();
      } else if (k === ".") {
        inputDot();
        e.preventDefault();
      } else if (k === "Enter" || k === "=") {
        equals();
        e.preventDefault();
      } else if (k === "Backspace") {
        backspace();
        e.preventDefault();
      } else if (k === "+" || k === "-" || k === "*" || k === "/") {
        const opMap = { "+": "+", "-": "−", "*": "×", "/": "÷" };
        setOperator(opMap[k]);
        e.preventDefault();
      } else if (k === "%") {
        percent();
      } else if (k.toLowerCase() === "c") {
        clearAll();
      } else if (k.toLowerCase() === "n" || k === "F9") {
        toggleSign();
        e.preventDefault();
      }
    };
  });

  // Bind keyboard input while the calculator is open.
  useEffect(() => {
    if (!open) return;
    const handler = (e) => keyHandlerRef.current?.(e);
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      clearTimeout(keyTimerRef.current);
      setActiveKey(null);
    };
  }, [open]);

  // Drag the header to move the calculator around the screen.
  const startDrag = (e) => {
    if (e.target.closest("button")) return; // keep close button clickable
    e.preventDefault();
    dragRef.current = { startX: e.clientX, startY: e.clientY, startPos: pos };
    const onMove = (ev) => {
      const d = dragRef.current;
      if (!d) return;
      const halfW = Math.max(0, (window.innerWidth - CALC_WIDTH) / 2);
      const minX = 60 - halfW;
      const maxX = halfW - 60;
      const halfH = window.innerHeight / 2;
      const minY = 40 - halfH;
      const maxY = halfH - 40;
      setPos({
        x:
          maxX >= minX
            ? Math.min(
                Math.max(d.startPos.x + (ev.clientX - d.startX), minX),
                maxX,
              )
            : 0,
        y:
          maxY >= minY
            ? Math.min(
                Math.max(d.startPos.y + (ev.clientY - d.startY), minY),
                maxY,
              )
            : 0,
      });
    };
    const onUp = () => {
      dragRef.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    document.body.style.cursor = "grabbing";
    document.body.style.userSelect = "none";
  };

  return (
    <Modal
      open={open}
      size="sm"
      onClose={onClose}
      closeOnBackdrop={false}
      blockScroll={false}
      modalStyle={{
        width: CALC_WIDTH,
        maxWidth: "none",
        position: "relative",
        pointerEvents: "auto",
      }}
      style={{
        background: "transparent",
        backdropFilter: "none",
        pointerEvents: "none",
        zIndex: 1001,
        transform: `translate(${pos.x}px, ${pos.y}px)`,
      }}
    >
      <ModalHeader onMouseDown={startDrag} style={{ cursor: "grab" }}>
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "var(--text-primary)",
          }}
        >
          Calculator
        </span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            flexShrink: 0,
          }}
        >
          <button
            type="button"
            className="modal__close"
            style={{ marginTop: 0 }}
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? "Collapse calculator" : "Expand calculator"}
            title={expanded ? "Collapse" : "Expand to show history"}
          >
            {expanded ? <IconCollapse size={16} /> : <IconExpand size={16} />}
          </button>
          <button
            type="button"
            className="modal__close"
            style={{ marginTop: 0 }}
            onClick={onClose}
            aria-label="Close calculator"
            title="Close"
          >
            <IconClose size={16} />
          </button>
        </div>
      </ModalHeader>
      <div
        style={{
          padding: 12,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {/* Equation + result display */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            padding: "10px 12px",
            background: "var(--surface-alt)",
            border: "1px solid var(--border-light)",
            borderRadius: "var(--radius-lg)",
          }}
        >
          <div
            style={{
              textAlign: "right",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              lineHeight: 1.4,
              color: "var(--text-muted)",
              minHeight: 15,
              maxHeight: 44,
              overflowY: "auto",
              wordBreak: "break-all",
            }}
          >
            {equationText || "\u00A0"}
          </div>
          <div
            style={{
              textAlign: "right",
              fontFamily: "var(--font-mono)",
              fontSize: 22,
              fontWeight: 600,
              color: "var(--text-primary)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              minHeight: 30,
            }}
          >
            {display}
          </div>
        </div>

        {/* Keypad */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 6,
          }}
        >
          <Key
            variant="fn"
            label="C"
            active={activeKey === "C"}
            onClick={clearAll}
          />
          <Key
            variant="fn"
            label="±"
            active={activeKey === "±"}
            onClick={toggleSign}
            title="Toggle sign (n or F9)"
          />
          <Key
            variant="fn"
            label="%"
            active={activeKey === "%"}
            onClick={percent}
          />
          <Key
            variant="op"
            label="÷"
            active={activeKey === "÷"}
            onClick={() => setOperator("÷")}
          />
          {["7", "8", "9"].map((d) => (
            <Key
              key={d}
              variant="digit"
              label={d}
              active={activeKey === d}
              onClick={() => inputDigit(d)}
            />
          ))}
          <Key
            variant="op"
            label="×"
            active={activeKey === "×"}
            onClick={() => setOperator("×")}
          />
          {["4", "5", "6"].map((d) => (
            <Key
              key={d}
              variant="digit"
              label={d}
              active={activeKey === d}
              onClick={() => inputDigit(d)}
            />
          ))}
          <Key
            variant="op"
            label="−"
            active={activeKey === "−"}
            onClick={() => setOperator("−")}
          />
          {["1", "2", "3"].map((d) => (
            <Key
              key={d}
              variant="digit"
              label={d}
              active={activeKey === d}
              onClick={() => inputDigit(d)}
            />
          ))}
          <Key
            variant="op"
            label="+"
            active={activeKey === "+"}
            onClick={() => setOperator("+")}
          />
          <Key
            variant="fn"
            label="⌫"
            active={activeKey === "⌫"}
            onClick={backspace}
            title="Backspace"
          />
          <Key
            variant="digit"
            label="0"
            active={activeKey === "0"}
            onClick={() => inputDigit("0")}
          />
          <Key
            variant="digit"
            label="."
            active={activeKey === "."}
            onClick={inputDot}
          />
          <Key
            variant="equals"
            label="="
            active={activeKey === "="}
            onClick={equals}
          />
        </div>

        {/* History — last 10 calculations (visible when expanded) */}
        {expanded && (
          <div
            style={{
              borderTop: "1px solid var(--border-light)",
              paddingTop: 8,
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: 0.6,
                }}
              >
                History
              </span>
              <button
                type="button"
                onClick={clearHistory}
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Clear
              </button>
            </div>              {history.length === 0 ? (
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    padding: "6px 2px",
                  }}
                >
                  No calculations yet
                </div>
              ) : (
                <div
                  style={{
                    maxHeight: 160,
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                {history.map((h) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => reuseHistory(h)}
                  title="Click to reuse result"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "3px 6px",
                    borderRadius: "var(--radius-md)",
                    fontSize: 12,
                    fontFamily: "var(--font-mono)",
                    color: "var(--text-secondary)",
                    textAlign: "left",
                  }}
                >
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h.expression}
                  </span>
                  <span
                    style={{
                      color: "var(--text-primary)",
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    = {h.result}
                  </span>
                </button>
                ))}
                </div>
              )}
            </div>
          )}
        </div>
    </Modal>
  );
}
