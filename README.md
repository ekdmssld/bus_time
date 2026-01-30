# 🚌 부산대 밀양캠퍼스 버스 시간표

밀양 ↔ 부산대 밀양캠퍼스를 운행하는 버스 시간표를 쉽게 조회할 수 있는 웹 앱입니다.

## 📋 프로젝트 소개

### 문제점
- 기존 버스 시간표가 **이미지(사진) 형태**로 제공
- 평일/주말/방학 → 왕편/복편 → 시간 탐색까지 **다단계 탐색 필요**
- 사람이 눈으로 직접 찾아야 해서 **시간 소요**

### 해결책
조건만 선택하면 원하는 시간표를 **즉시 확인**할 수 있는 웹 페이지

## ✨ 주요 기능

| 기능 | 설명 |
|------|------|
| 🗓️ 조건 선택 | 평일/주말·공휴일/방학, 왕편/복편 버튼으로 선택 |
| 📋 전체 시간표 | 선택한 조건의 시간표 전체 표시 |
| ⏰ 지금 출발 가능 | 현재 시간 이후 버스만 필터링 |
| 🔍 ±3시간 필터 | 현재 시간 기준 전후 3시간만 표시 |
| ⭐ 즐겨찾기 | 자주 이용하는 시간 저장 (LocalStorage) |
| 🌟 하이라이트 | 가장 가까운 출발 시간 강조 + 자동 스크롤 |
| 📅 자동 판별 | 오늘이 평일/주말인지 자동 선택 |

## 🚀 사용 방법

### 1. 웹에서 바로 사용
브라우저에서 `index.html` 파일을 열면 바로 사용 가능합니다.

### 2. 로컬 서버로 실행
```bash
# Python 3
python -m http.server 8080

# Node.js (npx)
npx serve
```

### 3. 사용법
1. **날짜 유형** 선택 (평일 / 주말·공휴일 / 방학)
2. **방향** 선택 (왕편: 밀양→부산대 / 복편: 부산대→밀양)
3. 필요시 **필터 체크** (지금 출발 가능, ±3시간)
4. ⭐ 버튼으로 **즐겨찾기** 저장

## 📁 프로젝트 구조

```
bus/
├── index.html              # 메인 HTML
├── css/
│   └── style.css           # 스타일시트
├── js/
│   ├── app.js              # 메인 앱 로직
│   ├── schedule.js         # 시간표 데이터 처리
│   ├── filter.js           # 필터링 로직
│   ├── favorites.js        # 즐겨찾기 기능
│   └── utils.js            # 유틸리티 함수
├── data/
│   └── schedules.json      # 버스 시간표 데이터
├── docs/
│   ├── PLANNING.md         # 기획서
│   └── DEVELOPMENT.md      # 개발 문서
└── README.md
```

## 📊 데이터 구조

### schedules.json
```json
{
  "schedules": [
    {
      "type": "weekday",       // weekday | weekend | vacation
      "direction": "outbound", // outbound(왕편) | inbound(복편)
      "route": "밀양 → 부산대 밀양캠퍼스",
      "timetable": [
        {
          "order": 1,
          "origin": "교동",           // 기점
          "departureTime": "06:01",   // 출발시간
          "yeongnamru": "06:14",      // 영남루
          "miryangStation": "06:45",  // 밀양역
          "pnu": "06:57",             // 부산대
          "destination": "용성",       // 종점
          "routeName": "1번",          // 노선명
          "note": null                 // 비고
        }
      ]
    }
  ],
  "meta": {
    "lastUpdated": "2026-01-30",
    "vacationPeriods": [...],
    "fieldMapping": {...}
  }
}
```

## 🔧 시간표 수정

`data/schedules.json` 파일을 수정하면 시간표를 업데이트할 수 있습니다.

### 새 시간 추가
```json
{
  "order": 35,
  "origin": "교동",
  "departureTime": "23:30",
  "yeongnamru": "23:43",
  "miryangStation": "23:50",
  "pnu": "00:02",
  "destination": "부산대",
  "routeName": "1번",
  "note": "막차"
}
```

### 방학 기간 설정
```json
"vacationPeriods": [
  { "start": "2026-07-01", "end": "2026-08-31" },
  { "start": "2026-12-20", "end": "2027-02-28" }
]
```

## 🛠️ 기술 스택

- **HTML5** - 마크업
- **CSS3** - 스타일링
- **Vanilla JavaScript** - 로직 (프레임워크 없음)
- **JSON** - 데이터 저장
- **LocalStorage** - 즐겨찾기 저장

## 📄 라이선스

MIT License
