<script setup>
import { useDataStore } from '@/stores/data'

const dataStore = useDataStore()
const galleryItems = dataStore.gallery.filter(g => g.type === 'image' || g.type === 'video')
</script>

<template>
  <div class="gallery-page">
    <section class="gallery-hero">
      <div class="container">
        <h1>Galerie des événements</h1>
        <p>Découvrez nos prestations et les moments forts de nos événements passés.</p>
      </div>
    </section>

    <section class="gallery-grid-section">
      <div class="container">
        <div v-if="galleryItems.length" class="gallery-grid">
          <div v-for="item in galleryItems" :key="item.id" class="gallery-card">
            <div v-if="item.type === 'image'" class="media-wrap">
              <img :src="item.url" :alt="item.title" @error="$event.target.src='/logo.png'">
            </div>
            <div v-else class="media-wrap video-wrap">
              <video :src="item.url" controls preload="metadata"></video>
            </div>
            <p v-if="item.title" class="caption">{{ item.title }}</p>
          </div>
        </div>
        <p v-else class="empty">Aucune image ou vidéo pour le moment.</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.gallery-page { color: var(--text-primary); padding-bottom: 4rem; }

.gallery-hero {
  padding: 4rem 0 2rem;
  text-align: center;
  background: radial-gradient(ellipse at 50% 0%, rgba(212, 175, 55, 0.1) 0%, transparent 50%);
}

.gallery-hero h1 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 2.5rem;
  color: var(--accent);
  margin-bottom: 0.5rem;
}

.gallery-hero p { color: var(--text-secondary); }

.container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }

.gallery-grid-section { padding: 2rem 0; }

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.gallery-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s;
}

.gallery-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.2);
}

.media-wrap {
  aspect-ratio: 4/3;
  overflow: hidden;
  background: var(--input-bg);
}

.media-wrap img,
.media-wrap video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-wrap video { object-fit: contain; }

.caption {
  padding: 1rem;
  font-size: 0.95rem;
  color: var(--text-secondary);
}

.empty { text-align: center; color: var(--text-muted); padding: 3rem; }
</style>
