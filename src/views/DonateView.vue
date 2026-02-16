<script setup>
import { ref } from 'vue'
import { useDataStore } from '@/stores/data'

const dataStore = useDataStore()
const form = ref({ name: '', contact: '', amount: '', method: 'mobile_money', paymentDetails: '', message: '' })
const submitted = ref(false)

const paymentMethods = [
  { value: 'mobile_money', label: 'Mobile Money (M-Pesa, Orange...)', placeholder: 'Numéro de téléphone' },
  { value: 'bank', label: 'Virement bancaire', placeholder: 'IBAN ou numéro de compte' },
  { value: 'cash', label: 'Espèces', placeholder: 'Précisez comment' }
]

function submit() {
  if (!form.value.name || !form.value.contact || !form.value.amount) return
  dataStore.addDonation(form.value)
  submitted.value = true
  form.value = { name: '', contact: '', amount: '', method: 'mobile_money', paymentDetails: '', message: '' }
}
</script>

<template>
  <div class="donate-page">
    <section class="donate-hero">
      <div class="container">
        <h1>Faire un don</h1>
        <p class="donate-desc">
          Votre soutien permet à RONKA Event Multi Service de se développer et d'offrir des formations 
          à nos jeunes membres. Chaque don compte pour notre communauté.
        </p>
      </div>
    </section>

    <section class="donate-content">
      <div class="container">
        <div v-if="submitted" class="success-message">
          <i class="pi pi-heart-fill icon"></i>
          <h3>Merci pour votre don !</h3>
          <p>Votre générosité contribue au développement de notre club.</p>
        </div>

        <form v-else class="donate-form" @submit.prevent="submit">
          <div class="form-group">
            <label for="name">Nom *</label>
            <input id="name" v-model="form.name" type="text" required placeholder="Votre nom">
          </div>
          <div class="form-group">
            <label for="contact">Contact *</label>
            <input id="contact" v-model="form.contact" type="text" required placeholder="Email ou téléphone">
          </div>
          <div class="form-group">
            <label for="amount">Montant (FC / USD) *</label>
            <input id="amount" v-model="form.amount" type="text" required placeholder="Ex: 5000 FC">
          </div>
          <div class="form-group">
            <label>Méthode de paiement *</label>
            <select v-model="form.method">
              <option v-for="m in paymentMethods" :key="m.value" :value="m.value">{{ m.label }}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="details">Détails du paiement</label>
            <input id="details" v-model="form.paymentDetails" type="text" :placeholder="paymentMethods.find(m => m.value === form.method)?.placeholder">
          </div>
          <div class="form-group">
            <label for="message">Message (optionnel)</label>
            <textarea id="message" v-model="form.message" rows="2" placeholder="Un message pour RONKA..."></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Confirmer le don</button>
        </form>

        <div class="donate-info">
          <p>Les dons sont utilisés pour : formations des membres, matériel d'événementiel, actions communautaires.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.donate-page { color: var(--text-primary); padding-bottom: 4rem; }

.donate-hero {
  padding: 4rem 0 2rem;
  text-align: center;
  background: radial-gradient(ellipse at 50% 0%, rgba(212, 175, 55, 0.1) 0%, transparent 50%);
}

.donate-hero h1 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 2.5rem;
  color: var(--accent);
  margin-bottom: 1rem;
}

.donate-desc {
  max-width: 600px;
  margin: 0 auto;
  color: var(--text-secondary);
  line-height: 1.6;
}

.container { max-width: 600px; margin: 0 auto; padding: 0 2rem; }

.donate-content { padding: 2rem 0; }

.donate-form {
  background: var(--bg-card);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
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

.form-group input:focus, .form-group select:focus, .form-group textarea:focus {
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

.success-message .icon { font-size: 3rem; display: block; margin-bottom: 0.5rem; color: #22c55e; }
.success-message h3 { color: #22c55e; margin-bottom: 0.5rem; }
.success-message p { color: var(--text-secondary); }

.donate-info {
  text-align: center;
  color: var(--text-muted);
  font-size: 0.9rem;
}
</style>
