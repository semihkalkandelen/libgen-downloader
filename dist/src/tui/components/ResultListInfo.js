"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const ink_1 = require("ink");
const index_1 = require("../store/index");
const ResultListInfo = () => {
    const searchValue = (0, index_1.useBoundStore)((state) => state.searchValue);
    const currentPage = (0, index_1.useBoundStore)((state) => state.currentPage);
    const bulkDownloadSelectedEntries = (0, index_1.useBoundStore)((state) => state.bulkDownloadSelectedEntries);
    return (react_1.default.createElement(ink_1.Box, null,
        react_1.default.createElement(ink_1.Text, { wrap: "truncate" },
            "Results for ",
            react_1.default.createElement(ink_1.Text, { color: "green" }, searchValue),
            " on page",
            " ",
            react_1.default.createElement(ink_1.Text, { color: "yellow" }, currentPage)),
        react_1.default.createElement(ink_1.Text, { color: "gray" }, " | "),
        react_1.default.createElement(ink_1.Text, { wrap: "truncate" },
            "Bulk download queue: ",
            react_1.default.createElement(ink_1.Text, { color: "green" }, bulkDownloadSelectedEntries.length))));
};
exports.default = ResultListInfo;
