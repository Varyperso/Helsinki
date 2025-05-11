const { test, before, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const { User } = require('../db')
const supertest = require('supertest')
const helper = require('./tests_helper')
const app = require('../app')

const api = supertest(app)

let token
before(async () => {

  const response = await api
    .post('/api/login') 
    .send({
      username: 'abc',
      password: 'hhytr6'
    })
  token = response.body.token
  console.log('Token:', token)
}) // not needed here because we dont need token to register a new user

test('creation succeeds with a fresh username', async () => {
  const usersAtStart = await helper.usersInDb()
  const newUser = {
    username: 'abcd',
    name: 'artikika',
    password: 'hhytr6',
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await helper.usersInDb()
  assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

  const usernames = usersAtEnd.map(u => u.username)
  assert(usernames.includes(newUser.username))
})

test('creation fails with a shorter than 3 characters username', async () => {
  const usersAtStart = await helper.usersInDb()
  const newUser = {
    username: 'ab',
    name: 'artikika',
    password: 'hhytr6',
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await helper.usersInDb()
  assert.strictEqual(usersAtEnd.length, usersAtStart.length)

})

after(async () => {
  await User.findOneAndDelete({ username: 'abcd' })
  await mongoose.connection.close()
})

