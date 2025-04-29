"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBulkDownloadQueueStateSlice = exports.initialBulkDownloadQueueState = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const download_statuses_1 = require("../../download-statuses");
const search_1 = require("../../api/data/search");
const utils_1 = require("../../utils");
const keys_1 = require("../layouts/keys");
const document_1 = require("../../api/data/document");
const url_1 = require("../../api/data/url");
const download_1 = require("../../api/data/download");
const file_1 = require("../../api/data/file");
const settings_1 = require("../../settings");
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
exports.initialBulkDownloadQueueState = {
    isBulkDownloadComplete: false,
    completedBulkDownloadItemCount: 0,
    failedBulkDownloadItemCount: 0,
    createdMD5ListFileName: "",
    bulkDownloadSelectedEntryIds: [],
    bulkDownloadSelectedEntries: [],
    bulkDownloadQueue: [],
};
const createBulkDownloadQueueStateSlice = (set, get) => ({
    ...exports.initialBulkDownloadQueueState,
    addToBulkDownloadQueue: (entry) => {
        const store = get();
        if (store.bulkDownloadSelectedEntryIds.includes(entry.id)) {
            return;
        }
        set({
            bulkDownloadSelectedEntries: [...store.bulkDownloadSelectedEntries, entry],
            bulkDownloadSelectedEntryIds: [...store.bulkDownloadSelectedEntryIds, entry.id],
        });
    },
    removeFromBulkDownloadQueue: (entryId) => {
        const store = get();
        if (!store.bulkDownloadSelectedEntryIds.includes(entryId)) {
            return;
        }
        set({
            bulkDownloadSelectedEntries: store.bulkDownloadSelectedEntries.filter((entry) => entry.id !== entryId),
        });
        store.removeEntryIdFromBulkDownloadQueue(entryId);
    },
    removeEntryIdFromBulkDownloadQueue: (entryId) => {
        const store = get();
        set({
            bulkDownloadSelectedEntryIds: store.bulkDownloadSelectedEntryIds.filter((id) => id !== entryId),
        });
    },
    onBulkQueueItemProcessing: (index) => {
        set((prev) => ({
            bulkDownloadQueue: prev.bulkDownloadQueue.map((item, i) => {
                if (index !== i) {
                    return item;
                }
                return {
                    ...item,
                    status: download_statuses_1.DownloadStatus.PROCESSING,
                };
            }),
        }));
    },
    onBulkQueueItemStart: (index, filename, total) => {
        set((prev) => ({
            bulkDownloadQueue: prev.bulkDownloadQueue.map((item, i) => {
                if (index !== i) {
                    return item;
                }
                return {
                    ...item,
                    filename,
                    total,
                    status: download_statuses_1.DownloadStatus.DOWNLOADING,
                };
            }),
        }));
    },
    onBulkQueueItemData: (index, filename, chunk, total) => {
        set((prev) => ({
            bulkDownloadQueue: prev.bulkDownloadQueue.map((item, i) => {
                if (index !== i) {
                    return item;
                }
                return {
                    ...item,
                    filename,
                    total,
                    progress: (item.progress || 0) + chunk.length,
                };
            }),
        }));
    },
    onBulkQueueItemComplete: (index) => {
        set((prev) => ({
            bulkDownloadQueue: prev.bulkDownloadQueue.map((item, i) => {
                if (index !== i) {
                    return item;
                }
                return {
                    ...item,
                    status: download_statuses_1.DownloadStatus.DOWNLOADED,
                };
            }),
        }));
        set((prev) => ({
            completedBulkDownloadItemCount: prev.completedBulkDownloadItemCount + 1,
        }));
    },
    onBulkQueueItemFail: (index) => {
        set((prev) => ({
            bulkDownloadQueue: prev.bulkDownloadQueue.map((item, i) => {
                if (index !== i) {
                    return item;
                }
                return {
                    ...item,
                    status: download_statuses_1.DownloadStatus.FAILED,
                };
            }),
        }));
        set((prev) => ({
            failedBulkDownloadItemCount: prev.failedBulkDownloadItemCount + 1,
        }));
    },
    operateBulkDownloadQueue: async () => {
        const bulkDownloadQueue = get().bulkDownloadQueue;
        for (let i = 0; i < bulkDownloadQueue.length; i++) {
            const item = bulkDownloadQueue[i];
            const waitTime = Math.floor(Math.random() * (900000 - 600000) + 600000); //puts a randomly cooldown between 10-15 minutes 
            console.log(`Bekleniyor: ${(waitTime / 60000).toFixed(2)} dakika...`); //so libgen will not understand whether it is a bot and let you
            await sleep(waitTime); //download more files without lower bandwith
            const md5SearchUrl = (0, search_1.constructMD5SearchUrl)(get().searchByMD5Pattern, get().mirror, item.md5);
            get().onBulkQueueItemProcessing(i);
            const searchPageDocument = await (0, utils_1.attempt)(() => (0, document_1.getDocument)(md5SearchUrl));
            if (!searchPageDocument) {
                get().setWarningMessage(`Couldn't fetch the search page for ${item.md5}`);
                get().onBulkQueueItemFail(i);
                continue;
            }
            const entry = (0, search_1.parseEntries)(searchPageDocument)?.[0];
            if (!entry) {
                get().setWarningMessage(`Couldn't find the entry for ${item.md5}`);
                get().onBulkQueueItemFail(i);
                continue;
            }
            const mirrorPageDocument = await (0, utils_1.attempt)(() => (0, document_1.getDocument)(entry.mirror));
            if (!mirrorPageDocument) {
                get().setWarningMessage(`Couldn't fetch the mirror page for ${item.md5}`);
                get().onBulkQueueItemFail(i);
                continue;
            }
            const downloadUrl = (0, url_1.findDownloadUrlFromMirror)(mirrorPageDocument);
            if (!downloadUrl) {
                get().setWarningMessage(`Couldn't find the download url for ${item.md5}`);
                get().onBulkQueueItemFail(i);
                continue;
            }
            const downloadStream = await (0, utils_1.attempt)(() => (0, node_fetch_1.default)(downloadUrl, {
                agent: settings_1.httpAgent,
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                    "Accept-Language": "en-US,en;q=0.5",
                    "Connection": "keep-alive",
                },
            }));
            if (!downloadStream) {
                get().setWarningMessage(`Couldn't fetch the download stream for ${item.md5}`);
                get().onBulkQueueItemFail(i);
                continue;
            }
            try {
                await (0, download_1.downloadFile)({
                    downloadStream,
                    onStart: (filename, total) => {
                        get().onBulkQueueItemStart(i, filename, total);
                    },
                    onData: (filename, chunk, total) => {
                        get().onBulkQueueItemData(i, filename, chunk, total);
                    },
                });
                get().onBulkQueueItemComplete(i);
            }
            catch (err) {
                get().onBulkQueueItemFail(i);
            }
        }
        set({
            isBulkDownloadComplete: true,
        });
        const completedMD5List = get()
            .bulkDownloadQueue.filter((item) => item.status === download_statuses_1.DownloadStatus.DOWNLOADED)
            .map((item) => item.md5);
        try {
            const filename = await (0, file_1.createMD5ListFile)(completedMD5List);
            set({
                createdMD5ListFileName: filename,
            });
        }
        catch (err) {
            get().setWarningMessage("Couldn't create the MD5 list file");
        }
    },
    startBulkDownload: async () => {
        if (get().bulkDownloadSelectedEntries.length === 0) {
            get().setWarningMessage("Bulk download queue is empty");
            return;
        }
        set({
            completedBulkDownloadItemCount: 0,
            failedBulkDownloadItemCount: 0,
            createdMD5ListFileName: "",
            isBulkDownloadComplete: false,
        });
        get().setActiveLayout(keys_1.LAYOUT_KEY.BULK_DOWNLOAD_LAYOUT);
        // initialize bulk queue
        set((prev) => ({
            bulkDownloadQueue: prev.bulkDownloadSelectedEntries.map(() => ({
                md5: "",
                status: download_statuses_1.DownloadStatus.FETCHING_MD5,
                filename: "",
                progress: 0,
                total: 0,
            })),
        }));
        // find md5list
        const entryIds = get().bulkDownloadSelectedEntryIds;
        const findMD5SearchUrl = (0, search_1.constructFindMD5SearchUrl)(get().MD5ReqPattern, get().mirror, entryIds);
        const md5ListResponse = await (0, utils_1.attempt)(() => (0, node_fetch_1.default)(findMD5SearchUrl));
        if (!md5ListResponse) {
            get().setWarningMessage("Couldn't fetch the MD5 list");
            return;
        }
        const md5Arr = (await md5ListResponse.json());
        const md5List = md5Arr.map((item) => item.md5);
        set((prev) => ({
            bulkDownloadQueue: prev.bulkDownloadQueue.map((item, index) => ({
                ...item,
                status: download_statuses_1.DownloadStatus.IN_QUEUE,
                md5: md5List[index],
            })),
        }));
        get().operateBulkDownloadQueue();
    },
    startBulkDownloadInCLI: async (md5List) => {
        set({
            bulkDownloadQueue: md5List.map((md5) => ({
                md5,
                status: download_statuses_1.DownloadStatus.IN_QUEUE,
                filename: "",
                progress: 0,
                total: 0,
            })),
        });
        await get().operateBulkDownloadQueue();
        // process exit successfully
        get().handleExit();
    },
    resetBulkDownloadQueue: () => {
        set({
            ...exports.initialBulkDownloadQueueState,
        });
    },
});
exports.createBulkDownloadQueueStateSlice = createBulkDownloadQueueStateSlice;
