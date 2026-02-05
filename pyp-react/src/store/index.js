import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import createAuthSlice from './slices/authSlice.js'
import createUserSlice from './slices/userSlice.js'
import createCourseSlice from './slices/courseSlice.js'
import createSectionSlice from './slices/sectionSlice.js'
import createUiSlice from './slices/uiSlice.js'

const persistConfig = {
    name: 'pyp-store',
    partialize: (state) => ({
        auth: state.auth,
        ui: state.ui,
    }),
}

const withMiddlewares = (config) =>
    devtools(persist(config, persistConfig), {
        enabled: import.meta.env.DEV,
        name: 'PYP Store',
    })

const useStore = create(
    withMiddlewares((...args) => ({
        ...createAuthSlice(...args),
        ...createUserSlice(...args),
        ...createCourseSlice(...args),
        ...createSectionSlice(...args),
        ...createUiSlice(...args),
    }))
)

export default useStore
