# 디자인 시스템 토큰

## 색상 팔레트
| 토큰 | 값 | 용도 |
|------|-----|------|
| Primary | #6366F1 | 주요 액션, 브랜드 컬러 |
| Primary Hover | #4F46E5 | 호버 상태 |
| Primary Light | #EEF2FF | 배경 하이라이트 |
| Secondary | #8B5CF6 | 그라데이션, 보조 액센트 |
| Background | #F8FAFC | 페이지 배경 |
| Card | #FFFFFF | 카드 배경 |
| Text Primary | #1E293B | 제목, 본문 |
| Text Secondary | #64748B | 보조 텍스트 |
| Text Muted | #94A3B8 | 비활성 텍스트 |
| Border | #E2E8F0 | 기본 보더 |
| Border Light | #F1F5F9 | 구분선 |
| Success | #10B981 | 성공 상태 |
| Danger | #EF4444 | 위험, 삭제 |

## 타이포그래피
- Font: Geist Sans (시스템 폰트)
- 제목: text-2xl (1.5rem), font-bold
- 소제목: text-base (1rem), font-semibold
- 본문: text-sm (0.875rem), normal
- 캡션: text-xs (0.75rem), text-slate-400

## 간격 및 라운딩
- 카드: rounded-2xl, p-5~p-8
- 버튼: rounded-xl, px-4~px-6, py-2~py-3
- 입력: rounded-xl, px-4, py-3
- 모달: rounded-2xl

## 그림자
- 카드: shadow-sm → hover:shadow-lg shadow-indigo-50
- 드롭다운: shadow-lg
- 모달: shadow-2xl

## 트랜지션
- 기본: transition-all duration-200
- 호버 효과: border-color + shadow 변화
