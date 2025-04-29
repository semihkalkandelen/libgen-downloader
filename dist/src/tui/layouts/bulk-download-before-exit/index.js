"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkDownloadBeforeExit = void 0;
const react_1 = __importDefault(require("react"));
const ink_1 = require("ink");
const index_1 = require("../../store/index");
const OptionList_1 = __importDefault(require("../../components/OptionList"));
const options_1 = require("../../../options");
const labels_1 = __importDefault(require("../../../labels"));
const keys_1 = require("../keys");
function BulkDownloadBeforeExit() {
    const bulkDownloadSelectedEntryIds = (0, index_1.useBoundStore)((state) => state.bulkDownloadSelectedEntryIds);
    const handleExit = (0, index_1.useBoundStore)((state) => state.handleExit);
    const setActiveLayout = (0, index_1.useBoundStore)((state) => state.setActiveLayout);
    const options = {
        [options_1.BeforeExitOption.NO]: {
            label: labels_1.default.NO,
            onSelect: () => {
                setActiveLayout(keys_1.LAYOUT_KEY.RESULT_LIST_LAYOUT);
            },
            order: 1,
        },
        [options_1.BeforeExitOption.YES]: {
            label: labels_1.default.YES,
            onSelect: () => handleExit(),
            order: 2,
        },
    };
    return (react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
        react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
            react_1.default.createElement(ink_1.Text, { wrap: "truncate-end" },
                "You have ",
                react_1.default.createElement(ink_1.Text, { color: "green" }, bulkDownloadSelectedEntryIds.length),
                " entries in your bulk download queue."),
            react_1.default.createElement(ink_1.Text, { wrap: "truncate-end" }, "Are you sure you want to exit?")),
        react_1.default.createElement(OptionList_1.default, { options: options })));
}
exports.BulkDownloadBeforeExit = BulkDownloadBeforeExit;
