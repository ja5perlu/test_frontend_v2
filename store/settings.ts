import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
    state: () => ({
        locale: 'zh-TW' as string,
    }),
    actions: {
        setLocale(l: string) {
            this.locale = l
        },
    },
})
