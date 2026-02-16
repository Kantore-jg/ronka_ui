import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDataStore = defineStore('data', () => {
  const bookings = ref([])
  const donations = ref([])
  const partners = ref([])
  const feedbacks = ref([])
  const suggestions = ref([])
  const members = ref([
    { id: 'demo-member', name: 'Membre Test', email: 'membre@ronka.com', username: 'membre@ronka.com', password: 'membre123' }
  ])
  const events = ref([])
  const eventAssignments = ref([])
  const eventComments = ref([])
  const gallery = ref([
    { id: 1, type: 'image', url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800', title: 'Mariage élégant' },
    { id: 2, type: 'image', url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800', title: 'Réception événementielle' },
    { id: 3, type: 'image', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', title: 'Fête privée' },
    { id: 4, type: 'image', url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800', title: 'Service traiteur' },
    { id: 5, type: 'image', url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800', title: 'Conférence' },
  ])
  
  function addBooking(booking) {
    bookings.value.push({ ...booking, id: Date.now(), createdAt: new Date().toISOString() })
  }
  
  function addDonation(donation) {
    donations.value.push({ ...donation, id: Date.now(), createdAt: new Date().toISOString() })
  }
  
  function addPartner(partner) {
    partners.value.push({ ...partner, id: Date.now(), status: 'pending', createdAt: new Date().toISOString() })
  }
  
  function addFeedback(feedback) {
    feedbacks.value.push({ ...feedback, id: Date.now(), createdAt: new Date().toISOString() })
  }
  
  function addSuggestion(suggestion) {
    suggestions.value.push({ ...suggestion, id: Date.now(), createdAt: new Date().toISOString() })
  }
  
  function addMember(member) {
    const id = Date.now()
    members.value.push({ ...member, id, password: member.password || 'ronka' + id.toString().slice(-4) })
  }
  
  function removeMember(id) {
    members.value = members.value.filter(m => m.id !== id)
  }
  
  function addEvent(event) {
    events.value.push({ ...event, id: Date.now(), createdAt: new Date().toISOString() })
  }
  
  function assignMemberToEvent(eventId, memberId) {
    eventAssignments.value.push({ eventId, memberId, id: Date.now() })
  }
  
  function addEventComment(eventId, comment, userId, userName) {
    eventComments.value.push({ eventId, comment, userId, userName, id: Date.now(), createdAt: new Date().toISOString() })
  }
  
  function approvePartner(id) {
    const partner = partners.value.find(p => p.id === id)
    if (partner) partner.status = 'approved'
  }
  
  function addGalleryItem(item) {
    gallery.value.push({ ...item, id: Date.now(), type: item.type || 'image' })
  }
  
  function removeGalleryItem(id) {
    gallery.value = gallery.value.filter(g => g.id !== id)
  }
  
  return {
    bookings, donations, partners, feedbacks, suggestions, members, events,
    eventAssignments, eventComments, gallery,
    addBooking, addDonation, addPartner, addFeedback, addSuggestion,
    addMember, removeMember, addEvent, assignMemberToEvent, addEventComment, approvePartner,
    addGalleryItem, removeGalleryItem
  }
})
