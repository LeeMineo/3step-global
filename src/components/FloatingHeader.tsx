"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import "./FloatingHeader.scss";

export default function FloatingHeader() {
  const [showHeader, setShowHeader] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  // ✅ 커서 위치에 따라 헤더 표시/숨김
  useEffect(() => {
    const threshold = 50;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;

      if (
        clientY <= threshold ||
        clientX <= threshold ||
        window.innerWidth - clientX <= threshold
      ) {
        setShowHeader(true);
      } else {
        // 메뉴가 열려 있지 않을 때만 숨김
        if (!isMobileMenuOpen) {
          setShowHeader(false);
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobileMenuOpen]);

  // ✅ 외부 클릭 & 스크롤 시 모바일 메뉴 닫기
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        headerRef.current &&
        !headerRef.current.contains(e.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    const handleScroll = () => {
      if (isMobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("click", handleClick);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobileMenuOpen]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // 언어 변경 로직 (추후 i18n 연결 가능)
    const lang = e.target.value;
    console.log("Selected language:", lang);
  };

  return (
    <AnimatePresence>
      {showHeader && (
        <motion.header
          ref={headerRef}
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="floating-header"
        >
          <div className="header-left">
            <Image src="/logo/3STEP_LOGO_COL.png" alt="3STEP GLOBAL Logo" width={120} height={40} />
          </div>

          {/* 데스크탑 nav */}
          <nav className="header-nav desktop-only">
            <a href="#company">Overview</a>
            <a href="#creators">Service</a>
            <a href="#business">Reference</a>
            <a href="#contact">Contact</a>
            <select onChange={handleLanguageChange}>
              <option value="KO">KO</option>
              <option value="EN">EN</option>
              <option value="JP">JP</option>
            </select>
          </nav>

          {/* 햄버거 버튼 (모바일) */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            ☰
          </button>

          {/* 모바일 메뉴 */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                className="mobile-menu"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <a href="#company">Overview</a>
                <a href="#creators">Service</a>
                <a href="#business">Reference</a>
                <a href="#contact">Contact</a>
                <select onChange={handleLanguageChange}>
                  <option value="KO">KO</option>
                  <option value="EN">EN</option>
                  <option value="JP">JP</option>
                </select>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
