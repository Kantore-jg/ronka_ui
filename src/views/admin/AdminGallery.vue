<script setup>
import { ref } from 'vue'
import { useDataStore } from '@/stores/data'

const dataStore = useDataStore()
const form = ref({ type: 'image', url: '', title: '' })
const showForm = ref(false)

function addItem() {
  if (!form.value.url) return
  dataStore.addGalleryItem(form.value)
  form.value = { type: 'image', url: '', title: '' }
  showForm.value = false
}

function removeItem(id) {
  if (confirm('Supprimer cet élément de la galerie ?')) dataStore.removeGalleryItem(id)
}
</script>

<template>
  <div class="admin-gallery">
    <div class="header">
      <h1>Galerie du site</h1>
      <button @click="showForm = !showForm" class="btn btn-primary">
        {{ showForm ? 'Annuler' : '+ Ajouter image/vidéo' }}
      </button>
    </div>

    <div v-if="showForm" class="add-form">
      <h3>Nouvelle image ou vidéo</h3>
      <p class="hint">Collez l'URL d'une image (Instagram, Unsplash, etc.) ou d'une vidéo.</p>
      <form @submit.prevent="addItem">
        <div class="form-group">
          <label>Type</label>
          <select v-model="form.type">
            <option value="image">Image</option>
            <option value="video">Vidéo</option>
          </select>
        </div>
        <div class="form-group">
          <label>URL *</label>
          <input v-model="form.url" type="url" required placeholder="https://...">
        </div>
        <div class="form-group">
          <label>Titre / Description</label>
          <input v-model="form.title" type="text" placeholder="Ex: Mariage Dupont 2024">
        </div>
        <button type="submit" class="btn btn-primary">Ajouter</button>
      </form>
    </div>

    <div class="gallery-list">
      <h3>Éléments de la galerie ({{ dataStore.gallery.length }})</h3>
      <div class="gallery-grid">
        <div v-for="item in dataStore.gallery" :key="item.id" class="gallery-item">
          <div class="preview">
            <img v-if="item.type === 'image'" :src="item.url" :alt="item.title" @error="$event.target.src='/logo.png'">
            <video v-else :src="item.url" muted preload="metadata"></video>
            <span class="type-badge">{{ item.type === 'video' ? 'Vidéo' : 'Image' }}</span>
          </div>
          <p class="item-title">{{ item.title || 'Sans titre' }}</p>
          <button @click="removeItem(item.id)" class="btn btn-sm btn-danger">Supprimer</button>
        </div>
      </div>
      <p v-if="!dataStore.gallery.length" class="empty">Aucun élément. Ajoutez des images ou vidéos.</p>
    </div>
  </div>
</template>

<style scoped>
.admin-gallery { color: var(--text-primary); }

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.admin-gallery h1 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.75rem;
  color: var(--accent);
}

.add-form {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.add-form h3 { font-size: 1rem; margin-bottom: 0.5rem; color: var(--text-primary); }
.hint { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem; }

.form-group { margin-bottom: 1rem; }
.form-group label { display: block; margin-bottom: 0.35rem; font-size: 0.9rem; color: var(--accent); }
.form-group input,
.form-group select {
  width: 100%;
  padding: 0.6rem 0.75rem;
  background: var(--input-bg);
  border: 1px solid var(--input-border);
  border-radius: 6px;
  color: var(--text-primary);
}

.gallery-list h3 { font-size: 1rem; margin-bottom: 1rem; color: var(--text-secondary); }

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.25rem;
}

.gallery-item {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
}

.preview {
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
  background: var(--input-bg);
}

.preview img,
.preview video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.type-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  font-size: 0.7rem;
  background: var(--accent);
  color: var(--btn-primary-text);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.item-title {
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.btn {
  padding: 0.6rem 1.25rem;
  border-radius: 6px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-primary { background: linear-gradient(135deg, var(--accent), var(--accent-hover)); color: var(--btn-primary-text); }
.btn-sm { padding: 0.4rem 0.75rem; font-size: 0.8rem; }
.btn-danger { background: rgba(239, 68, 68, 0.3); color: #ef4444; margin: 0 1rem 1rem; width: calc(100% - 2rem); }
.btn-danger:hover { background: rgba(239, 68, 68, 0.5); }
.empty { color: var(--text-muted); }
</style>
