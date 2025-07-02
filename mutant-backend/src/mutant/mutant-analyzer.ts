export function isMutant(dna: string[]): boolean {
    const N = dna.length;
    let count = 0;

    const check = (i: number, j: number, dx: number, dy: number) => {
        const char = dna[i][j];
        for (let k = 1; k < 4; k++) {
            const x = i + dx * k;
            const y = j + dy * k;
            if (x >= N || y >= N || dna[x][y] !== char) return false;
        }
        return true;
    };

    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            if (
                check(i, j, 0, 1) || // →
                check(i, j, 1, 0) || // ↓
                check(i, j, 1, 1) || // ↘
                check(i, j, 1, -1)   // ↙
            ) {
                count++;
                if (count > 1) return true;
            }
        }
    }

    return false;
}
