<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="auth-layout">
    <div class="auth-bg"></div>
    <div class="auth-content">
      <router-link to="/" class="auth-logo">
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
              linear-gradient(180deg, #0f0f14 0%, #16161d 100%);
}

.auth-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  padding: 2rem;
}

.auth-logo {
  display: block;
  text-align: center;
  margin-bottom: 2rem;
  text-decoration: none;
  color: inherit;
}

.auth-logo .logo-text {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 2rem;
  font-weight: 700;
  color: #D4AF37;
  letter-spacing: 0.15em;
  display: block;
}

.auth-logo .logo-sub {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.6);
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
</style>
