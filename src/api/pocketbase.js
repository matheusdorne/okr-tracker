import PocketBase from 'pocketbase'

export const pb = new PocketBase('http://127.0.0.1:8090')

export const getGoals = () =>
  pb.collection('goals').getFullList({ sort: '-created' })

export const getGoal = (id) =>
  pb.collection('goals').getOne(id)

export const createGoal = (data) =>
  pb.collection('goals').create(data)

export const updateGoal = (id, data) =>
  pb.collection('goals').update(id, data)

export const deleteGoal = (id) =>
  pb.collection('goals').delete(id)

export const getKRs = (goalId) =>
  pb.collection('key_results').getFullList({ filter: `goal="${goalId}"` })

export const createKR = (data) =>
  pb.collection('key_results').create(data)

export const updateKR = (id, data) =>
  pb.collection('key_results').update(id, data)

export const deleteKR = (id) =>
  pb.collection('key_results').delete(id)

export const getCheckins = (goalId) =>
  pb.collection('checkins').getFullList({ filter: `goal="${goalId}"`, sort: '-date' })

export const createCheckin = (data) =>
  pb.collection('checkins').create(data)

export const getReviews = (goalId) =>
  pb.collection('weekly_reviews').getFullList({ filter: `goal="${goalId}"`, sort: '-date' })

export const createReview = (data) =>
  pb.collection('weekly_reviews').create(data)
