<script setup>
import { onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

onMounted(() => {
  document.documentElement.setAttribute('data-theme', themeStore.isLight ? 'light' : 'dark')
})
</script>

<template>
  <RouterView />
</template>

<style>
* { box-sizing: border-box; margin: 0; padding: 0; }

:root,
[data-theme="dark"] {
  --bg-primary: #0f0f14;
  --bg-secondary: #16161d;
  --bg-card: rgba(255,255,255,0.03);
  --text-primary: #fff;
  --text-secondary: rgba(255,255,255,0.85);
  --text-muted: rgba(255,255,255,0.6);
  --accent: #D4AF37;
  --accent-hover: #B8960E;
  --border: rgba(212, 175, 55, 0.2);
  --input-bg: rgba(0, 0, 0, 0.3);
  --input-border: rgba(255, 255, 255, 0.1);
  --btn-primary-text: #0f0f14;
}

[data-theme="light"] {
  --bg-primary: #faf8f5;
  --bg-secondary: #fff;
  --bg-card: #fff;
  --text-primary: #3d2914;
  --text-secondary: #5c4529;
  --text-muted: #8b7355;
  --accent: #6b4423;
  --accent-hover: #8b5a2b;
  --border: rgba(107, 68, 35, 0.25);
  --input-bg: rgba(0, 0, 0, 0.06);
  --input-border: rgba(0, 0, 0, 0.2);
  --btn-primary-text: #fff;
}

body {
  font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
  line-height: 1.5;
}
a { color: inherit; }
</style>
