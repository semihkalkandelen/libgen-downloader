"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppHeader = void 0;
const react_1 = __importDefault(require("react"));
const ink_1 = require("ink");
const figures_1 = __importDefault(require("figures"));
const index_1 = require("../store/index");
const index_2 = require("../../index");
function AppHeader() {
    const latestVersion = (0, index_1.useBoundStore)((state) => state.latestVersion);
    const newVersionAvailable = latestVersion && latestVersion !== index_2.APP_VERSION;
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(ink_1.Box, { paddingY: 1, flexDirection: "column" },
            react_1.default.createElement(ink_1.Text, { wrap: "truncate-end" },
                react_1.default.createElement(ink_1.Text, { color: "gray" },
                    figures_1.default.bullet,
                    " "),
                react_1.default.createElement(ink_1.Text, { color: "white" }, "libgen-downloader "),
                react_1.default.createElement(ink_1.Text, { color: "green" },
                    "@",
                    index_2.APP_VERSION),
                react_1.default.createElement(ink_1.Text, null,
                    " ",
                    figures_1.default.arrowRight,
                    " "),
                react_1.default.createElement(ink_1.Text, { color: "gray" }, "github.com/obsfx/libgen-downloader"))),
        newVersionAvailable ? (react_1.default.createElement(ink_1.Box, null,
            react_1.default.createElement(ink_1.Text, null,
                react_1.default.createElement(ink_1.Text, { color: "gray" }, "New version available: "),
                react_1.default.createElement(ink_1.Text, { color: "green" },
                    figures_1.default.arrowRight,
                    " @",
                    latestVersion),
                react_1.default.createElement(ink_1.Text, { color: "blue" }, " run npm i -g libgen-downloader to update")))) : null));
}
exports.AppHeader = AppHeader;
