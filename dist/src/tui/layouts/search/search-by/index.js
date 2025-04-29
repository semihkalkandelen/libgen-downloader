"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchBy = void 0;
const react_1 = __importDefault(require("react"));
const ink_1 = require("ink");
const index_1 = require("../../../store/index");
const SearchByItem_1 = require("./SearchByItem");
function SearchBy() {
    const columnFilterQueryParamValues = (0, index_1.useBoundStore)((state) => state.columnFilterQueryParamValues);
    const selectedSearchByOption = (0, index_1.useBoundStore)((state) => state.selectedSearchByOption);
    const setSelectedSearchByOption = (0, index_1.useBoundStore)((state) => state.setSelectedSearchByOption);
    const selectedSearchByOptionLabel = selectedSearchByOption
        ? Object.entries(columnFilterQueryParamValues).find(([, value]) => value === selectedSearchByOption)?.[0]
        : "Default";
    return (react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
        react_1.default.createElement(ink_1.Box, { height: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true }, "Search by: "),
            react_1.default.createElement(ink_1.Text, { bold: true, color: "green" }, selectedSearchByOptionLabel)),
        react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
            react_1.default.createElement(SearchByItem_1.SearchByItem, { key: "default", isSelected: selectedSearchByOption === null, label: "Default", onSelect: () => {
                    setSelectedSearchByOption(null);
                } }),
            Object.entries(columnFilterQueryParamValues).map(([key, value]) => {
                return (react_1.default.createElement(SearchByItem_1.SearchByItem, { key: key, isSelected: selectedSearchByOption === value, label: key, onSelect: () => {
                        setSelectedSearchByOption(value);
                    } }));
            }))));
}
exports.SearchBy = SearchBy;
