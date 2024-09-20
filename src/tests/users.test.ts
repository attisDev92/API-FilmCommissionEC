import app from '../app'
import User from '../models/User'
import request from 'supertest'
import { fetchInitialUsers, invalidUser, newUser } from './helpers/userHelper'
import { IUser } from '../types'

describe('User API', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })

  it('create a new user', async (): Promise<void> => {
    const response = await request(app)
      .post('/api/users')
      .send(newUser)
      .expect(201)

    expect(response.body.email).toBe(newUser.email)
    expect(response.body.name).toBe(newUser.name)

    const user = await User.findOne({ email: newUser.email })
    expect(user).not.toBeNull()
    expect((user as IUser).name).toBe(newUser.name)
  })

  it('create a new user with invalid data', async (): Promise<void> => {
    const response = await request(app)
      .post('/api/users')
      .send(invalidUser)
      .expect(400)

    expect(response.body.error).toContain('error al crear usuario')
  })

  it('Get all users', async (): Promise<void> => {
    const initialUsers: IUser[] = await fetchInitialUsers()
    const response = await request(app).get('/api/users').expect(200)

    expect(response.body).toHaveLength(initialUsers.length)
  })
})
