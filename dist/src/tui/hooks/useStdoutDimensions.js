"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStdoutDimensions = void 0;
const react_1 = require("react");
const ink_1 = require("ink");
const settings_1 = require("../../settings");
// ref: https://github.com/cameronhunter/ink-monorepo/blob/master/packages/ink-use-stdout-dimensions/src/index.ts
function useStdoutDimensions() {
    const { stdout } = (0, ink_1.useStdout)();
    const initSize = stdout?.columns || settings_1.SCREEN_BASE_APP_WIDTH;
    const [dimensions, setDimensions] = (0, react_1.useState)([initSize, initSize]);
    (0, react_1.useEffect)(() => {
        if (!stdout) {
            return;
        }
        const handler = () => setDimensions([stdout.columns, stdout.rows]);
        stdout.on("resize", handler);
        return () => {
            stdout.off("resize", handler);
        };
    }, [stdout]);
    return dimensions;
}
exports.useStdoutDimensions = useStdoutDimensions;
