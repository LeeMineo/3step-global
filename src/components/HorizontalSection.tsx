"use client";

import React, { useRef, useEffect, useState } from "react";
import "./HorizontalSection.scss";

const data = [
  {
    number: "01",
    title: "Content Planning",
    description: "광고·콘텐츠 기획팀은 광고 기획부터 외부 업체와의 협업을 통해 큰 규모의 광고를 진행합니다.",
  },
  {
    number: "02",
    title: "Live Agency",
    description: "단순 라이브뿐만 아니라 광고, 마케팅 & 커머스 비즈니스까지 연계 가능한 콘텐츠 IP 사업도 함께 진행하고 있습니다.",
  },
  {
    number: "03",
    title: "Live Commerce",
    description: "숏폼 콘텐츠와 커머스를 함께 기획하여 높은 전환을 이끌어내며, 다양한 카테고리로 영역을 확장하고 있습니다.",
  },
  {
    number: "04",
    title: "Viral Marketing",
    description: "SNS를 통해 자연스러운 소문을 조성하여 진짜처럼 느껴지는 콘텐츠를 기획하고, 지속적 효과를 유도합니다.",
  },
];

export default function HorizontalSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scrollX, setScrollX] = useState(0);
  const [isSticky, setIsSticky] = useState(false);
  const [isFinalFixed, setIsFinalFixed] = useState(false);
  const [wrapperTop, setWrapperTop] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      const wrapper = wrapperRef.current;
      if (!container || !wrapper) return;

      const containerTop = container.offsetTop;
      const containerHeight = container.offsetHeight;
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      const scrollStart = containerTop;
      const scrollEnd = containerTop + containerHeight - windowHeight;

      if (scrollY >= scrollStart && scrollY <= scrollEnd) {
        setIsSticky(true);
        setIsFinalFixed(false);
        const progress = (scrollY - scrollStart) / (scrollEnd - scrollStart);
        const maxScrollX = wrapper.scrollWidth - window.innerWidth;
        setScrollX(progress * maxScrollX);
        setWrapperTop(0);
      } else if (scrollY > scrollEnd) {
        // 마지막 고정 위치
        setIsSticky(false);
        setIsFinalFixed(false);
        const maxScrollX = wrapper.scrollWidth - window.innerWidth;
        setScrollX(maxScrollX);
        setWrapperTop(containerHeight - windowHeight);
      } else {
        // 시작 전
        setIsSticky(false);
        setIsFinalFixed(false);
        setScrollX(0);
        setWrapperTop(0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="horizontal-section-outer"
      style={{ height: `${(data.length + 1) * 100}vh` }}
    >
      <div
        ref={wrapperRef}
        className={`horizontal-wrapper ${
          isFinalFixed ? "final-fixed" : isSticky ? "fixed" : "after-fixed"
        }`}
        style={{
          transform: `translateX(-${scrollX}px)`,
          top: isSticky || isFinalFixed ? 0 : wrapperTop,
        }}
      >
        {data.map((item, index) => (
          <div className="horizontal-item" key={index}>
            <div className="item-number">{item.number}</div>
            <h2>SERVICE {index + 1}</h2>
            <p>{item.title.toUpperCase()}</p>
            <p>{item.description}</p>
            <div className="read-more">read more</div>
          </div>
        ))}

        {/* 끝 섹션 */}
        <div className="horizontal-end-section">
          <div className="end-main-title">
            <h2>
              쓰리스텝 글로벌은 <br />
              국내 최초 MCN&라이브 사업을 <br />
              병행하는 기업입니다.
            </h2>
            <div className="scroll-indicator">
              The influence of our company
              <span className="arrow">↓</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}