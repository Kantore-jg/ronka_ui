<script setup>
import { ref } from 'vue'
import { useDataStore } from '@/stores/data'

const dataStore = useDataStore()
const form = ref({
  name: '',
  contact: '',
  eventType: '',
  date: '',
  lieu: '',
  description: ''
})
const submitted = ref(false)

const eventTypes = [
  'Cérémonie (mariage, funérailles...)',
  'Événement (conférence, concert...)',
  'Fête privée',
  'Autre'
]

function submit() {
  if (!form.value.name || !form.value.contact || !form.value.eventType || !form.value.date || !form.value.lieu) return
  dataStore.addBooking(form.value)
  submitted.value = true
  form.value = { name: '', contact: '', eventType: '', date: '', lieu: '', description: '' }
}
</script>

<template>
  <div class="booking-page">
    <section class="booking-hero">
      <div class="container">
        <h1>Réserver un événement</h1>
        <p>Remplissez le formulaire et notre équipe vous contactera pour confirmer votre réservation.</p>
      </div>
    </section>

    <section class="booking-form-section">
      <div class="container">
        <div v-if="submitted" class="success-message">
          <i class="pi pi-check-circle icon"></i>
          <h3>Demande envoyée !</h3>
          <p>Nous avons bien reçu votre demande et vous contacterons rapidement.</p>
        </div>

        <form v-else class="booking-form" @submit.prevent="submit">
          <div class="form-group">
            <label for="name">Nom complet *</label>
            <input id="name" v-model="form.name" type="text" required placeholder="Votre nom">
          </div>
          <div class="form-group">
            <label for="contact">Contact (téléphone ou email) *</label>
            <input id="contact" v-model="form.contact" type="text" required placeholder="+243 XXX XXX XXX">
          </div>
          <div class="form-group">
            <label for="eventType">Type d'événement *</label>
            <select id="eventType" v-model="form.eventType" required>
              <option value="">Sélectionnez...</option>
              <option v-for="t in eventTypes" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="date">Date *</label>
            <input id="date" v-model="form.date" type="date" required>
          </div>
          <div class="form-group">
            <label for="lieu">Lieu *</label>
            <input id="lieu" v-model="form.lieu" type="text" required placeholder="Ville, adresse">
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" v-model="form.description" rows="4" placeholder="Détails de l'événement..."></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Envoyer la demande</button>
        </form>
      </div>
    </section>
  </div>
</template>

<style scoped>
.booking-page { color: var(--text-primary); padding-bottom: 4rem; }

.booking-hero {
  padding: 4rem 0 2rem;
  text-align: center;
  background: radial-gradient(ellipse at 50% 0%, rgba(212, 175, 55, 0.1) 0%, transparent 50%);
}

.booking-hero h1 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 2.5rem;
  color: var(--accent);
  margin-bottom: 0.5rem;
}

.booking-hero p { color: var(--text-secondary); }

.container { max-width: 600px; margin: 0 auto; padding: 0 2rem; }

.booking-form-section { padding: 2rem 0; }

.booking-form {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--accent);
  font-weight: 500;
  font-size: 0.9rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--input-bg);
  border: 1px solid var(--input-border);
  border-radius: 6px;
  color: var(--text-primary);
  background: var(--input-bg);
  font-size: 1rem;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--accent);
}

.form-group textarea { resize: vertical; min-height: 100px; }

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

.btn-primary:hover { opacity: 0.95; }

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
