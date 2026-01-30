# 개발 문서

## 📅 개발 일지

### 2026-01-30: 프로젝트 초기 구현

#### 1. 프로젝트 기획
- 문제 정의: 이미지 형태의 버스 시간표 탐색 불편
- 목표: 조건 선택으로 시간표 즉시 조회
- 기술 스택 결정: 순수 HTML/CSS/JavaScript

#### 2. 프로젝트 구조 생성
```
bus/
├── index.html
├── css/style.css
├── js/ (app.js, schedule.js, filter.js, favorites.js, utils.js)
├── data/schedules.json
└── docs/
```

#### 3. 시간표 데이터 정리 (schedules.json)
- 사용자가 제공한 실제 시간표 데이터 입력
- JSON 구조 통합 (분리된 객체 → 단일 배열)
- 한글 컬럼명을 영문으로 변환

| 한글 | 영문 | 설명 |
|------|------|------|
| 기점 | origin | 출발 정류장 |
| 시간 | departureTime | 기점 출발 시간 |
| 영남루 | yeongnamru | 영남루 정류장 시간 |
| 밀양역 | miryangStation | 밀양역 정류장 시간 |
| 부산대 | pnu | 부산대 정류장 시간 |
| 종점/방면별 | destination | 도착지 |
| 노선명 | routeName | 버스 노선 번호 |
| 비고 | note | 추가 정보 (신도로/구도로 등) |

#### 4. 핵심 기능 구현

**app.js** - 메인 앱 로직
- 상태 관리 (dayType, direction, filters)
- UI 이벤트 바인딩
- 시간표 렌더링

**schedule.js** - 데이터 처리
- JSON 파일 로드
- 조건별 시간표 조회

**filter.js** - 필터링
- 출발 가능 버스 필터 (현재 시간 이후)
- ±3시간 범위 필터
- 가장 가까운 시간 인덱스 찾기

**favorites.js** - 즐겨찾기
- LocalStorage 저장/로드
- 토글 기능

**utils.js** - 유틸리티
- 시간 변환 (HH:MM → 분)
- 평일/주말 판별
- 방학 기간 확인

---

## 🏗️ 아키텍처

### 데이터 흐름
```
schedules.json
     ↓
Schedule.load()
     ↓
Schedule.getSchedule(dayType, direction)
     ↓
Filter.filterAvailable() / Filter.filterNearby()
     ↓
App.render()
     ↓
HTML 시간표 리스트
```

### 상태 관리
```javascript
App.state = {
    dayType: 'weekday' | 'weekend' | 'vacation',
    direction: 'outbound' | 'inbound',
    availableOnly: boolean,
    nearbyOnly: boolean,
    favoritesOnly: boolean  // 즐겨찾기만 보기
}
```

---

## ⭐ 즐겨찾기만 보기 기능

### 기능 설명
- 저장한 즐겨찾기 시간만 필터링하여 표시
- 현재 선택한 조건(날짜 유형, 방향)에 해당하는 즐겨찾기만 표시

### 구현 방식
1. **UI**: 체크박스 추가 `☐ 즐겨찾기만 보기`
2. **상태**: `App.state.favoritesOnly` 추가
3. **필터링**: `Favorites.filterFavoritesOnly()` 함수 추가
4. **렌더링**: 체크 시 즐겨찾기 시간만 표시

### 데이터 흐름
```
시간표 데이터
     ↓
[favoritesOnly 체크 시]
     ↓
Favorites.getAll() 에서 현재 조건에 맞는 시간 추출
     ↓
해당 시간만 필터링하여 렌더링
```

---

## 📝 시간표 데이터 설명

### 6개 시간표 구성
| type | direction | 설명 |
|------|-----------|------|
| weekday | outbound | 평일 왕편 (밀양→부산대) |
| weekday | inbound | 평일 복편 (부산대→밀양) |
| weekend | outbound | 주말 왕편 |
| weekend | inbound | 주말 복편 |
| vacation | outbound | 방학 왕편 |
| vacation | inbound | 방학 복편 |

### 정류장 순서
**왕편 (outbound)**
```
기점 → 영남루 → 밀양역 → 부산대 → 종점
```

**복편 (inbound)**
```
기점 → 부산대 → 밀양역 → 영남루 → 종점
```

---

## 💾 LocalStorage를 이용한 즐겨찾기

### 로그인 없이 즐겨찾기가 가능한 이유

이 프로젝트는 **LocalStorage**라는 브라우저 내장 저장소를 사용합니다.

```
사용자가 ★ 클릭
       ↓
브라우저의 LocalStorage에 저장
       ↓
같은 기기 + 같은 브라우저에서 유지됨
```

### LocalStorage 특징

| 항목 | 설명 |
|------|------|
| 저장 위치 | 사용자의 **브라우저** 내부 |
| 용량 | 약 5MB |
| 유효 기간 | **영구** (삭제 전까지 유지) |
| 서버 필요 | ❌ 불필요 |
| 로그인 필요 | ❌ 불필요 |

### 장점
- ✅ 서버 없이 즉시 사용 가능
- ✅ 로그인/회원가입 불필요
- ✅ 빠른 저장/로드 (네트워크 없이 로컬에서 처리)

### 단점
- ⚠️ 다른 기기에서는 즐겨찾기 공유 안 됨
- ⚠️ 브라우저 데이터 삭제 시 사라짐
- ⚠️ 다른 브라우저(Safari ↔ Chrome)에서 공유 안 됨

### 코드 예시 (`favorites.js`)

```javascript
// 저장
localStorage.setItem('bus_favorites', JSON.stringify(['weekday-outbound-08:30']));

// 불러오기
const favorites = JSON.parse(localStorage.getItem('bus_favorites'));
```

---

## 🔄 향후 개선 사항

### 단기
- [ ] 다크모드 지원
- [ ] PWA 적용 (오프라인 지원)
- [ ] 알림 기능 (출발 N분 전)

### 장기
- [ ] 실시간 버스 위치 연동 (API 가용 시)
- [ ] 다국어 지원
- [ ] 여러 노선 지원

---

## 💻 개발 환경

- **OS**: macOS
- **Editor**: 코드 에디터
- **Browser**: Chrome/Safari
- **Version Control**: Git

## 🔗 저장소

- GitHub: https://github.com/ekdmssld/bus_time
