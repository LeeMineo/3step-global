"use client";

import { useEffect } from "react";

export default function ScrollToTop() {
  useEffect(() => {
    // 페이지 로드 시 맨 위로
    window.scrollTo(0, 0);

    // 브라우저 스크롤 복원 비활성화
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  return null;
}


//새로고침시 페이지 처음부터 시작
