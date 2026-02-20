<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useDataStore } from '@/stores/data'
import { galleryApi } from '@/api/client'

const dataStore = useDataStore()
const currentIndex = ref(0)
let intervalId = null
const apiItems = ref([])
const apiUrl = import.meta.env.VITE_API_URL

const galleryItems = computed(() => {
  const source = apiUrl ? apiItems.value : dataStore.gallery
  return source.filter(g => g.type === 'image' || g.type === 'video')
})

function nextSlide() {
  const n = galleryItems.value.length
  if (!n) return
  currentIndex.value = (currentIndex.value + 1) % n
}

function goToSlide(i) {
  currentIndex.value = i
}

onMounted(async () => {
  if (apiUrl) {
    try {
      const data = await galleryApi.list()
      apiItems.value = Array.isArray(data) ? data : []
    } catch {
      apiItems.value = []
    }
  }
  if (galleryItems.value.length) {
    intervalId = setInterval(nextSlide, 2000)
  }
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<template>
  <div class="home">
    <section class="hero">
      <div class="hero-content">
        <h1>RONKA Event Multi Service</h1>
        <p class="hero-tagline">30-50 jeunes au service de vos moments inoubliables</p>
        <p class="hero-desc">Cérémonies, événements, fêtes — nous fournissons serveurs et organisation pour faire de chaque occasion un succès.</p>
        <div class="hero-actions">
          <router-link to="/booking" class="btn btn-primary">Réserver un événement</router-link>
          <router-link to="/donate" class="btn btn-secondary">Faire un don</router-link>
          <router-link to="/partenaires" class="btn btn-outline">Devenir partenaire</router-link>
        </div>
      </div>
      <div class="hero-decoration"></div>
    </section>

    <section class="mission">
      <div class="container">
        <h2>Notre mission</h2>
        <p class="mission-text">
          RONKA Event Multi Service est un club de 30-50 jeunes dynamiques dédiés à l'excellence événementielle. 
          Nous accompagnons vos cérémonies, vos événements et vos fêtes avec professionnalisme et passion, 
          en mettant à votre disposition des serveurs qualifiés et une organisation irréprochable.
        </p>
      </div>
    </section>

    <section v-if="galleryItems.length" class="gallery-preview">
      <div class="container">
        <h2>Nos événements en images</h2>
        <div class="carousel-wrap">
          <div class="carousel-track" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
            <div v-for="(item, i) in galleryItems" :key="item.id" class="carousel-slide">
              <div v-if="item.type === 'image'" class="slide-media">
                <img :src="item.url" :alt="item.title" @error="$event.target.src='/logo.png'">
              </div>
              <div v-else class="slide-media">
                <video :src="item.url" muted loop autoplay playsinline></video>
              </div>
              <p v-if="item.title" class="slide-caption">{{ item.title }}</p>
            </div>
          </div>
          <div v-if="galleryItems.length > 1" class="carousel-dots">
            <button
              v-for="(_, i) in galleryItems"
              :key="i"
              class="dot"
              :class="{ active: i === currentIndex }"
              @click="goToSlide(i)"
              :aria-label="`Image ${i + 1}`"
            ></button>
          </div>
        </div>
        <router-link to="/galerie" class="btn btn-outline gallery-link">
          <i class="pi pi-images"></i> Voir plus d'images
        </router-link>
      </div>
    </section>

    <section class="quick-services">
      <div class="container">
        <h2>Nos services</h2>
        <div class="services-grid">
          <div class="service-card">
            <i class="pi pi-building service-icon"></i>
            <h3>Cérémonies</h3>
            <p>Mariages, funérailles et événements religieux</p>
          </div>
          <div class="service-card">
            <i class="pi pi-calendar service-icon"></i>
            <h3>Événements</h3>
            <p>Conférences, concerts et manifestations</p>
          </div>
          <div class="service-card">
            <i class="pi pi-gift service-icon"></i>
            <h3>Fêtes privées</h3>
            <p>Anniversaires, fêtes de famille</p>
          </div>
          <div class="service-card">
            <i class="pi pi-users service-icon"></i>
            <h3>Service traiteur</h3>
            <p>Mise à disposition de serveurs professionnels</p>
          </div>
        </div>
        <router-link to="/services" class="btn btn-outline center">Voir tous nos services</router-link>
      </div>
    </section>

    <section class="cta">
      <div class="container">
        <h2>Prêt à organiser votre événement ?</h2>
        <div class="cta-buttons">
          <router-link to="/booking" class="btn btn-primary">Réserver</router-link>
          <router-link to="/auth/login" class="btn btn-outline">Se connecter</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home { color: var(--text-primary); }

.hero {
  min-height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: radial-gradient(ellipse at 50% 30%, rgba(212, 175, 55, 0.12) 0%, transparent 55%),
              linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  overflow: hidden;
}

.hero-decoration {
  position: absolute;
  top: -50%;
  right: -20%;
  width: 60%;
  height: 150%;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.06) 0%, transparent 60%);
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 700px;
  padding: 2rem;
}

.hero h1 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  color: var(--accent);
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.hero-tagline {
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
}

.hero-desc {
  color: var(--text-muted);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  display: inline-block;
  padding: 0.85rem 1.75rem;
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  font-size: 0.95rem;
}

.btn-primary {
  background: linear-gradient(135deg, #D4AF37, #B8960E);
  color: var(--bg-primary);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(212, 175, 55, 0.4);
}

.btn-secondary {
  background: rgba(212, 175, 55, 0.2);
  color: var(--accent);
  border: 1px solid var(--border);
}

.btn-outline {
  background: transparent;
  color: var(--accent);
  border: 1px solid var(--border);
}

.btn-outline:hover, .btn-secondary:hover {
  background: var(--border);
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 2rem;
}

.mission {
  padding: 5rem 0;
  background: rgba(212, 175, 55, 0.03);
}

.mission h2, .quick-services h2, .cta h2 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 2rem;
  color: var(--accent);
  text-align: center;
  margin-bottom: 1.5rem;
}

.mission-text {
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
  color: var(--text-secondary);
  line-height: 1.7;
}

.gallery-preview {
  padding: 4rem 0;
  background: var(--bg-primary);
}

.gallery-preview h2 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 2rem;
  color: var(--accent);
  text-align: center;
  margin-bottom: 2rem;
}

.carousel-wrap {
  position: relative;
  max-width: 800px;
  margin: 0 auto 2rem;
  overflow: hidden;
  border-radius: 16px;
  border: 1px solid var(--border);
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.carousel-slide {
  min-width: 100%;
  flex-shrink: 0;
}

.slide-media {
  aspect-ratio: 16/10;
  overflow: hidden;
  background: var(--input-bg);
}

.slide-media img,
.slide-media video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slide-caption {
  padding: 1rem;
  text-align: center;
  color: var(--text-secondary);
  font-size: 1rem;
}

.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid var(--accent);
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.dot.active {
  background: var(--accent);
}

.gallery-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 auto;
}

.gallery-link i { font-size: 1.1rem; }

.quick-services { padding: 5rem 0; }

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.service-card {
  background: var(--bg-card);
  border: 1px solid rgba(212, 175, 55, 0.15);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s;
}

.service-card:hover {
  transform: translateY(-4px);
  border-color: rgba(212, 175, 55, 0.4);
  box-shadow: 0 8px 30px rgba(0,0,0,0.3);
}

.service-card .service-icon { font-size: 2.5rem; display: block; margin-bottom: 0.5rem; color: var(--accent); }
.service-card h3 { font-size: 1.1rem; margin-bottom: 0.25rem; color: var(--text-primary); }
.service-card p { font-size: 0.9rem; color: var(--text-muted); }
.center { display: block; text-align: center; margin: 0 auto; }

.cta {
  padding: 5rem 0;
  background: radial-gradient(ellipse at center, rgba(212, 175, 55, 0.08) 0%, transparent 70%);
}

.cta h2 { margin-bottom: 1.5rem; }
.cta-buttons { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
</style>
