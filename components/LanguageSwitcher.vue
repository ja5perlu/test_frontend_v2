<template>
  <div class="lang-switcher" aria-hidden="false">
    <select v-model="current" @change="onChange" aria-label="Language switch">
      <option value="zh-TW">中文</option>
      <option value="en-US">EN</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSettingsStore } from '~/store/settings'

const settings = useSettingsStore()
const { locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const router = useRouter()

const normalize = (code?: string | null) => {
  if (!code) return undefined
  const c = code.toLowerCase()
  if (c === 'zh' || c.startsWith('zh-')) return 'zh-TW'
  if (c === 'en' || c.startsWith('en-')) return 'en-US'
  return code
}

const current = ref<string>(settings.locale || locale.value || 'zh-TW')

const onChange = async () => {
  const target = (normalize(current.value) || current.value) as string
  settings.setLocale(target)
  
  const path = switchLocalePath(target)
  if (path) {
    await router.push(path)
  }
}

onMounted(() => {
  if (!settings.locale) {
    const nav = (navigator.language || (navigator.languages && navigator.languages[0]) || '').toString()
    const n = normalize(nav) || 'zh-TW'
    settings.setLocale(n)
    current.value = n
  } else {
    current.value = settings.locale
  }
})
</script>

<style scoped>
.lang-switcher {
  position: fixed;
  top: 12px;
  right: 12px;
  z-index: 1200;
}
.lang-switcher select {
  background: rgba(255,255,255,0.06);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.06);
  padding: 6px 8px;
  border-radius: 6px;
}
</style>
