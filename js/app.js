/**
 * 메인 앱 로직
 */

const App = {
    // 현재 선택된 조건
    state: {
        dayType: 'weekday',
        direction: 'outbound',
        availableOnly: false,
        nearbyOnly: false
    },

    /**
     * 앱 초기화
     */
    async init() {
        // 시간표 데이터 로드
        await Schedule.load();

        // 오늘 날짜 기준 자동 선택
        this.state.dayType = Utils.getTodayType();

        // 방학 기간 확인
        if (Utils.isVacationPeriod(Schedule.getVacationPeriods())) {
            this.state.dayType = 'vacation';
        }

        // UI 초기화
        this.initUI();
        this.bindEvents();
        this.updateCurrentTime();
        this.render();

        // 1분마다 현재 시간 업데이트
        setInterval(() => this.updateCurrentTime(), 60000);
    },

    /**
     * UI 초기 상태 설정
     */
    initUI() {
        // 날짜 유형 버튼 활성화
        document.querySelectorAll('#dayTypeGroup .filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.value === this.state.dayType);
        });
    },

    /**
     * 이벤트 바인딩
     */
    bindEvents() {
        // 날짜 유형 선택
        document.querySelectorAll('#dayTypeGroup .filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setActiveButton('#dayTypeGroup', btn);
                this.state.dayType = btn.dataset.value;
                this.render();
            });
        });

        // 방향 선택
        document.querySelectorAll('#directionGroup .filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setActiveButton('#directionGroup', btn);
                this.state.direction = btn.dataset.value;
                this.render();
            });
        });

        // 필터 옵션
        document.getElementById('availableOnly').addEventListener('change', (e) => {
            this.state.availableOnly = e.target.checked;
            this.render();
        });

        document.getElementById('nearbyOnly').addEventListener('change', (e) => {
            this.state.nearbyOnly = e.target.checked;
            this.render();
        });
    },

    /**
     * 버튼 활성화 상태 변경
     */
    setActiveButton(groupSelector, activeBtn) {
        document.querySelectorAll(`${groupSelector} .filter-btn`).forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    },

    /**
     * 현재 시간 업데이트
     */
    updateCurrentTime() {
        document.getElementById('currentTime').textContent = Utils.getCurrentTime();
    },

    /**
     * 시간표 렌더링
     */
    render() {
        const routeId = Schedule.getDefaultRouteId();
        if (!routeId) {
            this.renderEmpty('시간표 데이터를 불러올 수 없습니다.');
            return;
        }

        let times = Schedule.getSchedule(routeId, this.state.dayType, this.state.direction);

        // 필터 적용
        if (this.state.availableOnly) {
            times = Filter.filterAvailable(times);
        }
        if (this.state.nearbyOnly) {
            times = Filter.filterNearby(times);
        }

        if (times.length === 0) {
            this.renderEmpty('해당 조건에 맞는 시간표가 없습니다.');
            return;
        }

        // 가장 가까운 시간 찾기
        const closestIndex = Filter.findClosestIndex(times);
        const currentMinutes = Utils.timeToMinutes(Utils.getCurrentTime());

        // 시간표 렌더링
        const list = document.getElementById('scheduleList');
        list.innerHTML = times.map((time, index) => {
            const timeMinutes = Utils.timeToMinutes(time);
            const isPassed = timeMinutes < currentMinutes;
            const isClosest = index === closestIndex && !isPassed;
            const isFavorite = Favorites.isFavorite(time, this.state.dayType, this.state.direction);

            return `
                <li class="schedule-item ${isPassed ? 'passed' : ''} ${isClosest ? 'highlight' : ''}">
                    <span class="schedule-time">⏰ ${time}</span>
                    <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                            data-time="${time}">★</button>
                </li>
            `;
        }).join('');

        // 즐겨찾기 버튼 이벤트
        list.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const time = btn.dataset.time;
                const isNowFavorite = Favorites.toggle(time, this.state.dayType, this.state.direction);
                btn.classList.toggle('active', isNowFavorite);
            });
        });

        // 가장 가까운 시간으로 스크롤
        if (!this.state.availableOnly && !this.state.nearbyOnly) {
            const highlightItem = list.querySelector('.highlight');
            if (highlightItem) {
                highlightItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    },

    /**
     * 빈 상태 렌더링
     */
    renderEmpty(message) {
        document.getElementById('scheduleList').innerHTML = `
            <li class="empty-state">${message}</li>
        `;
    }
};

// 앱 시작
document.addEventListener('DOMContentLoaded', () => App.init());
