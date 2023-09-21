import { writeFile } from "node:fs";

export default async function parse2json(gpus, jsonPath) {
  return new Promise((resolve, reject) => {
    const kv = {};
    gpus.forEach((item) => {
      kv[item.PCIID] = item.product;
    });
    const content = JSON.stringify(kv, Object.keys(kv).sort(), 2);
    writeFile(jsonPath, content, (err) => {
      if (err) reject(err);
      console.log(`saved to ${jsonPath}`);
    });
    resolve(kv);
  });
}
