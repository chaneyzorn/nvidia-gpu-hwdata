import { JSDOM } from "jsdom";

export default function parseGpuList(htmlBody) {
  let res = [];
  let dom = new JSDOM(htmlBody);
  let doc = dom.window.document;
  let infos = doc.querySelectorAll("div.informaltable");
  infos.forEach((item) => {
    let trs = item.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
    for (const tr of trs) {
      let tds = tr.getElementsByTagName("td");
      let gpu = {
        product: tds[0].textContent,
        PCIID: tds[1].textContent,
        VDPAU: tds[2]?.textContent || "",
      };
      res.push(gpu);
    }
  });
  return res;
}
