"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloadIndicator = void 0;
const react_1 = __importDefault(require("react"));
const ink_1 = require("ink");
const index_1 = require("../store/index");
const DownloadIndicator = () => {
    const totalAddedToDownloadQueue = (0, index_1.useBoundStore)((state) => state.totalAddedToDownloadQueue);
    const totalDownloaded = (0, index_1.useBoundStore)((state) => state.totalDownloaded);
    const totalFailed = (0, index_1.useBoundStore)((state) => state.totalFailed);
    if (totalAddedToDownloadQueue === 0) {
        return null;
    }
    return (react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
        react_1.default.createElement(ink_1.Text, { wrap: "truncate" },
            react_1.default.createElement(ink_1.Text, { color: "green" },
                "DOWNLOADED ",
                totalDownloaded,
                "/",
                totalAddedToDownloadQueue),
            " ",
            totalFailed > 0 && react_1.default.createElement(ink_1.Text, { color: "redBright" },
                "FAIL (",
                totalFailed,
                ") "),
            "to ",
            react_1.default.createElement(ink_1.Text, { color: "blueBright" }, process.cwd()))));
};
exports.DownloadIndicator = DownloadIndicator;
