# Notion Clone Project

바닐라 자바스크립트를 사용한 노션 클론 프로젝트입니다. SPA(Single Page Application) 구조로 구현되었으며, 문서 생성 및 실시간 자동 저장 기능을 제공합니다.

## 주요 기능

### 1. 문서 관리
- 루트 문서 생성
- 하위 문서 생성
- 문서 제목 및 내용 수정
- 실시간 자동 저장 (디바운싱 적용)

### 2. 페이지 네비게이션
- History API를 활용한 SPA 라우팅 구현
- 사이드바를 통한 문서 목록 표시
- 사이드바 토글 기능

## 기술 스택

- Vanilla JavaScript
- HTML5
- CSS3

## 프로젝트 구조

```
├── api/
│   └── api.js              # API 요청 관련 함수
├── components/
│   ├── DocumentManager.js  # 문서 관리 컴포넌트
│   ├── Editor.js          # 에디터 컴포넌트
│   └── Sidebar.js         # 사이드바 컴포넌트
├── constants/
│   └── urls.js            # API URL 상수
├── router/
│   └── router.js          # SPA 라우팅 처리
├── styles/
│   ├── breadCrums.css
│   ├── editor.css
│   ├── main.css
│   ├── reset.css
│   ├── sideBar.css
│   └── variables.css
└── src/
    └── main.js            # 앱 진입점
```

## API 명세

### 문서 수정 API
```
Method: PUT
Path: https://kdt-api.fe.dev-cos.com/documents/${documentId}
Request Body: {
    "title": "제목 수정",
    "content": "내용 수정"
}
```

## 주요 구현 사항

### 1. SPA 라우팅
- History API를 사용하여 페이지 전환 없이 동적 라우팅 구현
- URL 변경 시 해당하는 문서 내용을 동적으로 불러옴

### 2. 실시간 자동 저장
- 문서 수정 시 디바운싱을 적용하여 자동 저장
- 불필요한 API 호출 최소화 (2초 딜레이)

### 3. 문서 편집기
- 제목과 내용을 동시에 편집 가능
- 실시간 저장 기능 통합

### 4. 사이드바
- 문서 목록 표시
- 토글 기능으로 화면 공간 효율적 활용
- 새 문서 생성 버튼 제공

## 스타일링

- CSS 변수를 활용한 일관된 디자인 시스템 적용
- Pretendard, Noto Sans KR 폰트 사용
- 반응형 레이아웃 구현

## 구현 조건

- 바닐라 자바스크립트만을 사용한 SPA 구현
- History API를 활용한 라우팅
- 문서 읽기와 수정이 동시에 처리되는 구조
- 디바운싱이 적용된 자동 저장 기능

## 개발 환경 설정

1. 프로젝트 클론
```bash
git clone [repository-url]
```

2. 로컬 서버 실행
```bash
# Live Server 등을 사용하여 로컬 서버 실행
```

## 브라우저 지원

- 최신 버전의 크롬, 파이어폭스, 사파리, 엣지 브라우저 지원
