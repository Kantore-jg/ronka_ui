<script setup>
const services = [
  {
    icon: '💒',
    title: 'Cérémonies',
    desc: 'Mariages, funérailles, baptêmes et événements religieux. Notre équipe assure un service impeccable et discret.',
    details: ['Service de restauration', 'Mise en place', 'Accueil des invités']
  },
  {
    icon: '🎉',
    title: 'Événements',
    desc: 'Conférences, concerts, séminaires et manifestations. Organisation et logistique complètes.',
    details: ['Logistique', 'Accueil', 'Coordination']
  },
  {
    icon: '🎂',
    title: 'Fêtes privées',
    desc: 'Anniversaires, fêtes de famille, soirées privées. Ambiance chaleureuse et professionnelle.',
    details: ['Service à table', 'Bar', 'Nettoyage']
  },
  {
    icon: '👔',
    title: 'Serveurs professionnels',
    desc: 'Mise à disposition de serveurs qualifiés pour tout type d\'événement. Formation et ponctualité garanties.',
    details: ['Service traiteur', 'Cocktails', 'Banquets']
  },
  {
    icon: '🎯',
    title: 'Organisation complète',
    desc: 'De la planification à l\'exécution, nous gérons tous les aspects de votre événement.',
    details: ['Planification', 'Coordination', 'Suivi']
  }
]
</script>

<template>
  <div class="services-page">
    <section class="services-hero">
      <div class="container">
        <h1>Nos Services</h1>
        <p>RONKA Event Multi Service met à votre disposition une équipe de jeunes dynamiques pour tous vos événements.</p>
      </div>
    </section>

    <section class="services-list">
      <div class="container">
        <div v-for="(s, i) in services" :key="i" class="service-item">
          <div class="service-icon">{{ s.icon }}</div>
          <div class="service-body">
            <h2>{{ s.title }}</h2>
            <p>{{ s.desc }}</p>
            <ul>
              <li v-for="d in s.details" :key="d">{{ d }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="services-cta">
      <div class="container">
        <p>Intéressé ? Réservez dès maintenant ou devenez partenaire.</p>
        <div class="actions">
          <router-link to="/booking" class="btn btn-primary">Réserver</router-link>
          <router-link to="/partenaires" class="btn btn-outline">Devenir partenaire</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.services-page { color: #fff; padding-bottom: 4rem; }

.services-hero {
  padding: 4rem 0;
  text-align: center;
  background: radial-gradient(ellipse at 50% 0%, rgba(212, 175, 55, 0.1) 0%, transparent 50%);
}

.services-hero h1 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 2.5rem;
  color: #D4AF37;
  margin-bottom: 0.5rem;
}

.services-hero p {
  color: rgba(255,255,255,0.8);
  max-width: 600px;
  margin: 0 auto;
}

.container { max-width: 900px; margin: 0 auto; padding: 0 2rem; }

.services-list { padding: 2rem 0; }

.service-item {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  padding: 2rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.service-item:last-of-type { border-bottom: none; }

.service-icon {
  font-size: 3rem;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 12px;
  flex-shrink: 0;
}

.service-body h2 {
  font-size: 1.5rem;
  color: #D4AF37;
  margin-bottom: 0.5rem;
}

.service-body p { color: rgba(255,255,255,0.85); margin-bottom: 0.75rem; line-height: 1.6; }
.service-body ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.service-body li {
  background: rgba(212, 175, 55, 0.15);
  color: #D4AF37;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.services-cta {
  text-align: center;
  padding: 3rem 0;
  background: rgba(212, 175, 55, 0.05);
  border-radius: 12px;
  margin: 0 2rem;
}

.services-cta p { margin-bottom: 1rem; color: rgba(255,255,255,0.9); }
.actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }

.btn {
  display: inline-block;
  padding: 0.85rem 1.75rem;
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-primary { background: linear-gradient(135deg, #D4AF37, #B8960E); color: #0f0f14; }
.btn-outline { background: transparent; color: #D4AF37; border: 1px solid rgba(212, 175, 55, 0.5); }
.btn-outline:hover { background: rgba(212, 175, 55, 0.15); }

@media (max-width: 640px) {
  .service-item { flex-direction: column; gap: 1rem; }
}
</style>
