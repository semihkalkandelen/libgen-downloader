"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRenderedListItems = exports.constructListItems = exports.createOptionItem = exports.attempt = exports.delay = void 0;
const ListItem_1 = require("./api/models/ListItem");
const constants_1 = require("./constants");
const options_1 = require("./options");
const labels_1 = __importDefault(require("./labels"));
const settings_1 = require("./settings");
function delay(ms) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}
exports.delay = delay;
async function attempt(cb, onFail, onError, onComplete) {
    for (let i = 0; i < settings_1.FAIL_REQ_ATTEMPT_COUNT; i++) {
        try {
            const result = await cb();
            if (onComplete) {
                onComplete();
            }
            return result;
        }
        catch (e) {
            if (onFail) {
                onFail(`Request failed, trying again ${i + 1}/${settings_1.FAIL_REQ_ATTEMPT_COUNT}`);
            }
            await delay(settings_1.FAIL_REQ_ATTEMPT_DELAY_MS);
            if (i + 1 === settings_1.FAIL_REQ_ATTEMPT_COUNT) {
                if (onError) {
                    onError(e?.message);
                }
            }
        }
    }
    return null;
}
exports.attempt = attempt;
const createOptionItem = (id, label, onSelect) => ({
    type: ListItem_1.IResultListItemType.Option,
    data: {
        id,
        label,
        onSelect,
    },
});
exports.createOptionItem = createOptionItem;
const constructListItems = ({ entries, currentPage, isNextPageAvailable, handleSearchOption, handleNextPageOption, handlePrevPageOption, handleStartBulkDownloadOption, handleExitOption, }) => {
    const entryListItems = entries.map((entry, idx) => ({
        type: ListItem_1.IResultListItemType.Entry,
        data: entry,
        order: idx + 1,
    }));
    return [
        ...entryListItems.slice(entryListItems.length - constants_1.RESULT_LIST_ACTIVE_LIST_INDEX, entryListItems.length),
        (0, exports.createOptionItem)(options_1.Option.SEARCH, labels_1.default.SEARCH, handleSearchOption),
        ...(isNextPageAvailable
            ? [(0, exports.createOptionItem)(options_1.Option.NEXT_PAGE, labels_1.default.NEXT_PAGE, handleNextPageOption)]
            : []),
        ...(currentPage > 1
            ? [(0, exports.createOptionItem)(options_1.Option.PREV_PAGE, labels_1.default.PREV_PAGE, handlePrevPageOption)]
            : []),
        (0, exports.createOptionItem)(options_1.Option.START_BULK_DOWNLOAD, labels_1.default.START_BULK_DOWNLOAD, handleStartBulkDownloadOption),
        (0, exports.createOptionItem)(options_1.Option.EXIT, labels_1.default.EXIT, handleExitOption),
        ...entryListItems.slice(0, entryListItems.length - constants_1.RESULT_LIST_ACTIVE_LIST_INDEX),
    ];
};
exports.constructListItems = constructListItems;
const getRenderedListItems = (cursor, listItems, anyEntryExpanded, activeExpandedListLength) => {
    const renderedItemsLimit = Math.max(constants_1.MIN_RESULT_LIST_LENGTH, anyEntryExpanded ? constants_1.RESULT_LIST_LENGTH - activeExpandedListLength : constants_1.RESULT_LIST_LENGTH);
    const renderedItems = [];
    for (let i = 0; i < renderedItemsLimit; i++) {
        if (i >= listItems.length) {
            break;
        }
        const itemIndex = (cursor + i) % listItems.length;
        renderedItems.push(listItems[itemIndex]);
    }
    return renderedItems;
};
exports.getRenderedListItems = getRenderedListItems;
