"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDownloadQueueStateSlice = exports.initialDownloadQueueState = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const download_statuses_1 = require("../../download-statuses");
const utils_1 = require("../../utils");
const document_1 = require("../../api/data/document");
const url_1 = require("../../api/data/url");
const download_1 = require("../../api/data/download");
const settings_1 = require("../../settings");
exports.initialDownloadQueueState = {
    downloadQueue: [],
    inDownloadQueueEntryIds: [],
    downloadProgressMap: {},
    totalAddedToDownloadQueue: 0,
    totalDownloaded: 0,
    totalFailed: 0,
    isQueueActive: false,
};
const createDownloadQueueStateSlice = (set, get) => ({
    ...exports.initialDownloadQueueState,
    pushDownloadQueue: (entry) => {
        const store = get();
        if (store.inDownloadQueueEntryIds.includes(entry.id)) {
            return;
        }
        set({
            downloadQueue: [...store.downloadQueue, entry],
            inDownloadQueueEntryIds: [...store.inDownloadQueueEntryIds, entry.id],
        });
        store.updateCurrentDownloadProgress(entry.id, {
            filename: "",
            progress: 0,
            total: 0,
            status: download_statuses_1.DownloadStatus.IN_QUEUE,
        });
        store.increaseTotalAddedToDownloadQueue();
        if (store.isQueueActive) {
            return;
        }
        store.iterateQueue();
    },
    consumeDownloadQueue: () => {
        const store = get();
        if (store.downloadQueue.length < 1) {
            return undefined;
        }
        const entry = store.downloadQueue[0];
        set({
            downloadQueue: store.downloadQueue.slice(1, store.downloadQueue.length),
        });
        return entry;
    },
    removeEntryIdFromDownloadQueue: (entryId) => {
        const store = get();
        set({
            inDownloadQueueEntryIds: store.inDownloadQueueEntryIds.filter((id) => id !== entryId),
        });
    },
    iterateQueue: async () => {
        const store = get();
        set({ isQueueActive: true });
        for (;;) {
            const entry = store.consumeDownloadQueue();
            if (!entry) {
                break;
            }
            store.updateCurrentDownloadProgress(entry.id, {
                status: download_statuses_1.DownloadStatus.CONNECTING_TO_LIBGEN,
            });
            let downloadUrl = "";
            if (entry.alternativeDirectDownloadUrl !== undefined) {
                downloadUrl = entry.alternativeDirectDownloadUrl;
            }
            else {
                const mirrorPageDocument = await (0, utils_1.attempt)(() => (0, document_1.getDocument)(entry.mirror));
                if (!mirrorPageDocument) {
                    store.setWarningMessage(`Couldn't fetch the mirror page for "${entry.title}"`);
                    continue;
                }
                downloadUrl = (0, url_1.findDownloadUrlFromMirror)(mirrorPageDocument);
            }
            if (!downloadUrl) {
                store.setWarningMessage(`Couldn't find the download url for "${entry.title}"`);
                continue;
            }
            const downloadStream = await (0, utils_1.attempt)(() => (0, node_fetch_1.default)(downloadUrl, {
                agent: settings_1.httpAgent,
            }));
            if (!downloadStream) {
                store.setWarningMessage(`Couldn't fetch the download stream for "${entry.title}"`);
                continue;
            }
            try {
                store.updateCurrentDownloadProgress(entry.id, {
                    status: download_statuses_1.DownloadStatus.DOWNLOADING,
                });
                await (0, download_1.downloadFile)({
                    downloadStream,
                    onStart: (filename, total) => {
                        store.updateCurrentDownloadProgress(entry.id, {
                            filename,
                            progress: null,
                            total,
                        });
                    },
                    onData: (filename, chunk, total) => {
                        store.updateCurrentDownloadProgress(entry.id, {
                            filename,
                            progress: chunk.length,
                            total,
                        });
                    },
                });
                store.increaseTotalDownloaded();
                store.updateCurrentDownloadProgress(entry.id, {
                    status: download_statuses_1.DownloadStatus.DOWNLOADED,
                });
            }
            catch (error) {
                store.setWarningMessage(`Couldn't download "${entry.title}"`);
                store.increaseTotalFailed();
                store.updateCurrentDownloadProgress(entry.id, {
                    status: download_statuses_1.DownloadStatus.FAILED,
                });
            }
            finally {
                store.removeEntryIdFromDownloadQueue(entry.id);
            }
        }
        set({ isQueueActive: false });
    },
    updateCurrentDownloadProgress: (entryId, downloadProgress) => {
        set((prev) => ({
            downloadProgressMap: {
                ...prev.downloadProgressMap,
                [entryId]: {
                    ...(prev.downloadProgressMap[entryId] || {}),
                    ...downloadProgress,
                    progress: downloadProgress.progress === null
                        ? 0
                        : (prev.downloadProgressMap[entryId]?.progress || 0) +
                            (downloadProgress.progress || 0),
                },
            },
        }));
    },
    increaseTotalAddedToDownloadQueue: () => {
        set((prev) => ({
            totalAddedToDownloadQueue: prev.totalAddedToDownloadQueue + 1,
        }));
    },
    increaseTotalDownloaded: () => {
        set((prev) => ({
            totalDownloaded: prev.totalDownloaded + 1,
        }));
    },
    increaseTotalFailed: () => {
        set((prev) => ({
            totalFailed: prev.totalFailed + 1,
        }));
    },
});
exports.createDownloadQueueStateSlice = createDownloadQueueStateSlice;
