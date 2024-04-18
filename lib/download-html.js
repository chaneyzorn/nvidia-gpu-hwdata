import { existsSync, writeFileSync, readFileSync } from "node:fs";
import { request } from "node:https";

export default async function fetchGpuProductTable(version) {
  return new Promise((resolve, reject) => {
    const filePath = `htmls/nvidia-${version}-supportedchips.html`;
    if (existsSync(filePath)) {
      console.log(`${filePath} exists, skip fetch html file.`);
      const content = readFileSync(filePath, { encoding: "utf-8" });
      resolve({
        content,
        version,
      });
      return;
    }

    const url = `https://download.nvidia.com/XFree86/Linux-x86_64/${version}/README/supportedchips.html`;
    const req = request(url, {timeout: 10000}, (res) => {
      console.log(`request version: ${version} => STATUS: ${res.statusCode}`);

      let body = "";
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", () => {
        writeFileSync(filePath, body);
        resolve({
          content: body,
          version,
        });
      });
    });

    req.on("error", (e) => {
      reject(e);
    });

    req.end(() => {
      console.log(`request version: ${version} sended`);
    });
  });
}
