"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findDownloadUrlFromMirror = exports.parseDownloadUrls = void 0;
const labels_1 = __importDefault(require("../../labels"));
const selectors_1 = __importDefault(require("../selectors"));
function parseDownloadUrls(document, throwError) {
    const urls = [];
    try {
        const mainDownloadUrlElement = document.querySelector(selectors_1.default.MAIN_DOWNLOAD_URL_SELECTOR);
        if (!mainDownloadUrlElement) {
            if (throwError) {
                throwError(`${labels_1.default.ERR_OCCURED_WHILE_PARSING_DOC} mainDownloadUrlElement ${selectors_1.default.MAIN_DOWNLOAD_URL_SELECTOR}`);
            }
            return;
        }
        const mainDownloadUrl = mainDownloadUrlElement.getAttribute("href");
        if (mainDownloadUrl) {
            urls.push(mainDownloadUrl);
        }
        const otherDownloadUrlsContainerElement = document.querySelector(selectors_1.default.OTHER_DOWNLOAD_URLS_SELECTOR);
        if (!otherDownloadUrlsContainerElement) {
            if (throwError) {
                throwError(`${labels_1.default.ERR_OCCURED_WHILE_PARSING_DOC} otherDownloadUrlsContainerElement ${selectors_1.default.OTHER_DOWNLOAD_URLS_SELECTOR}`);
            }
            return;
        }
        const otherDownloadUrlsElements = Array.from(otherDownloadUrlsContainerElement.children);
        for (let i = 0; i < otherDownloadUrlsElements.length; i++) {
            const element = otherDownloadUrlsElements[i];
            const url = element.children[0]?.getAttribute("href");
            if (url) {
                urls.push(url);
            }
        }
        return urls;
    }
    catch (e) {
        if (throwError) {
            throwError("Error occured while fetching download urls");
        }
        return;
    }
}
exports.parseDownloadUrls = parseDownloadUrls;
function findDownloadUrlFromMirror(document, throwError) {
    const downloadLinkElement = document.querySelector(selectors_1.default.MAIN_DOWNLOAD_URL_SELECTOR);
    if (!downloadLinkElement) {
        if (throwError) {
            throwError("downloadLinkElement is undefined");
        }
        return;
    }
    const downloadLink = downloadLinkElement.getAttribute("href");
    return downloadLink;
}
exports.findDownloadUrlFromMirror = findDownloadUrlFromMirror;
