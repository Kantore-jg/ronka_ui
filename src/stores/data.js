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
  
  return {
    bookings, donations, partners, feedbacks, suggestions, members, events,
    eventAssignments, eventComments,
    addBooking, addDonation, addPartner, addFeedback, addSuggestion,
    addMember, removeMember, addEvent, assignMemberToEvent, addEventComment, approvePartner
  }
})
