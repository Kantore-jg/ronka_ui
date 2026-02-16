import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isMember = computed(() => user.value?.role === 'member')
  const isPublicUser = computed(() => user.value?.role === 'public')
  
  function login(userData) {
    user.value = userData
    localStorage.setItem('ronka_user', JSON.stringify(userData))
  }
  
  function logout() {
    user.value = null
    localStorage.removeItem('ronka_user')
  }
  
  function initFromStorage() {
    const stored = localStorage.getItem('ronka_user')
    if (stored) {
      user.value = JSON.parse(stored)
    }
  }
  
  return { user, isAuthenticated, isAdmin, isMember, isPublicUser, login, logout, initFromStorage }
})
