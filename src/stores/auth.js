import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/client'

const API_URL = import.meta.env.VITE_API_URL

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isMember = computed(() => user.value?.role === 'member')
  const isPublicUser = computed(() => user.value?.role === 'public')
  
  function login(userData, token = null) {
    const data = { ...userData }
    if (token) data.token = token
    user.value = data
    localStorage.setItem('ronka_user', JSON.stringify(data))
  }
  
  function logout() {
    user.value = null
    localStorage.removeItem('ronka_user')
  }
  
  function initFromStorage() {
    const stored = localStorage.getItem('ronka_user')
    if (stored) {
      try {
        user.value = JSON.parse(stored)
      } catch {
        user.value = null
      }
    }
  }
  
  async function loginViaApi(email, password) {
    if (!API_URL) return null
    try {
      const res = await authApi.login(email, password)
      login({
        id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        username: res.user.username,
        role: res.user.role,
      }, res.token)
      return res.user
    } catch {
      return null
    }
  }
  
  async function logoutViaApi() {
    if (API_URL && user.value?.token) {
      try {
        await authApi.logout()
      } catch {}
    }
    logout()
  }
  
  return { user, isAuthenticated, isAdmin, isMember, isPublicUser, login, logout, initFromStorage, loginViaApi, logoutViaApi }
})
