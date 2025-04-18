"use client";

import React, { useRef, useEffect, useState, JSX } from "react";
import "./CollaborationSection.scss";
import CollabContent from "./CollabContent"; // 내부 콘텐츠 컴포넌트 임포트

// 타입 정의
type Collaboration = {
  id: string;
  title: string;
  username: string;
  brand: string;
  videoSrc: string;
};

type Counter = {
  label: string;
  target: number;
};

// 데이터 정의
const collaborations: Collaboration[] = [
  {
    id: "heartleaf",
    title: "Heartleaf TECA Serum",
    username: "@lana23.11",
    brand: "Abib",
    videoSrc: "/videos/heartleaf.mp4",
  },
  {
    id: "signal",
    title: "Signal Perming Ampoule",
    username: "@or.8ro",
    brand: "SLOWMENT",
    videoSrc: "/videos/signal.mp4",
  },
  {
    id: "core",
    title: "Core Finish Cream",
    username: "@kariin.zip",
    brand: "SLOWMENT",
    videoSrc: "/videos/core.mp4",
  },
];

const counters: Counter[] = [
  { label: "Creators", target: 250 },
  { label: "Live Hosts", target: 750 },
  { label: "Projects", target: 3000 },
];

const PREVIOUS_COMPONENTS_HEIGHT = 1050;

// Props 타입 정의
interface CollaborationSectionProps {
  triggerFromCard?: boolean;
  initialCardPosition?: {
    top: number;
    left: number;
    width: number;
    height: number;
  } | null;
}

export default function CollaborationSection({
  triggerFromCard = false,
  initialCardPosition = null,
}: CollaborationSectionProps): JSX.Element {
  const sectionRef = useRef<HTMLDivElement>(null);
  const prevScrollY = useRef<number>(0);
  const isScrollingUp = useRef<boolean>(false);
  const lastSlideAnimationComplete = useRef<boolean>(false);
  const hasInitiallyAnimated = useRef<boolean>(false);
  const isInitialized = useRef<boolean>(false);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isFixed, setIsFixed] = useState<boolean>(false);
  const [isEntering, setIsEntering] = useState<boolean>(false); 
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const [cardStyle, setCardStyle] = useState<{[key: string]: string}>({});
  
  // 진입 애니메이션 시작 함수
  const startEnterAnimation = (): void => {
    setIsEntering(true);
    
    // 인플루언서 카드에서 시작하는 경우
    if (triggerFromCard && initialCardPosition) {
      // 인플루언서 카드의 위치에서 시작
      setCardStyle({
        position: 'fixed',
        top: `${initialCardPosition.top}px`,
        left: `${initialCardPosition.left}px`,
        width: `${initialCardPosition.width}px`,
        height: `${initialCardPosition.height}px`,
        borderRadius: '8px',
        backgroundColor: '#2E2F30',
        zIndex: '1000',
        opacity: '1',
        transform: 'none',
        transition: 'none'
      });
      
      // 약간의 지연 후 전체 화면으로 확장
      setTimeout(() => {
        setCardStyle({
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          height: '100vh',
          borderRadius: '0',
          backgroundColor: '#2E2F30',
          zIndex: '1000',
          opacity: '1',
          transform: 'none',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
        });
        
        // 애니메이션 완료 후 콘텐츠 표시
        setTimeout(() => {
          setIsEntering(false);
          setIsVisible(true);
          setIsFixed(true);
        }, 800);
      }, 50);
    } 
    // 일반적인 스크롤 진입의 경우
    else {
      // 작은 카드에서 시작하는 초기 스타일 설정
      setCardStyle({
        width: '320px',
        height: '200px',
        borderRadius: '20px',
        opacity: '0',
        transform: 'scale(0.6) translateY(50px)'
      });
      
      // 약간의 지연 후 전체 화면으로 확장
      setTimeout(() => {
        setCardStyle({
          width: '100%',
          height: '100vh',
          borderRadius: '0',
          opacity: '1',
          transform: 'scale(1) translateY(0)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
        });
        
        // 카드 애니메이션 완료 후 컨텐츠 표시
        setTimeout(() => {
          setIsEntering(false);
          setIsFixed(true);
        }, 800);
      }, 100);
    }
  };
  
  // 종료 애니메이션 시작 함수
  const startExitAnimation = (): void => {
    setIsExiting(true);
    
    // 인플루언서 카드로 돌아가는 경우
    if (triggerFromCard && initialCardPosition) {
      setCardStyle({
        position: 'fixed',
        top: `${initialCardPosition.top}px`,
        left: `${initialCardPosition.left}px`,
        width: `${initialCardPosition.width}px`,
        height: `${initialCardPosition.height}px`,
        borderRadius: '8px',
        backgroundColor: '#2E2F30',
        zIndex: '1000',
        opacity: '0.6',
        transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: 'none'
      });
      
      // 애니메이션 완료 후 인플루언서 섹션으로 이벤트 전송
      setTimeout(() => {
        // 콜라보레이션 섹션 종료 이벤트 발생
        window.dispatchEvent(
          new CustomEvent('collab-section-closed', {
            detail: { closeTime: Date.now() }
          })
        );
        
        setIsExiting(false);
        setIsFixed(false);
        setIsVisible(false);
      }, 800);
    }
    // 일반 종료 애니메이션
    else {
      // 전체 화면에서 작은 카드로 축소
      setCardStyle({
        width: '320px',
        height: '200px',
        borderRadius: '20px',
        opacity: '0.6',
        transform: 'scale(0.6) translateY(50px)',
        transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: 'none'
      });
      
      // 애니메이션 완료 후 컴포넌트 숨기기
      setTimeout(() => {
        setIsExiting(false);
        setIsFixed(false);
        setIsVisible(false);

        // 완전히 사라질 때 스타일 초기화 (다음 진입을 위해)
        setCardStyle({
          opacity: '0',
          transform: 'scale(0.6) translateY(50px)'
        });
      }, 800);
    }
  };

  // 컴포넌트 마운트 시 한 번만 실행되는 초기화
  useEffect(() => {
    // 컴포넌트가 이미 초기화되었다면 다시 초기화하지 않음
    if (isInitialized.current) return;
    
    isInitialized.current = true;
    
    // 기본값 설정 - 나머지 로직은 스크롤 감지에서 처리
    setActiveIndex(0);
    
    // 만약 인플루언서 카드에서 트리거된 경우 즉시 진입 애니메이션 시작
    if (triggerFromCard && initialCardPosition) {
      setIsVisible(true);
      startEnterAnimation();
    }
  }, [triggerFromCard, initialCardPosition]);

  // 스크롤 감지 및 상태 업데이트
  useEffect(() => {
    // 인플루언서 카드에서 트리거된 경우 스크롤 이벤트는 무시
    if (triggerFromCard) return;
    
    const handleScroll = (): void => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const previousComponentsPixels =
        (PREVIOUS_COMPONENTS_HEIGHT * windowHeight) / 100;
      const sectionEnd = previousComponentsPixels + windowHeight;
  
      // 스크롤 방향 감지
      isScrollingUp.current = scrollY < prevScrollY.current;
      prevScrollY.current = scrollY;
  
      // 섹션이 뷰포트에 있는지 확인
      if (
        scrollY >= previousComponentsPixels - windowHeight / 2 &&
        scrollY < sectionEnd
      ) {
        // 섹션이 화면에 들어왔을 때 (진입 애니메이션 시작)
        if (!isVisible && !isEntering && !isExiting) {
          setIsVisible(true);
          startEnterAnimation();

          // 위로 스크롤 중이고 이미 애니메이션이 실행된 적이 있으면 마지막 카드로 설정
          if (isScrollingUp.current && hasInitiallyAnimated.current) {
            // 마지막 슬라이드로 설정
            if (activeIndex !== collaborations.length) {
              setActiveIndex(collaborations.length);
            }
            // 애니메이션 완료 상태 설정
            lastSlideAnimationComplete.current = true;
          } 
        }
        
        // 위로 스크롤하는 순간 즉시 fixed 상태를 해제하고 일반 스크롤로 전환 (첫 슬라이드일 때만)
        if (isScrollingUp.current && isFixed && activeIndex <= 0) {
          // 첫 슬라이드에서 위로 스크롤 시 종료 애니메이션 시작
          if (!isExiting) {
            startExitAnimation();
          }
        } 
        // 아래로 스크롤하고 fixed가 아닌 경우에만 fixed로 설정
        else if (!isScrollingUp.current && !isFixed && !isEntering && !isExiting) {
          setIsFixed(true);
        }
        // 위로 스크롤하고 있지만 첫 슬라이드가 아니면 fixed 유지
        else if (isScrollingUp.current && !isFixed && activeIndex > 0 && !isEntering && !isExiting) {
          setIsFixed(true);
        }
      } 
      // 섹션이 화면 밖으로 벗어났을 때
      else if (isVisible && !isExiting) {
        // 화면에서 충분히 벗어났을 때 종료 애니메이션 시작
        startExitAnimation();
      }
    };
  
    window.addEventListener("scroll", handleScroll);
    handleScroll();
  
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isVisible, isFixed, activeIndex, isEntering, isExiting, triggerFromCard]);

  // 마지막 슬라이드 애니메이션 완료 처리 콜백
  const onLastSlideComplete = () => {
    lastSlideAnimationComplete.current = true;
    setTimeout(() => {
      startExitAnimation();
    }, 500);
  };

  // 애니메이션 완료 기록
  const onAnimationComplete = () => {
    hasInitiallyAnimated.current = true;
  };

  return (
    <>
      <div
        ref={sectionRef}
        id="collaboration-section"
        className={`collab-section ${isVisible ? "visible" : ""} ${
          isFixed ? "fixed" : ""
        } ${
          isEntering ? "entering" : ""
        } ${
          isExiting ? "exiting" : ""
        }`}
        style={cardStyle}
      >
        <div className="background-watermark">3STEP</div>

        <div className={`collab-content ${(isEntering || isExiting) ? 'hidden' : 'visible'}`}>
          {/* 내부 콘텐츠 컴포넌트 */}
          <CollabContent 
            isVisible={isVisible && !isEntering && !isExiting}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            isScrollingUp={isScrollingUp}
            collaborations={collaborations}
            counters={counters}
            onLastSlideComplete={onLastSlideComplete}
            onAnimationComplete={onAnimationComplete}
          />
        </div>
      </div>

      {/* 공간 확보용 더미 - 인플루언서 카드 연동 시 높이 조정 */}
      {!triggerFromCard && <div style={{ height: "100vh" }}></div>}
    </>
  );
}