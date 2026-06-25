function toRange(v: number | number[]): [number, number] {
    if (Array.isArray(v)) {
        if (v.length === 1) return [v[0], v[0]];
        return [v[0], v[1]];
    }
    return [v, v];
}
function rangeDistance(
    [a1, a2]: [number, number],
    [b1, b2]: [number, number]
): number {
    if (a2 < b1) return b1 - a2;
    if (b2 < a1) return a1 - b2;
    return 0; // overlap
}
export default function calculateScore(
    guess: number | number[],
    actual: number | [number, number]
): number {
    const maxDifference = 2000;
    const maxScore = 1000;
    const guessRange = toRange(guess);
    const actualRange = toRange(actual);

    const difference = rangeDistance(guessRange, actualRange);

    if (difference >= maxDifference) return 0;

    // exponential scoring to reward close guesses
    const normalized = 1 - difference / maxDifference; // 1.0 perfect, 0.0 at maxDiff
    const result = Math.round(maxScore * Math.pow(normalized, 3)); // cubic/exponential curve

    return result;
}