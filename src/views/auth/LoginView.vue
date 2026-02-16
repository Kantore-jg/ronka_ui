<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useDataStore } from '@/stores/data'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const dataStore = useDataStore()

const form = ref({ email: '', password: '' })
const error = ref('')

const demoAccounts = [
  { role: 'admin', email: 'admin@ronka.com', password: 'admin123', name: 'Admin RONKA' },
  { role: 'member', email: 'membre@ronka.com', password: 'membre123', name: 'Membre Test' },
  { role: 'public', email: 'public@ronka.com', password: 'public123', name: 'Utilisateur Public' },
]

function login() {
  error.value = ''
  
  const demo = demoAccounts.find(
    d => d.email === form.value.email && d.password === form.value.password
  )
  
  if (demo) {
    const memberFromStore = demo.role === 'member' ? dataStore.members.find(m => m.email === demo.email || m.username === demo.email) : null
    authStore.login({
      id: memberFromStore?.id ?? demo.role,
      email: demo.email,
      name: demo.name,
      role: demo.role
    })
    const redirect = route.query.redirect
    if (redirect && redirect.startsWith('/')) {
      router.push(redirect)
    } else if (demo.role === 'admin') {
      router.push({ name: 'admin-dashboard' })
    } else if (demo.role === 'member') {
      router.push({ name: 'member-dashboard' })
    } else {
      router.push({ name: 'public-dashboard' })
    }
    return
  }

  const member = dataStore.members.find(
    m => (m.email === form.value.email || m.username === form.value.email) && m.password === form.value.password
  )
  
  if (member) {
    authStore.login({ id: member.id, email: member.email || member.username, name: member.name, role: 'member' })
    router.push({ name: 'member-dashboard' })
    return
  }

  error.value = 'Identifiants incorrects.'
}
</script>

<template>
  <div class="auth-card">
    <h2>Connexion</h2>
    <form @submit.prevent="login" class="auth-form">
      <div v-if="error" class="error-msg">{{ error }}</div>
      <div class="form-group">
        <label for="email">Email / Identifiant</label>
        <input id="email" v-model="form.email" type="text" required placeholder="admin@ronka.com">
      </div>
      <div class="form-group">
        <label for="password">Mot de passe</label>
        <input id="password" v-model="form.password" type="password" required placeholder="••••••••">
      </div>
      <button type="submit" class="btn btn-primary">Se connecter</button>
    </form>
    <p class="demo-info">
      Comptes démo : admin@ronka.com / admin123 • membre@ronka.com / membre123 • public@ronka.com / public123
    </p>
    <p class="auth-link">
      Pas de compte ? <router-link to="/auth/register">Créer un compte public</router-link>
    </p>
  </div>
</template>

<style scoped>
.auth-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 12px;
  padding: 2rem;
}

.auth-card h2 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.5rem;
  color: #D4AF37;
  text-align: center;
  margin-bottom: 1.5rem;
}

.auth-form .form-group { margin-bottom: 1.25rem; }
.auth-form label {
  display: block;
  margin-bottom: 0.5rem;
  color: rgba(255,255,255,0.9);
  font-size: 0.9rem;
}

.auth-form input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 6px;
  color: #fff;
  font-size: 1rem;
}

.auth-form input:focus {
  outline: none;
  border-color: #D4AF37;
}

.btn {
  width: 100%;
  padding: 0.85rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #D4AF37, #B8960E);
  color: #0f0f14;
}

.error-msg {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.demo-info {
  margin-top: 1rem;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.5);
  text-align: center;
}

.auth-link {
  margin-top: 1rem;
  text-align: center;
  color: rgba(255,255,255,0.8);
  font-size: 0.9rem;
}

.auth-link a { color: #D4AF37; }
</style>
