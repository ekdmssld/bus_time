/**
 * 시간표 데이터 처리 모듈
 */

const Schedule = {
    data: null,

    /**
     * JSON 파일에서 시간표 데이터 로드
     */
    async load() {
        try {
            const response = await fetch('data/schedules.json');
            this.data = await response.json();
            return this.data;
        } catch (error) {
            console.error('시간표 데이터 로드 실패:', error);
            return null;
        }
    },

    /**
     * 조건에 맞는 시간표 반환
     * @param {string} routeId - 노선 ID
     * @param {string} dayType - 'weekday' | 'weekend' | 'vacation'
     * @param {string} direction - 'outbound' | 'inbound'
     */
    getSchedule(routeId, dayType, direction) {
        if (!this.data) return [];

        const route = this.data.routes.find(r => r.id === routeId);
        if (!route) return [];

        return route.schedules[dayType]?.[direction] || [];
    },

    /**
     * 첫 번째 노선 ID 반환
     */
    getDefaultRouteId() {
        if (!this.data || this.data.routes.length === 0) return null;
        return this.data.routes[0].id;
    },

    /**
     * 방학 기간 정보 반환
     */
    getVacationPeriods() {
        return this.data?.meta?.vacationPeriods || [];
    }
};
