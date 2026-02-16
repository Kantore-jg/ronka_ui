<script setup>
</script>

<template>
  <div class="home">
    <section class="hero">
      <div class="hero-content">
        <h1>RONKA Event Multi Service</h1>
        <p class="hero-tagline">30-50 jeunes au service de vos moments inoubliables</p>
        <p class="hero-desc">Cérémonies, événements, fêtes — nous fournissons serveurs et organisation pour faire de chaque occasion un succès.</p>
        <div class="hero-actions">
          <router-link to="/booking" class="btn btn-primary">Réserver un événement</router-link>
          <router-link to="/donate" class="btn btn-secondary">Faire un don</router-link>
          <router-link to="/partenaires" class="btn btn-outline">Devenir partenaire</router-link>
        </div>
      </div>
      <div class="hero-decoration"></div>
    </section>

    <section class="mission">
      <div class="container">
        <h2>Notre mission</h2>
        <p class="mission-text">
          RONKA Event Multi Service est un club de 30-50 jeunes dynamiques dédiés à l'excellence événementielle. 
          Nous accompagnons vos cérémonies, vos événements et vos fêtes avec professionnalisme et passion, 
          en mettant à votre disposition des serveurs qualifiés et une organisation irréprochable.
        </p>
      </div>
    </section>

    <section class="quick-services">
      <div class="container">
        <h2>Nos services</h2>
        <div class="services-grid">
          <div class="service-card">
            <span class="icon">💒</span>
            <h3>Cérémonies</h3>
            <p>Mariages, funérailles et événements religieux</p>
          </div>
          <div class="service-card">
            <span class="icon">🎉</span>
            <h3>Événements</h3>
            <p>Conférences, concerts et manifestations</p>
          </div>
          <div class="service-card">
            <span class="icon">🎂</span>
            <h3>Fêtes privées</h3>
            <p>Anniversaires, fêtes de famille</p>
          </div>
          <div class="service-card">
            <span class="icon">👔</span>
            <h3>Service traiteur</h3>
            <p>Mise à disposition de serveurs professionnels</p>
          </div>
        </div>
        <router-link to="/services" class="btn btn-outline center">Voir tous nos services</router-link>
      </div>
    </section>

    <section class="cta">
      <div class="container">
        <h2>Prêt à organiser votre événement ?</h2>
        <div class="cta-buttons">
          <router-link to="/booking" class="btn btn-primary">Réserver</router-link>
          <router-link to="/auth/login" class="btn btn-outline">Se connecter</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home { color: #fff; }

.hero {
  min-height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: radial-gradient(ellipse at 50% 30%, rgba(212, 175, 55, 0.12) 0%, transparent 55%),
              linear-gradient(180deg, #0f0f14 0%, #16161d 100%);
  overflow: hidden;
}

.hero-decoration {
  position: absolute;
  top: -50%;
  right: -20%;
  width: 60%;
  height: 150%;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.06) 0%, transparent 60%);
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 700px;
  padding: 2rem;
}

.hero h1 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  color: #D4AF37;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.hero-tagline {
  font-size: 1.25rem;
  color: rgba(255,255,255,0.9);
  margin-bottom: 0.75rem;
}

.hero-desc {
  color: rgba(255,255,255,0.7);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  display: inline-block;
  padding: 0.85rem 1.75rem;
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  font-size: 0.95rem;
}

.btn-primary {
  background: linear-gradient(135deg, #D4AF37, #B8960E);
  color: #0f0f14;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(212, 175, 55, 0.4);
}

.btn-secondary {
  background: rgba(212, 175, 55, 0.2);
  color: #D4AF37;
  border: 1px solid rgba(212, 175, 55, 0.5);
}

.btn-outline {
  background: transparent;
  color: #D4AF37;
  border: 1px solid rgba(212, 175, 55, 0.5);
}

.btn-outline:hover, .btn-secondary:hover {
  background: rgba(212, 175, 55, 0.15);
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 2rem;
}

.mission {
  padding: 5rem 0;
  background: rgba(212, 175, 55, 0.03);
}

.mission h2, .quick-services h2, .cta h2 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 2rem;
  color: #D4AF37;
  text-align: center;
  margin-bottom: 1.5rem;
}

.mission-text {
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
  color: rgba(255,255,255,0.85);
  line-height: 1.7;
}

.quick-services { padding: 5rem 0; }

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.service-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(212, 175, 55, 0.15);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s;
}

.service-card:hover {
  transform: translateY(-4px);
  border-color: rgba(212, 175, 55, 0.4);
  box-shadow: 0 8px 30px rgba(0,0,0,0.3);
}

.service-card .icon { font-size: 2.5rem; display: block; margin-bottom: 0.5rem; }
.service-card h3 { font-size: 1.1rem; margin-bottom: 0.25rem; color: #fff; }
.service-card p { font-size: 0.9rem; color: rgba(255,255,255,0.6); }
.center { display: block; text-align: center; margin: 0 auto; }

.cta {
  padding: 5rem 0;
  background: radial-gradient(ellipse at center, rgba(212, 175, 55, 0.08) 0%, transparent 70%);
}

.cta h2 { margin-bottom: 1.5rem; }
.cta-buttons { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
</style>
