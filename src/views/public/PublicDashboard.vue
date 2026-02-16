<script setup>
import { useAuthStore } from '@/stores/auth'
import { useDataStore } from '@/stores/data'

const authStore = useAuthStore()
const dataStore = useDataStore()

const myBookings = dataStore.bookings
const myDonations = dataStore.donations
const myPartners = dataStore.partners
</script>

<template>
  <div class="public-dashboard">
    <h1>Mon compte</h1>
    <p class="welcome">Bienvenue, {{ authStore.user?.name }}.</p>

    <div class="info-card">
      <p>Depuis cet espace, vous pouvez consulter vos réservations, dons et demandes de partenariat.</p>
      <p class="note">Note : Les données sont stockées localement pour cette démo. En production, elles seraient liées à votre compte.</p>
    </div>

    <section class="section">
      <h2>Mes réservations</h2>
      <div v-if="myBookings.length" class="list">
        <div v-for="b in [...myBookings].reverse()" :key="b.id" class="item">
          <strong>{{ b.eventType }}</strong> — {{ b.date }} à {{ b.lieu }}
        </div>
      </div>
      <p v-else class="empty">Aucune réservation.</p>
      <router-link to="/booking" class="link">Faire une réservation →</router-link>
    </section>

    <section class="section">
      <h2>Mes dons</h2>
      <div v-if="myDonations.length" class="list">
        <div v-for="d in [...myDonations].reverse()" :key="d.id" class="item">
          {{ d.amount }} — {{ d.method }}
        </div>
      </div>
      <p v-else class="empty">Aucun don.</p>
      <router-link to="/donate" class="link">Faire un don →</router-link>
    </section>

    <section class="section">
      <h2>Demandes de partenariat</h2>
      <div v-if="myPartners.length" class="list">
        <div v-for="p in [...myPartners].reverse()" :key="p.id" class="item">
          {{ p.name }} — {{ p.status === 'approved' ? 'Approuvé' : 'En attente' }}
        </div>
      </div>
      <p v-else class="empty">Aucune demande.</p>
      <router-link to="/partenaires" class="link">Devenir partenaire →</router-link>
    </section>
  </div>
</template>

<style scoped>
.public-dashboard { color: var(--text-primary); }

.public-dashboard h1 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.75rem;
  color: var(--accent);
  margin-bottom: 0.25rem;
}

.welcome { color: var(--text-secondary); margin-bottom: 1rem; }

.info-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 1.25rem;
  margin-bottom: 2rem;
}

.info-card p { margin-bottom: 0.5rem; color: var(--text-secondary); }
.info-card .note { font-size: 0.85rem; color: var(--text-muted); }

.section { margin-bottom: 2rem; }
.section h2 { font-size: 1.1rem; color: #D4AF37; margin-bottom: 1rem; }

.list { margin-bottom: 0.5rem; }
.item {
  padding: 0.75rem;
  background: var(--bg-card);
  border-radius: 6px;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.empty { color: var(--text-muted); margin-bottom: 0.5rem; }
.link { color: #D4AF37; font-size: 0.9rem; }
.link:hover { text-decoration: underline; }
</style>
