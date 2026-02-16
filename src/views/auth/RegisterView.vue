<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({ name: '', email: '', password: '', confirmPassword: '' })
const error = ref('')

function register() {
  error.value = ''
  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Les mots de passe ne correspondent pas.'
    return
  }
  if (form.value.password.length < 6) {
    error.value = 'Le mot de passe doit faire au moins 6 caractères.'
    return
  }
  
  authStore.login({
    id: 'public-' + Date.now(),
    name: form.value.name,
    email: form.value.email,
    role: 'public'
  })
  router.push({ name: 'public-dashboard' })
}
</script>

<template>
  <div class="auth-card">
    <h2>Créer un compte</h2>
    <p class="subtitle">Compte public : booking, donate, partenariat, feedback</p>
    <form @submit.prevent="register" class="auth-form">
      <div v-if="error" class="error-msg">{{ error }}</div>
      <div class="form-group">
        <label for="name">Nom complet</label>
        <input id="name" v-model="form.name" type="text" required placeholder="Votre nom">
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" v-model="form.email" type="email" required placeholder="vous@exemple.com">
      </div>
      <div class="form-group">
        <label for="password">Mot de passe</label>
        <input id="password" v-model="form.password" type="password" required placeholder="Min. 6 caractères">
      </div>
      <div class="form-group">
        <label for="confirmPassword">Confirmer le mot de passe</label>
        <input id="confirmPassword" v-model="form.confirmPassword" type="password" required placeholder="••••••••">
      </div>
      <button type="submit" class="btn btn-primary">S'inscrire</button>
    </form>
    <p class="auth-link">
      Déjà un compte ? <router-link to="/auth/login">Se connecter</router-link>
    </p>
  </div>
</template>

<style scoped>
.auth-card {
  background: var(--bg-card);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 12px;
  padding: 2rem;
}

.auth-card h2 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.5rem;
  color: #D4AF37;
  text-align: center;
  margin-bottom: 0.25rem;
}

.subtitle {
  font-size: 0.85rem;
  color: var(--text-muted);
  text-align: center;
  margin-bottom: 1.5rem;
}

.auth-form .form-group { margin-bottom: 1.25rem; }
.auth-form label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.auth-form input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--input-bg);
  border: 1px solid var(--input-border);
  border-radius: 6px;
  color: var(--text-primary);
  background: var(--input-bg);
  font-size: 1rem;
}

.auth-form input:focus {
  outline: none;
  border-color: var(--accent);
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
  background: linear-gradient(135deg, var(--accent), var(--accent-hover));
  color: var(--btn-primary-text);
}

.error-msg {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.auth-link {
  margin-top: 1rem;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.auth-link a { color: #D4AF37; }
</style>
