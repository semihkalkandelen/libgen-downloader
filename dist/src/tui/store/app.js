"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAppStateSlice = exports.initialAppState = void 0;
const utils_1 = require("../../utils");
const keys_1 = require("../layouts/keys");
const screen_1 = require("../helpers/screen");
exports.initialAppState = {
    isLoading: false,
    anyEntryExpanded: false,
    showSearchMinCharWarning: true,
    loaderMessage: "",
    searchValue: "",
    selectedSearchByOption: null,
    errorMessage: null,
    warningMessage: null,
    warningTimeout: null,
    currentPage: 1,
    activeExpandedListLength: 0,
    listItemsCursor: 0,
    detailedEntry: null,
    entries: [],
    listItems: [],
    activeLayout: keys_1.LAYOUT_KEY.SEARCH_LAYOUT,
};
const createAppStateSlice = (set, get) => ({
    CLIMode: false,
    setCLIMode: (CLIMode) => set({ CLIMode }),
    ...exports.initialAppState,
    setIsLoading: (isLoading) => set({ isLoading }),
    setAnyEntryExpanded: (anyEntryExpanded) => set({ anyEntryExpanded }),
    setLoaderMessage: (loaderMessage) => set({ loaderMessage }),
    setSearchValue: (searchValue) => {
        set(() => ({ showSearchMinCharWarning: searchValue.length < 3 }));
        set({ searchValue });
    },
    setSelectedSearchByOption: (selectedSearchByOption) => {
        set({ selectedSearchByOption });
    },
    setErrorMessage: (errorMessage) => set({ errorMessage }),
    setWarningMessage: (warningMessage) => {
        const WARNING_DURATION = 5000;
        const timeout = get().warningTimeout;
        if (timeout) {
            clearTimeout(timeout);
        }
        set({ warningMessage });
        const newTimeout = setTimeout(() => {
            set({ warningMessage: null });
        }, WARNING_DURATION);
        set({ warningTimeout: newTimeout });
    },
    setCurrentPage: (currentPage) => set({ currentPage }),
    setActiveExpandedListLength: (activeExpandedListLength) => set({ activeExpandedListLength }),
    setListItemsCursor: (listItemsCursor) => set({ listItemsCursor }),
    setDetailedEntry: (detailedEntry) => set({ detailedEntry }),
    setEntries: (entries) => {
        const store = get();
        const listItems = (0, utils_1.constructListItems)({
            entries,
            currentPage: store.currentPage,
            isNextPageAvailable: store.lookupPageCache(store.currentPage + 1).length > 0,
            handleSearchOption: store.backToSearch,
            handleNextPageOption: store.nextPage,
            handlePrevPageOption: store.prevPage,
            handleStartBulkDownloadOption: store.startBulkDownload,
            handleExitOption: () => {
                if (get().inDownloadQueueEntryIds.length > 0) {
                    store.setActiveLayout(keys_1.LAYOUT_KEY.DOWNLOAD_QUEUE_BEFORE_EXIT_LAYOUT);
                    return;
                }
                if (get().bulkDownloadSelectedEntryIds.length > 0) {
                    store.setActiveLayout(keys_1.LAYOUT_KEY.BULK_DOWNLOAD_BEFORE_EXIT_LAYOUT);
                    return;
                }
                store.handleExit();
            },
        });
        set({ entries, listItems });
    },
    setActiveLayout: (activeLayout) => {
        const store = get();
        if (!store.CLIMode) {
            (0, screen_1.clearScreen)();
        }
        set({ activeLayout });
    },
    resetAppState: () => set(exports.initialAppState),
});
exports.createAppStateSlice = createAppStateSlice;
