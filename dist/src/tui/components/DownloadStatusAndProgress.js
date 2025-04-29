"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloadStatusAndProgress = void 0;
const react_1 = __importDefault(require("react"));
const ink_1 = require("ink");
const progress_1 = require("../helpers/progress");
const download_statuses_1 = require("../../download-statuses");
function DownloadStatusAndProgress({ downloadProgressData }) {
    const downloadProgress = (0, progress_1.getDownloadProgress)(downloadProgressData.progress || 0, downloadProgressData.total);
    return (react_1.default.createElement(ink_1.Text, null,
        download_statuses_1.downloadStatusIndicators[downloadProgressData.status],
        " ",
        downloadProgressData.status !== download_statuses_1.DownloadStatus.DOWNLOADED && (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(ink_1.Text, { color: "white" },
                downloadProgress?.progressPercentage,
                "% ",
                downloadProgress?.downloadedSize,
                " /",
                " ",
                downloadProgress?.totalSize),
            " "))));
}
exports.DownloadStatusAndProgress = DownloadStatusAndProgress;
