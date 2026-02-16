<script setup>
import { RouterView } from 'vue-router'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
</script>

<template>
  <div class="auth-layout">
    <div class="auth-bg"></div>
    <div class="auth-content">
      <button @click="themeStore.toggle()" class="auth-theme-toggle" :title="themeStore.isLight ? 'Thème sombre' : 'Thème clair'" aria-label="Changer le thème">
        <i :class="themeStore.isLight ? 'pi pi-moon' : 'pi pi-sun'"></i>
      </button>
      <router-link to="/" class="auth-logo">
        <img src="/logo.png" alt="RONKA" class="auth-logo-img">
        <span class="logo-text">RONKA</span>
        <span class="logo-sub">Event Multi Service</span>
      </router-link>
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.auth-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 30% 20%, rgba(212, 175, 55, 0.08) 0%, transparent 50%),
              linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
}

.auth-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  padding: 2rem;
}

.auth-theme-toggle {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--border);
  color: var(--accent);
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
}

.auth-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  text-decoration: none;
  color: inherit;
}

.auth-logo-img {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  object-fit: cover;
  margin-bottom: 0.75rem;
}

.auth-logo .logo-text {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 2rem;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: 0.15em;
  display: block;
}

.auth-logo .logo-sub {
  font-size: 0.75rem;
  color: var(--text-muted);
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
</style>
