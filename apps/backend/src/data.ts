import { Dataset } from "@guessera/types";
import A from "./data/ancient_history.json" with { type: 'json' };
import B from "./data/post_classical.json" with { type: 'json' };
import C from "./data/early_modern.json" with { type: 'json' };
import D from "./data/late_modern.json" with { type: 'json' };
import { normalizeAncientHistory } from "./data/data_normalizer.js";
import { normalizePostClassicalHistory } from "./data/data_normalizer.js";
import { normalizeEarlyModernHistory } from "./data/data_normalizer.js";
import { normalizeLateModernHistory } from "./data/data_normalizer.js";

export const dataset: Dataset = {
  ancient_history: normalizeAncientHistory(A),
  post_classical: normalizePostClassicalHistory(B),
  early_modern: normalizeEarlyModernHistory(C),
  late_modern: normalizeLateModernHistory(D),
};