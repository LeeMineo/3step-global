"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import CollaborationSection from "./CollaborationSection";
import "./Influencer.scss";

const influencers = [
  {
    src: "/influencer/influencer1.png",
    hoverSrc: "/influencer/influencer1_hover.png",
    name: "selin.egmn",
    followers: "730K",
    link: "https://www.instagram.com/selin.egmn/",
  },
  {
    src: "/influencer/influencer2.png",
    hoverSrc: "/influencer/influencer2_hover.png",
    name: "gyuree_k",
    followers: "82K",
    link: "https://www.instagram.com/gyuree_k/",
  },
  {
    src: "/influencer/influencer3.png",
    hoverSrc: "/influencer/influencer3_hover.png",
    name: "hyemi.live",
    followers: "117K",
    link: "https://www.instagram.com/jaeinn/",
  },
  {
    src: "/influencer/influencer4.png",
    hoverSrc: "/influencer/influencer4_hover.png",
    name: "2__ni_na__7",
    followers: "3k",
    link: "https://www.instagram.com/2__ni_na__7",
  },
];

// 콜라보레이션 카드 정보 추가
const collabCard = {
  src: "/influencer/collab_card.png", // 적절한 이미지 경로로 수정
  hoverSrc: "/influencer/collab_card_hover.png", // 적절한 이미지 경로로 수정
  name: "collab.showcase",
  followers: "3STEP",
  link: "#collaboration",
};

export default function InfluencerSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const collabCardRef = useRef<HTMLDivElement>(null);
  const sectionEndRef = useRef<HTMLDivElement>(null);
  const [circleScale, setCircleScale] = useState(0.2);
  const [showCircle, setShowCircle] = useState(false);
  const [circleOpacity, setCircleOpacity] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // 콜라보레이션 섹션 상태 관리
  const [showCollabSection, setShowCollabSection] = useState(false);
  const [collabCardPosition, setCollabCardPosition] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!wrapperRef.current || !sectionEndRef.current) return;

      const wrapperRect = wrapperRef.current.getBoundingClientRect();
      const endRect = sectionEndRef.current.getBoundingClientRect();
      const isVisible = wrapperRect.top < window.innerHeight && wrapperRect.bottom > 0;
      
      // Calculate fade-in effect (when entering the section)
      if (isVisible) {
        // Set circle visibility
        setShowCircle(true);
        
        // Calculate entrance fade-in
        const entranceProgress = Math.min(
          (window.innerHeight - wrapperRect.top) / (window.innerHeight * 0.3),
          1
        );
        const entranceOpacity = Math.max(0, Math.min(entranceProgress, 1));
        
        // Calculate exit fade-out (when approaching the end)
        // Start fading out when the end section is 10rem (160px) from the bottom of the viewport
        const fadeoutDistance = 160; // 10rem
        const exitProgress = Math.max(
          0,
          1 - ((endRect.top - window.innerHeight + fadeoutDistance) / fadeoutDistance)
        );
        const exitOpacity = Math.max(0, 1 - exitProgress);
        
        // Use the more relevant opacity value
        if (endRect.top < window.innerHeight + fadeoutDistance) {
          // We're near the end, use exit opacity
          setCircleOpacity(exitOpacity);
        } else {
          // We're at the beginning or middle, use entrance opacity
          setCircleOpacity(entranceOpacity);
        }
        
        // Scale calculation (same as before)
        const top = wrapperRef.current.offsetTop;
        const scrollY = window.scrollY;
        const winH = window.innerHeight;
        const distance = scrollY - (top - winH);
        const progress = Math.min(Math.max(distance / winH, 0), 1);
        const scale = 0.2 + progress * 2.5;
        setCircleScale(scale);
      } else {
        // Out of view completely
        setShowCircle(false);
        setCircleOpacity(0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    // 콜라보레이션 섹션 종료 이벤트 리스너
    const handleCollabSectionClosed = () => {
      setShowCollabSection(false);
      console.log("🔥 collab-section-closed 실행됨");
      
      // 콜라보레이션 카드를 다시 표시하고 클릭 가능하게 복원
      if (collabCardRef.current) {
        collabCardRef.current.style.opacity = '1';
        collabCardRef.current.style.pointerEvents = 'auto';
        
        // CSS 트랜지션을 부드럽게 하기 위한 설정
        collabCardRef.current.style.transition = 'opacity 0.5s ease, transform 0.3s ease';
      }
      
      // 스크롤 위치 복원 (필요한 경우)
      if (collabCardRef.current) {
        const cardPosition = collabCardRef.current.getBoundingClientRect();
        const scrollPosition = window.scrollY + cardPosition.top - window.innerHeight/2;
        window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
      }
    };

    window.addEventListener('collab-section-closed', handleCollabSectionClosed);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener('collab-section-closed', handleCollabSectionClosed);
    };
  }, []);

  // 콜라보레이션 카드 클릭 핸들러
  const handleCollabCardClick = () => {
    if (showCollabSection) return;
    
    // 카드의 위치 정보 가져오기
    if (collabCardRef.current) {
      const rect = collabCardRef.current.getBoundingClientRect();
      
      // 콜라보레이션 섹션으로 전달할 카드 위치 정보 저장
      setCollabCardPosition({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
      
      // 카드가 콜라보레이션 섹션으로 전환되면 카드 숨기기
      collabCardRef.current.style.opacity = '0';
      collabCardRef.current.style.pointerEvents = 'none';
      
      // 콜라보레이션 섹션 표시
      setShowCollabSection(true);
    }
  };

  return (
    <div ref={wrapperRef}>
      {showCircle && (
        <div
          className="circle-reveal"
          style={{ 
            transform: `scale(${circleScale})`,
            opacity: circleOpacity
          }}
        />
      )}

      {/* 인트로 */}
      <section className="influencer-section">
        <div className="intro-floating-text">
          <h1>
            <span>Meet the Icons</span>
            <br />
            <span>Behind Our Influence</span>
          </h1>
          <div className="scroll-down-arrow">↓</div>
        </div>
      </section>

      {/* 카드 리스트 */}
      <div className="influencer-section">
        <div className="influencer-card-container">
          {influencers.map((item, i) => (
            <div
              key={i}
              className={`influencer-card card-${i}`}
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              <div className="hover-wrapper">
                <div className="top-bar">{item.followers}</div>
                <div className="bottom-bar">#{item.name}</div>
                <Image
                  src={hoverIndex === i ? item.hoverSrc : item.src}
                  alt={item.name}
                  width={500}
                  height={700}
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>
          ))}
          
          {/* 다섯 번째 카드 (콜라보레이션 카드) */}
          <div
            ref={collabCardRef}
            className={`influencer-card card-collab ${showCollabSection ? 'expanded' : ''}`}
            onMouseEnter={() => setHoverIndex(99)}
            onMouseLeave={() => setHoverIndex(null)}
            onClick={handleCollabCardClick}
            style={{
              position: 'absolute',
              top: '1000px',
              left: '10%',
              // 클릭 가능한 상태 유지를 위한 설정
              transition: 'opacity 0.5s ease, transform 0.3s ease',
            }}
          >
            <div className="hover-wrapper">
              <div className="top-bar">{collabCard.followers}</div>
              <div className="bottom-bar">#{collabCard.name}</div>
              <Image
                src={hoverIndex === 99 ? collabCard.hoverSrc : collabCard.src}
                alt={collabCard.name}
                width={500}
                height={700}
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 콜라보레이션 섹션 (인플루언서 컴포넌트 내부에서 조건부 렌더링) */}
      {showCollabSection && collabCardPosition && (
        <CollaborationSection 
          triggerFromCard={true} 
          initialCardPosition={collabCardPosition} 
        />
      )}

      {/* 트리거용 (스크롤 기준점) */}
      <div id="collab-trigger" style={{ height: "1px", marginTop: "100px" }}></div>

      {/* 스크롤 공간 확보 및 fade-out 트리거용 ref */}
      <div ref={sectionEndRef} style={{ height: "100vh" }} />
    </div>
  );
}