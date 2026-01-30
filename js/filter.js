/**
 * 필터링 로직 모듈
 */

const Filter = {
    // 현재 방향 저장 (App에서 설정)
    currentDirection: 'outbound',

    /**
     * 방향에 따라 표시할 시간 반환
     */
    getDisplayTime(item, direction) {
        return direction === 'outbound' ? item.miryangStation : item.pnu;
    },

    /**
     * 지금 출발 가능한 버스만 필터링
     * @param {Array} timetable - 시간표 배열
     * @param {string} direction - 방향
     */
    filterAvailable(timetable, direction) {
        const currentMinutes = Utils.timeToMinutes(Utils.getCurrentTime());

        return timetable.filter(item => {
            const timeStr = this.getDisplayTime(item, direction);
            if (!timeStr) return false;

            const timeMinutes = Utils.timeToMinutes(timeStr);
            return timeMinutes >= currentMinutes;
        });
    },

    /**
     * 현재 시간 ±3시간 범위로 필터링
     * @param {Array} timetable - 시간표 배열
     * @param {string} direction - 방향
     */
    filterNearby(timetable, direction) {
        const currentMinutes = Utils.timeToMinutes(Utils.getCurrentTime());
        const rangeMinutes = 3 * 60; // 3시간 = 180분

        return timetable.filter(item => {
            const timeStr = this.getDisplayTime(item, direction);
            if (!timeStr) return true;

            const timeMinutes = Utils.timeToMinutes(timeStr);
            return Math.abs(timeMinutes - currentMinutes) <= rangeMinutes;
        });
    },

    /**
     * 가장 가까운 출발 시간의 인덱스 찾기
     * @param {Array} timetable - 시간표 배열
     * @param {string} direction - 방향
     */
    findClosestIndex(timetable, direction) {
        const currentMinutes = Utils.timeToMinutes(Utils.getCurrentTime());
        let closestIndex = 0;
        let minDiff = Infinity;

        timetable.forEach((item, index) => {
            const timeStr = this.getDisplayTime(item, direction);
            if (!timeStr) return;

            const timeMinutes = Utils.timeToMinutes(timeStr);
            const diff = timeMinutes - currentMinutes;

            if (diff >= 0 && diff < minDiff) {
                minDiff = diff;
                closestIndex = index;
            }
        });

        return closestIndex;
    }
};
