import create, { StateCreator } from 'zustand'


interface LanguageSlice {
    language: string;
    setLanguage: (language: string) => void;
}

const createLanguageSlice: StateCreator<LanguageSlice, [], [], LanguageSlice> = (set) => ({
    language: "javascript",
    setLanguage: (language) => set(() => ({
        language: language
    }))
})

export const useGlobalStore = create<LanguageSlice>()((...a) => ({
    ...createLanguageSlice(...a)
}))