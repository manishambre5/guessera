import type { GameDifficulty } from "@guessera/types";

type SliderBoundsProps = {
    statement?: {
        eraLabel?: string;
        periodLabel?: string;
    };
    difficulty?: GameDifficulty;
    oldestYear: number;
    currentYear: number;
};

function eraBounds(label: string): [number, number] {
	console.log(label);
	if (label === "Ancient") {
		return [-3199, 500];
	} else if (label === "Post Classical") {
		return [500, 1499];
	} else if (label === "Early Modern") {
		return [1500, 1899];
	} else {
		return [1900, 1999];
	}
}

function periodBounds(label: string): [number, number] {
	if (label === "Early history") {
		return [-3199, -779]; //780	BCE
	} else if (label === "Classical antiquity") {
		return [-779, 0];
	} else if (label === "Common Era") {
		return [0, 500];
	} else if (label === "Early post-classical history") {
		return [400, 1000];
	} else if (label === "Middle post-classical history") {
		return [1000, 1300];
	} else if (label === "Late post-classical history") {
		return [1300, 1500];
	} else if (["16th century", "17th century", "18th century", "19th century"].includes(label)) {
		return [1500, 1900];
	} else {
		return [1900, 2000];
	}
}

export default function getSliderBounds({
    statement,
    difficulty,
    oldestYear,
    currentYear
} : SliderBoundsProps) {
    if (!statement?.eraLabel || !statement?.periodLabel || !difficulty) {
        return { min: oldestYear, max: currentYear };
    }

    switch (difficulty) {
        case "easy": {
            const [min, max] = periodBounds(statement.periodLabel);
            return { min, max };
        }
        case "medium": {
            const [min, max] = eraBounds(statement.eraLabel);
            return { min, max };
        }
        default:
            return { min: oldestYear, max: currentYear };
    }
}