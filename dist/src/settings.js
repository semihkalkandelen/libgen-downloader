"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpAgent = exports.SEARCH_PAGE_SIZE = exports.FAIL_REQ_ATTEMPT_DELAY_MS = exports.FAIL_REQ_ATTEMPT_COUNT = exports.CONFIGURATION_URL = exports.SCREEN_WIDTH_PERC = exports.SCREEN_PADDING = exports.SCREEN_BASE_APP_WIDTH = void 0;
const https_1 = __importDefault(require("https"));
exports.SCREEN_BASE_APP_WIDTH = 80;
exports.SCREEN_PADDING = 5;
exports.SCREEN_WIDTH_PERC = 95;
exports.CONFIGURATION_URL = "https://raw.githubusercontent.com/obsfx/libgen-downloader/configuration/config.json";
exports.FAIL_REQ_ATTEMPT_COUNT = 5;
exports.FAIL_REQ_ATTEMPT_DELAY_MS = 2000;
exports.SEARCH_PAGE_SIZE = 25;
// https agent to bypass SSL rejection
exports.httpAgent = new https_1.default.Agent({
    rejectUnauthorized: false,
});
