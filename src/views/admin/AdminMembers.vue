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
              <th>Nom</th>
              <th>Code membre</th>
              <th>Email</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="m in members" :key="m.id">
              <td>{{ m.name }}</td>
              <td><code>{{ m.username }}</code></td>
              <td>{{ m.email }}</td>
              <td>
                <button @click="removeMember(m.id)" class="btn-sm btn-danger">Supprimer</button>
              </td>
            </tr>
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

.members-table code {
  background: var(--input-bg);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
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
.btn-danger { background: rgba(239, 68, 68, 0.3); color: #ef4444; }
.btn-danger:hover { background: rgba(239, 68, 68, 0.5); }
.empty { color: var(--text-muted); }
.error-msg { background: rgba(239,68,68,0.2); color: #ef4444; padding: 0.75rem; border-radius: 6px; margin-bottom: 1rem; }
.success-msg { background: rgba(34,197,94,0.15); color: #22c55e; padding: 0.75rem; border-radius: 6px; margin-bottom: 1rem; font-size: 0.9rem; }

@media (max-width: 640px) {
  .form-row { grid-template-columns: 1fr; }
}
</style>
