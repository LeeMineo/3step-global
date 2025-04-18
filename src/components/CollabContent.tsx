"use client";

import React, { useRef, useState, useEffect, JSX } from "react";
import "./CollaborationSection.scss";

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

interface CollabContentProps {
  isVisible: boolean;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  isScrollingUp: React.MutableRefObject<boolean>;
  collaborations: Collaboration[];
  counters: Counter[];
  onLastSlideComplete: () => void;
  onAnimationComplete: () => void;
}

// 더 느려지는 효과를 위한 이징 함수
const easeOutQuint = (t: number): number => {
  return 1 - Math.pow(1 - t, 5);
};

const LOCK_DELAY_MS = 1500;

export default function CollabContent({
  isVisible,
  activeIndex,
  setActiveIndex,
  collaborations,
  counters,
  onLastSlideComplete,
  onAnimationComplete
}: CollabContentProps): JSX.Element {
  const phoneRef = useRef<HTMLDivElement>(null);
  
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [isScrollLocked, setIsScrollLocked] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [slideDirection, setSlideDirection] = useState<'up' | 'down'>('up');
  
  const [counterValues, setCounterValues] = useState<number[]>(
    counters.map(() => 0)
  );
  const [changingIndices, setChangingIndices] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [counterAnimationClass, setCounterAnimationClass] = useState<string>("");
  
  // 터치 관련
  const [touchStart, setTouchStart] = useState<number | null>(null);
  
  // 카운터 애니메이션 시작
  const startCounterAnimation = (): (() => void) => {
    // 초기 상태 설정
    setIsComplete(false);
    setChangingIndices([]);
    
    // 애니메이션 시간 조정
    const duration = 2500; // 총 애니메이션 지속 시간 (ms)
    const startTime = Date.now();
    setIsScrollLocked(true);

    // 시작 값을 목표의 약 95% 정도로 설정
    const startingValues: number[] = counters.map((c) => Math.floor(c.target * 0.9));
    setCounterValues(startingValues);

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedTime = now - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // 이징 함수 적용 - 마지막 부분에서 느려지는 효과
      const easedProgress = easeOutQuint(progress);

      if (progress >= 1) {
        // 애니메이션 완료
        clearInterval(interval);
        
        // 최종 값으로 설정
        setCounterValues(counters.map((c) => c.target));
        
        // 마지막 숫자들에 변경 효과 적용
        setChangingIndices([0, 1, 2]);
        
        // 완료 효과
        setTimeout(() => {
          setIsComplete(true);
          setChangingIndices([]);
          onAnimationComplete(); // 애니메이션 완료 콜백
        }, 300);
        
        // 스크롤 잠금 해제
        setTimeout(() => {
          setIsScrollLocked(false);
        }, 1000);
      } else {
        // 진행 중 - 서서히 목표치에 접근
        const newValues = counters.map((c, idx) => {
          const startValue = startingValues[idx];
          const targetValue = c.target;
          const remaining = targetValue - startValue;
          
          // 변경된 값 계산
          const newValue = Math.floor(startValue + (remaining * easedProgress));
          
          // 값이 변경되면 변경 인덱스 추가
          if (newValue !== counterValues[idx]) {
            // 마지막 자릿수만 변경될 때만 애니메이션 적용
            if (Math.abs(newValue - counterValues[idx]) < 10 && !changingIndices.includes(idx)) {
              setChangingIndices(prev => [...prev, idx]);
              
              // 잠시 후 애니메이션 클래스 제거
              setTimeout(() => {
                setChangingIndices(prev => prev.filter(i => i !== idx));
              }, 300);
            }
          }
          
          return newValue;
        });
        
        setCounterValues(newValues);
      }
    }, 30); // 업데이트 간격을 30ms로 늘려 더 눈에 띄는 변화 만들기

    // 클린업 함수
    return () => clearInterval(interval);
  };

  // activeIndex가 collaborations.length에 도달했을 때 애니메이션 완료 처리
  useEffect(() => {
    if (activeIndex === collaborations.length && !isTransitioning) {
      // 슬라이드 전환 애니메이션 지속 시간과 기타 애니메이션 시간을 고려해서 지연 적용
      setTimeout(() => {
        onLastSlideComplete();
      }, 1000); // 애니메이션 완료를 위한 충분한 시간 부여
    }
  }, [activeIndex, isTransitioning, onLastSlideComplete]);

  // 첫 번째 진입 시 카운터 애니메이션 시작
  useEffect(() => {
    if (isVisible && activeIndex === 0 && counterAnimationClass === "") {
      setCounterAnimationClass("animate-in");
      startCounterAnimation();
    }
  }, [isVisible, activeIndex, counterAnimationClass]);

  const changeSlide = (nextIndex: number): void => {
    if (isTransitioning || nextIndex === activeIndex) return;

    setPreviousIndex(activeIndex);
    setSlideDirection(nextIndex > activeIndex ? 'up' : 'down');
    setIsTransitioning(true);
    setActiveIndex(nextIndex);

    setTimeout(() => {
      setIsTransitioning(false);
      setPreviousIndex(null);
    }, 500);
  };

  const handleWheel = (e: React.WheelEvent): void => {
    if (!isVisible || isScrollLocked || isTransitioning) {
      e.preventDefault();
      return;
    }

    const direction = e.deltaY > 0 ? 1 : -1;

    if (direction > 0) {
      // 마지막 슬라이드 다음으로 스크롤 시 종료
      if (activeIndex >= collaborations.length) {
        return;
      } else {
        e.preventDefault();
        const nextIndex = activeIndex + 1;
        if (nextIndex <= collaborations.length) {
          setIsScrollLocked(true);
          changeSlide(nextIndex);
          setTimeout(() => {
            setIsScrollLocked(false);
          }, LOCK_DELAY_MS);
        }
      }
    } else {
      if (activeIndex <= 0) {
        // 첫 슬라이드에서 위로 스크롤 시 종료
        return;
      } else {
        e.preventDefault();
        const nextIndex = activeIndex - 1;
        if (nextIndex >= 0) {
          setIsScrollLocked(true);
          changeSlide(nextIndex);
          setTimeout(() => {
            setIsScrollLocked(false);
          }, LOCK_DELAY_MS);
        }
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent): void => {
    if (isScrollLocked || isTransitioning) return;
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent): void => {
    if (isScrollLocked || touchStart === null || isTransitioning) return;

    const touchEnd = e.touches[0].clientY;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && activeIndex < collaborations.length) {
        const nextIndex = activeIndex + 1;
        if (nextIndex <= collaborations.length) {
          setIsScrollLocked(true);
          changeSlide(nextIndex);
          setTimeout(() => {
            setIsScrollLocked(false);
          }, LOCK_DELAY_MS);
        }
      } else if (diff < 0 && activeIndex > 0) {
        const nextIndex = activeIndex - 1;
        if (nextIndex >= 0) {
          setIsScrollLocked(true);
          changeSlide(nextIndex);
          setTimeout(() => {
            setIsScrollLocked(false);
          }, LOCK_DELAY_MS);
        }
      }
      setTouchStart(null);
    }
  };

  // 휠 이벤트 처리
  useEffect(() => {
    const wheelHandler = (e: WheelEvent): void => {
      if (isVisible) handleWheel(e as unknown as React.WheelEvent);
    };

    const preventDefaultScroll = (e: Event): boolean => {
      // 마지막 슬라이드이고 애니메이션이 완료되지 않았으면 스크롤 막기
      if (
        isVisible &&
        (isTransitioning ||
          isScrollLocked ||
          (activeIndex < collaborations.length && activeIndex > 0))
      ) {
        e.preventDefault();
        return false;
      }
      return true;
    };

    if (isVisible) {
      window.addEventListener("wheel", wheelHandler, { passive: false });
      document.addEventListener("touchmove", preventDefaultScroll, {
        passive: false,
      });
      document.addEventListener("wheel", preventDefaultScroll, {
        passive: false,
      });

      return () => {
        window.removeEventListener("wheel", wheelHandler);
        document.removeEventListener("touchmove", preventDefaultScroll);
        document.removeEventListener("wheel", preventDefaultScroll);
      };
    }
    
    return undefined;
  }, [isVisible, isScrollLocked, activeIndex, isTransitioning]);

  const renderPhoneContent = (index: number): JSX.Element | null => {
    if (index === 0) {
      return (
        <div className={`counter-section ${counterAnimationClass}`}>
          <div className="tagline">
            <h2>단순한 콘텐츠를 넘어,</h2>
            <h3>
              우리는 <strong>결과</strong>로 증명합니다.
            </h3>
          </div>

          <div className="counters">
            {counters.map((counter, idx) => (
              <div className="counter-item" key={idx}>
                <div className="counter-label">{counter.label}</div>
                <div className={`counter-value ${changingIndices.includes(idx) ? 'changing' : ''} ${isComplete ? 'counter-complete' : ''}`}>
                  {counterValues[idx]}+
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    const collab = collaborations[index - 1];
    if (!collab) return null;

    return (
      <div className="phone-content">
        <div className="phone-video-container">
          <video
            className="phone-video"
            src={collab.videoSrc}
            autoPlay
            muted
            playsInline
            loop
          />
        </div>
        <div className="collab-info">
          <div className="collab-title">{collab.title}</div>
          <div className="collab-username">{collab.username}</div>
        </div>
      </div>
    );
  };

  return (
    <div 
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      className={`collab-inner-content ${isScrollLocked ? "scroll-locked" : ""}`}
    >
      {activeIndex === 0 ? (
        <div className={`stats-container active`}>
          {renderPhoneContent(0)}
        </div>
      ) : (
        <div className="phone-container">
          <div ref={phoneRef} className="phone-frame">
            <div
              className={`slide-item active ${
                isTransitioning ? `sliding-${slideDirection}` : ""
              }`}
            >
              {renderPhoneContent(activeIndex)}
            </div>

            {previousIndex !== null && (
              <div
                className={`slide-item previous ${
                  isTransitioning
                    ? `sliding-${slideDirection}-out`
                    : ""
                }`}
              >
                {renderPhoneContent(previousIndex)}
              </div>
            )}
          </div>

          <div
            className={`collab-details ${
              activeIndex > 0 &&
              collaborations[activeIndex - 1]?.brand === "Abib"
                ? "left-align"
                : "right-align"
            }`}
          >
            <h2
              className={`collab-product-title ${
                isTransitioning
                  ? slideDirection === "up"
                    ? "slide-in"
                    : "slide-in-top"
                  : ""
              }`}
            >
              {activeIndex > 0 &&
                collaborations[activeIndex - 1]?.title}
            </h2>

            <div
              className={`collab-brand ${
                isTransitioning
                  ? slideDirection === "up"
                    ? "slide-in"
                    : "slide-in-top"
                  : ""
              }`}
            >
              <span className="collab-label" key={`label-${activeIndex}`}>
                COLLAB
                <span className="underline-animation"></span>
              </span>
              <span className="collab-with underline-container" key={activeIndex}>
                {activeIndex > 0 &&
                  `with ${collaborations[activeIndex - 1]?.brand}`}
                <span className="underline-animation"></span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 진행 상태 표시기 */}
      <div className="progress-indicators">
        {[0, ...collaborations.map((_, i) => i + 1)].map((idx) => (
          <div
            key={idx}
            className={`indicator ${activeIndex === idx ? "active" : ""}`}
            onClick={() =>
              !isScrollLocked && !isTransitioning && changeSlide(idx)
            }
          />
        ))}
      </div>

      {/* 다음 버튼 */}
      {activeIndex < collaborations.length && (
        <div
          className="next-indicator"
          onClick={() =>
            !isScrollLocked &&
            !isTransitioning &&
            changeSlide(activeIndex + 1)
          }
        >
          <span className="next-arrow">↓</span>
        </div>
      )}
    </div>
  );
}