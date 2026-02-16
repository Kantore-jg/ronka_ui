<script setup>
import { ref } from 'vue'
import { useDataStore } from '@/stores/data'

const dataStore = useDataStore()
const form = ref({ name: '', email: '', username: '', password: '' })
const showForm = ref(false)

function addMember() {
  if (!form.value.name || !form.value.username) return
  const member = {
    name: form.value.name,
    email: form.value.email || form.value.username + '@ronka.com',
    username: form.value.username,
    password: form.value.password || 'ronka' + Date.now().toString().slice(-4)
  }
  dataStore.addMember(member)
  form.value = { name: '', email: '', username: '', password: '' }
  showForm.value = false
}

function removeMember(id) {
  if (confirm('Supprimer ce membre ?')) dataStore.removeMember(id)
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

    <div v-if="showForm" class="add-form">
      <h3>Nouveau membre</h3>
      <p class="hint">L'admin crée le compte. Le membre reçoit ses identifiants (username + password).</p>
      <form @submit.prevent="addMember">
        <div class="form-row">
          <div class="form-group">
            <label>Nom complet *</label>
            <input v-model="form.name" type="text" required placeholder="Jean Dupont">
          </div>
          <div class="form-group">
            <label>Username (identifiant) *</label>
            <input v-model="form.username" type="text" required placeholder="jean.dupont">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Email</label>
            <input v-model="form.email" type="email" placeholder="jean@email.com">
          </div>
          <div class="form-group">
            <label>Mot de passe (optionnel, généré si vide)</label>
            <input v-model="form.password" type="text" placeholder="ronka1234">
          </div>
        </div>
        <button type="submit" class="btn btn-primary">Créer le compte membre</button>
      </form>
    </div>

    <div class="members-list">
      <h3>Membres du club ({{ dataStore.members.length }})</h3>
      <div v-if="dataStore.members.length" class="table-wrap">
        <table class="members-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Identifiant</th>
              <th>Mot de passe</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="m in dataStore.members" :key="m.id">
              <td>{{ m.name }}</td>
              <td>{{ m.username || m.email }}</td>
              <td><code>{{ m.password }}</code></td>
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
.admin-members { color: #fff; }

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
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.add-form h3 { font-size: 1rem; margin-bottom: 0.5rem; color: #fff; }
.hint { font-size: 0.85rem; color: rgba(255,255,255,0.6); margin-bottom: 1rem; }

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
.form-group label { display: block; margin-bottom: 0.35rem; font-size: 0.9rem; color: #D4AF37; }
.form-group input {
  width: 100%;
  padding: 0.6rem 0.75rem;
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 6px;
  color: #fff;
}

.members-list h3 { font-size: 1rem; margin-bottom: 1rem; color: rgba(255,255,255,0.9); }
.table-wrap { overflow-x: auto; }
.members-table {
  width: 100%;
  border-collapse: collapse;
  background: rgba(255,255,255,0.02);
  border-radius: 8px;
  overflow: hidden;
}

.members-table th,
.members-table td {
  padding: 0.85rem 1rem;
  text-align: left;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.members-table th {
  background: rgba(212, 175, 55, 0.1);
  color: #D4AF37;
  font-weight: 600;
  font-size: 0.9rem;
}

.members-table code {
  background: rgba(0,0,0,0.3);
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

.btn-primary { background: linear-gradient(135deg, #D4AF37, #B8960E); color: #0f0f14; }
.btn-sm { padding: 0.4rem 0.75rem; font-size: 0.8rem; }
.btn-danger { background: rgba(239, 68, 68, 0.3); color: #ef4444; }
.btn-danger:hover { background: rgba(239, 68, 68, 0.5); }
.empty { color: rgba(255,255,255,0.5); }

@media (max-width: 640px) {
  .form-row { grid-template-columns: 1fr; }
}
</style>
