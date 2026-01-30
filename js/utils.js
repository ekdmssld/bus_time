/**
 * 유틸리티 함수 모듈
 */

const Utils = {
    /**
     * 현재 시간을 HH:MM 형식으로 반환
     */
    getCurrentTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    },

    /**
     * 시간 문자열을 분 단위로 변환 (비교용)
     * @param {string} time - "HH:MM" 형식
     */
    timeToMinutes(time) {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    },

    /**
     * 오늘이 평일인지 주말인지 판단
     * @returns {'weekday' | 'weekend'}
     */
    getTodayType() {
        const day = new Date().getDay();
        return (day === 0 || day === 6) ? 'weekend' : 'weekday';
    },

    /**
     * 현재 날짜가 방학 기간인지 확인
     * @param {Array} vacationPeriods - 방학 기간 배열
     */
    isVacationPeriod(vacationPeriods) {
        if (!vacationPeriods || vacationPeriods.length === 0) return false;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return vacationPeriods.some(period => {
            const start = new Date(period.start);
            const end = new Date(period.end);
            return today >= start && today <= end;
        });
    }
};
