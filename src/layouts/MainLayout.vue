<script setup>
import { ref, computed } from 'vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
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
          <span class="logo-text">RONKA</span>
          <span class="logo-sub">Event Multi Service</span>
        </router-link>
        
        <button class="mobile-toggle" @click="mobileMenuOpen = !mobileMenuOpen" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
        
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
      </nav>
    </header>
    
    <main class="main-content">
      <RouterView />
    </main>
    
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-brand">
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
          <a href="https://www.instagram.com/ronka_multiservices/" target="_blank" rel="noopener" aria-label="Instagram">Instagram</a>
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
  background: rgba(15, 15, 20, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
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
  flex-direction: column;
}

.logo-text {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #D4AF37;
  letter-spacing: 0.15em;
}

.logo-sub {
  font-size: 0.7rem;
  color: rgba(255,255,255,0.7);
  letter-spacing: 0.2em;
  text-transform: uppercase;
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
  color: rgba(255,255,255,0.9);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-links a:hover, .nav-links a.router-link-active {
  color: #D4AF37;
}

.dashboard-link { color: #D4AF37 !important; }
.btn-login {
  background: linear-gradient(135deg, #D4AF37, #B8960E);
  color: #0f0f14 !important;
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
  background: #D4AF37;
}

.main-content { flex: 1; padding-top: 80px; }

.footer {
  background: #0a0a0e;
  color: rgba(255,255,255,0.8);
  margin-top: auto;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 2rem;
}

.footer-brand .logo-text { font-size: 1.2rem; }
.footer-brand p { margin-top: 0.5rem; opacity: 0.8; font-size: 0.9rem; }
.footer-links { display: flex; flex-direction: column; gap: 0.5rem; }
.footer-links a { color: inherit; text-decoration: none; }
.footer-links a:hover { color: #D4AF37; }
.footer-bottom {
  padding: 1rem 2rem;
  text-align: center;
  border-top: 1px solid rgba(255,255,255,0.1);
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
    background: rgba(15, 15, 20, 0.98);
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
