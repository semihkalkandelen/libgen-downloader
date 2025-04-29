"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBoundStore = void 0;
const zustand_1 = __importDefault(require("zustand"));
const app_1 = require("./app");
const bulk_download_queue_1 = require("./bulk-download-queue");
const cache_1 = require("./cache");
const config_1 = require("./config");
const download_queue_1 = require("./download-queue");
const events_1 = require("./events");
exports.useBoundStore = (0, zustand_1.default)((set, get) => ({
    ...(0, app_1.createAppStateSlice)(set, get),
    ...(0, config_1.createConfigStateSlice)(set, get),
    ...(0, download_queue_1.createDownloadQueueStateSlice)(set, get),
    ...(0, bulk_download_queue_1.createBulkDownloadQueueStateSlice)(set, get),
    ...(0, cache_1.createCacheStateSlice)(set, get),
    ...(0, events_1.createEventActionsSlice)(set, get),
}));
