<script setup>
import { computed, ref, onMounted } from 'vue'
import { useDataStore } from '@/stores/data'
import { useAuthStore } from '@/stores/auth'
import { bookingsApi, donationsApi, partnersApi, feedbackApi, membersApi, eventsApi } from '@/api/client'

const dataStore = useDataStore()
const authStore = useAuthStore()
const apiUrl = import.meta.env.VITE_API_URL
const hasToken = computed(() => !!authStore.user?.token)

const bookings = ref([])
const donations = ref([])
const partners = ref([])
const feedbacks = ref([])
const members = ref([])
const events = ref([])
const loading = ref(true)
const error = ref('')

const stats = computed(() => {
  if (apiUrl && hasToken.value) {
    const feedAll = feedbacks.value || []
    const feedAndSugg = feedAll.filter(f => f.type === 'feedback').length + feedAll.filter(f => f.type === 'suggestion').length
    return {
      bookings: (bookings.value || []).length,
      donations: (donations.value || []).length,
      partners: (partners.value || []).filter(p => p.status === 'approved').length,
      partnersPending: (partners.value || []).filter(p => p.status === 'pending').length,
      feedbacks: feedAndSugg,
      suggestions: 0,
      members: (members.value || []).length,
      events: (events.value || []).length,
    }
  }
  return {
    bookings: dataStore.bookings.length,
    donations: dataStore.donations.length,
    partners: dataStore.partners.filter(p => p.status === 'approved').length,
    partnersPending: dataStore.partners.filter(p => p.status === 'pending').length,
    feedbacks: dataStore.feedbacks.length,
    suggestions: dataStore.suggestions.length,
    members: dataStore.members.length,
    events: dataStore.events.length,
  }
})

const recentBookings = computed(() => {
  const list = (apiUrl && hasToken.value) ? bookings.value : dataStore.bookings
  return [...list].reverse().slice(0, 5)
})
const recentDonations = computed(() => {
  const list = (apiUrl && hasToken.value) ? donations.value : dataStore.donations
  return [...list].reverse().slice(0, 5)
})

onMounted(async () => {
  if (!apiUrl || !hasToken.value) {
    loading.value = false
    return
  }
  try {
    const [b, d, p, f, m, e] = await Promise.all([
      bookingsApi.list(),
      donationsApi.list(),
      partnersApi.list(),
      feedbackApi.list(),
      membersApi.list(),
      eventsApi.list(),
    ])
    bookings.value = Array.isArray(b) ? b : []
    donations.value = Array.isArray(d) ? d : []
    partners.value = Array.isArray(p) ? p : []
    feedbacks.value = Array.isArray(f) ? f : []
    members.value = Array.isArray(m) ? m : []
    events.value = Array.isArray(e) ? e : []
  } catch (err) {
    error.value = err.message || 'Erreur lors du chargement.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="admin-dashboard">
    <h1>Tableau de bord Admin</h1>
    <p v-if="error" class="error-msg">{{ error }}</p>
    <p v-if="loading" class="loading">Chargement...</p>
    
    <div class="stats-grid">
      <div class="stat-card">
        <span class="stat-value">{{ stats.bookings }}</span>
        <span class="stat-label">Réservations</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">{{ stats.donations }}</span>
        <span class="stat-label">Dons</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">{{ stats.partners }}</span>
        <span class="stat-label">Partenaires</span>
      </div>
      <div class="stat-card warning" v-if="stats.partnersPending">
        <span class="stat-value">{{ stats.partnersPending }}</span>
        <span class="stat-label">Partenaires en attente</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">{{ stats.feedbacks + stats.suggestions }}</span>
        <span class="stat-label">Feedbacks & Suggestions</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">{{ stats.members }}</span>
        <span class="stat-label">Membres du club</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">{{ stats.events }}</span>
        <span class="stat-label">Événements</span>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="panel">
        <h2>Réservations récentes</h2>
        <div v-if="recentBookings.length" class="list">
          <div v-for="b in recentBookings" :key="b.id" class="list-item">
            <div>
              <strong>{{ b.name }}</strong> — {{ b.eventType || b.event_type }}
            </div>
            <small>{{ (b.date || b.created_at)?.slice?.(0, 10) }} • {{ b.lieu }}</small>
          </div>
        </div>
        <p v-else class="empty">Aucune réservation</p>
        <router-link to="/admin/bookings" class="link">Voir tout →</router-link>
      </div>
      <div class="panel">
        <h2>Dons récents</h2>
        <div v-if="recentDonations.length" class="list">
          <div v-for="d in recentDonations" :key="d.id" class="list-item">
            <div>
              <strong>{{ d.name }}</strong> — {{ d.amount }}
            </div>
            <small>{{ d.method || '-' }}</small>
          </div>
        </div>
        <p v-else class="empty">Aucun don</p>
      </div>
    </div>

    <div class="quick-actions">
      <router-link to="/admin/members" class="btn btn-primary">Gérer les membres</router-link>
      <router-link to="/admin/events" class="btn btn-outline">Gérer les événements</router-link>
    </div>
  </div>
</template>

<style scoped>
.admin-dashboard { color: var(--text-primary); }

.error-msg {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.loading { color: var(--text-muted); margin-bottom: 1rem; }

.admin-dashboard h1 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.75rem;
  color: var(--accent);
  margin-bottom: 1.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--bg-card);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 10px;
  padding: 1.25rem;
  text-align: center;
}

.stat-card.warning { border-color: rgba(234, 179, 8, 0.5); }
.stat-value { display: block; font-size: 1.75rem; font-weight: 700; color: #D4AF37; }
.stat-label { font-size: 0.85rem; color: var(--text-muted); }

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.panel {
  background: var(--bg-card);
  border: 1px solid rgba(212, 175, 55, 0.15);
  border-radius: 12px;
  padding: 1.5rem;
}

.panel h2 {
  font-size: 1rem;
  color: var(--accent);
  margin-bottom: 1rem;
}

.list-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border);
}

.list-item:last-child { border-bottom: none; }
.list-item small { color: var(--text-muted); font-size: 0.85rem; }
.empty { color: var(--text-muted); font-size: 0.9rem; }
.link { color: #D4AF37; font-size: 0.9rem; margin-top: 0.5rem; display: inline-block; }

.quick-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none;
  font-size: 0.95rem;
}
.btn-primary { background: linear-gradient(135deg, var(--accent), var(--accent-hover)); color: var(--btn-primary-text); }
.btn-outline { background: transparent; color: #D4AF37; border: 1px solid rgba(212, 175, 55, 0.5); }
.btn-outline:hover { background: rgba(212, 175, 55, 0.15); }
</style>
