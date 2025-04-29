"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEventActionsSlice = void 0;
const keys_1 = require("../layouts/keys");
const labels_1 = __importDefault(require("../../labels"));
const search_1 = require("../../api/data/search");
const settings_1 = require("../../settings");
const utils_1 = require("../../utils");
const document_1 = require("../../api/data/document");
const url_1 = require("../../api/data/url");
const createEventActionsSlice = (_set, get) => ({
    backToSearch: () => {
        const store = get();
        store.resetAppState();
        store.setActiveLayout(keys_1.LAYOUT_KEY.SEARCH_LAYOUT);
    },
    search: async (query, pageNumber) => {
        const store = get();
        const searchURL = (0, search_1.constructSearchURL)({
            query,
            mirror: store.mirror,
            pageNumber,
            pageSize: settings_1.SEARCH_PAGE_SIZE,
            searchReqPattern: store.searchReqPattern,
            columnFilterQueryParamKey: store.columnFilterQueryParamKey,
            columnFilterQueryParamValue: store.selectedSearchByOption,
        });
        const cachedEntries = store.lookupPageCache(pageNumber);
        if (cachedEntries.length > 0) {
            return cachedEntries;
        }
        const pageDocument = await (0, utils_1.attempt)(() => (0, document_1.getDocument)(searchURL));
        if (!pageDocument) {
            get().setWarningMessage(`Couldn't fetch the search page for "${query}"`);
            return [];
        }
        const entries = (0, search_1.parseEntries)(pageDocument);
        if (!entries) {
            get().setWarningMessage(`Couldn't parse the search page for "${query}"`);
            return [];
        }
        store.setEntryCacheMap(searchURL, entries);
        return entries;
    },
    handleSearchSubmit: async () => {
        const store = get();
        if (store.searchValue.length < 3) {
            return;
        }
        store.setActiveLayout(keys_1.LAYOUT_KEY.RESULT_LIST_LAYOUT);
        store.setIsLoading(true);
        store.setLoaderMessage(labels_1.default.GETTING_RESULTS);
        const entries = await store.search(store.searchValue, store.currentPage);
        // search to cache next page
        await store.search(store.searchValue, store.currentPage + 1);
        store.setEntries(entries);
        store.setIsLoading(false);
    },
    nextPage: async () => {
        const store = get();
        const nextPageNumber = store.currentPage + 1;
        const furtherPageNumber = store.currentPage + 2;
        store.setIsLoading(true);
        store.setLoaderMessage(labels_1.default.GETTING_RESULTS);
        let entries = store.lookupPageCache(nextPageNumber);
        if (entries.length === 0) {
            entries = await store.search(store.searchValue, nextPageNumber);
        }
        // search to cache next page
        await store.search(store.searchValue, furtherPageNumber);
        store.setCurrentPage(nextPageNumber);
        store.setListItemsCursor(0);
        store.setIsLoading(false);
        // It is important to set entries after the search cause of determine
        // next page availability
        store.setEntries(entries);
    },
    prevPage: async () => {
        const store = get();
        store.setIsLoading(true);
        store.setLoaderMessage(labels_1.default.GETTING_RESULTS);
        if (store.currentPage < 2) {
            store.setIsLoading(false);
            return;
        }
        // search retrives from cache
        const prevPageEntries = await store.search(store.searchValue, store.currentPage - 1);
        // It is important to set entries after the search cause of caching controls
        store.setCurrentPage(store.currentPage - 1);
        store.setEntries(prevPageEntries);
        store.setListItemsCursor(0);
        store.setIsLoading(false);
    },
    fetchEntryAlternativeDownloadURLs: async (entry) => {
        const store = get();
        const cachedAlternativeDownloadURLs = store.alternativeDownloadURLsCacheMap[entry.id];
        if (cachedAlternativeDownloadURLs) {
            return cachedAlternativeDownloadURLs;
        }
        const pageDocument = await (0, utils_1.attempt)(() => (0, document_1.getDocument)(entry.mirror));
        if (!pageDocument) {
            get().setWarningMessage(`Couldn't fetch the entry page for "${entry.title}"`);
            return [];
        }
        const parsedDownloadUrls = (0, url_1.parseDownloadUrls)(pageDocument);
        if (!parsedDownloadUrls) {
            get().setWarningMessage(`Couldn't parse the entry page for "${entry.title}"`);
            return [];
        }
        store.setAlternativeDownloadURLsCacheMap(entry.id, parsedDownloadUrls);
        return parsedDownloadUrls;
    },
    handleExit: () => {
        process.exit(0);
    },
});
exports.createEventActionsSlice = createEventActionsSlice;
