//import { Dataset } from "@guessera/types";
import { Dataset } from "./types/index.js"; // cauz heroku can't work with pnpm workspaces?
import A from "./data/ancient_history.json" with { type: 'json' };
import B from "./data/post_classical.json" with { type: 'json' };
import C from "./data/early_modern.json" with { type: 'json' };
import D from "./data/late_modern.json" with { type: 'json' };
import { normalizeA } from "./data/data_normalizer.js";
import { normalizeB } from "./data/data_normalizer.js";

export const dataset: Dataset = {
  ancient_history: normalizeA(A, "Ancient"),
  post_classical: normalizeB(B, "Post Classical"),
  early_modern: normalizeB(C, "Early Modern"),
  late_modern: normalizeA(D, "Late Modern"),
};