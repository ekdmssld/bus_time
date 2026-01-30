/**
 * 필터링 로직 모듈
 */

const Filter = {
    /**
     * 지금 출발 가능한 버스만 필터링
     * @param {string[]} times - 시간 배열
     */
    filterAvailable(times) {
        const currentMinutes = Utils.timeToMinutes(Utils.getCurrentTime());
        return times.filter(time => Utils.timeToMinutes(time) >= currentMinutes);
    },

    /**
     * 현재 시간 ±3시간 범위로 필터링
     * @param {string[]} times - 시간 배열
     */
    filterNearby(times) {
        const currentMinutes = Utils.timeToMinutes(Utils.getCurrentTime());
        const rangeMinutes = 3 * 60; // 3시간 = 180분

        return times.filter(time => {
            const timeMinutes = Utils.timeToMinutes(time);
            return Math.abs(timeMinutes - currentMinutes) <= rangeMinutes;
        });
    },

    /**
     * 가장 가까운 출발 시간의 인덱스 찾기
     * @param {string[]} times - 시간 배열
     */
    findClosestIndex(times) {
        const currentMinutes = Utils.timeToMinutes(Utils.getCurrentTime());
        let closestIndex = 0;
        let minDiff = Infinity;

        times.forEach((time, index) => {
            const timeMinutes = Utils.timeToMinutes(time);
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
