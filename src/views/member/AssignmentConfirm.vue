<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { eventsApi } from '@/api/client'

const route = useRoute()
const router = useRouter()

const assignmentId = computed(() => route.params.id)
const isDeclinePath = computed(() => route.path.includes('/decline'))
const actionType = computed(() => isDeclinePath.value ? 'declined' : 'confirmed')

const loading = ref(true)
const success = ref(false)
const error = ref('')
const result = ref(null)

onMounted(async () => {
  try {
    const res = await eventsApi.confirmAssignment(assignmentId.value, actionType.value)
    result.value = res.assignment
    success.value = true
  } catch (e) {
    error.value = e.message || 'Une erreur est survenue.'
  } finally {
    loading.value = false
  }
})

function goToDashboard() {
  router.push({ name: 'member-dashboard' })
}
</script>

<template>
  <div class="confirm-page">
    <div v-if="loading" class="state-card">
      <i class="pi pi-spin pi-spinner icon-loading"></i>
      <h2>Traitement en cours...</h2>
    </div>

    <div v-else-if="success" class="state-card" :class="actionType === 'confirmed' ? 'card-success' : 'card-declined'">
      <i :class="actionType === 'confirmed' ? 'pi pi-check-circle' : 'pi pi-times-circle'" class="icon-result"></i>
      <h2>{{ actionType === 'confirmed' ? 'Présence confirmée !' : 'Assignation déclinée' }}</h2>
      <p v-if="result?.event">
        Événement : <strong>{{ result.event.title }}</strong>
      </p>
      <p v-if="result?.event?.date">
        Date : {{ new Date(result.event.date).toLocaleDateString('fr-FR') }}
      </p>
      <p v-if="result?.event?.lieu">
        Lieu : {{ result.event.lieu }}
      </p>
      <button @click="goToDashboard" class="btn btn-primary">Retour à mon espace</button>
    </div>

    <div v-else class="state-card card-error">
      <i class="pi pi-exclamation-triangle icon-result"></i>
      <h2>Erreur</h2>
      <p>{{ error }}</p>
      <button @click="goToDashboard" class="btn btn-primary">Retour à mon espace</button>
    </div>
  </div>
</template>

<style scoped>
.confirm-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 2rem;
}

.state-card {
  text-align: center;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 3rem 2.5rem;
  max-width: 480px;
  width: 100%;
}

.card-success { border-color: #28a745; }
.card-declined { border-color: #dc3545; }
.card-error { border-color: #dc3545; }

.icon-loading {
  font-size: 3rem;
  color: var(--accent);
  margin-bottom: 1rem;
}

.icon-result {
  font-size: 3.5rem;
  margin-bottom: 1rem;
}

.card-success .icon-result { color: #28a745; }
.card-declined .icon-result { color: #dc3545; }
.card-error .icon-result { color: #dc3545; }

.state-card h2 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.5rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.state-card p {
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  text-decoration: none;
  font-size: 0.95rem;
  margin-top: 1.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #D4AF37, #B8960E);
  color: #0f0f14;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(212, 175, 55, 0.4);
}
</style>
