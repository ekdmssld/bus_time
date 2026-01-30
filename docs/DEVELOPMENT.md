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
    nearbyOnly: boolean
}
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
