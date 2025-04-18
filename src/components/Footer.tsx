"use client";

import React from "react";
import Image from "next/image";
import "./Footer.scss";

export default function Footer() {
  return (
    <footer className="business-card-footer">
      <div className="card-container">
        {/* Left 3 */}
        <div className="card-left">
          <Image
            src="/logo/3STEP_LOGO.svg"
            alt="3STEP GLOBAL Logo"
            width={140}
            height={140}
            className="logo"
          />
        </div>

        {/* Right 7 */}
        <div className="card-right">
          <div className="top-section">
            <div className="info-block">
              <h2>Jang Eun Young</h2>
              <p className="title">C.E.O</p>
              <p><strong>Mobile.</strong> +82 10-6605-1841</p>
              <p>jason@threestep.co.kr</p>
            </div>

            <div className="address-block">
              <div className="address">
                <span className="badge">KOREA</span>
                <p>41, Nonhyeon-ro 151-gil, Gangnam-gu,<br />Seoul, Republic of Korea</p>
              </div>
              <div className="address">
                <span className="badge">JAPAN</span>
                <p>203 Hakkuberi-, 3-27-9 Saginomiya,<br />Nakano-ku, Tokyo-to, Japan</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 희미한 구분선 + 저작권 */}
      <div className="footer-divider" />
      <div className="footer-copyright">
        &copy; {new Date().getFullYear()} 3STEP GLOBAL. All rights reserved.
      </div>
    </footer>
  );
}
