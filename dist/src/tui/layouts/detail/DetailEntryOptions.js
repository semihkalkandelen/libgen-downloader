"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const ink_1 = require("ink");
const figures_1 = __importDefault(require("figures"));
const OptionList_1 = __importDefault(require("../../components/OptionList"));
const options_1 = require("../../../options");
const labels_1 = __importDefault(require("../../../labels"));
const keys_1 = require("../keys");
const index_1 = require("../../store/index");
const DetailEntryOptions = () => {
    const detailedEntry = (0, index_1.useBoundStore)((state) => state.detailedEntry);
    const setDetailedEntry = (0, index_1.useBoundStore)((state) => state.setDetailedEntry);
    const setActiveLayout = (0, index_1.useBoundStore)((state) => state.setActiveLayout);
    const pushDownloadQueue = (0, index_1.useBoundStore)((state) => state.pushDownloadQueue);
    const addToBulkDownloadQueue = (0, index_1.useBoundStore)((state) => state.addToBulkDownloadQueue);
    const removeFromBulkDownloadQueue = (0, index_1.useBoundStore)((state) => state.removeFromBulkDownloadQueue);
    const fetchEntryAlternativeDownloadURLs = (0, index_1.useBoundStore)((state) => state.fetchEntryAlternativeDownloadURLs);
    const inDownloadQueueEntryIds = (0, index_1.useBoundStore)((state) => state.inDownloadQueueEntryIds);
    const inDownloadQueue = detailedEntry
        ? inDownloadQueueEntryIds.includes(detailedEntry.id)
        : false;
    const bulkDownloadSelectedEntryIds = (0, index_1.useBoundStore)((state) => state.bulkDownloadSelectedEntryIds);
    const inBulkDownloadQueue = detailedEntry
        ? bulkDownloadSelectedEntryIds.includes(detailedEntry.id)
        : false;
    const [alternativeDownloadURLs, setAlternativeDownloadURLs] = (0, react_1.useState)([]);
    const [alternativeDownloadURLsLoading, setAlternativeDownloadURLsLoading] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (!detailedEntry) {
            return;
        }
        let isMounted = true;
        const fetchDownloadUrls = async () => {
            setAlternativeDownloadURLsLoading(true);
            const alternativeDownloadURLs = await fetchEntryAlternativeDownloadURLs(detailedEntry);
            if (!isMounted) {
                return;
            }
            setAlternativeDownloadURLs(alternativeDownloadURLs);
            setAlternativeDownloadURLsLoading(false);
        };
        fetchDownloadUrls();
        return () => {
            isMounted = false;
        };
    }, [detailedEntry, fetchEntryAlternativeDownloadURLs]);
    const toggleBulkDownload = () => {
        if (!detailedEntry) {
            return;
        }
        if (inBulkDownloadQueue) {
            removeFromBulkDownloadQueue(detailedEntry.id);
            return;
        }
        addToBulkDownloadQueue(detailedEntry);
    };
    const detailOptions = {
        [options_1.DetailEntryOption.TURN_BACK_TO_THE_LIST]: {
            label: labels_1.default.TURN_BACK_TO_THE_LIST,
            onSelect: () => {
                setActiveLayout(keys_1.LAYOUT_KEY.RESULT_LIST_LAYOUT);
                setDetailedEntry(null);
            },
        },
        [options_1.DetailEntryOption.DOWNLOAD_DIRECTLY]: {
            loading: inDownloadQueue,
            label: inDownloadQueue ? labels_1.default.DOWNLOADING : labels_1.default.DOWNLOAD_DIRECTLY,
            description: "(Press [D])",
            onSelect: () => {
                if (detailedEntry) {
                    pushDownloadQueue(detailedEntry);
                }
            },
        },
        [options_1.DetailEntryOption.ALTERNATIVE_DOWNLOADS]: {
            loading: alternativeDownloadURLsLoading || inDownloadQueue,
            label: `${labels_1.default.ALTERNATIVE_DOWNLOADS} (${alternativeDownloadURLs.length})`,
            onSelect: () => setShowAlternativeDownloads(true),
        },
        [options_1.DetailEntryOption.BULK_DOWNLOAD_QUEUE]: {
            label: inBulkDownloadQueue
                ? labels_1.default.REMOVE_FROM_BULK_DOWNLOAD_QUEUE
                : labels_1.default.ADD_TO_BULK_DOWNLOAD_QUEUE,
            description: "(Press [TAB])",
            onSelect: () => {
                toggleBulkDownload();
            },
        },
    };
    const [showAlternativeDownloads, setShowAlternativeDownloads] = (0, react_1.useState)(false);
    const alternativeDownloadOptions = {
        ...alternativeDownloadURLs.reduce((prev, current, idx) => {
            return {
                ...prev,
                [idx]: {
                    label: `(${idx + 1}) ${current}`,
                    onSelect: () => {
                        if (detailedEntry) {
                            pushDownloadQueue({
                                ...detailedEntry,
                                alternativeDirectDownloadUrl: current,
                            });
                            setShowAlternativeDownloads(false);
                        }
                    },
                },
            };
        }, {}),
        [options_1.DetailEntryOption.BACK_TO_ENTRY_OPTIONS]: {
            label: labels_1.default.BACK_TO_ENTRY_OPTIONS,
            onSelect: () => setShowAlternativeDownloads(false),
        },
    };
    (0, ink_1.useInput)((input, key) => {
        if (key.tab) {
            toggleBulkDownload();
            return;
        }
        if (input.toLowerCase() === "d" && detailedEntry) {
            pushDownloadQueue(detailedEntry);
            return;
        }
    });
    if (!detailedEntry) {
        return null;
    }
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(ink_1.Box, { paddingLeft: 3, height: 1 }, inBulkDownloadQueue && (react_1.default.createElement(ink_1.Text, { color: "green" },
            figures_1.default.tick,
            " ",
            labels_1.default.ADDED_TO_BULK_DOWNLOAD_QUEUE))),
        showAlternativeDownloads ? (react_1.default.createElement(OptionList_1.default, { key: "alternativeDownloadOptions", options: alternativeDownloadOptions })) : (react_1.default.createElement(OptionList_1.default, { key: "detailOptions", options: detailOptions }))));
};
exports.default = DetailEntryOptions;
