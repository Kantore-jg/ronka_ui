<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDataStore } from '@/stores/data'
import { useAuthStore } from '@/stores/auth'
import { eventsApi, membersApi, feedbackApi, partnersApi } from '@/api/client'

const dataStore = useDataStore()
const authStore = useAuthStore()
const form = ref({ title: '', date: '', lieu: '', description: '' })
const showForm = ref(false)
const selectedEvent = ref(null)
const assignMemberId = ref('')
const adminComment = ref({})
const apiUrl = import.meta.env.VITE_API_URL
const hasToken = computed(() => !!authStore.user?.token)

const apiEvents = ref([])
const apiMembers = ref([])
const apiFeedbacks = ref([])
const apiPartners = ref([])
const error = ref('')

const events = computed(() => (apiUrl && hasToken.value) ? apiEvents.value : dataStore.events)
const members = computed(() => (apiUrl && hasToken.value) ? apiMembers.value : dataStore.members)
const feedbacks = computed(() => (apiUrl && hasToken.value) ? apiFeedbacks.value.filter(f => f.type === 'feedback') : dataStore.feedbacks)
const suggestions = computed(() => (apiUrl && hasToken.value) ? apiFeedbacks.value.filter(f => f.type === 'suggestion') : dataStore.suggestions)
const partnersPending = computed(() => (apiUrl && hasToken.value) ? apiPartners.value.filter(p => p.status === 'pending') : dataStore.partners.filter(p => p.status === 'pending'))

function getAssignedMembers(event) {
  if (!event) return []
  const assigns = event.assignments || []
  return assigns.map(a => a.member || a).filter(Boolean)
}

onMounted(async () => {
  if (!apiUrl || !hasToken.value) return
  try {
    const [ev, mem, fb, pt] = await Promise.all([
      eventsApi.list(),
      membersApi.list(),
      feedbackApi.list(),
      partnersApi.list(),
    ])
    apiEvents.value = Array.isArray(ev) ? ev : []
    apiMembers.value = Array.isArray(mem) ? mem : []
    apiFeedbacks.value = Array.isArray(fb) ? fb : []
    apiPartners.value = Array.isArray(pt) ? pt : []
  } catch (e) {
    error.value = e.message || 'Erreur chargement'
  }
})

async function addEvent() {
  if (!form.value.title || !form.value.date) return
  error.value = ''
  if (apiUrl && hasToken.value) {
    try {
      await eventsApi.create(form.value)
      form.value = { title: '', date: '', lieu: '', description: '' }
      showForm.value = false
      const ev = await eventsApi.list()
      apiEvents.value = Array.isArray(ev) ? ev : []
      return
    } catch (e) {
      error.value = e.message || 'Erreur création'
      return
    }
  }
  dataStore.addEvent(form.value)
  form.value = { title: '', date: '', lieu: '', description: '' }
  showForm.value = false
}

async function assignMember() {
  const ev = selectedEvent.value
  if (!ev || !assignMemberId.value) return
  const eventId = typeof ev === 'object' ? ev.id : ev
  if (apiUrl && hasToken.value) {
    try {
      await eventsApi.assignMember(eventId, assignMemberId.value)
      assignMemberId.value = ''
      selectedEvent.value = null
      const data = await eventsApi.list()
      apiEvents.value = Array.isArray(data) ? data : []
    } catch (e) {
      error.value = e.message || 'Erreur assignation'
    }
    return
  }
  dataStore.assignMemberToEvent(eventId, assignMemberId.value)
  assignMemberId.value = ''
  selectedEvent.value = null
}

async function addAdminComment(eventId) {
  const comment = adminComment.value[eventId]?.trim()
  if (!comment) return
  if (apiUrl && hasToken.value) {
    try {
      await eventsApi.addComment(eventId, comment)
      adminComment.value[eventId] = ''
      const data = await eventsApi.list()
      apiEvents.value = Array.isArray(data) ? data : []
    } catch (e) {
      error.value = e.message || 'Erreur commentaire'
    }
    return
  }
  dataStore.addEventComment(eventId, comment, authStore.user?.id, authStore.user?.name + ' (Admin)')
  adminComment.value[eventId] = ''
}

async function approvePartner(id) {
  if (apiUrl && hasToken.value) {
    try {
      await partnersApi.approve(id)
      apiPartners.value = apiPartners.value.filter(p => p.id !== id)
      const pt = await partnersApi.list()
      apiPartners.value = Array.isArray(pt) ? pt : []
    } catch (e) {
      error.value = e.message || 'Erreur approbation'
    }
    return
  }
  dataStore.approvePartner(id)
}
</script>

<template>
  <div class="admin-events">
    <div class="header">
      <h1>Gestion des événements</h1>
      <p v-if="error" class="error-msg">{{ error }}</p>
      <button @click="showForm = !showForm" class="btn btn-primary">
        {{ showForm ? 'Annuler' : '+ Créer un événement' }}
      </button>
    </div>

    <div v-if="showForm" class="add-form">
      <h3>Nouvel événement</h3>
      <form @submit.prevent="addEvent">
        <div class="form-group">
          <label>Titre *</label>
          <input v-model="form.title" type="text" required placeholder="Ex: Mariage Dupont">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Date *</label>
            <input v-model="form.date" type="date" required>
          </div>
          <div class="form-group">
            <label>Lieu</label>
            <input v-model="form.lieu" type="text" placeholder="Ville, adresse">
          </div>
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea v-model="form.description" rows="3" placeholder="Détails..."></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Créer</button>
      </form>
    </div>

    <div class="events-list">
      <h3>Événements</h3>
      <div v-for="e in events" :key="e.id" class="event-card">
        <div class="event-info">
          <h4>{{ e.title }}</h4>
          <p>{{ (e.date || e.created_at)?.slice?.(0, 10) || e.date }} • {{ e.lieu || '—' }}</p>
          <p v-if="e.description" class="desc">{{ e.description }}</p>
          <div v-if="getAssignedMembers(e).length" class="assigned">
            <strong>Assignés :</strong> {{ getAssignedMembers(e).map(m => m.name).join(', ') }}
          </div>
          <div v-if="new Date(e.date || e.created_at || 0) < new Date()" class="comments-section">
            <div v-for="c in (e.comments || []).concat(dataStore.eventComments.filter(x => x.eventId === e.id))" :key="c.id" class="comment">
              <strong>{{ c.user?.name || c.userName }}</strong>: {{ c.comment }}
            </div>
            <div class="add-comment">
              <input v-model="adminComment[e.id]" @keyup.enter="addAdminComment(e.id)" placeholder="Commenter (visible par les membres)...">
              <button @click="addAdminComment(e.id)" class="btn btn-sm btn-primary">Ajouter</button>
            </div>
          </div>
        </div>
        <div class="event-actions">
          <div v-if="selectedEvent === e.id || selectedEvent?.id === e.id" class="assign-box">
            <select v-model="assignMemberId" class="select">
              <option value="">Sélectionner un membre</option>
              <option v-for="m in members" :key="m.id" :value="String(m.id)">{{ m.name }}</option>
            </select>
            <div class="btn-row">
              <button @click="assignMember" class="btn btn-sm btn-primary">Assigner</button>
              <button @click="selectedEvent = null" class="btn btn-sm btn-outline">Fermer</button>
            </div>
          </div>
          <button v-else @click="selectedEvent = e" class="btn btn-sm btn-outline">Assigner membre</button>
        </div>
      </div>
      <p v-if="!events.length" class="empty">Aucun événement</p>
    </div>

    <div class="admin-panels">
      <div class="panel">
        <h3>Feedbacks</h3>
        <div v-for="f in feedbacks" :key="f.id" class="item">
          <p>{{ f.message }}</p>
          <small>{{ f.name || 'Anonyme' }} • {{ f.contact || '' }}</small>
        </div>
        <p v-if="!feedbacks.length" class="empty">Aucun feedback</p>
      </div>
      <div class="panel">
        <h3>Suggestions</h3>
        <div v-for="s in suggestions" :key="s.id" class="item">
          <p>{{ s.message }}</p>
          <small>{{ s.name || 'Anonyme' }}</small>
        </div>
        <p v-if="!suggestions.length" class="empty">Aucune suggestion</p>
      </div>
      <div class="panel">
        <h3>Partenaires (en attente)</h3>
        <div v-for="p in partnersPending" :key="p.id" class="item">
          <p><strong>{{ p.name }}</strong> — {{ p.contact }}</p>
          <button @click="approvePartner(p.id)" class="btn btn-sm btn-primary">Approuver</button>
        </div>
        <p v-if="!partnersPending.length" class="empty">Aucun en attente</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-events { color: var(--text-primary); }

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.admin-events h1 {
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

.form-group { margin-bottom: 1rem; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
.form-group label { display: block; margin-bottom: 0.35rem; font-size: 0.9rem; color: #D4AF37; }
.form-group input, .form-group textarea {
  width: 100%;
  padding: 0.6rem 0.75rem;
  background: var(--input-bg);
  border: 1px solid var(--input-border);
  border-radius: 6px;
  color: var(--text-primary);
}

.events-list h3 { font-size: 1rem; margin-bottom: 1rem; color: var(--text-secondary); }

.event-card {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 1.25rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.event-info h4 { margin-bottom: 0.25rem; color: var(--accent); }
.event-info p { font-size: 0.9rem; color: var(--text-secondary); }
.event-info .desc { font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem; }
.assigned { font-size: 0.85rem; margin-top: 0.5rem; color: var(--text-secondary); }

.comments-section { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border); }
.comments-section .comment { font-size: 0.9rem; padding: 0.5rem 0; color: var(--text-secondary); }
.add-comment { display: flex; gap: 0.5rem; margin-top: 0.5rem; }
.add-comment input {
  flex: 1;
  padding: 0.5rem 0.75rem;
  background: var(--input-bg);
  border: 1px solid var(--input-border);
  border-radius: 6px;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.assign-box { display: flex; flex-direction: column; gap: 0.5rem; }
.select {
  padding: 0.5rem;
  background: var(--input-bg);
  border: 1px solid var(--input-border);
  border-radius: 6px;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.btn-row { display: flex; gap: 0.5rem; }
.btn { padding: 0.6rem 1.25rem; border-radius: 6px; font-weight: 600; border: none; cursor: pointer; font-size: 0.9rem; }
.btn-primary { background: linear-gradient(135deg, var(--accent), var(--accent-hover)); color: var(--btn-primary-text); }
.btn-sm { padding: 0.4rem 0.75rem; font-size: 0.8rem; }
.btn-outline { background: transparent; color: var(--accent); border: 1px solid var(--border); }
.empty { color: var(--text-muted); font-size: 0.9rem; }

.admin-panels {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.panel {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 1.25rem;
}

.panel h3 { font-size: 1rem; color: #D4AF37; margin-bottom: 1rem; }
.panel .item {
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border);
}
.panel .item:last-child { border-bottom: none; }
.panel .item p { font-size: 0.9rem; margin-bottom: 0.25rem; }
.panel .item small { font-size: 0.8rem; color: var(--text-muted); }
.error-msg { background: rgba(239,68,68,0.2); color: #ef4444; padding: 0.75rem; border-radius: 6px; margin-bottom: 1rem; }
</style>
