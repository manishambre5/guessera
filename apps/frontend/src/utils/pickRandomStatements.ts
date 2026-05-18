import { statements } from "@/statements";
import type { Statement } from "@guessera/types";

const pickRandomStatements = (n: number): Statement[] => {
    const chosenStatements = [];
    const usedIndices = new Set();
    while (chosenStatements.length < n) {
        const randomIndex = Math.floor(Math.random() * statements.length);
        if (!usedIndices.has(randomIndex)) {
            usedIndices.add(randomIndex);
            chosenStatements.push(statements[randomIndex]);
        }
    }
    return chosenStatements;
}

export default pickRandomStatements;