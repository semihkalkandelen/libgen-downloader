"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.operate = void 0;
const fs_1 = __importDefault(require("fs"));
const document_1 = require("../api/data/document");
const search_1 = require("../api/data/search");
const url_1 = require("../api/data/url");
const index_1 = __importDefault(require("../tui/index"));
const keys_1 = require("../tui/layouts/keys");
const index_2 = require("../tui/store/index");
const utils_1 = require("../utils");
const operate = async (flags) => {
    if (flags.search) {
        const query = flags.search;
        if (query.length < 3) {
            console.log("Query must be at least 3 characters long");
            return;
        }
        const store = index_2.useBoundStore.getState();
        await store.fetchConfig();
        store.setSearchValue(query);
        (0, index_1.default)({
            startInCLIMode: false,
            doNotFetchConfigInitially: true,
        });
        store.handleSearchSubmit();
        return;
    }
    if (flags.bulk) {
        const filePath = flags.bulk;
        fs_1.default.readFile(filePath, "utf8", async (err, data) => {
            if (err) {
                throw err;
            }
            const md5List = data.split("\n");
            const store = index_2.useBoundStore.getState();
            await store.fetchConfig();
            (0, index_1.default)({
                startInCLIMode: true,
                doNotFetchConfigInitially: true,
                initialLayout: keys_1.LAYOUT_KEY.BULK_DOWNLOAD_LAYOUT,
            });
            store.startBulkDownloadInCLI(md5List);
        });
        return;
    }
    if (flags.url) {
        const md5 = flags.url;
        console.log("Fetching config...");
        await index_2.useBoundStore.getState().fetchConfig();
        const store = index_2.useBoundStore.getState();
        console.log("Finding download url...");
        const md5SearchUrl = (0, search_1.constructMD5SearchUrl)(store.searchByMD5Pattern, store.mirror, md5);
        const searchPageDocument = await (0, utils_1.attempt)(() => (0, document_1.getDocument)(md5SearchUrl));
        if (!searchPageDocument) {
            console.log("Failed to get search page document");
            return;
        }
        const entry = (0, search_1.parseEntries)(searchPageDocument)?.[0];
        if (!entry) {
            console.log("Failed to parse entry");
            return;
        }
        const mirrorPageDocument = await (0, utils_1.attempt)(() => (0, document_1.getDocument)(entry.mirror));
        if (!mirrorPageDocument) {
            console.log("Failed to get mirror page document");
            return;
        }
        const downloadUrl = (0, url_1.findDownloadUrlFromMirror)(mirrorPageDocument);
        if (!downloadUrl) {
            console.log("Failed to find download url");
            return;
        }
        console.log("Here is the direct download link:", downloadUrl);
        return;
    }
    if (flags.download) {
        const md5 = flags.download;
        const md5List = [md5];
        const store = index_2.useBoundStore.getState();
        await store.fetchConfig();
        (0, index_1.default)({
            startInCLIMode: true,
            doNotFetchConfigInitially: true,
            initialLayout: keys_1.LAYOUT_KEY.BULK_DOWNLOAD_LAYOUT,
        });
        store.startBulkDownloadInCLI(md5List);
        return;
    }
    (0, index_1.default)({
        startInCLIMode: false,
        doNotFetchConfigInitially: false,
    });
};
exports.operate = operate;
