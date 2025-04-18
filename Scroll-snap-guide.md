# ✅ 3STEP GLOBAL 페이지 구간별 스크롤 전환 가이드

이 문서는 `HomePage` 내부 각 섹션에 **스크롤 단위 전환 효과**를 동일하게 적용하기 위해 필요한 구성 기준 및 코드 적용 방법을 안내합니다.

---

## 📌 전제 조건

- **각 섹션은 전체 뷰포트 높이(`100vh`)**로 고정되어야 함.
- 스크롤 시 한 섹션씩 부드럽게 전환되도록 **wheel 이벤트를 통해 `scrollTo`** 처리함.
- `window.scrollY`, `window.innerHeight` 기준으로 구간을 판단하여 이동해야 함.

---

## 📐 섹션 구조 및 순서

```tsx
<main>
  <FloatingHeader />

  <Bubble />             // ✅ 구간 0 (0 ~ 1)
  <HorizontalSection />  // ✅ 구간 1 (1 ~ 2)
  <Influencer />         // ✅ 구간 2 (2 ~ 3)
  <ImpactSection />      // ✅ 구간 3 (3 ~ 4)
  <협력업체섹션 />       // ✅ 구간 4 (4 ~ 5)

  <Footer />
</main>
```

---

## ✅ 각 컴포넌트 적용 기준

### 1. 각 섹션 wrapper에 공통 적용

```tsx
<section className="section" style={{ height: '100vh' }}>...</section>
```

또는 SCSS 공통 클래스 처리:

```scss
.section {
  height: 100vh;
  overflow: hidden;
  scroll-snap-align: start;
}
```

---

## ✅ 공통 스크롤 전환 로직

아래 로직을 상단(App 또는 Layout) 혹은 별도 `ScrollManager` 컴포넌트에서 처리 가능:

```ts
useEffect(() => {
  const handleWheel = (e: WheelEvent) => {
    if (isAnimating || isLocked) return;

    const screenH = window.innerHeight;
    const currentY = window.scrollY;

    // 아래 방향
    if (e.deltaY > 0) {
      if (currentY < screenH - 10) {
        window.scrollTo({ top: screenH, behavior: 'smooth' });
      } else if (currentY < screenH * 2 - 10) {
        window.scrollTo({ top: screenH * 2, behavior: 'smooth' });
      } else if (currentY < screenH * 3 - 10) {
        window.scrollTo({ top: screenH * 3, behavior: 'smooth' });
      } // ... 추가 구간도 동일
    }

    // 위 방향
    if (e.deltaY < 0) {
      if (currentY >= screenH * 4 - 10 && currentY < screenH * 5) {
        window.scrollTo({ top: screenH * 3, behavior: 'smooth' });
      } else if (currentY >= screenH * 3 - 10 && currentY < screenH * 4) {
        window.scrollTo({ top: screenH * 2, behavior: 'smooth' });
      } // ...
    }
  };

  window.addEventListener('wheel', handleWheel, { passive: false });
  return () => window.removeEventListener('wheel', handleWheel);
}, []);
```

---

## 💡 팁: 구간이 많아질 경우

- `sectionIndex`를 `useState`로 만들어서 `+1/-1` 전환 형태로 관리 가능
- `scrollTo(sectionIndex * window.innerHeight)` 방식으로 더 깔끔하게 정리 가능함

---

## ✅ 적용 요약

| 섹션 이름             | 높이 설정 | scrollTo 값         |
|----------------------|-----------|----------------------|
| `<Bubble />`         | `100vh`   | `0`                  |
| `<HorizontalSection />` | `100vh`   | `window.innerHeight` |
| `<Influencer />`     | `100vh`   | `2 * window.innerHeight` |
| `<ImpactSection />`  | `100vh`   | `3 * window.innerHeight` |
| `<협력업체섹션 />`   | `100vh`   | `4 * window.innerHeight` |

---

필요 시 각 섹션 별 ref 설정 후 `element.scrollIntoView()` 방식으로도 대체 가능.

