"use client";

import { useEffect, useRef, useState } from "react";
import "./Influencer.scss";

export default function Influencer_Intro() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [circleScale, setCircleScale] = useState(0.2);
  const [showCircle, setShowCircle] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!wrapperRef.current) return;

      const wrapperRect = wrapperRef.current.getBoundingClientRect();
      
      // 섹션의 끝 지점 + 추가 10vw 거리 계산
      const additionalDistance = window.innerWidth * 0.1; // 10vw
      const sectionBottom = wrapperRect.bottom + additionalDistance;
      
      // 섹션이 화면에 보이거나 추가 거리 이내에 있으면 원 표시
      const isVisible = wrapperRect.top < window.innerHeight && sectionBottom > 0;
      
      // 원 표시 여부 설정 (즉시 변경)
      setShowCircle(isVisible);
      
      if (isVisible) {
        // 스케일 계산은 기존과 동일하게 유지
        const top = wrapperRef.current.offsetTop;
        const scrollY = window.scrollY;
        const winH = window.innerHeight;
        const distance = scrollY - (top - winH);
        const progress = Math.min(Math.max(distance / winH, 0), 1);
        const scale = 0.2 + progress * 2.5;
        setCircleScale(scale);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="intro-wrapper">
      {showCircle && (
        <div
          className="circle-reveal"
          style={{ 
            transform: `scale(${circleScale})`
          }}
        />
      )}

      {/* 인트로 */}
      <section className="intro-section">
        <div className="intro-floating-text">
          <h1>
            <span>Meet the Icons</span>
            <br />
            <span>Behind Our Influence</span>
          </h1>
          <div className="scroll-down-arrow">↓</div>
        </div>
      </section>
    </div>
  );
}