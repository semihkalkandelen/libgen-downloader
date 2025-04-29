"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadStatusIndicators = exports.DownloadStatus = void 0;
const react_1 = __importDefault(require("react"));
const ink_1 = require("ink");
var DownloadStatus;
(function (DownloadStatus) {
    DownloadStatus["IDLE"] = "IDLE";
    DownloadStatus["IN_QUEUE"] = "IN_QUEUE";
    DownloadStatus["PROCESSING"] = "PROCESSING";
    DownloadStatus["DOWNLOADING"] = "DOWNLOADING";
    DownloadStatus["DOWNLOADED"] = "DOWNLOADED";
    DownloadStatus["FAILED"] = "FAILED";
    DownloadStatus["CONNECTING_TO_LIBGEN"] = "CONNECTING_TO_LIBGEN";
    DownloadStatus["FETCHING_MD5"] = "FETCHING_MD5";
})(DownloadStatus || (exports.DownloadStatus = DownloadStatus = {}));
exports.downloadStatusIndicators = {
    [DownloadStatus.IDLE]: null,
    [DownloadStatus.IN_QUEUE]: (react_1.default.createElement(ink_1.Text, { color: "grey", inverse: true },
        " ",
        "IN QUEUE",
        " ")),
    [DownloadStatus.PROCESSING]: (react_1.default.createElement(ink_1.Text, { color: "yellowBright", inverse: true },
        " ",
        "PROCESSING",
        " ")),
    [DownloadStatus.DOWNLOADING]: (react_1.default.createElement(ink_1.Text, { color: "blueBright", inverse: true },
        " ",
        "DOWNLOADING",
        " ")),
    [DownloadStatus.DOWNLOADED]: (react_1.default.createElement(ink_1.Text, { color: "green", inverse: true },
        " ",
        "DOWNLOADED",
        " ")),
    [DownloadStatus.FAILED]: (react_1.default.createElement(ink_1.Text, { color: "red", inverse: true },
        " ",
        "FAILED",
        " ")),
    [DownloadStatus.CONNECTING_TO_LIBGEN]: (react_1.default.createElement(ink_1.Text, { color: "yellowBright", inverse: true },
        " ",
        "CONNECTING TO LIBGEN",
        " ")),
    [DownloadStatus.FETCHING_MD5]: (react_1.default.createElement(ink_1.Text, { color: "whiteBright", inverse: true },
        " ",
        "FETCHING MD5",
        " ")),
};
