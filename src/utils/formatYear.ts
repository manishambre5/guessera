// To format year (-1000 --> ~1000BCE)
const formatYear = (value: number): string => {
    const num = Number(value);
    // num-1 cauz 256 BCE is mathematically year -255 and there's no year 0 in the BCE-CE scale
    return num < 1 ? `${Math.abs(num-1)} BCE` : `${num} CE`;
};

export default formatYear;