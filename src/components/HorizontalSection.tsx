"use client";

import React, { useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./HorizontalSection.scss";

export default function HorizontalSection() {
  const { t } = useTranslation('common');
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scrollX, setScrollX] = useState(0);
  const [isSticky, setIsSticky] = useState(false);
  const [isFinalFixed, setIsFinalFixed] = useState(false);
  const [wrapperTop, setWrapperTop] = useState(0);

  const serviceData = [
    {
      number: "01",
      title: t("service_01_title"),
      description: t("service_01_desc"),
    },
    {
      number: "02",
      title: t("service_02_title"),
      description: t("service_02_desc"),
    },
    {
      number: "03",
      title: t("service_03_title"),
      description: t("service_03_desc"),
    },
    {
      number: "04",
      title: t("service_04_title"),
      description: t("service_04_desc"),
    },
  ];

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
        setIsSticky(false);
        setIsFinalFixed(false);
        const maxScrollX = wrapper.scrollWidth - window.innerWidth;
        setScrollX(maxScrollX);
        setWrapperTop(containerHeight - windowHeight);
      } else {
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
      style={{ height: `${(serviceData.length + 1) * 100}vh` }}
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
        {serviceData.map((item, index) => (
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
              {t("horizontal_end_title").split("\n").map((line, idx) => (
                <React.Fragment key={idx}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </h2>
            <div className="scroll-indicator">
              {t("scroll_indicator")}
              <span className="arrow">↓</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
