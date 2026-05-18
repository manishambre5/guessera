export default function calculateScore(guess: number, actual: number): number {
    const maxDifference = 2000;
    const maxScore = 1000;
    const difference = Math.abs(guess - actual);

    if (difference >= maxDifference) return 0;

    // exponential scoring to reward close guesses well
    const normalized = 1 - difference / maxDifference; // 1.0 perfect, 0.0 at maxDiff
    const result = Math.round(maxScore * Math.pow(normalized, 3)); // cubic/exponential curve

    return result;
}