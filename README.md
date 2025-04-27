FloatingHeader.tsx	// 화면 가장자리에 커서 갖다대면 나오는 헤더
VideoIntro.tsx	// 전체화면 배경 영상 인트로 섹션
SectionCompany.tsx	// 회사 간략 소개
SectionCreators.tsx	// 소속 크리에이터 소개
SectionImpact.tsx	// 영향력, 수치나 슬라이드 등
SectionReference.tsx	// 레퍼런스 사례 (스크롤 카드, 모션 등)
SectionBusiness.tsx	// 제공하는 비즈니스 모델/서비스
SectionPartners.tsx	// 협업 브랜드 로고/설명 등
Footer.tsx	// SNS, 이메일, 주소 등 정보 포함



//언어팩 입히는 방법

## // 언어팩 입히는 방법

1. 입히고 싶은 파일에 아래 코드 추가:

import { useTranslation } from "react-i18next";

export default 함수 안에:

const { t } = useTranslation('common');

2. 적용하고 싶은 글씨를 다음처럼 변경:

<h2>Our dreams will change the world</h2>
<p>우리의 콘텐츠는 이제 글로벌로 향합니다.</p>

↓

<h2>{t('hero_title')}</h2>
<p>{t('hero_line1')}</p>

3. 아래처럼 번역 파일 작성:

public/locales/ko/common.json:
{
  "hero_title": "Our dreams will change the world",
  "hero_line1": "우리의 콘텐츠는 이제 글로벌로 향합니다."
}

public/locales/en/common.json:
{
  "hero_title": "Our dreams will change the world",
  "hero_line1": "Our content is now going global."
}

public/locales/ja/common.json:
{
  "hero_title": "私たちの夢は世界を変える",
  "hero_line1": "私たちのコンテンツは今、グローバルへ。"
}
