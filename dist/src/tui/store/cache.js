"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCacheStateSlice = exports.initialCacheState = void 0;
const search_1 = require("../../api/data/search");
const settings_1 = require("../../settings");
exports.initialCacheState = {
    entryCacheMap: {},
    alternativeDownloadURLsCacheMap: {},
};
const createCacheStateSlice = (set, get) => ({
    ...exports.initialCacheState,
    setEntryCacheMap: (searchURL, entryList) => {
        const store = get();
        const entryCacheMap = {
            ...store.entryCacheMap,
            [searchURL]: entryList,
        };
        set({ entryCacheMap });
    },
    resetEntryCacheMap: () => {
        set({
            entryCacheMap: {},
        });
    },
    lookupPageCache: (pageNumber) => {
        const store = get();
        const searchURLAsCacheMapKey = (0, search_1.constructSearchURL)({
            query: store.searchValue,
            mirror: store.mirror,
            pageNumber,
            pageSize: settings_1.SEARCH_PAGE_SIZE,
            searchReqPattern: store.searchReqPattern,
            columnFilterQueryParamKey: store.columnFilterQueryParamKey,
            columnFilterQueryParamValue: store.selectedSearchByOption,
        });
        return store.entryCacheMap[searchURLAsCacheMapKey] || [];
    },
    setAlternativeDownloadURLsCacheMap: (entryId, urlList) => {
        const store = get();
        const alternativeDownloadURLsCacheMap = {
            ...store.alternativeDownloadURLsCacheMap,
            [entryId]: urlList,
        };
        set({ alternativeDownloadURLsCacheMap });
    },
});
exports.createCacheStateSlice = createCacheStateSlice;
