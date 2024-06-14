#! /usr/bin/env node

import fetchGpuProductTable from "./lib/download-html.js";
import parseGpuList from "./lib/parse-gpu-list.js";
import parse2json from "./lib/parse2json.js";

import { writeFile } from "node:fs";

async function doAll() {
  const versions = ["550.90.07", "515.76", "495.46", "470.141.03", "465.31"];
  const contents = await Promise.all(
    versions.map((item) => fetchGpuProductTable(item)),
  );
  const jsons = await Promise.all(
    contents.map((item) =>
      parse2json(
        parseGpuList(item.content),
        `json_dbs/gpu_product_db_${item.version}.json`,
      ),
    ),
  );
  const merged = Object.assign({}, ...jsons);
  const mergedContent = JSON.stringify(merged, Object.keys(merged).sort(), 2);
  writeFile("json_dbs/gpu_product_db.json", mergedContent, () => {
    console.log("full gpu products save to: json_dbs/gpu_product_db.json");
  });
}

// doAll().catch((err) => {
//   console.log(`error: ${err}`);
// });

doAll()
