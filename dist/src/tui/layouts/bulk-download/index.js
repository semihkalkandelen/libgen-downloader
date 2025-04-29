"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkDownload = void 0;
const react_1 = __importDefault(require("react"));
const ink_1 = require("ink");
const ink_spinner_1 = __importDefault(require("ink-spinner"));
const index_1 = require("../../store/index");
const DownloadStatusAndProgress_1 = require("../../components/DownloadStatusAndProgress");
const BulkDownloadAfterCompleteOptions_1 = require("./BulkDownloadAfterCompleteOptions");
function BulkDownload() {
    const bulkDownloadQueue = (0, index_1.useBoundStore)((state) => state.bulkDownloadQueue);
    const isBulkDownloadComplete = (0, index_1.useBoundStore)((state) => state.isBulkDownloadComplete);
    const completedBulkDownloadItemCount = (0, index_1.useBoundStore)((state) => state.completedBulkDownloadItemCount);
    const failedBulkDownloadItemCount = (0, index_1.useBoundStore)((state) => state.failedBulkDownloadItemCount);
    const createdMD5ListFileName = (0, index_1.useBoundStore)((state) => state.createdMD5ListFileName);
    const CLIMode = (0, index_1.useBoundStore)((state) => state.CLIMode);
    const totalItemCount = bulkDownloadQueue.length;
    return (react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
        react_1.default.createElement(ink_1.Box, { paddingLeft: 3, flexDirection: "column" },
            react_1.default.createElement(ink_1.Text, { wrap: "truncate-end" },
                react_1.default.createElement(ink_1.Text, { color: "greenBright" },
                    "COMPLETED (",
                    completedBulkDownloadItemCount,
                    ") "),
                react_1.default.createElement(ink_1.Text, { color: "redBright" },
                    "FAILED (",
                    failedBulkDownloadItemCount,
                    ") "),
                react_1.default.createElement(ink_1.Text, { color: "white" },
                    "TOTAL (",
                    totalItemCount,
                    ")")),
            react_1.default.createElement(ink_1.Text, { color: "gray" }, createdMD5ListFileName ? (react_1.default.createElement(ink_1.Text, null,
                "MD5 list file created: ",
                react_1.default.createElement(ink_1.Text, { color: "blueBright" }, createdMD5ListFileName))) : (react_1.default.createElement(ink_spinner_1.default, { type: "simpleDotsScrolling" }))),
            react_1.default.createElement(ink_1.Text, { color: "white" },
                "Downloading files to ",
                react_1.default.createElement(ink_1.Text, { color: "blueBright" }, process.cwd())),
            bulkDownloadQueue.map((item, idx) => (react_1.default.createElement(ink_1.Text, { key: idx, wrap: "truncate-end" },
                react_1.default.createElement(DownloadStatusAndProgress_1.DownloadStatusAndProgress, { downloadProgressData: item }),
                item.filename ? (react_1.default.createElement(ink_1.Text, null,
                    react_1.default.createElement(ink_1.Text, { color: "green" }, item.filename))) : item.md5 ? (react_1.default.createElement(ink_1.Text, null,
                    react_1.default.createElement(ink_1.Text, { color: "gray" }, "md5: "),
                    react_1.default.createElement(ink_1.Text, { color: "green" }, item.md5))) : (react_1.default.createElement(ink_1.Text, { color: "gray" }, "-"))))),
            !CLIMode && isBulkDownloadComplete && react_1.default.createElement(BulkDownloadAfterCompleteOptions_1.BulkDownloadAfterCompleteOptions, null))));
}
exports.BulkDownload = BulkDownload;
