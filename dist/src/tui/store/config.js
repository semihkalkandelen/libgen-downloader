"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfigStateSlice = exports.initialConfigState = void 0;
const config_1 = require("../../api/data/config");
const labels_1 = __importDefault(require("../../labels"));
const utils_1 = require("../../utils");
exports.initialConfigState = {
    latestVersion: "",
    mirrors: [],
    searchReqPattern: "",
    searchByMD5Pattern: "",
    MD5ReqPattern: "",
    mirror: "",
    columnFilterQueryParamKey: "",
    columnFilterQueryParamValues: {},
};
const createConfigStateSlice = (set, get) => ({
    ...exports.initialConfigState,
    fetchConfig: async () => {
        const store = get();
        store.setIsLoading(true);
        store.setLoaderMessage(labels_1.default.FETCHING_CONFIG);
        const config = await (0, utils_1.attempt)(config_1.fetchConfig);
        if (!config) {
            store.setIsLoading(false);
            store.setErrorMessage("Couldn't fetch the config");
            return;
        }
        // Find an available mirror
        store.setLoaderMessage(labels_1.default.FINDING_MIRROR);
        const mirror = await (0, config_1.findMirror)(config.mirrors, (failedMirror) => {
            store.setLoaderMessage(`${labels_1.default.COULDNT_REACH_TO_MIRROR}, ${failedMirror}. ${labels_1.default.FINDING_MIRROR}`);
        });
        store.setIsLoading(false);
        if (!mirror) {
            store.setErrorMessage("Couldn't find a working mirror");
            return;
        }
        set({
            ...config,
            mirror,
        });
    },
});
exports.createConfigStateSlice = createConfigStateSlice;
