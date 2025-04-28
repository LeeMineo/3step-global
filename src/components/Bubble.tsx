"use client";

import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import "./BubbleScene.scss";
import { useTranslation } from "react-i18next";

const Bubble = ({ scrollY }: { scrollY: number }) => {
  const mesh = useRef<THREE.Mesh>(null);


  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.002;
      mesh.current.rotation.x += 0.001;
      const eased = Math.pow(scrollY, 1.2);
      const scale = 1 + eased * 4;
      mesh.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[1, 128, 128]} />
      <MeshDistortMaterial
        color="#ffffff"
        opacity={0.9}
        roughness={1}
        metalness={0.5}
        clearcoat={0.7}
        clearcoatRoughness={0.1}
        reflectivity={1}
        distort={0.3}
        speed={2}
        emissive={"#A7D8FF"}
        emissiveIntensity={2}
        sheen={0.5}
        sheenColor={new THREE.Color("#FF0000")}
        toneMapped={false}
        transparent
      />
    </mesh>
  );
};

export default function BubbleScene() {
  const [scrollY, setScrollY] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const introTextRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('common');
  //const isChrome = typeof window !== "undefined" && /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);


  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = window.innerHeight;
      const currentScroll = window.scrollY;
      const scrollRatio = Math.min(currentScroll / maxScroll, 1);
      setScrollY(scrollRatio);

      const screenH = window.innerHeight;
      const fadeOutStart = screenH * 1.1;
      const fadeOutEnd = screenH * 1.9;

      let introOpacity = 1;
      if (currentScroll >= fadeOutStart && currentScroll <= fadeOutEnd) {
        const ratio = (currentScroll - fadeOutStart) / (fadeOutEnd - fadeOutStart);
        introOpacity = 1 - ratio;
      } else if (currentScroll > fadeOutEnd) {
        introOpacity = 0;
      }

      if (introTextRef.current) {
        introTextRef.current.style.opacity = `${introOpacity}`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isLocked ? "hidden" : "auto";
  }, [isLocked]);
  

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isAnimating || isLocked) {
        e.preventDefault();
        return;
      }

      const currentY = window.scrollY;
      const screenH = window.innerHeight;

      if (e.deltaY > 0) {
        if (currentY < screenH - 10) {
          setIsAnimating(true);
          window.scrollTo({ top: screenH, behavior: "smooth" });

          setIsLocked(true);
          setTimeout(() => setIsLocked(false), 1500);
          setTimeout(() => setIsAnimating(false), 1200);
        } else if (currentY >= screenH && currentY < screenH * 2 - 10) {
          setIsAnimating(true);
          window.scrollTo({ top: screenH * 2, behavior: "smooth" });
          setTimeout(() => setIsAnimating(false), 1200);
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [isAnimating, isLocked]);

  return (
    
    <>
      {/* ✅ 비눗방울 영역 */}
      <div
        className="bubble-wrapper"
        style={{
          opacity: Math.max(1 - scrollY * 1.5, 0),
          pointerEvents: scrollY === 1 ? "none" : "auto",
          zIndex: scrollY === 1 ? -1 : 20,
        }}
      >
        <div className="bubble-logo">
          <img src="/logo/BIG_LOGO2.svg" alt="3STEP GLOBAL" />
        </div>

        <Canvas camera={{ position: [0, 0, 3] }}>
          <ambientLight intensity={2} />
          <pointLight position={[10, 10, 10]} />
          <Bubble scrollY={scrollY} />
          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>

      {/* ✅ 소개 텍스트 영역 */}
      <div
        className="aurora-section"
        style={{
          opacity: scrollY,
          zIndex: scrollY === 1 ? -1 : 10,
          pointerEvents: scrollY === 1 ? "none" : "auto",
        }}
      >
        {/* 오로라 라인 */}
{/* <svg className="aurora-svg" viewBox="0 0 1440 600" preserveAspectRatio="none">
  <defs>
    <linearGradient id="aurora-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#7FC9F8" />
      <stop offset="50%" stopColor="#A5CFFF" />
      <stop offset="100%" stopColor="#8089E0" />
    </linearGradient>
  </defs>

  {isChrome && (
    <path
      d="M0,300 C360,100 1080,500 1440,300"
      className="aurora-line"
    />
  )}
</svg> */}


        <div
          ref={introTextRef}
          className="aurora-text"
        >
          <h2 className="desktop-heading">Our dreams will change the world</h2>
          <h2 className="mobile-heading">Our dreams will<br />change the world</h2>
          <p>{t('bubble_text1')}</p>
          <p>{t('bubble_text2')}</p>
          <p>{t('bubble_text3')}</p>
          <p>{t('bubble_text4')}</p>

        </div>
      </div>

      {/* 스크롤 공간 확보 */}
      <div style={{ height: "200vh" }} />
    </>
  );
}
