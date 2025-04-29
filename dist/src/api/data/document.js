"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDocument = void 0;
const jsdom_1 = require("jsdom");
const node_fetch_1 = __importDefault(require("node-fetch"));
const settings_1 = require("../../settings");
async function getDocument(searchURL) {
    try {
        const response = await (0, node_fetch_1.default)(searchURL, {
            agent: settings_1.httpAgent,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
                "Connection": "keep-alive",
            },
        });
        const htmlString = await response.text();
        return new jsdom_1.JSDOM(htmlString).window.document;
    }
    catch (e) {
        throw new Error(`Error occured while fetching document of ${searchURL}`);
    }
}
exports.getDocument = getDocument;
