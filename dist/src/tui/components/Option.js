"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const ink_1 = require("ink");
const figures_1 = __importDefault(require("figures"));
const Spinner_1 = __importDefault(require("./Spinner"));
const Option = ({ isOptionActive, option, ...rest }) => {
    return (react_1.default.createElement(ink_1.Box, { ...rest },
        react_1.default.createElement(ink_1.Box, { paddingRight: 1 },
            react_1.default.createElement(ink_1.Text, { color: isOptionActive ? "yellow" : "", bold: isOptionActive }, isOptionActive ? figures_1.default.pointer : " ")),
        option.loading && (react_1.default.createElement(ink_1.Box, { paddingRight: 1 },
            react_1.default.createElement(Spinner_1.default, null))),
        react_1.default.createElement(ink_1.Box, null,
            react_1.default.createElement(ink_1.Text, { wrap: "truncate", color: option.loading ? "gray" : isOptionActive ? "yellow" : "", bold: isOptionActive }, option.label),
            option.description ? (react_1.default.createElement(ink_1.Text, { wrap: "truncate", color: "gray" },
                " ",
                option.description)) : null)));
};
exports.default = Option;
