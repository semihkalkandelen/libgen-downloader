"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const ink_1 = require("ink");
const Option_1 = __importDefault(require("./Option"));
const useListControls_1 = require("../hooks/useListControls");
const OptionList = ({ options }) => {
    const sortedEntries = Object.entries(options).sort(([, a], [, b]) => (a.order ?? 0) - (b.order ?? 0));
    const values = sortedEntries.map(([, option]) => option);
    const { selectedOptionIndex } = (0, useListControls_1.useListControls)(values, (item) => {
        if (!item.loading) {
            item.onSelect();
        }
    });
    return (react_1.default.createElement(ink_1.Box, { flexDirection: "column", paddingLeft: 3 }, sortedEntries.map(([key, option], idx) => {
        const isOptionActive = idx === selectedOptionIndex;
        return react_1.default.createElement(Option_1.default, { key: key, isOptionActive: isOptionActive, option: option });
    })));
};
exports.default = OptionList;
