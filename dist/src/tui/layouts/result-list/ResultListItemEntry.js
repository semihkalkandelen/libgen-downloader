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
const ResultListContext_1 = require("../../contexts/ResultListContext");
const options_1 = require("../../../options");
const labels_1 = __importDefault(require("../../../labels"));
const settings_1 = require("../../../settings");
const index_1 = require("../../store/index");
const DownloadStatusAndProgress_1 = require("../../components/DownloadStatusAndProgress");
const ResultListItemEntry = ({ item, isActive, isExpanded, isFadedOut }) => {
    const addToBulkDownloadQueue = (0, index_1.useBoundStore)((state) => state.addToBulkDownloadQueue);
    const removeFromBulkDownloadQueue = (0, index_1.useBoundStore)((state) => state.removeFromBulkDownloadQueue);
    const currentPage = (0, index_1.useBoundStore)((state) => state.currentPage);
    const setAnyEntryExpanded = (0, index_1.useBoundStore)((state) => state.setAnyEntryExpanded);
    const setActiveExpandedListLength = (0, index_1.useBoundStore)((state) => state.setActiveExpandedListLength);
    const pushDownloadQueue = (0, index_1.useBoundStore)((state) => state.pushDownloadQueue);
    const fetchEntryAlternativeDownloadURLs = (0, index_1.useBoundStore)((state) => state.fetchEntryAlternativeDownloadURLs);
    const inDownloadQueueEntryIds = (0, index_1.useBoundStore)((state) => state.inDownloadQueueEntryIds);
    const inDownloadQueue = inDownloadQueueEntryIds.includes(item.data.id);
    const bulkDownloadSelectedEntryIds = (0, index_1.useBoundStore)((state) => state.bulkDownloadSelectedEntryIds);
    const inBulkDownloadQueue = bulkDownloadSelectedEntryIds.includes(item.data.id);
    const downloadProgressMap = (0, index_1.useBoundStore)((state) => state.downloadProgressMap);
    const downloadProgressData = downloadProgressMap[item.data.id];
    const { handleSeeDetailsOptions, handleTurnBackToTheListOption } = (0, ResultListContext_1.useResultListContext)();
    const [showAlternativeDownloads, setShowAlternativeDownloads] = (0, react_1.useState)(false);
    const [alternativeDownloadURLs, setAlternativeDownloadURLs] = (0, react_1.useState)([]);
    const [alternativeDownloadURLsLoading, setAlternativeDownloadURLsLoading] = (0, react_1.useState)(false);
    const toggleBulkDownload = () => {
        if (inBulkDownloadQueue) {
            removeFromBulkDownloadQueue(item.data.id);
            return;
        }
        addToBulkDownloadQueue(item.data);
    };
    const entryOptions = {
        [options_1.ResultListEntryOption.SEE_DETAILS]: {
            label: labels_1.default.SEE_DETAILS,
            onSelect: () => handleSeeDetailsOptions(item.data),
        },
        [options_1.ResultListEntryOption.DOWNLOAD_DIRECTLY]: {
            loading: inDownloadQueue,
            label: inDownloadQueue ? labels_1.default.DOWNLOADING : labels_1.default.DOWNLOAD_DIRECTLY,
            description: "(Press [D])",
            onSelect: () => {
                pushDownloadQueue(item.data);
            },
        },
        [options_1.ResultListEntryOption.ALTERNATIVE_DOWNLOADS]: {
            label: `${labels_1.default.ALTERNATIVE_DOWNLOADS} (${alternativeDownloadURLs.length})`,
            loading: alternativeDownloadURLsLoading || inDownloadQueue,
            onSelect: () => {
                setActiveExpandedListLength(alternativeDownloadURLs.length + 1);
                setShowAlternativeDownloads(true);
            },
        },
        [options_1.ResultListEntryOption.BULK_DOWNLOAD_QUEUE]: {
            label: inBulkDownloadQueue
                ? labels_1.default.REMOVE_FROM_BULK_DOWNLOAD_QUEUE
                : labels_1.default.ADD_TO_BULK_DOWNLOAD_QUEUE,
            description: "(Press [TAB])",
            onSelect: () => {
                toggleBulkDownload();
            },
        },
        [options_1.ResultListEntryOption.TURN_BACK_TO_THE_LIST]: {
            label: labels_1.default.TURN_BACK_TO_THE_LIST,
            onSelect: handleTurnBackToTheListOption,
        },
    };
    const alternativeDownloadOptions = {
        ...alternativeDownloadURLs.reduce((prev, current, idx) => {
            return {
                ...prev,
                [idx]: {
                    label: `(${idx + 1}) ${current}`,
                    onSelect: () => {
                        pushDownloadQueue({
                            ...item.data,
                            alternativeDirectDownloadUrl: current,
                        });
                        setShowAlternativeDownloads(false);
                        setActiveExpandedListLength(Object.keys(entryOptions).length);
                    },
                },
            };
        }, {}),
        [options_1.ResultListEntryOption.BACK_TO_ENTRY_OPTIONS]: {
            label: labels_1.default.BACK_TO_ENTRY_OPTIONS,
            onSelect: () => {
                setShowAlternativeDownloads(false);
                setActiveExpandedListLength(Object.keys(entryOptions).length);
            },
        },
    };
    (0, ink_1.useInput)((input, key) => {
        if (key.return && !isExpanded) {
            setAnyEntryExpanded(true);
            setActiveExpandedListLength(Object.keys(entryOptions).length);
            return;
        }
        if (key.tab) {
            toggleBulkDownload();
            return;
        }
        if (input.toLowerCase() === "d") {
            pushDownloadQueue(item.data);
            return;
        }
    }, { isActive });
    (0, react_1.useEffect)(() => {
        if (!isExpanded || alternativeDownloadURLs.length > 0) {
            return;
        }
        let isMounted = true;
        const fetchDownloadUrls = async () => {
            setAlternativeDownloadURLsLoading(true);
            const alternativeDownloadURLs = await fetchEntryAlternativeDownloadURLs(item.data);
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
    }, [isExpanded, item.data, fetchEntryAlternativeDownloadURLs, alternativeDownloadURLs]);
    return (react_1.default.createElement(ink_1.Box, { flexDirection: "column", paddingLeft: isExpanded ? 1 : 0 },
        react_1.default.createElement(ink_1.Text, { wrap: "truncate", color: isFadedOut ? "gray" : isExpanded ? "cyanBright" : isActive ? "cyanBright" : "" },
            isActive && !isExpanded ? figures_1.default.pointer : " ",
            inBulkDownloadQueue && react_1.default.createElement(ink_1.Text, { color: "green" },
                " ",
                figures_1.default.tick,
                " "),
            react_1.default.createElement(ink_1.Text, null,
                "[",
                item.order + (currentPage - 1) * settings_1.SEARCH_PAGE_SIZE,
                "] "),
            downloadProgressData && (react_1.default.createElement(DownloadStatusAndProgress_1.DownloadStatusAndProgress, { downloadProgressData: downloadProgressData })),
            react_1.default.createElement(ink_1.Text, { color: isFadedOut ? "gray" : "green", bold: true }, item.data.extension),
            " ",
            react_1.default.createElement(ink_1.Text, { bold: isActive }, item.data.title)),
        isExpanded &&
            (showAlternativeDownloads ? (react_1.default.createElement(OptionList_1.default, { key: "alternativeDownloads", options: alternativeDownloadOptions })) : (react_1.default.createElement(OptionList_1.default, { key: "entryOptions", options: entryOptions })))));
};
exports.default = ResultListItemEntry;
