<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDataStore } from '@/stores/data'
import { partnersApi } from '@/api/client'

const dataStore = useDataStore()
const form = ref({ name: '', contact: '', email: '', company: '', message: '' })
const submitted = ref(false)
const error = ref('')
const partnersList = ref([])
const apiUrl = import.meta.env.VITE_API_URL

const approvedPartners = computed(() =>
  apiUrl && partnersList.value.length ? partnersList.value : dataStore.partners.filter(p => p.status === 'approved')
)

onMounted(async () => {
  if (apiUrl) {
    try {
      const data = await partnersApi.list()
      partnersList.value = Array.isArray(data) ? data : []
    } catch {
      partnersList.value = []
    }
  }
})

async function submit() {
  if (!form.value.name || !form.value.contact) return
  error.value = ''
  if (apiUrl) {
    try {
      await partnersApi.create(form.value)
      submitted.value = true
      form.value = { name: '', contact: '', email: '', company: '', message: '' }
      const data = await partnersApi.list()
      partnersList.value = Array.isArray(data) ? data : []
      return
    } catch (e) {
      error.value = e.message || 'Erreur lors de l\'envoi.'
      return
    }
  }
  dataStore.addPartner(form.value)
  submitted.value = true
  form.value = { name: '', contact: '', email: '', company: '', message: '' }
}
</script>

<template>
  <div class="partners-page">
    <section class="partners-hero">
      <div class="container">
        <h1>Devenir partenaire</h1>
        <p>Rejoignez RONKA Event Multi Service et soutenez une jeunesse dynamique au service de l'événementiel.</p>
      </div>
    </section>

    <section class="partners-content">
      <div class="container">
        <div v-if="submitted" class="success-message">
          <i class="pi pi-check-circle icon"></i>
          <h3>Demande envoyée !</h3>
          <p>Nous étudierons votre dossier et vous contacterons sous peu.</p>
        </div>

        <form v-else class="partners-form" @submit.prevent="submit">
          <div v-if="error" class="error-msg">{{ error }}</div>
          <div class="form-group">
            <label for="name">Nom / Raison sociale *</label>
            <input id="name" v-model="form.name" type="text" required placeholder="Votre nom ou entreprise">
          </div>
          <div class="form-group">
            <label for="contact">Contact *</label>
            <input id="contact" v-model="form.contact" type="text" required placeholder="Téléphone ou email">
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" v-model="form.email" type="email" placeholder="contact@exemple.com">
          </div>
          <div class="form-group">
            <label for="company">Entreprise / Organisation</label>
            <input id="company" v-model="form.company" type="text" placeholder="Nom de l'entreprise">
          </div>
          <div class="form-group">
            <label for="message">Message</label>
            <textarea id="message" v-model="form.message" rows="4" placeholder="Présentez-vous et vos objectifs de partenariat..."></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Envoyer la demande</button>
        </form>

        <div v-if="approvedPartners.length" class="partners-logos">
          <h2>Nos partenaires</h2>
          <div class="logos-grid">
            <div v-for="p in approvedPartners" :key="p.id" class="partner-card">
              <div class="partner-logo">{{ p.name?.charAt(0) || 'P' }}</div>
              <span>{{ p.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.partners-page { color: var(--text-primary); padding-bottom: 4rem; }

.partners-hero {
  padding: 4rem 0 2rem;
  text-align: center;
  background: radial-gradient(ellipse at 50% 0%, rgba(212, 175, 55, 0.1) 0%, transparent 50%);
}

.partners-hero h1 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 2.5rem;
  color: var(--accent);
  margin-bottom: 0.5rem;
}

.partners-hero p { color: var(--text-secondary); }

.container { max-width: 600px; margin: 0 auto; padding: 0 2rem; }

.partners-content { padding: 2rem 0; }

.partners-form {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 3rem;
}

.form-group { margin-bottom: 1.25rem; }
.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--accent);
  font-weight: 500;
  font-size: 0.9rem;
}

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

.form-group input:focus, .form-group textarea:focus {
  outline: none;
  border-color: var(--accent);
}

.error-msg {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
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
  margin-bottom: 2rem;
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

.partners-logos { margin-top: 3rem; }
.partners-logos h2 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.5rem;
  color: var(--accent);
  text-align: center;
  margin-bottom: 1.5rem;
}

.logos-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.partner-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--bg-card);
  padding: 1rem 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--border);
}

.partner-logo {
  width: 48px;
  height: 48px;
  background: rgba(212, 175, 55, 0.2);
  color: var(--accent);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
}
</style>
