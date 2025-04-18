"use client";

import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import "./CTAForm.scss"; // ✅ 전역 SCSS 스타일 가져오기

export default function CTAForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    emailjs
      .sendForm(
        "your_service_id",      // EmailJS 서비스 ID
        "your_template_id",     // EmailJS 템플릿 ID
        formRef.current,
        "your_public_key"       // EmailJS 퍼블릭 키
      )
      .then(() => {
        setSent(true);
        setTimeout(() => setSent(false), 4000);
        formRef.current?.reset();
      })
      .catch((error) => {
        console.error("EmailJS Error:", error);
      });
  };

  return (
    <div className="cta-container">
      <h2 className="cta-title">
        Let’s Make Something <span>Great</span>
      </h2>
      <form ref={formRef} onSubmit={handleSubmit} className="cta-form">
        <input
          type="email"
          name="user_email"
          required
          placeholder="Your Email"
          className="cta-input"
        />
        <button type="submit" className="cta-button">
          Let’s Connect →
        </button>
      </form>
      {sent && <div className="cta-toast">메일이 전송되었어요! 🎉</div>}
    </div>
  );
}
