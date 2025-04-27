"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next"; // react-i18next!
import i18n from "@/lib/i18n"; // 직접 초기화한 i18n import!
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { languages } from "@/i18n/settings";
import "./FloatingHeader.scss";

export default function FloatingHeader() {
  const { t } = useTranslation('common');
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

  // ✅ 언어 변경 (URL 변화 없음)
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value.toLowerCase();
    i18n.changeLanguage(lang); // 안전하게 언어 변경!
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
            <a href="#company">{t('overview')}</a>
            <a href="#creators">{t('service')}</a>
            <a href="#business">{t('reference')}</a>
            <a href="#contact">{t('contact')}</a>
            <select onChange={handleLanguageChange} value={i18n.language?.toUpperCase() ?? 'KO'}>
              {languages.map((lng) => (
                <option key={lng} value={lng.toUpperCase()}>
                  {lng.toUpperCase()}
                </option>
              ))}
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
                <a href="#company">{t('overview')}</a>
                <a href="#creators">{t('service')}</a>
                <a href="#business">{t('reference')}</a>
                <a href="#contact">{t('contact')}</a>
                <select onChange={handleLanguageChange} value={i18n.language?.toUpperCase() ?? 'KO'}>
                  {languages.map((lng) => (
                    <option key={lng} value={lng.toUpperCase()}>
                      {lng.toUpperCase()}
                    </option>
                  ))}
                </select>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
