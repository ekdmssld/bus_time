/**
 * 필터링 로직 모듈
 */

const Filter = {
    /**
     * 지금 출발 가능한 버스만 필터링 (부산대 시간 기준)
     * @param {Array} timetable - 시간표 배열
     * @param {string} direction - 방향 (outbound: pnu 도착시간, inbound: pnu 출발시간)
     */
    filterAvailable(timetable, direction) {
        const currentMinutes = Utils.timeToMinutes(Utils.getCurrentTime());

        return timetable.filter(item => {
            // 부산대 시간 기준으로 필터링
            const timeStr = item.pnu;
            if (!timeStr) return false;

            const timeMinutes = Utils.timeToMinutes(timeStr);
            return timeMinutes >= currentMinutes;
        });
    },

    /**
     * 현재 시간 ±3시간 범위로 필터링 (부산대 시간 기준)
     * @param {Array} timetable - 시간표 배열
     */
    filterNearby(timetable) {
        const currentMinutes = Utils.timeToMinutes(Utils.getCurrentTime());
        const rangeMinutes = 3 * 60; // 3시간 = 180분

        return timetable.filter(item => {
            const timeStr = item.pnu;
            if (!timeStr) return true; // 시간이 없으면 포함

            const timeMinutes = Utils.timeToMinutes(timeStr);
            return Math.abs(timeMinutes - currentMinutes) <= rangeMinutes;
        });
    },

    /**
     * 가장 가까운 출발 시간의 인덱스 찾기 (부산대 시간 기준)
     * @param {Array} timetable - 시간표 배열
     */
    findClosestIndex(timetable) {
        const currentMinutes = Utils.timeToMinutes(Utils.getCurrentTime());
        let closestIndex = 0;
        let minDiff = Infinity;

        timetable.forEach((item, index) => {
            const timeStr = item.pnu;
            if (!timeStr) return;

            const timeMinutes = Utils.timeToMinutes(timeStr);
            const diff = timeMinutes - currentMinutes;

            // 현재 시간 이후의 가장 가까운 시간
            if (diff >= 0 && diff < minDiff) {
                minDiff = diff;
                closestIndex = index;
            }
        });

        return closestIndex;
    }
};
