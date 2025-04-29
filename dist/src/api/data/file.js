"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMD5ListFile = void 0;
const fs_1 = __importDefault(require("fs"));
async function createMD5ListFile(md5List) {
    const filename = `MD5_LIST_${Date.now().toString()}.txt`;
    await fs_1.default.promises.writeFile(`./${filename}`, md5List.join("\n"));
    return filename;
}
exports.createMD5ListFile = createMD5ListFile;
