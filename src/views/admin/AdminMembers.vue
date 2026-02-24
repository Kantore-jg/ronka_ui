<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDataStore } from '@/stores/data'
import { useAuthStore } from '@/stores/auth'
import { membersApi } from '@/api/client'

const dataStore = useDataStore()
const authStore = useAuthStore()
const form = ref({ name: '', email: '' })
const showForm = ref(false)
const apiUrl = import.meta.env.VITE_API_URL
const apiMembers = ref([])
const error = ref('')
const successMsg = ref('')
const loading = ref(false)
const expandedMemberId = ref(null)
const memberAssignments = ref({})
const loadingAssignments = ref(false)

const members = computed(() =>
  (apiUrl && authStore.user?.token) ? apiMembers.value : dataStore.members
)

onMounted(async () => {
  if (apiUrl && authStore.user?.token) {
    try {
      const data = await membersApi.list()
      apiMembers.value = Array.isArray(data) ? data : []
    } catch (e) {
      error.value = e.message || 'Erreur chargement'
    }
  }
})

async function toggleMemberDetail(memberId) {
  if (expandedMemberId.value === memberId) {
    expandedMemberId.value = null
    return
  }
  expandedMemberId.value = memberId
  if (memberAssignments.value[memberId]) return
  if (apiUrl && authStore.user?.token) {
    loadingAssignments.value = true
    try {
      const data = await membersApi.assignments(memberId)
      memberAssignments.value[memberId] = Array.isArray(data) ? data : []
    } catch (e) {
      memberAssignments.value[memberId] = []
    } finally {
      loadingAssignments.value = false
    }
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

async function addMember() {
  if (!form.value.name || !form.value.email) return
  error.value = ''
  successMsg.value = ''
  loading.value = true
  if (apiUrl && authStore.user?.token) {
    try {
      const res = await membersApi.create({
        name: form.value.name,
        email: form.value.email,
      })
      form.value = { name: '', email: '' }
      showForm.value = false
      const data = await membersApi.list()
      apiMembers.value = Array.isArray(data) ? data : []
      successMsg.value = `Membre créé avec le code ${res.code || res.member?.username}. Un email avec les identifiants a été envoyé à ${res.member?.email}.`
    } catch (e) {
      error.value = e.message || 'Erreur lors de la création'
    } finally {
      loading.value = false
    }
    return
  }
  const member = {
    name: form.value.name,
    email: form.value.email,
    username: 'Ronka-' + new Date().getFullYear() + '-' + String(dataStore.members.length + 1).padStart(4, '0'),
  }
  dataStore.addMember(member)
  form.value = { name: '', email: '' }
  showForm.value = false
  loading.value = false
}

async function removeMember(id) {
  if (!confirm('Supprimer ce membre ?')) return
  successMsg.value = ''
  if (apiUrl && authStore.user?.token) {
    try {
      await membersApi.delete(id)
      apiMembers.value = apiMembers.value.filter(m => m.id !== id)
      if (expandedMemberId.value === id) expandedMemberId.value = null
    } catch (e) {
      error.value = e.message || 'Erreur suppression'
    }
    return
  }
  dataStore.removeMember(id)
}
</script>

<template>
  <div class="admin-members">
    <div class="header">
      <h1>Gestion des membres</h1>
      <button @click="showForm = !showForm" class="btn btn-primary">
        {{ showForm ? 'Annuler' : '+ Ajouter un membre' }}
      </button>
    </div>

    <div v-if="successMsg" class="success-msg">{{ successMsg }}</div>

    <div v-if="showForm" class="add-form">
      <h3>Nouveau membre</h3>
      <p class="hint">Saisissez le nom et l'email du membre. Un code unique sera généré automatiquement (ex: Ronka-2026-0001) et un email avec les identifiants de connexion sera envoyé au membre.</p>
      <form @submit.prevent="addMember">
        <div class="form-row">
          <div class="form-group">
            <label>Nom complet *</label>
            <input v-model="form.name" type="text" required placeholder="Jean Dupont">
          </div>
          <div class="form-group">
            <label>Email *</label>
            <input v-model="form.email" type="email" required placeholder="jean@email.com">
          </div>
        </div>
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Création en cours...' : 'Créer le compte membre' }}
        </button>
      </form>
    </div>

    <div class="members-list">
      <p v-if="error" class="error-msg">{{ error }}</p>
      <h3>Membres du club ({{ members.length }})</h3>
      <div v-if="members.length" class="table-wrap">
        <table class="members-table">
          <thead>
            <tr>
              <th></th>
              <th>Nom</th>
              <th>Code membre</th>
              <th>Email</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <template v-for="m in members" :key="m.id">
              <tr :class="{ 'row-expanded': expandedMemberId === m.id }">
                <td>
                  <button @click="toggleMemberDetail(m.id)" class="btn-expand" :title="expandedMemberId === m.id ? 'Masquer' : 'Voir les événements'">
                    <i :class="expandedMemberId === m.id ? 'pi pi-chevron-down' : 'pi pi-chevron-right'"></i>
                  </button>
                </td>
                <td>{{ m.name }}</td>
                <td><code>{{ m.username }}</code></td>
                <td>{{ m.email }}</td>
                <td>
                  <button @click="removeMember(m.id)" class="btn-icon btn-danger" title="Supprimer">
                    <i class="pi pi-trash"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="expandedMemberId === m.id" class="detail-row">
                <td colspan="5">
                  <div class="assignments-panel">
                    <h4><i class="pi pi-calendar"></i> Événements assignés</h4>
                    <div v-if="loadingAssignments" class="loading-text">
                      <i class="pi pi-spin pi-spinner"></i> Chargement...
                    </div>
                    <div v-else-if="memberAssignments[m.id]?.length" class="assignments-list">
                      <div v-for="a in memberAssignments[m.id]" :key="a.id" class="assignment-item">
                        <div class="assignment-info">
                          <strong>{{ a.event?.title || 'Événement supprimé' }}</strong>
                          <span class="assignment-meta">
                            {{ formatDate(a.event?.date) }}
                            <template v-if="a.event?.lieu"> • {{ a.event.lieu }}</template>
                          </span>
                        </div>
                        <div class="assignment-status">
                          <span class="status-badge" :class="getStatusClass(a.status)">
                            <i :class="a.status === 'confirmed' ? 'pi pi-check' : a.status === 'declined' ? 'pi pi-times' : 'pi pi-clock'"></i>
                            {{ getStatusLabel(a.status) }}
                          </span>
                          <span v-if="a.confirmed_at" class="confirmed-date">
                            {{ formatDate(a.confirmed_at) }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p v-else class="empty-assignments">Aucun événement assigné.</p>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <p v-else class="empty">Aucun membre. Ajoutez-en un.</p>
    </div>
  </div>
</template>

<style scoped>
.admin-members { color: var(--text-primary); }

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.admin-members h1 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.75rem;
  color: #D4AF37;
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

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
.form-group label { display: block; margin-bottom: 0.35rem; font-size: 0.9rem; color: #D4AF37; }
.form-group input {
  width: 100%;
  padding: 0.6rem 0.75rem;
  background: var(--input-bg);
  border: 1px solid var(--input-border);
  border-radius: 6px;
  color: var(--text-primary);
}

.members-list h3 { font-size: 1rem; margin-bottom: 1rem; color: var(--text-secondary); }
.table-wrap { overflow-x: auto; }
.members-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--bg-card);
  border-radius: 8px;
  overflow: hidden;
}

.members-table th,
.members-table td {
  padding: 0.85rem 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border);
}

.members-table th {
  background: rgba(212, 175, 55, 0.1);
  color: #D4AF37;
  font-weight: 600;
  font-size: 0.9rem;
}

.members-table th:first-child { width: 40px; }

.members-table code {
  background: var(--input-bg);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
}

.row-expanded { background: rgba(212, 175, 55, 0.05); }

.btn-expand {
  background: transparent;
  border: none;
  color: var(--accent);
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  transition: background 0.2s;
}

.btn-expand:hover { background: rgba(212, 175, 55, 0.15); }

.btn-icon {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.4rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  transition: all 0.2s;
}

.btn-danger { color: #ef4444; }
.btn-danger:hover { background: rgba(239, 68, 68, 0.2); }

.detail-row td {
  padding: 0 !important;
  border-bottom: 2px solid var(--border);
}

.assignments-panel {
  padding: 1rem 1.5rem 1.25rem;
  background: rgba(212, 175, 55, 0.03);
}

.assignments-panel h4 {
  font-size: 0.9rem;
  color: var(--accent);
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.loading-text {
  color: var(--text-muted);
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.assignments-list { display: flex; flex-direction: column; gap: 0.5rem; }

.assignment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.65rem 0.85rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  gap: 1rem;
  flex-wrap: wrap;
}

.assignment-info { display: flex; flex-direction: column; gap: 0.15rem; }
.assignment-info strong { font-size: 0.9rem; color: var(--text-primary); }
.assignment-meta { font-size: 0.8rem; color: var(--text-muted); }

.assignment-status { display: flex; align-items: center; gap: 0.75rem; }

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.65rem;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 600;
}

.status-confirmed { background: rgba(34, 197, 94, 0.15); color: #22c55e; }
.status-declined { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
.status-pending { background: rgba(234, 179, 8, 0.15); color: #eab308; }

.confirmed-date { font-size: 0.75rem; color: var(--text-muted); }

.empty-assignments { color: var(--text-muted); font-size: 0.85rem; margin: 0; }

.btn {
  padding: 0.6rem 1.25rem;
  border-radius: 6px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-primary { background: linear-gradient(135deg, var(--accent), var(--accent-hover)); color: var(--btn-primary-text); }
.empty { color: var(--text-muted); }
.error-msg { background: rgba(239,68,68,0.2); color: #ef4444; padding: 0.75rem; border-radius: 6px; margin-bottom: 1rem; }
.success-msg { background: rgba(34,197,94,0.15); color: #22c55e; padding: 0.75rem; border-radius: 6px; margin-bottom: 1rem; font-size: 0.9rem; }

@media (max-width: 640px) {
  .form-row { grid-template-columns: 1fr; }
  .assignment-item { flex-direction: column; align-items: flex-start; }
}
</style>
