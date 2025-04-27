"use client";

import React, { useEffect, useRef } from "react";
import "./PartnersSection.scss";
import { useTranslation } from "react-i18next";

const partners = [
  { id: 1, name: "Olive Young", logo: "/brand/olive.png" },
  { id: 2, name: "ESPOIR", logo: "/brand/espoir.jpg" },
  { id: 3, name: "GS SHOP", logo: "/brand/gsshop.png" },
  { id: 4, name: "too cool for school", logo: "/brand/too.png" },
];

export default function PartnersSection() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation('common');

  useEffect(() => {
    if (trackRef.current) {
      // 무한 슬라이더를 위해 실제 로고 너비에 맞게 설정
      
      // 너비를 설정할 필요 없음 - CSS에서 자동으로 계산
    }
  }, []);

  return (
    <section className="partnersSection">
      <div className="partnersHeader">
        <h2 className="partnersTitle">Partners<br />Who Believe in Us</h2>
        <p className="partnersSubtitle">
          {t('partners_subtitle')}
        </p>
      </div>

      <div className="partnersSlider">
        <div className="logosTrackContainer">
          {/* 첫 번째 로고 세트 */}
          <div className="logosTrack">
            {/* 반복 효과를 위해 파트너 배열을 두 번 반복 */}
            {partners.map((partner, idx) => (
              <div className="partnerLogo" key={`set1-${idx}`}>
                <div className="logoContainer">
                  <img src={partner.logo} alt={`${partner.name} 로고`} />
                </div>
                <p className="partnerName">{partner.name}</p>
              </div>
            ))}
            
            {/* 첫 번째 세트와 동일한 두 번째 세트 (끊김 없는 루프를 위함) */}
            {partners.map((partner, idx) => (
              <div className="partnerLogo" key={`set2-${idx}`}>
                <div className="logoContainer">
                  <img src={partner.logo} alt={`${partner.name} 로고`} />
                </div>
                <p className="partnerName">{partner.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="partnersFooterText">
        Let&apos;s Make Something Great
      </div>
    </section>
  );
}