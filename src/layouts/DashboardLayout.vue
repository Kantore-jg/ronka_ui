<script setup>
import { ref, computed } from 'vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'

const authStore = useAuthStore()
const themeStore = useThemeStore()
const sidebarCollapsed = ref(false)

const sidebarLinks = computed(() => {
  if (authStore.isAdmin) {
    return [
      { name: 'Tableau de bord', to: '/admin', icon: 'pi-chart-bar' },
      { name: 'Membres', to: '/admin/members', icon: 'pi-users' },
      { name: 'Événements', to: '/admin/events', icon: 'pi-calendar' },
      { name: 'Réservations', to: '/admin/bookings', icon: 'pi-list' },
      { name: 'Galerie', to: '/admin/galerie', icon: 'pi-images' },
    ]
  }
  if (authStore.isMember) {
    return [
      { name: 'Mon espace', to: '/member', icon: 'pi-chart-bar' },
    ]
  }
  return [
    { name: 'Mon compte', to: '/account', icon: 'pi-chart-bar' },
  ]
})

async function logout() {
  await authStore.logoutViaApi()
  window.location.href = '/'
}
</script>

<template>
  <div class="dashboard-layout">
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <router-link to="/" class="sidebar-logo">
          <img src="/logo.png" alt="RONKA" class="logo-img">
          <div v-if="!sidebarCollapsed" class="logo-text-wrap">
            <span class="logo-text">RONKA</span>
            <span class="logo-sub">Event Multi Service</span>
          </div>
        </router-link>
        <button @click="sidebarCollapsed = !sidebarCollapsed" class="sidebar-toggle" aria-label="Toggle sidebar">
          <i :class="sidebarCollapsed ? 'pi pi-arrow-right' : 'pi pi-arrow-left'" class="pi"></i>
        </button>
      </div>
      <nav class="sidebar-nav">
        <router-link
          v-for="link in sidebarLinks"
          :key="link.to"
          :to="link.to"
          class="sidebar-link"
          active-class="active"
        >
          <i :class="['pi', link.icon]" class="icon"></i>
          <span v-if="!sidebarCollapsed" class="link-text">{{ link.name }}</span>
        </router-link>
      </nav>
      <div class="sidebar-footer">
        <div v-if="!sidebarCollapsed" class="user-info">{{ authStore.user?.name || authStore.user?.email }}</div>
        <div class="footer-actions">
          <button @click="logout" class="btn-logout" :title="sidebarCollapsed ? 'Déconnexion' : ''">
            <i class="pi pi-sign-out"></i>
            <span v-if="!sidebarCollapsed">Déconnexion</span>
          </button>
        </div>
      </div>
    </aside>
    <main class="dashboard-main">
      <div class="dashboard-header">
        <button @click="themeStore.toggle()" class="theme-toggle-top" :title="themeStore.isLight ? 'Thème sombre' : 'Thème clair'" aria-label="Changer le thème">
          <i :class="themeStore.isLight ? 'pi pi-moon' : 'pi pi-sun'"></i>
        </button>
      </div>
      <div class="dashboard-content">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<style scoped>
.dashboard-layout {
  min-height: 100vh;
  display: flex;
  background: var(--bg-primary);
  color: var(--text-primary);
}

.sidebar {
  width: 260px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  padding: 1rem;
  transition: width 0.25s ease;
}

.sidebar.collapsed {
  width: 72px;
  padding: 1rem 0.5rem;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  gap: 0.5rem;
}

.sidebar.collapsed .sidebar-header {
  flex-direction: column;
}

.sidebar-toggle {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--border);
  color: var(--accent);
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.sidebar-toggle:hover {
  background: var(--accent);
  color: var(--bg-primary);
}

.sidebar-logo {
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex: 1;
  min-width: 0;
}

.logo-img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.logo-text-wrap { min-width: 0; }
.sidebar-logo .logo-text {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: 0.08em;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-logo .logo-sub {
  font-size: 0.6rem;
  color: var(--text-muted);
  letter-spacing: 0.12em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.2s;
}

.sidebar.collapsed .sidebar-link {
  justify-content: center;
  padding: 0.75rem;
}

.sidebar-link .icon {
  font-size: 1.1rem;
  flex-shrink: 0;
}

.sidebar-link:hover {
  background: rgba(107, 68, 35, 0.1);
  color: var(--accent);
}

[data-theme="dark"] .sidebar-link:hover {
  background: rgba(212, 175, 55, 0.1);
}

.sidebar-link.active {
  background: rgba(107, 68, 35, 0.15);
  color: var(--accent);
}

[data-theme="dark"] .sidebar-link.active {
  background: rgba(212, 175, 55, 0.15);
}

.sidebar-footer {
  padding-top: 1rem;
  border-top: 1px solid var(--border);
}

.user-info {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.footer-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sidebar.collapsed .footer-actions {
  align-items: center;
}

.btn-logout {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  background: transparent;
  border: 1px solid var(--border);
  color: var(--accent);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.sidebar.collapsed .btn-logout {
  width: 36px;
  padding: 0.5rem;
}

.btn-logout:hover {
  background: var(--accent);
  color: var(--bg-primary);
}

.dashboard-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.dashboard-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  justify-content: flex-end;
  padding: 1rem 2rem;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border);
}

.theme-toggle-top {
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
  transition: all 0.2s;
}

.theme-toggle-top:hover {
  background: var(--accent);
  color: var(--btn-primary-text);
}

.dashboard-content {
  flex: 1;
  padding: 2rem;
}
</style>
