<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()

const sidebarLinks = computed(() => {
  if (authStore.isAdmin) {
    return [
      { name: 'Tableau de bord', to: '/admin', icon: '📊' },
      { name: 'Membres', to: '/admin/members', icon: '👥' },
      { name: 'Événements', to: '/admin/events', icon: '📅' },
      { name: 'Réservations', to: '/admin/bookings', icon: '📋' },
    ]
  }
  if (authStore.isMember) {
    return [
      { name: 'Mon espace', to: '/member', icon: '📊' },
    ]
  }
  return [
    { name: 'Mon compte', to: '/account', icon: '📊' },
  ]
})

function logout() {
  authStore.logout()
  window.location.href = '/'
}
</script>

<template>
  <div class="dashboard-layout">
    <aside class="sidebar">
      <router-link to="/" class="sidebar-logo">
        <span class="logo-text">RONKA</span>
        <span class="logo-sub">Event Multi Service</span>
      </router-link>
      <nav class="sidebar-nav">
        <router-link
          v-for="link in sidebarLinks"
          :key="link.to"
          :to="link.to"
          class="sidebar-link"
          active-class="active"
        >
          <span class="icon">{{ link.icon }}</span>
          {{ link.name }}
        </router-link>
      </nav>
      <div class="sidebar-footer">
        <p class="user-info">{{ authStore.user?.name || authStore.user?.email }}</p>
        <button @click="logout" class="btn-logout">Déconnexion</button>
      </div>
    </aside>
    <main class="dashboard-main">
      <RouterView />
    </main>
  </div>
</template>


<style scoped>
.dashboard-layout {
  min-height: 100vh;
  display: flex;
  background: #0f0f14;
  color: #fff;
}

.sidebar {
  width: 260px;
  background: rgba(22, 22, 29, 0.95);
  border-right: 1px solid rgba(212, 175, 55, 0.15);
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
}

.sidebar-logo {
  text-decoration: none;
  color: inherit;
  margin-bottom: 2rem;
}

.sidebar-logo .logo-text {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: #D4AF37;
  letter-spacing: 0.1em;
  display: block;
}

.sidebar-logo .logo-sub {
  font-size: 0.65rem;
  color: rgba(255,255,255,0.6);
  letter-spacing: 0.15em;
}

.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: rgba(255,255,255,0.8);
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.2s;
}

.sidebar-link:hover {
  background: rgba(212, 175, 55, 0.1);
  color: #D4AF37;
}

.sidebar-link.active {
  background: rgba(212, 175, 55, 0.15);
  color: #D4AF37;
}

.sidebar-footer {
  padding-top: 1rem;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.user-info {
  font-size: 0.85rem;
  opacity: 0.8;
  margin-bottom: 0.5rem;
}

.btn-logout {
  background: transparent;
  border: 1px solid rgba(212, 175, 55, 0.5);
  color: #D4AF37;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  width: 100%;
  transition: all 0.2s;
}

.btn-logout:hover {
  background: rgba(212, 175, 55, 0.2);
}

.dashboard-main {
  flex: 1;
  padding: 2rem;
  overflow: auto;
}
</style>
