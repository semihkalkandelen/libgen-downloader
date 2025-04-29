"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findMirror = exports.fetchConfig = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const settings_1 = require("../../settings");
const settings_2 = require("../../settings"); // HTTPS bypass agent
async function fetchConfig() {
    try {
        const response = await (0, node_fetch_1.default)(settings_1.CONFIGURATION_URL, {
            agent: settings_2.httpAgent,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                "Accept": "application/json",
                "Accept-Language": "en-US,en;q=0.5",
                "Connection": "keep-alive",
            },
        });
        const json = await response.json();
        const conf = json;
        return {
            latestVersion: conf["latest_version"] || "",
            mirrors: conf["mirrors"] || [],
            searchReqPattern: conf["searchReqPattern"] || "",
            searchByMD5Pattern: conf["searchByMD5Pattern"] || "",
            MD5ReqPattern: conf["MD5ReqPattern"] || "",
            columnFilterQueryParamKey: conf["columnFilterQueryParamKey"] || "",
            columnFilterQueryParamValues: conf["columnFilterQueryParamValues"] || {},
        };
    }
    catch (e) {
        throw new Error("Error occured while fetching configuration.");
    }
}
exports.fetchConfig = fetchConfig;
async function findMirror(mirrors, onMirrorFail) {
    for (let i = 0; i < mirrors.length; i++) {
        const mirror = mirrors[i];
        try {
            await (0, node_fetch_1.default)(mirror, {
                agent: settings_2.httpAgent,
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                    "Accept": "text/html",
                    "Accept-Language": "en-US,en;q=0.5",
                    "Connection": "keep-alive",
                },
            });
            return mirror;
        }
        catch (e) {
            onMirrorFail(mirror);
        }
    }
    return null;
}
exports.findMirror = findMirror;
