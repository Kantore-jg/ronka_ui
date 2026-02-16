<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useDataStore } from '@/stores/data'

const authStore = useAuthStore()
const dataStore = useDataStore()
const newComment = ref({})

const myAssignments = computed(() => {
  const myId = authStore.user?.id
  if (!myId) return []
  return dataStore.eventAssignments
    .filter(a => a.memberId === myId)
    .map(a => dataStore.events.find(e => e.id === a.eventId))
    .filter(Boolean)
})

const pastEvents = computed(() => 
  dataStore.events.filter(e => new Date(e.date) < new Date())
)

const eventComments = computed(() => dataStore.eventComments)

function addComment(eventId) {
  const comment = newComment.value[eventId]?.trim()
  if (!comment) return
  dataStore.addEventComment(eventId, comment, authStore.user?.id, authStore.user?.name)
  newComment.value[eventId] = ''
}
</script>

<template>
  <div class="member-dashboard">
    <h1>Mon espace membre</h1>
    <p class="welcome">Bienvenue, {{ authStore.user?.name }}.</p>

    <section class="section">
      <h2>Mes événements assignés</h2>
      <div v-if="myAssignments.length" class="events-list">
        <div v-for="e in myAssignments" :key="e.id" class="event-card">
          <h3>{{ e.title }}</h3>
          <p>{{ e.date }} • {{ e.lieu || '—' }}</p>
          <p v-if="e.description" class="desc">{{ e.description }}</p>
        </div>
      </div>
      <p v-else class="empty">Aucun événement assigné pour le moment.</p>
    </section>

    <section class="section">
      <h2>Événements passés (commenter)</h2>
      <div v-if="pastEvents.length" class="events-list">
        <div v-for="e in pastEvents" :key="e.id" class="event-card">
          <h3>{{ e.title }}</h3>
          <p>{{ e.date }} • {{ e.lieu || '—' }}</p>
          <div class="comments">
            <div v-for="c in eventComments.filter(c => c.eventId === e.id)" :key="c.id" class="comment">
              <strong>{{ c.userName }}</strong>: {{ c.comment }}
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

.section {
  margin-bottom: 2rem;
}

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

.event-card h3 { font-size: 1rem; color: var(--text-primary); margin-bottom: 0.25rem; }
.event-card p { font-size: 0.9rem; color: var(--text-secondary); }
.desc { font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem; }
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
  background: var(--input-bg);
  font-size: 0.9rem;
}
.btn { padding: 0.5rem 1rem; border-radius: 6px; font-weight: 600; border: none; cursor: pointer; }
.btn-sm { font-size: 0.85rem; }
.btn-primary { background: linear-gradient(135deg, #D4AF37, #B8960E); color: #0f0f14; }
.hint { font-size: 0.8rem; color: var(--text-muted); margin-top: 0.5rem; }
.empty { color: var(--text-muted); }
</style>
