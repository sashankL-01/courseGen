const uiInitialState = {
    theme: 'dark',
    sidebarOpen: false,
    sidebarCollapsed: false,
    filters: {},
}

const createUiSlice = (set) => ({
    ui: { ...uiInitialState },
    setTheme: (theme) =>
        set(
            (state) => ({
                ui: { ...state.ui, theme },
            }),
            false,
            'ui/theme'
        ),
    setSidebarOpen: (sidebarOpen) =>
        set(
            (state) => ({
                ui: { ...state.ui, sidebarOpen },
            }),
            false,
            'ui/sidebar'
        ),
    setSidebarCollapsed: (sidebarCollapsed) =>
        set(
            (state) => ({
                ui: { ...state.ui, sidebarCollapsed },
            }),
            false,
            'ui/sidebar-collapsed'
        ),
    toggleSidebarCollapsed: () =>
        set(
            (state) => ({
                ui: { ...state.ui, sidebarCollapsed: !state.ui.sidebarCollapsed },
            }),
            false,
            'ui/sidebar-toggle'
        ),
    setFilters: (filters) =>
        set(
            (state) => ({
                ui: { ...state.ui, filters: { ...state.ui.filters, ...filters } },
            }),
            false,
            'ui/filters'
        ),
    clearFilters: () =>
        set(
            (state) => ({
                ui: { ...state.ui, filters: {} },
            }),
            false,
            'ui/filters-clear'
        ),
})

export { uiInitialState }
export default createUiSlice
