/**
 * 메인 앱 로직
 */

const App = {
    // 현재 선택된 조건
    state: {
        dayType: 'weekday',
        direction: 'outbound',
        availableOnly: false,
        nearbyOnly: false,
        favoritesOnly: false
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
        setInterval(() => {
            this.updateCurrentTime();
            this.render(); // 시간 변경 시 다시 렌더링
        }, 60000);
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

        document.getElementById('favoritesOnly').addEventListener('change', (e) => {
            this.state.favoritesOnly = e.target.checked;
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
        let timetable = Schedule.getSchedule(this.state.dayType, this.state.direction);
        const routeName = Schedule.getRouteName(this.state.dayType, this.state.direction);

        // 노선 이름 표시
        const routeNameEl = document.getElementById('routeName');
        if (routeNameEl) {
            routeNameEl.textContent = routeName;
        }

        if (!timetable || timetable.length === 0) {
            this.renderEmpty('시간표 데이터를 불러올 수 없습니다.');
            return;
        }

        // 필터 적용
        if (this.state.availableOnly) {
            timetable = Filter.filterAvailable(timetable, this.state.direction);
        }
        if (this.state.nearbyOnly) {
            timetable = Filter.filterNearby(timetable, this.state.direction);
        }
        if (this.state.favoritesOnly) {
            timetable = Favorites.filterFavoritesOnly(timetable, this.state.dayType, this.state.direction);
        }

        if (timetable.length === 0) {
            const msg = this.state.favoritesOnly ? '저장된 즐겨찾기가 없습니다. ⭐를 눌러 추가하세요.' : '해당 조건에 맞는 시간표가 없습니다.';
            this.renderEmpty(msg);
            return;
        }

        // 가장 가까운 시간 찾기
        const closestIndex = Filter.findClosestIndex(timetable, this.state.direction);
        const currentMinutes = Utils.timeToMinutes(Utils.getCurrentTime());

        // 시간표 렌더링
        const list = document.getElementById('scheduleList');
        list.innerHTML = timetable.map((item, index) => {
            // 방향에 따라 표시할 시간 선택: outbound는 밀양역, inbound는 부산대
            const displayTime = this.state.direction === 'outbound' ? item.miryangStation : item.pnu;
            const timeMinutes = displayTime ? Utils.timeToMinutes(displayTime) : 0;
            const isPassed = displayTime && timeMinutes < currentMinutes;
            const isClosest = index === closestIndex && !isPassed;
            const isFavorite = Favorites.isFavorite(displayTime, this.state.dayType, this.state.direction);
            // 방향에 따른 정류장 시간 표시
            const stopTimes = this.state.direction === 'outbound'
                ? `${item.yeongnamru || '--:--'} → ${item.miryangStation || '--:--'} → ${item.pnu || '--:--'}`
                : `${item.pnu || '--:--'} → ${item.miryangStation || '--:--'} → ${item.yeongnamru || '--:--'}`;

            return `
                <li class="schedule-item ${isPassed ? 'passed' : ''} ${isClosest ? 'highlight' : ''}">
                    <div class="schedule-info">
                        <span class="schedule-time">🚌 ${displayTime || '--:--'}</span>
                        <span class="schedule-details">
                            ${stopTimes}
                            ${item.routeName ? `<span class="route-badge">${item.routeName}</span>` : ''}
                            ${item.note ? `<span class="note-badge">${item.note}</span>` : ''}
                        </span>
                    </div>
                    <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                            data-time="${displayTime}">★</button>
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
