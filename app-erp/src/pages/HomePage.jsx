import React, { useEffect, useRef } from "react";
import "./HomePage.css";

const RH = 140;
const RM = 260;
const RS = 380;

function polar(r, a) {
  const rad = (a * Math.PI) / 180;
  return {
    x: r * Math.cos(rad),
    y: r * Math.sin(rad),
  };
}

const HomePage = () => {
  const hoursGroupRef = useRef(null);
  const minutesGroupRef = useRef(null);
  const secondsGroupRef = useRef(null);
  const ampmTextRef = useRef(null);
  const dateTextRef = useRef(null);
  const wrapperRef = useRef(null);

  const secSplashRef = useRef(null);
  const secSplashRef2 = useRef(null);
  const minSplashRef = useRef(null);
  const minSplashRef2 = useRef(null);

  // Generate Hours
  const hours = Array.from({ length: 12 }, (_, i) => {
    const num = i + 1;
    const a = num * 30;
    const pos = polar(RH, a);
    return (
      <text
        key={`h-${num}`}
        className="watch-hour-text"
        x={pos.x}
        y={pos.y}
        transform={`rotate(${a},${pos.x},${pos.y})`}
      >
        {num}
      </text>
    );
  });

  // Generate Minutes
  const minutes = Array.from({ length: 60 }, (_, i) => {
    const a = i * 6;
    const pos = polar(RM, a);
    return (
      <text
        key={`m-${i}`}
        className="watch-minute-text"
        x={pos.x}
        y={pos.y}
        transform={`rotate(${a},${pos.x},${pos.y})`}
      >
        {i.toString().padStart(2, "0")}
      </text>
    );
  });

  // Generate Seconds
  const seconds = Array.from({ length: 60 }, (_, i) => {
    const a = i * 6;
    const pos = polar(RS, a);
    return (
      <text
        key={`s-${i}`}
        className="watch-second-text"
        x={pos.x}
        y={pos.y}
        transform={`rotate(${a},${pos.x},${pos.y})`}
      >
        {i.toString().padStart(2, "0")}
      </text>
    );
  });

  useEffect(() => {
    let animationFrameId;
    let lastSecond = 0;
    let secondTurns = 0;
    let prevSec = new Date().getSeconds();
    let prevMin = new Date().getMinutes();

    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];

    const highlight = (groupNode, cls, index) => {
      if (!groupNode) return;
      const texts = groupNode.querySelectorAll("text");
      texts.forEach((e, i) => {
        e.classList.remove(cls);
        if (i === index) e.classList.add(cls);
      });
    };

    const update = () => {
      const now = new Date();
      const ms = now.getMilliseconds();
      const s = now.getSeconds();
      const m = now.getMinutes();
      const h24 = now.getHours();
      const h = h24 % 12 || 12;

      /* AM PM */
      if (ampmTextRef.current) {
        ampmTextRef.current.textContent = h24 >= 12 ? "PM" : "AM";
      }

      /* DATE */
      if (dateTextRef.current) {
        dateTextRef.current.textContent = `${now.getDate()} ${
          months[now.getMonth()]
        } ${now.getFullYear()}`;
      }

      /* SECOND SMOOTH ROTATION */
      const sec = s + ms / 1000;
      if (s < lastSecond) {
        secondTurns += 60;
      }
      lastSecond = s;

      const continuousSeconds = secondTurns + sec;
      if (secondsGroupRef.current) {
        secondsGroupRef.current.setAttribute(
          "transform",
          `rotate(${-continuousSeconds * 6})`
        );
        highlight(secondsGroupRef.current, "watch-active-second", s);
      }

      if (s !== prevSec) {
        if (secSplashRef.current && secSplashRef2.current) {
          secSplashRef.current.classList.remove("watch-play-splash-sec");
          secSplashRef2.current.classList.remove("watch-play-splash-sec-2");
          void secSplashRef.current.getBoundingClientRect(); // trigger reflow
          secSplashRef.current.classList.add("watch-play-splash-sec");
          secSplashRef2.current.classList.add("watch-play-splash-sec-2");
        }
        prevSec = s;
      }

      /* MINUTE SNAP */
      const minProgress = m;
      if (minutesGroupRef.current) {
        minutesGroupRef.current.setAttribute(
          "transform",
          `rotate(${-minProgress * 6})`
        );
        highlight(minutesGroupRef.current, "watch-active-minute", m);
      }

      if (m !== prevMin) {
        if (minSplashRef.current && minSplashRef2.current) {
          minSplashRef.current.classList.remove("watch-play-splash-min");
          minSplashRef2.current.classList.remove("watch-play-splash-min-2");
          void minSplashRef.current.getBoundingClientRect();
          minSplashRef.current.classList.add("watch-play-splash-min");
          minSplashRef2.current.classList.add("watch-play-splash-min-2");
        }
        prevMin = m;
      }

      /* HOUR SNAP */
      const hrProgress = h;
      if (hoursGroupRef.current) {
        hoursGroupRef.current.setAttribute(
          "transform",
          `rotate(${-hrProgress * 30})`
        );
        highlight(hoursGroupRef.current, "watch-active-hour", h - 1);
      }

      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);

    const handleMouseMove = (e) => {
      if (wrapperRef.current) {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 10;
        wrapperRef.current.style.transform = `translateY(-50%) perspective(900px) rotateY(${x}deg) rotateX(${-y}deg)`;
      }
    };

    //document.addEventListener("mousemove", handleMouseMove);

    return () => {
      cancelAnimationFrame(animationFrameId);
      //document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="watch-home-container">
      <div className="watch-grid-bg"></div>

      <div className="watch-clock-wrapper" ref={wrapperRef}>
        <svg className="watch-clock-svg" viewBox="0 0 450 800" preserveAspectRatio="xMinYMid meet">
          {/* window */}
          <rect
            x="0"
            y="370"
            width="450"
            height="60"
            className="watch-highlight-window"
          />

          <line x1="0" y1="370" x2="450" y2="370" className="watch-window-border" />
          <line x1="0" y1="430" x2="450" y2="430" className="watch-window-border" />

          <line x1="0" y1="400" x2="450" y2="400" className="watch-center-laser" />

          {/* Water Splash Ripples */}
          <circle ref={minSplashRef} className="watch-splash-ripple watch-min-ripple" cx={RM} cy="400" r="0" />
          <circle ref={minSplashRef2} className="watch-splash-ripple watch-min-ripple-2" cx={RM} cy="400" r="0" />
          <circle ref={secSplashRef} className="watch-splash-ripple watch-sec-ripple" cx={RS} cy="400" r="0" />
          <circle ref={secSplashRef2} className="watch-splash-ripple watch-sec-ripple-2" cx={RS} cy="400" r="0" />

          <text ref={ampmTextRef} className="watch-ampm-text" x="60" y="390">
            AM
          </text>
          <text ref={dateTextRef} className="watch-date-text" x="60" y="420">
            14 MAR 2026
          </text>

          <g id="clock-center" transform="translate(0,400)">
            <circle r="140" className="watch-ring" />
            <circle r="260" className="watch-ring" />
            <circle r="380" className="watch-ring" />

            <g ref={hoursGroupRef}>{hours}</g>
            <g ref={minutesGroupRef}>{minutes}</g>
            <g ref={secondsGroupRef}>{seconds}</g>
          </g>
        </svg>

        <div className="watch-fade-overlay"></div>
      </div>
    </div>
  );
};

export default HomePage;