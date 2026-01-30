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
     * @param {string} dayType - 'weekday' | 'weekend' | 'vacation'
     * @param {string} direction - 'outbound' | 'inbound'
     */
    getSchedule(dayType, direction) {
        if (!this.data) return [];

        const schedule = this.data.schedules.find(
            s => s.type === dayType && s.direction === direction
        );

        return schedule ? schedule.timetable : [];
    },

    /**
     * 노선 이름 반환
     * @param {string} dayType - 'weekday' | 'weekend' | 'vacation'
     * @param {string} direction - 'outbound' | 'inbound'
     */
    getRouteName(dayType, direction) {
        if (!this.data) return '';

        const schedule = this.data.schedules.find(
            s => s.type === dayType && s.direction === direction
        );

        return schedule ? schedule.route : '';
    },

    /**
     * 방학 기간 정보 반환
     */
    getVacationPeriods() {
        return this.data?.meta?.vacationPeriods || [];
    },

    /**
     * 필드 매핑 정보 반환 (한글 레이블용)
     */
    getFieldMapping() {
        return this.data?.meta?.fieldMapping || {};
    }
};
