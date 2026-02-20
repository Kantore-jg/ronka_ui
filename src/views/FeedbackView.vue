<script setup>
import { ref } from 'vue'
import { useDataStore } from '@/stores/data'
import { useAuthStore } from '@/stores/auth'
import { feedbackApi } from '@/api/client'

const dataStore = useDataStore()
const authStore = useAuthStore()
const form = ref({ type: 'feedback', name: '', contact: '', message: '' })
const submitted = ref(false)
const error = ref('')

async function submit() {
  if (!form.value.message) return
  error.value = ''
  const apiUrl = import.meta.env.VITE_API_URL
  
  if (apiUrl && apiUrl.length > 0) {
    try {
      await feedbackApi.create(form.value)
      submitted.value = true
      form.value = { type: 'feedback', name: '', contact: '', message: '' }
      return
    } catch (e) {
      error.value = e.message || 'Erreur lors de l\'envoi.'
      return
    }
  }
  
  if (form.value.type === 'feedback') {
    dataStore.addFeedback(form.value)
  } else {
    dataStore.addSuggestion(form.value)
  }
  submitted.value = true
  form.value = { type: 'feedback', name: '', contact: '', message: '' }
}
</script>

<template>
  <div class="feedback-page">
    <section class="feedback-hero">
      <div class="container">
        <h1>Feedback & Suggestions</h1>
        <p>Votre avis compte ! Envoyez-nous vos retours ou suggestions pour nous aider à nous améliorer.</p>
      </div>
    </section>

    <section class="feedback-content">
      <div class="container">
        <div v-if="submitted" class="success-message">
          <i class="pi pi-check-circle icon"></i>
          <h3>Message envoyé !</h3>
          <p>Merci pour votre contribution. Nous prenons chaque message en compte.</p>
        </div>

        <form v-else class="feedback-form" @submit.prevent="submit">
          <div v-if="error" class="error-msg">{{ error }}</div>
          <div class="form-group">
            <label>Type</label>
            <div class="radio-group">
              <label class="radio-label">
                <input v-model="form.type" type="radio" value="feedback">
                Feedback
              </label>
              <label class="radio-label">
                <input v-model="form.type" type="radio" value="suggestion">
                Suggestion
              </label>
            </div>
          </div>
          <div class="form-group">
            <label for="name">Nom (optionnel)</label>
            <input id="name" v-model="form.name" type="text" placeholder="Votre nom">
          </div>
          <div class="form-group">
            <label for="contact">Contact (optionnel)</label>
            <input id="contact" v-model="form.contact" type="text" placeholder="Pour vous recontacter">
          </div>
          <div class="form-group">
            <label for="message">Message *</label>
            <textarea id="message" v-model="form.message" rows="5" required placeholder="Partagez votre feedback ou suggestion..."></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Envoyer</button>
        </form>
      </div>
    </section>
  </div>
</template>

<style scoped>
.feedback-page { color: var(--text-primary); padding-bottom: 4rem; }

.feedback-hero {
  padding: 4rem 0 2rem;
  text-align: center;
  background: radial-gradient(ellipse at 50% 0%, rgba(212, 175, 55, 0.1) 0%, transparent 50%);
}

.feedback-hero h1 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 2.5rem;
  color: var(--accent);
  margin-bottom: 0.5rem;
}

.feedback-hero p { color: var(--text-secondary); }

.container { max-width: 600px; margin: 0 auto; padding: 0 2rem; }

.feedback-content { padding: 2rem 0; }

.feedback-form {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 2rem;
}

.form-group { margin-bottom: 1.25rem; }
.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--accent);
  font-weight: 500;
  font-size: 0.9rem;
}

.radio-group {
  display: flex;
  gap: 1.5rem;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: var(--text-secondary);
}

.radio-label input { accent-color: var(--accent); }

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--input-bg);
  border: 1px solid var(--input-border);
  border-radius: 6px;
  color: var(--text-primary);
  font-size: 1rem;
}

.form-group textarea { resize: vertical; min-height: 120px; }

.form-group input:focus, .form-group textarea:focus {
  outline: none;
  border-color: var(--accent);
}

.btn {
  width: 100%;
  padding: 1rem;
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

.success-message {
  text-align: center;
  padding: 3rem;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 12px;
}

.success-message .icon {
  display: inline-block;
  width: 60px;
  height: 60px;
  line-height: 60px;
  background: rgba(34, 197, 94, 0.3);
  color: #22c55e;
  border-radius: 50%;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.success-message h3 { color: #22c55e; margin-bottom: 0.5rem; }
.success-message p { color: var(--text-secondary); }
</style>
