"use client";

import { useRef, useState, useEffect } from "react";
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

export default function Influencer_Cards() {
  const collabCardRef = useRef<HTMLDivElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  
  // 3D 효과를 위한 상태
  const [tiltPosition, setTiltPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // 콜라보레이션 섹션 상태 관리
  const [showCollabSection, setShowCollabSection] = useState(false);
  const [collabCardPosition, setCollabCardPosition] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  // 자동 틸트 애니메이션 효과
  useEffect(() => {
    if (!showCollabSection && collabCardRef.current) {
      // 자동 미세 움직임 애니메이션을 위한 타이머
      const autoTiltTimer = setInterval(() => {
        if (!isHovering) {
          // 미세한 랜덤 움직임 생성
          const randomX = Math.sin(Date.now() / 1000) * 5;
          const randomY = Math.cos(Date.now() / 1500) * 5;
          setTiltPosition({ x: randomX, y: randomY });
        }
      }, 50);

      return () => {
        clearInterval(autoTiltTimer);
      };
    }
  }, [showCollabSection, isHovering]);

  // 컴포넌트 마운트 시 이벤트 리스너 등록
  useEffect(() => {
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
      window.removeEventListener('collab-section-closed', handleCollabSectionClosed);
    };
  }, []);

  // 마우스 움직임에 따른 틸트 효과 핸들러
  const handleMouseMove = (e: React.MouseEvent) => {
    if (collabCardRef.current && !showCollabSection) {
      const card = collabCardRef.current;
      const rect = card.getBoundingClientRect();
      
      // 카드 내부에서의 마우스 상대 위치 계산 (중앙이 0,0)
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      
      // 틸트 효과 적용
      setTiltPosition({ x: x * -10, y: y * 10 });
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
    setIsHovering(false);
    // 부드럽게 원래 위치로 돌아가기
    setTiltPosition({ x: 0, y: 0 });
  };

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
    <div className="cards-wrapper">
      {/* 카드 리스트 */}
      <div className="cards-section">
        <div className="cards-container">
          {influencers.map((item, i) => (
            <div
              key={i}
              className={`card-item card-position-${i}`}
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              <div className="card-hover-wrapper">
                <div className="card-top-bar">{item.followers}</div>
                <div className="card-bottom-bar">#{item.name}</div>
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
          
          {/* 다섯 번째 카드 (콜라보레이션 카드) - 3D 틸트 효과 추가 */}
          <div
            ref={collabCardRef}
            className={`card-item card-collab card-3d ${showCollabSection ? 'expanded' : ''}`}
            onMouseEnter={() => setHoverIndex(99)}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            onClick={handleCollabCardClick}
            style={{
              position: 'absolute',
              top: '1000px',
              left: '10%',
              transform: `perspective(1000px) rotateY(${tiltPosition.x}deg) rotateX(${tiltPosition.y}deg) translateZ(10px)`,
              transition: 'transform 0.2s ease-out, opacity 0.5s ease, box-shadow 0.3s ease',
            }}
          >
            <div className="card-hover-wrapper">
              <div className="card-top-bar">{collabCard.followers}</div>
              <div className="card-bottom-bar">#{collabCard.name}</div>
              
              {/* TAP 버튼 추가 */}
              <div className="card-tap-button">
                <span>TAP</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              
              {/* 3D 효과를 위한 반짝임 오버레이 */}
              <div 
                className="card-shine-overlay" 
                style={{ 
                  backgroundPosition: `${(tiltPosition.x + 10) * 5}% ${(tiltPosition.y + 10) * 5}%` 
                }}
              ></div>
              
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

    </div>
  );
}