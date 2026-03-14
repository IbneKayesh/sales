import React, { useState, useRef, useEffect } from 'react';
import './Calculator.css';

const Calculator = ({ visible, onClose }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  const [currentVal, setCurrentVal] = useState("0");
  const [previousVal, setPreviousVal] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForNewVal, setWaitingForNewVal] = useState(false);
  const [expression, setExpression] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (visible && !isInitialized) {
      setPosition({
        x: window.innerWidth / 2 - 160,
        y: Math.max(80, window.innerHeight / 2 - 250)
      });
      setIsInitialized(true);
    }
  }, [visible, isInitialized]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        let newX = e.clientX - offsetRef.current.x;
        let newY = e.clientY - offsetRef.current.y;
        newX = Math.max(0, Math.min(newX, window.innerWidth - 320));
        newY = Math.max(0, Math.min(newY, window.innerHeight - 40));
        setPosition({ x: newX, y: newY });
      }
    };
    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = (e) => {
    if (dragRef.current && dragRef.current.contains(e.target) && e.target.tagName !== 'BUTTON') {
      setIsDragging(true);
      offsetRef.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    }
  };

  const createRipple = (event) => {
    const button = event.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add("ripple");
    const ripple = button.getElementsByClassName("ripple")[0];
    if (ripple) ripple.remove();
    button.appendChild(circle);
  };

  const formatDisplayOperator = (op) => {
    if (op === '*') return '×';
    if (op === '/') return '÷';
    if (op === '-') return '−';
    return op;
  };

  const inputDigit = (digit) => {
    if (waitingForNewVal) {
      setCurrentVal(String(digit));
      setWaitingForNewVal(false);
    } else {
      setCurrentVal(currentVal === "0" ? String(digit) : currentVal + digit);
    }
  };

  const inputDot = () => {
    if (waitingForNewVal) {
      setCurrentVal("0.");
      setWaitingForNewVal(false);
    } else if (currentVal.indexOf(".") === -1) {
      setCurrentVal(currentVal + ".");
    }
  };

  const clearAll = () => {
    setCurrentVal("0");
    setPreviousVal(null);
    setOperator(null);
    setExpression("");
    setWaitingForNewVal(false);
  };

  const clearEntry = () => {
    setCurrentVal("0");
  };

  const backspace = () => {
    if (!waitingForNewVal) {
      setCurrentVal(currentVal.length > 1 ? currentVal.slice(0, -1) : "0");
    }
  };

  const performOperation = (op) => {
    const inputValue = parseFloat(currentVal);

    if (previousVal == null) {
      setPreviousVal(inputValue);
      setExpression(`${currentVal} ${formatDisplayOperator(op)}`);
    } else if (operator && !waitingForNewVal) {
      const currentValue = previousVal;
      let newValue = currentValue;
      
      switch (operator) {
        case '+': newValue = currentValue + inputValue; break;
        case '-': newValue = currentValue - inputValue; break;
        case '*': newValue = currentValue * inputValue; break;
        case '/': newValue = currentValue / inputValue; break;
        default: break;
      }
      
      newValue = parseFloat(newValue.toFixed(8));
      setPreviousVal(newValue);
      setExpression(`${newValue} ${formatDisplayOperator(op)}`);
      setCurrentVal(String(newValue));
    } else {
      setExpression(`${previousVal} ${formatDisplayOperator(op)}`);
    }

    setWaitingForNewVal(true);
    setOperator(op);
  };

  const calculateEquals = () => {
    if (!operator || previousVal == null) return;

    const inputValue = parseFloat(currentVal);
    const currentValue = previousVal;
    let newValue = currentValue;

    switch (operator) {
      case '+': newValue = currentValue + inputValue; break;
      case '-': newValue = currentValue - inputValue; break;
      case '*': newValue = currentValue * inputValue; break;
      case '/': newValue = currentValue / inputValue; break;
      default: break;
    }

    newValue = parseFloat(newValue.toFixed(8));
    const newExpr = `${currentValue} ${formatDisplayOperator(operator)} ${inputValue} =`;
    
    setHistory(prev => [{ expr: newExpr, result: String(newValue) }, ...prev].slice(0, 15)); 
    setExpression(newExpr);
    setCurrentVal(String(newValue));
    setPreviousVal(null);
    setOperator(null);
    setWaitingForNewVal(true);
  };

  const handleButtonClick = (e, type, value) => {
    createRipple(e);
    if (type === 'number') inputDigit(value);
    else if (type === 'dot') inputDot();
    else if (type === 'clear') clearAll();
    else if (type === 'clearEntry') clearEntry();
    else if (type === 'backspace') backspace();
    else if (type === 'operator') performOperation(value);
    else if (type === 'equals') calculateEquals();
  };
  
  useEffect(() => {
    if (!visible) return;

    const handleKeyDown = (e) => {
      if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        inputDigit(Number(e.key));
      } else if (e.key === '.') {
        inputDot();
      } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        performOperation(e.key);
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculateEquals();
      } else if (e.key === 'Backspace') {
        backspace();
      } else if (e.key === 'Escape') {
        clearAll();
      } else if (e.key.toLowerCase() === 'c') {
        clearEntry();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [visible, currentVal, previousVal, operator, waitingForNewVal, expression, history]);

  const formatValue = (val) => {
    const parts = val.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join('.');
  };

  if (!visible) return null;

  return (
    <div className="calculator-window" style={{ left: position.x, top: position.y }}>
      <div className="calculator-header" ref={dragRef} onMouseDown={handleMouseDown}>
        <span>Calculator</span>
        <button className="calculator-close" onClick={onClose} title="Close">×</button>
      </div>

      <div className={`calculator-history-panel ${showHistory ? 'show' : ''}`}>
        <div className="flex justify-content-between align-items-center mb-3">
          <span style={{color: '#00ffcc', fontWeight: 'bold'}}>History</span>
          <button style={{background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '20px'}} onClick={() => setShowHistory(false)}>×</button>
        </div>
        {history.length === 0 ? (
          <div style={{color: '#888', textAlign: 'center', marginTop: '30px'}}>No history yet</div>
        ) : (
          history.map((item, idx) => (
            <div key={idx} className="history-item" onClick={() => {
              setCurrentVal(item.result);
              setExpression("");
              setOperator(null);
              setPreviousVal(null);
              setWaitingForNewVal(true);
              setShowHistory(false);
            }}>
              <div className="history-expr">{item.expr}</div>
              <div className="history-result">{formatValue(item.result)}</div>
            </div>
          ))
        )}
      </div>

      <div className="calculator-body">
        <button className="calculator-history-btn" onClick={() => setShowHistory(!showHistory)} title="History">
          <i className="pi pi-history p-mr-1"></i> {history.length} History
        </button>
        
        <div className="calculator-displays">
          <div className="calculator-expr-display" title={expression}>{expression || '\u00A0'}</div>
          <div className="calculator-main-display" title={currentVal}>{formatValue(currentVal)}</div>
        </div>

        <div className="calculator-keypad">
          <button className="calc-btn clear" onClick={(e) => handleButtonClick(e, 'clear')}>AC</button>
          <button className="calc-btn clear" onClick={(e) => handleButtonClick(e, 'clearEntry')}>C</button>
          <button className="calc-btn operator" onClick={(e) => handleButtonClick(e, 'backspace')}>⌫</button>
          <button className="calc-btn operator" onClick={(e) => handleButtonClick(e, 'operator', '/')}>÷</button>

          <button className="calc-btn number" onClick={(e) => handleButtonClick(e, 'number', 7)}>7</button>
          <button className="calc-btn number" onClick={(e) => handleButtonClick(e, 'number', 8)}>8</button>
          <button className="calc-btn number" onClick={(e) => handleButtonClick(e, 'number', 9)}>9</button>
          <button className="calc-btn operator" onClick={(e) => handleButtonClick(e, 'operator', '*')}>×</button>

          <button className="calc-btn number" onClick={(e) => handleButtonClick(e, 'number', 4)}>4</button>
          <button className="calc-btn number" onClick={(e) => handleButtonClick(e, 'number', 5)}>5</button>
          <button className="calc-btn number" onClick={(e) => handleButtonClick(e, 'number', 6)}>6</button>
          <button className="calc-btn operator" onClick={(e) => handleButtonClick(e, 'operator', '-')}>−</button>

          <button className="calc-btn number" onClick={(e) => handleButtonClick(e, 'number', 1)}>1</button>
          <button className="calc-btn number" onClick={(e) => handleButtonClick(e, 'number', 2)}>2</button>
          <button className="calc-btn number" onClick={(e) => handleButtonClick(e, 'number', 3)}>3</button>
          <button className="calc-btn operator" onClick={(e) => handleButtonClick(e, 'operator', '+')}>+</button>

          <button className="calc-btn number" style={{gridColumn: 'span 2'}} onClick={(e) => handleButtonClick(e, 'number', 0)}>0</button>
          <button className="calc-btn number" onClick={(e) => handleButtonClick(e, 'dot')}>.</button>
          <button className="calc-btn equals" onClick={(e) => handleButtonClick(e, 'equals')}>=</button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
