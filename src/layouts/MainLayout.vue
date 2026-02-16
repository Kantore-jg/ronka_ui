<script setup>
import { ref, computed } from 'vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'

const authStore = useAuthStore()
const themeStore = useThemeStore()
const mobileMenuOpen = ref(false)

const navLinks = computed(() => [
  { name: 'Accueil', to: '/' },
  { name: 'Services', to: '/services' },
  { name: 'Réserver', to: '/booking' },
  { name: 'Don', to: '/donate' },
  { name: 'Partenaires', to: '/partenaires' },
  { name: 'Feedback', to: '/feedback' },
])

function getDashboardLink() {
  if (authStore.isAdmin) return { name: 'admin-dashboard', text: 'Admin' }
  if (authStore.isMember) return { name: 'member-dashboard', text: 'Mon espace' }
  if (authStore.isPublicUser) return { name: 'public-dashboard', text: 'Mon compte' }
  return null
}
</script>

<template>
  <div class="main-layout">
    <header class="header">
      <nav class="nav">
        <router-link to="/" class="logo">
          <img src="/logo.png" alt="RONKA" class="logo-img">
          <div class="logo-text-wrap">
            <span class="logo-text">RONKA</span>
            <span class="logo-sub">Event Multi Service</span>
          </div>
        </router-link>
        
        <div class="nav-right">
          <ul class="nav-links" :class="{ open: mobileMenuOpen }">
          <li v-for="link in navLinks" :key="link.to">
            <router-link :to="link.to" @click="mobileMenuOpen = false">{{ link.name }}</router-link>
          </li>
          <li v-if="getDashboardLink()">
            <router-link :to="{ name: getDashboardLink().name }" @click="mobileMenuOpen = false" class="dashboard-link">
              {{ getDashboardLink().text }}
            </router-link>
          </li>
          <li v-else class="auth-links">
            <router-link to="/auth/login" @click="mobileMenuOpen = false">Se connecter</router-link>
            <router-link to="/auth/register" @click="mobileMenuOpen = false" class="btn-login">S'inscrire</router-link>
          </li>
          </ul>
          <button @click="themeStore.toggle()" class="theme-toggle" :title="themeStore.isLight ? 'Thème sombre' : 'Thème clair'" aria-label="Changer le thème">
            <i :class="themeStore.isLight ? 'pi pi-moon' : 'pi pi-sun'"></i>
          </button>
          <button class="mobile-toggle" @click="mobileMenuOpen = !mobileMenuOpen" aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>
    </header>
    
    <main class="main-content">
      <RouterView />
    </main>
    
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-brand">
          <img src="/logo.png" alt="RONKA" class="footer-logo">
          <span class="logo-text">RONKA</span>
          <span class="logo-sub">Event Multi Service</span>
          <p>30-50 jeunes au service de vos événements</p>
        </div>
        <div class="footer-links">
          <router-link to="/services">Services</router-link>
          <router-link to="/booking">Réserver</router-link>
          <router-link to="/donate">Don</router-link>
          <router-link to="/partenaires">Partenaires</router-link>
          <router-link to="/feedback">Feedback</router-link>
        </div>
        <div class="footer-social">
          <a href="https://www.instagram.com/ronka_multiservices/" target="_blank" rel="noopener" aria-label="Instagram">
            <i class="pi pi-instagram"></i> Instagram
          </a>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; {{ new Date().getFullYear() }} RONKA Event Multi Service. Tous droits réservés.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: var(--bg-secondary);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
}

.nav {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-img {
  width: 42px;
  height: 42px;
  object-fit: cover;
  border-radius: 8px;
}

.logo-text-wrap { display: flex; flex-direction: column; }
.logo-text {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: 0.15em;
}

.logo-sub {
  font-size: 0.7rem;
  color: var(--text-muted);
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.nav-right { display: flex; align-items: center; gap: 1rem; }
.theme-toggle {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--accent);
  width: 40px;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  transition: all 0.2s;
}
.theme-toggle:hover {
  background: var(--accent);
  color: var(--bg-primary);
}

.nav-links {
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
  align-items: center;
}

.nav-links a {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-links a:hover, .nav-links a.router-link-active {
  color: var(--accent);
}

.dashboard-link { color: var(--accent) !important; }
.btn-login {
  background: linear-gradient(135deg, var(--accent), var(--accent-hover));
  color: var(--bg-primary) !important;
  padding: 0.5rem 1.25rem;
  border-radius: 4px;
  font-weight: 600;
}

.mobile-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}

.mobile-toggle span {
  width: 25px;
  height: 2px;
  background: var(--accent);
}

.main-content { flex: 1; padding-top: 80px; }

.footer {
  background: var(--bg-secondary);
  color: var(--text-muted);
  margin-top: auto;
  border-top: 1px solid var(--border);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 2rem;
}

.footer-logo { width: 36px; height: 36px; border-radius: 6px; object-fit: cover; margin-bottom: 0.5rem; }
.footer-brand .logo-text { font-size: 1.2rem; }
.footer-brand p { margin-top: 0.5rem; opacity: 0.8; font-size: 0.9rem; }
.footer-links { display: flex; flex-direction: column; gap: 0.5rem; }
.footer-links a { color: inherit; text-decoration: none; }
.footer-links a:hover { color: var(--accent); }
.footer-bottom {
  padding: 1rem 2rem;
  text-align: center;
  border-top: 1px solid var(--border);
  font-size: 0.85rem;
  opacity: 0.7;
}

@media (max-width: 768px) {
  .mobile-toggle { display: flex; }
  .nav-links {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    background: var(--bg-secondary);
    padding: 2rem;
    gap: 1rem;
    transform: translateY(-100%);
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s;
  }
  .nav-links.open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }
  .footer-content { grid-template-columns: 1fr; text-align: center; }
}
</style>
