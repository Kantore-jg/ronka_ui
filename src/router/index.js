import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import MainLayout from '@/layouts/MainLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        { path: '', name: 'home', component: () => import('@/views/HomeView.vue'), meta: { title: 'Accueil' } },
        { path: 'services', name: 'services', component: () => import('@/views/ServicesView.vue'), meta: { title: 'Nos Services' } },
        { path: 'booking', name: 'booking', component: () => import('@/views/BookingView.vue'), meta: { title: 'Réserver' } },
        { path: 'donate', name: 'donate', component: () => import('@/views/DonateView.vue'), meta: { title: 'Faire un Don' } },
        { path: 'partenaires', name: 'partenaires', component: () => import('@/views/PartnersView.vue'), meta: { title: 'Partenaires' } },
        { path: 'feedback', name: 'feedback', component: () => import('@/views/FeedbackView.vue'), meta: { title: 'Feedback & Suggestions' } },
        { path: 'galerie', name: 'galerie', component: () => import('@/views/GalleryView.vue'), meta: { title: 'Galerie' } },
      ]
    },
    {
      path: '/auth',
      component: AuthLayout,
      children: [
        { path: 'login', name: 'login', component: () => import('@/views/auth/LoginView.vue'), meta: { title: 'Connexion', guest: true } },
        { path: 'register', name: 'register', component: () => import('@/views/auth/RegisterView.vue'), meta: { title: 'Inscription', guest: true } },
      ]
    },
    {
      path: '/admin',
      component: DashboardLayout,
      meta: { requiresAuth: true, role: 'admin' },
      children: [
        { path: '', name: 'admin-dashboard', component: () => import('@/views/admin/AdminDashboard.vue'), meta: { title: 'Tableau de bord Admin' } },
        { path: 'members', name: 'admin-members', component: () => import('@/views/admin/AdminMembers.vue'), meta: { title: 'Gestion des membres' } },
        { path: 'events', name: 'admin-events', component: () => import('@/views/admin/AdminEvents.vue'), meta: { title: 'Gestion des événements' } },
        { path: 'bookings', name: 'admin-bookings', component: () => import('@/views/admin/AdminBookings.vue'), meta: { title: 'Réservations' } },
        { path: 'galerie', name: 'admin-galerie', component: () => import('@/views/admin/AdminGallery.vue'), meta: { title: 'Galerie' } },
      ]
    },
    {
      path: '/member',
      component: DashboardLayout,
      meta: { requiresAuth: true, role: 'member' },
      children: [
        { path: '', name: 'member-dashboard', component: () => import('@/views/member/MemberDashboard.vue'), meta: { title: 'Mon espace' } },
      ]
    },
    {
      path: '/account',
      component: DashboardLayout,
      meta: { requiresAuth: true, role: 'public' },
      children: [
        { path: '', name: 'public-dashboard', component: () => import('@/views/public/PublicDashboard.vue'), meta: { title: 'Mon compte' } },
      ]
    },
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  authStore.initFromStorage()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.meta.role && authStore.user?.role !== to.meta.role) {
    if (authStore.isAdmin) next({ name: 'admin-dashboard' })
    else if (authStore.isMember) next({ name: 'member-dashboard' })
    else if (authStore.isPublicUser) next({ name: 'public-dashboard' })
    else next({ name: 'home' })
  } else if (to.meta.guest && authStore.isAuthenticated) {
    if (authStore.isAdmin) next({ name: 'admin-dashboard' })
    else if (authStore.isMember) next({ name: 'member-dashboard' })
    else next({ name: 'public-dashboard' })
  } else {
    document.title = to.meta.title ? `${to.meta.title} | RONKA Event Multi Service` : 'RONKA Event Multi Service'
    next()
  }
})

export default router
