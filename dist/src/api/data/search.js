"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseEntries = exports.constructFindMD5SearchUrl = exports.constructMD5SearchUrl = exports.constructSearchURL = void 0;
const selectors_1 = __importDefault(require("../selectors"));
function constructSearchURL({ query, pageNumber, pageSize, mirror, searchReqPattern, columnFilterQueryParamKey, columnFilterQueryParamValue, }) {
    let url = searchReqPattern
        .replace("{mirror}", mirror)
        .replace("{query}", query)
        .replace("{pageNumber}", pageNumber.toString())
        .replace("{pageSize}", pageSize.toString());
    if (columnFilterQueryParamValue) {
        url += `&${columnFilterQueryParamKey}=${columnFilterQueryParamValue}`;
    }
    return url;
}
exports.constructSearchURL = constructSearchURL;
function constructMD5SearchUrl(pattern, mirror, md5) {
    return pattern.replace("{mirror}", mirror).replace("{md5}", md5);
}
exports.constructMD5SearchUrl = constructMD5SearchUrl;
function constructFindMD5SearchUrl(pattern, mirror, idList) {
    return pattern.replace("{mirror}", mirror).replace("{id}", idList.join(","));
}
exports.constructFindMD5SearchUrl = constructFindMD5SearchUrl;
function parseEntries(document, throwError) {
    const entries = [];
    const containerTable = document.querySelector(selectors_1.default.TABLE_CONTAINER_SELECTOR);
    if (!containerTable) {
        if (throwError) {
            throwError("containerTable is undefined");
        }
        return;
    }
    // Get rid of table header by slicing it
    const entryElements = Array.from(containerTable.children).slice(1);
    for (let i = 0; i < entryElements.length; i++) {
        const element = entryElements[i];
        const id = element.children[0]?.textContent || "";
        const authors = element.children[1]?.textContent || "";
        const title = element.children[2]?.textContent || "";
        const publisher = element.children[3]?.textContent || "";
        const year = element.children[4]?.textContent || "";
        const pages = element.children[5]?.textContent || "";
        const language = element.children[6]?.textContent || "";
        const size = element.children[7]?.textContent || "";
        const extension = element.children[8]?.textContent || "";
        const mirror = element.children[9]?.children[0]?.getAttribute("href") || "";
        entries.push({
            id,
            authors,
            title,
            publisher,
            year,
            pages,
            language,
            size,
            extension,
            mirror,
        });
    }
    return entries;
}
exports.parseEntries = parseEntries;
