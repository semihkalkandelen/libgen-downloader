"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadFile = void 0;
const content_disposition_1 = __importDefault(require("content-disposition"));
const fs_1 = __importDefault(require("fs"));
// Yeni: Rastgele bekleme fonksiyonu
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
const downloadFile = async ({ downloadStream, onStart, onData, }) => {
    return new Promise(async (resolve, reject) => {
        const MAX_FILE_NAME_LENGTH = 128;
        // Yeni: 2-5 saniye rastgele bekle
        const delay = Math.floor(Math.random() * 3000) + 2000;
        await sleep(delay);
        const downloadContentDisposition = downloadStream.headers.get("content-disposition");
        if (!downloadContentDisposition) {
            reject(new Error("No content-disposition header found"));
            return;
        }
        const parsedContentDisposition = content_disposition_1.default.parse(downloadContentDisposition);
        const fullFileName = parsedContentDisposition.parameters.filename;
        const slicedFileName = fullFileName.slice(Math.max(fullFileName.length - MAX_FILE_NAME_LENGTH, 0), fullFileName.length);
        const path = `./${slicedFileName}`;
        const file = fs_1.default.createWriteStream(path);
        const total = Number(downloadStream.headers.get("content-length") || 0);
        const filename = parsedContentDisposition.parameters.filename;
        if (!downloadStream.body) {
            return;
        }
        onStart(filename, total);
        downloadStream.body.on("data", (chunk) => {
            onData(filename, chunk, total);
        });
        downloadStream.body.on("finish", () => {
            const downloadResult = {
                path,
                filename,
                total,
            };
            resolve(downloadResult);
        });
        downloadStream.body.on("error", () => {
            reject(new Error(`(${filename}) Error occurred while downloading file`));
        });
        downloadStream.body.pipe(file);
    });
};
exports.downloadFile = downloadFile;
