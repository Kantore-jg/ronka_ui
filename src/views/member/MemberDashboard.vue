<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useDataStore } from '@/stores/data'
import { eventsApi } from '@/api/client'

const authStore = useAuthStore()
const dataStore = useDataStore()
const newComment = ref({})
const apiUrl = import.meta.env.VITE_API_URL
const apiEvents = ref([])
const myApiAssignments = ref([])
const confirmingId = ref(null)

function getMyAssignment(event) {
  const myId = authStore.user?.id
  return event.assignments?.find(a => a.member_id === myId)
}

const pendingAssignments = computed(() => {
  if (!apiUrl || !authStore.user?.token) return []
  return myApiAssignments.value.filter(a => a.status === 'pending')
})

const myAssignments = computed(() => {
  if (apiUrl && authStore.user?.token) {
    return apiEvents.value
  }
  const myId = authStore.user?.id
  if (!myId) return []
  return dataStore.eventAssignments
    .filter(a => a.memberId === myId)
    .map(a => dataStore.events.find(e => e.id === a.eventId))
    .filter(Boolean)
})

async function loadData() {
  if (apiUrl && authStore.user?.token) {
    try {
      const [events, assignments] = await Promise.all([
        eventsApi.list(),
        eventsApi.myAssignments(),
      ])
      apiEvents.value = Array.isArray(events) ? events : []
      myApiAssignments.value = Array.isArray(assignments) ? assignments : []
    } catch (e) {
      console.error('Erreur chargement:', e)
    }
  }
}

onMounted(loadData)

async function respondToAssignment(assignmentId, status) {
  confirmingId.value = assignmentId
  try {
    await eventsApi.confirmAssignment(assignmentId, status)
    const idx = myApiAssignments.value.findIndex(a => a.id === assignmentId)
    if (idx !== -1) {
      myApiAssignments.value.splice(idx, 1)
    }
    apiEvents.value = apiEvents.value.map(e => ({
      ...e,
      assignments: e.assignments?.map(a =>
        a.id === assignmentId ? { ...a, status } : a
      ),
    }))
  } catch (e) {
    console.error('Erreur confirmation:', e)
  } finally {
    confirmingId.value = null
  }
}

function getStatusLabel(status) {
  if (status === 'confirmed') return 'Confirmé'
  if (status === 'declined') return 'Décliné'
  return 'En attente'
}

function getStatusClass(status) {
  if (status === 'confirmed') return 'status-confirmed'
  if (status === 'declined') return 'status-declined'
  return 'status-pending'
}

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-FR')
}

const pastEvents = computed(() => {
  const events = (apiUrl && authStore.user?.token) ? apiEvents.value : dataStore.events
  return events.filter(e => new Date(e.date) < new Date())
})

function getEventComments(eventId) {
  if (apiUrl && authStore.user?.token) {
    const event = apiEvents.value.find(e => e.id === eventId)
    return event?.comments || []
  }
  return dataStore.eventComments.filter(c => c.eventId === eventId)
}

async function addComment(eventId) {
  const comment = newComment.value[eventId]?.trim()
  if (!comment) return
  if (apiUrl && authStore.user?.token) {
    try {
      await eventsApi.addComment(eventId, comment)
      await loadData()
      newComment.value[eventId] = ''
    } catch (e) {
      console.error('Erreur lors de l\'ajout du commentaire:', e)
    }
  } else {
    dataStore.addEventComment(eventId, comment, authStore.user?.id, authStore.user?.name)
    newComment.value[eventId] = ''
  }
}
</script>

<template>
  <div class="member-dashboard">
    <h1>Mon espace membre</h1>
    <p class="welcome">Bienvenue, {{ authStore.user?.name }}.</p>

    <section v-if="pendingAssignments.length" class="notifications">
      <div v-for="a in pendingAssignments" :key="a.id" class="notif-card">
        <div class="notif-icon">
          <i class="pi pi-bell"></i>
        </div>
        <div class="notif-content">
          <p class="notif-title">Vous êtes assigné(e) à un événement</p>
          <p class="notif-event">
            <strong>{{ a.event?.title }}</strong>
            — {{ formatDate(a.event?.date) }}
            <template v-if="a.event?.lieu"> • {{ a.event.lieu }}</template>
          </p>
          <p v-if="a.event?.description" class="notif-desc">{{ a.event.description }}</p>
        </div>
        <div class="notif-actions">
          <button
            @click="respondToAssignment(a.id, 'confirmed')"
            class="btn-confirm"
            :disabled="confirmingId === a.id"
          >
            <i class="pi pi-check"></i> Confirmer
          </button>
          <button
            @click="respondToAssignment(a.id, 'declined')"
            class="btn-decline"
            :disabled="confirmingId === a.id"
          >
            <i class="pi pi-times"></i> Décliner
          </button>
        </div>
      </div>
    </section>

    <section class="section">
      <h2>Mes événements assignés</h2>
      <div v-if="myAssignments.length" class="events-list">
        <div v-for="e in myAssignments" :key="e.id" class="event-card">
          <div class="event-header">
            <h3>{{ e.title }}</h3>
            <span
              v-if="getMyAssignment(e)"
              class="status-badge"
              :class="getStatusClass(getMyAssignment(e).status)"
            >
              <i :class="getMyAssignment(e).status === 'confirmed' ? 'pi pi-check' : getMyAssignment(e).status === 'declined' ? 'pi pi-times' : 'pi pi-clock'"></i>
              {{ getStatusLabel(getMyAssignment(e).status) }}
            </span>
          </div>
          <p>{{ formatDate(e.date) }} • {{ e.lieu || '—' }}</p>
          <p v-if="e.description" class="desc">{{ e.description }}</p>
          <div v-if="getMyAssignment(e)?.status === 'pending'" class="inline-actions">
            <button @click="respondToAssignment(getMyAssignment(e).id, 'confirmed')" class="btn-confirm-sm" :disabled="confirmingId === getMyAssignment(e).id">
              <i class="pi pi-check"></i> Confirmer
            </button>
            <button @click="respondToAssignment(getMyAssignment(e).id, 'declined')" class="btn-decline-sm" :disabled="confirmingId === getMyAssignment(e).id">
              <i class="pi pi-times"></i> Décliner
            </button>
          </div>
        </div>
      </div>
      <p v-else class="empty">Aucun événement assigné pour le moment.</p>
    </section>

    <section class="section">
      <h2>Événements passés (commenter)</h2>
      <div v-if="pastEvents.length" class="events-list">
        <div v-for="e in pastEvents" :key="e.id" class="event-card">
          <h3>{{ e.title }}</h3>
          <p>{{ formatDate(e.date) }} • {{ e.lieu || '—' }}</p>
          <div class="comments">
            <div v-for="c in getEventComments(e.id)" :key="c.id" class="comment">
              <strong>{{ c.user?.name || c.userName }}</strong>: {{ c.comment }}
            </div>
          </div>
          <div class="add-comment">
            <input v-model="newComment[e.id]" @keyup.enter="addComment(e.id)" placeholder="Ajouter un commentaire..." class="comment-input">
            <button @click="addComment(e.id)" class="btn btn-sm btn-primary">Envoyer</button>
          </div>
          <p class="hint">Les commentaires sont visibles par les membres et l'admin.</p>
        </div>
      </div>
      <p v-else class="empty">Aucun événement passé.</p>
    </section>
  </div>
</template>

<style scoped>
.member-dashboard { color: var(--text-primary); }

.member-dashboard h1 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.75rem;
  color: #D4AF37;
  margin-bottom: 0.25rem;
}

.welcome { color: var(--text-secondary); margin-bottom: 1.5rem; }

.notifications { margin-bottom: 2rem; display: flex; flex-direction: column; gap: 0.75rem; }

.notif-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  background: rgba(212, 175, 55, 0.08);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 12px;
  flex-wrap: wrap;
}

.notif-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(212, 175, 55, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notif-icon i { color: #D4AF37; font-size: 1.1rem; }

.notif-content { flex: 1; min-width: 200px; }
.notif-title { font-weight: 600; color: var(--accent); font-size: 0.95rem; margin-bottom: 0.25rem; }
.notif-event { font-size: 0.9rem; color: var(--text-primary); }
.notif-desc { font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem; }

.notif-actions { display: flex; gap: 0.5rem; align-items: center; flex-shrink: 0; }

.btn-confirm, .btn-decline {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-confirm { background: #22c55e; color: #fff; }
.btn-confirm:hover { background: #16a34a; }
.btn-decline { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
.btn-decline:hover { background: rgba(239, 68, 68, 0.35); }
.btn-confirm:disabled, .btn-decline:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-confirm-sm, .btn-decline-sm {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.35rem 0.75rem;
  border-radius: 5px;
  font-weight: 600;
  font-size: 0.8rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-confirm-sm { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
.btn-confirm-sm:hover { background: rgba(34, 197, 94, 0.35); }
.btn-decline-sm { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
.btn-decline-sm:hover { background: rgba(239, 68, 68, 0.3); }
.btn-confirm-sm:disabled, .btn-decline-sm:disabled { opacity: 0.5; cursor: not-allowed; }

.section { margin-bottom: 2rem; }

.section h2 {
  font-size: 1.1rem;
  color: #D4AF37;
  margin-bottom: 1rem;
}

.events-list { display: flex; flex-direction: column; gap: 1rem; }

.event-card {
  background: var(--bg-card);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 10px;
  padding: 1.25rem;
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.25rem;
  flex-wrap: wrap;
}

.event-card h3 { font-size: 1rem; color: var(--text-primary); margin: 0; }
.event-card p { font-size: 0.9rem; color: var(--text-secondary); }
.desc { font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem; }

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.6rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
}

.status-confirmed { background: rgba(34, 197, 94, 0.15); color: #22c55e; }
.status-declined { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
.status-pending { background: rgba(234, 179, 8, 0.15); color: #eab308; }

.inline-actions { display: flex; gap: 0.5rem; margin-top: 0.75rem; }

.comments { margin-top: 1rem; }
.comment {
  font-size: 0.9rem;
  padding: 0.5rem;
  background: var(--input-bg);
  border-radius: 6px;
  margin-bottom: 0.5rem;
}
.add-comment { display: flex; gap: 0.5rem; margin-top: 0.75rem; }
.comment-input {
  flex: 1;
  padding: 0.5rem 0.75rem;
  background: var(--input-bg);
  border: 1px solid var(--input-border);
  border-radius: 6px;
  color: var(--text-primary);
  font-size: 0.9rem;
}
.btn { padding: 0.5rem 1rem; border-radius: 6px; font-weight: 600; border: none; cursor: pointer; }
.btn-sm { font-size: 0.85rem; }
.btn-primary { background: linear-gradient(135deg, #D4AF37, #B8960E); color: #0f0f14; }
.hint { font-size: 0.8rem; color: var(--text-muted); margin-top: 0.5rem; }
.empty { color: var(--text-muted); }

@media (max-width: 640px) {
  .notif-card { flex-direction: column; }
  .notif-actions { width: 100%; }
  .notif-actions button { flex: 1; justify-content: center; }
}
</style>
