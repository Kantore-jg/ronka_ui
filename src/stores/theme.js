import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isLight = ref(localStorage.getItem('ronka_theme') === 'light')
  
  watch(isLight, (val) => {
    localStorage.setItem('ronka_theme', val ? 'light' : 'dark')
    document.documentElement.setAttribute('data-theme', val ? 'light' : 'dark')
  }, { immediate: true })
  
  function toggle() {
    isLight.value = !isLight.value
  }
  
  return { isLight, toggle }
})
