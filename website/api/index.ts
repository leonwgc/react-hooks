import type { HookName } from "../catalog";
import type { ApiDoc } from "./types";
import { coreDocs } from "./core";
import { browserDocs } from "./browser";
import { dataDocs } from "./data";
import { formDocs } from "./form";
import { listDocs } from "./lists";
import { queueDocs } from "./queue";
import { webBrowserDocs } from "./web-browser";
import { webInteractionDocs } from "./web-interaction";

import { phase4Docs } from "./phase4";

// Exhaustive: a newly added Hook must also have a complete API entry.
export const apiDocs: Record<HookName, ApiDoc> = {
  ...phase4Docs,
  ...coreDocs,
  ...browserDocs,
  ...dataDocs,
  ...formDocs,
  ...listDocs,
  ...queueDocs,
  ...webBrowserDocs,
  ...webInteractionDocs,
};
