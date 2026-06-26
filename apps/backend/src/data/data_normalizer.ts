import { Statement } from "@guessera/types";

type RawDataA = {
	era: string;
	events: {
		year: string;
		event: string;
	}[];
};

type RawDataB = {
	era: string;
    sections: {
        title: string;
        events: {
            year: string;
            date?: string;
            event: string;
            description?: string;
        }[];
    }[];
};

const normalizeYearLabel = (year: string): string => {
    const trimmed = year.trim();
    
    // Check if the era suffix exists
    const hasEra = /\b(BC|BCE|AD|CE)\b/i.test(trimmed);
    
    let normalized = trimmed
        .replace(/\bBC\b/gi, "BCE")
        .replace(/\bAD\b/gi, "CE");
    
    if (!hasEra) {
        normalized = `${normalized} CE`;
    }
    
    return normalized;
};

const convertYear = (year: string): number => {
    const upper = year.toUpperCase().trim();
    const num = parseInt(upper.replace(/[^0-9]/g, ""), 10);
    
	// To format year (-1000 --> ~1000BCE)
    if (upper.includes("BC") || upper.includes("BCE")) {
		// num-1 cauz 256 BCE is mathematically year -255 and there's no year 0 in the BCE-CE scale
        return -(num - 1);
    }
    return num;
};

//TODO: handle event year values like 'Late 4th Millennium BC', '470~469 BCE', ...

const typeCastYear = (year: string): number | [number, number] => {
    // Normalize all dash variants to a common separator
    const normalized = year
        .replace(/\u2013/g, "|")  // en dash
        .replace(/\u2014/g, "|")  // em dash
        .replace(/\u2012/g, "|")  // figure dash
        .replace(/\u2010/g, "|")  // hyphen
		.replace(/-/g, "|")  // regular hyphen/minus
        .trim();

    // Split only if both parts look like years
    const parts = normalized.split("|").map(p => p.trim()).filter(Boolean);
    
    if (parts.length === 2) {
        // Verify both parts actually contain a number before treating as range
        const bothAreYears = parts.every(p => /\d/.test(p));
        if (bothAreYears) {

			// The first year (upperbound) may not have an era label if both bounds are from the same era. So if it doesn't then add the same one as the lowerbound
			const [upperbound, lowerbound] = parts;
			const upperboundHasEraLabel = /\b(BC|BCE|AD|CE)\b/i.test(upperbound);
			const lowerboundEraMatch = lowerbound.match(/\b(BC|BCE|AD|CE)\b/i);

			// If first part has no era but second does, inherit it
			const normalizedUpperbound = (!upperboundHasEraLabel && lowerboundEraMatch)
				? `${upperbound} ${lowerboundEraMatch[0]}`
				: upperbound;

            return [convertYear(normalizedUpperbound), convertYear(lowerbound)];
        }
    }

    return convertYear(year);
};

export function normalizeA(rawData: RawDataA[], eraLabel:string): Statement[] {
	let counter = 1;
	return rawData.flatMap((era) =>
		era.events.map((event) => {
			const typeCasted = typeCastYear(event.year);
			const isRange = Array.isArray(typeCasted);

			return {
                id: `A${counter++}`,
                statement: event.event,
                ...(isRange
                    ? {
                        type: "period",
                        yearRange: typeCasted,
                        yearRangeLabel: normalizeYearLabel(event.year),
                    }
                    : {
                        type: "event",
                        year: typeCasted,
                        yearLabel: normalizeYearLabel(event.year),
                    }),
                periodLabel: era.era,
                eraLabel: eraLabel,
            };
		})
	);
}

export function normalizeB(rawData: RawDataB[], eraLabel: string): Statement[] {
	let counter = 1;
	return rawData.flatMap((era) =>
        era.sections.flatMap((section) =>
            section.events.map((event) => {
			const typeCasted = typeCastYear(event.year);
			const isRange = Array.isArray(typeCasted);

			return {
                id: `A${counter++}`,
                statement: event.event,
                ...(isRange
                    ? {
                        type: "period",
                        yearRange: typeCasted,
                        yearRangeLabel: normalizeYearLabel(event.year),
                    }
                    : {
                        type: "event",
                        year: typeCasted,
                        yearLabel: normalizeYearLabel(event.year),
                    }),
                periodLabel: era.era,
                eraLabel: eraLabel,
            };
		})
	));
}