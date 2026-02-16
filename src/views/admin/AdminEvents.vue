<script setup>
import { ref } from 'vue'
import { useDataStore } from '@/stores/data'
import { useAuthStore } from '@/stores/auth'

const dataStore = useDataStore()
const authStore = useAuthStore()
const form = ref({ title: '', date: '', lieu: '', description: '' })
const showForm = ref(false)
const selectedEvent = ref(null)
const assignMemberId = ref('')
const adminComment = ref({})

function addEvent() {
  if (!form.value.title || !form.value.date) return
  dataStore.addEvent(form.value)
  form.value = { title: '', date: '', lieu: '', description: '' }
  showForm.value = false
}

function assignMember() {
  if (!selectedEvent.value || !assignMemberId.value) return
  dataStore.assignMemberToEvent(selectedEvent.value.id, assignMemberId.value)
  assignMemberId.value = ''
}

function getAssignedMembers(eventId) {
  return dataStore.eventAssignments
    .filter(a => a.eventId === eventId)
    .map(a => dataStore.members.find(m => m.id === a.memberId))
    .filter(Boolean)
}

function addAdminComment(eventId) {
  const comment = adminComment.value[eventId]?.trim()
  if (!comment) return
  dataStore.addEventComment(eventId, comment, authStore.user?.id, authStore.user?.name + ' (Admin)')
  adminComment.value[eventId] = ''
}
</script>

<template>
  <div class="admin-events">
    <div class="header">
      <h1>Gestion des événements</h1>
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
      <div v-for="e in dataStore.events" :key="e.id" class="event-card">
        <div class="event-info">
          <h4>{{ e.title }}</h4>
          <p>{{ e.date }} • {{ e.lieu || '—' }}</p>
          <p v-if="e.description" class="desc">{{ e.description }}</p>
          <div v-if="getAssignedMembers(e.id).length" class="assigned">
            <strong>Assignés :</strong> {{ getAssignedMembers(e.id).map(m => m.name).join(', ') }}
          </div>
          <div v-if="new Date(e.date) < new Date()" class="comments-section">
            <div v-for="c in dataStore.eventComments.filter(c => c.eventId === e.id)" :key="c.id" class="comment">
              <strong>{{ c.userName }}</strong>: {{ c.comment }}
            </div>
            <div class="add-comment">
              <input v-model="adminComment[e.id]" @keyup.enter="addAdminComment(e.id)" placeholder="Commenter (visible par les membres)...">
              <button @click="addAdminComment(e.id)" class="btn btn-sm btn-primary">Ajouter</button>
            </div>
          </div>
        </div>
        <div class="event-actions">
          <div v-if="selectedEvent === e.id" class="assign-box">
            <select v-model="assignMemberId" class="select">
              <option value="">Sélectionner un membre</option>
              <option v-for="m in dataStore.members" :key="m.id" :value="m.id">{{ m.name }}</option>
            </select>
            <div class="btn-row">
              <button @click="assignMember" class="btn btn-sm btn-primary">Assigner</button>
              <button @click="selectedEvent = null" class="btn btn-sm btn-outline">Fermer</button>
            </div>
          </div>
          <button v-else @click="selectedEvent = e.id" class="btn btn-sm btn-outline">Assigner membre</button>
        </div>
      </div>
      <p v-if="!dataStore.events.length" class="empty">Aucun événement</p>
    </div>

    <div class="admin-panels">
      <div class="panel">
        <h3>Feedbacks</h3>
        <div v-for="f in dataStore.feedbacks" :key="f.id" class="item">
          <p>{{ f.message }}</p>
          <small>{{ f.name || 'Anonyme' }} • {{ f.contact || '' }}</small>
        </div>
        <p v-if="!dataStore.feedbacks.length" class="empty">Aucun feedback</p>
      </div>
      <div class="panel">
        <h3>Suggestions</h3>
        <div v-for="s in dataStore.suggestions" :key="s.id" class="item">
          <p>{{ s.message }}</p>
          <small>{{ s.name || 'Anonyme' }}</small>
        </div>
        <p v-if="!dataStore.suggestions.length" class="empty">Aucune suggestion</p>
      </div>
      <div class="panel">
        <h3>Partenaires (en attente)</h3>
        <div v-for="p in dataStore.partners.filter(x => x.status === 'pending')" :key="p.id" class="item">
          <p><strong>{{ p.name }}</strong> — {{ p.contact }}</p>
          <button @click="dataStore.approvePartner(p.id)" class="btn btn-sm btn-primary">Approuver</button>
        </div>
        <p v-if="!dataStore.partners.filter(x => x.status === 'pending').length" class="empty">Aucun en attente</p>
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
</style>
