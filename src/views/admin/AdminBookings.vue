<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDataStore } from '@/stores/data'
import { useAuthStore } from '@/stores/auth'
import { bookingsApi } from '@/api/client'

const dataStore = useDataStore()
const authStore = useAuthStore()
const apiUrl = import.meta.env.VITE_API_URL
const apiBookings = ref([])
const error = ref('')

const bookings = computed(() =>
  (apiUrl && authStore.user?.token) ? apiBookings.value : dataStore.bookings
)

onMounted(async () => {
  if (apiUrl && authStore.user?.token) {
    try {
      const data = await bookingsApi.list()
      apiBookings.value = Array.isArray(data) ? data : []
    } catch (e) {
      error.value = e.message || 'Erreur chargement'
    }
  }
})
</script>

<template>
  <div class="admin-bookings">
    <h1>Réservations</h1>
    <p v-if="error" class="error-msg">{{ error }}</p>
    <p class="subtitle">Toutes les demandes de booking reçues. Attribuez les marchés aux membres.</p>

    <div v-if="bookings.length" class="bookings-grid">
      <div v-for="b in [...bookings].reverse()" :key="b.id" class="booking-card">
        <div class="booking-header">
          <h3>{{ b.name }}</h3>
          <span class="date">{{ (b.date || b.created_at)?.slice?.(0, 10) || b.date }}</span>
        </div>
        <p class="event-type">{{ b.eventType || b.event_type }}</p>
        <p class="lieu"><i class="pi pi-map-marker"></i> {{ b.lieu }}</p>
        <p v-if="b.contact" class="contact"><i class="pi pi-phone"></i> {{ b.contact }}</p>
        <p v-if="b.description" class="desc">{{ b.description }}</p>
      </div>
    </div>
    <p v-else class="empty">Aucune réservation pour le moment.</p>
  </div>
</template>

<style scoped>
.admin-bookings { color: var(--text-primary); }

.admin-bookings h1 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.75rem;
  color: var(--accent);
  margin-bottom: 0.25rem;
}

.subtitle { color: var(--text-muted); margin-bottom: 1.5rem; font-size: 0.9rem; }

.bookings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.25rem;
}

.booking-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 1.25rem;
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.booking-header h3 { font-size: 1.1rem; color: var(--accent); }
.date { font-size: 0.85rem; color: var(--text-muted); }
.event-type { font-weight: 600; margin-bottom: 0.25rem; }
.lieu, .contact { font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 0.25rem; }
.lieu i, .contact i { margin-right: 0.35rem; }
.desc { font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem; line-height: 1.4; }
.empty { color: var(--text-muted); }
.error-msg { background: rgba(239,68,68,0.2); color: #ef4444; padding: 0.75rem; border-radius: 6px; margin-bottom: 1rem; }
</style>
