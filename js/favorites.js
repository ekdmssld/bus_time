/**
 * 즐겨찾기 기능 모듈
 */

const Favorites = {
    STORAGE_KEY: 'bus_favorites',

    /**
     * 즐겨찾기 목록 가져오기
     */
    getAll() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    /**
     * 즐겨찾기 추가
     * @param {string} time - 시간
     * @param {string} dayType - 날짜 유형
     * @param {string} direction - 방향
     */
    add(time, dayType, direction) {
        const favorites = this.getAll();
        const key = `${dayType}-${direction}-${time}`;

        if (!favorites.includes(key)) {
            favorites.push(key);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
        }
    },

    /**
     * 즐겨찾기 제거
     * @param {string} time - 시간
     * @param {string} dayType - 날짜 유형
     * @param {string} direction - 방향
     */
    remove(time, dayType, direction) {
        const favorites = this.getAll();
        const key = `${dayType}-${direction}-${time}`;
        const index = favorites.indexOf(key);

        if (index > -1) {
            favorites.splice(index, 1);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
        }
    },

    /**
     * 즐겨찾기 여부 확인
     * @param {string} time - 시간
     * @param {string} dayType - 날짜 유형
     * @param {string} direction - 방향
     */
    isFavorite(time, dayType, direction) {
        const favorites = this.getAll();
        const key = `${dayType}-${direction}-${time}`;
        return favorites.includes(key);
    },

    /**
     * 즐겨찾기 토글
     * @param {string} time - 시간
     * @param {string} dayType - 날짜 유형
     * @param {string} direction - 방향
     */
    toggle(time, dayType, direction) {
        if (this.isFavorite(time, dayType, direction)) {
            this.remove(time, dayType, direction);
            return false;
        } else {
            this.add(time, dayType, direction);
            return true;
        }
    }
};
