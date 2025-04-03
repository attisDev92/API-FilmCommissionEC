import app from '../app'
import User from '../models/User'
import request from 'supertest'
import {
  newUser,
  invalidUser,
  createInitialUser,
  createEmailValidationToken,
  fetchInitialUsers,
} from './helpers/userHelper'
import { UserType, UserLoginPayload } from '../types/userTypes'
import { loginUser } from '../services/users.service'
import { initialUsers } from './helpers/userHelper'

describe('User API', (): void => {
  beforeEach(async (): Promise<void> => {
    await User.deleteMany({})
  })

  it('create a new user', async (): Promise<void> => {
    const response = await request(app)
      .post('/api/users')
      .send(newUser)
      .expect(201)

    expect(response.body.data.email).toBe(newUser.email)
    expect(response.body.data.username).toBe(newUser.username)

    const user = await User.findOne({ email: newUser.email })
    expect(user).not.toBeNull()
    expect(user?.username).toBe(newUser.username)
  })

  it('create user already exist', async (): Promise<void> => {
    const user = await createInitialUser(newUser)

    const response = await request(app)
      .post('/api/users')
      .send({ username: user.username, email: user.email })
      .expect(400)

    expect(response.body).toEqual({
      status: 400,
      statusMsg: expect.stringContaining('Bad Request'),
      error: expect.stringContaining(
        'Usuario o email ya se encuentra registrado',
      ),
    })
  })

  it('create a new user with invalid data', async (): Promise<void> => {
    const response = await request(app)
      .post('/api/users')
      .send(invalidUser)
      .expect(400)

    expect(response.body).toEqual({
      status: 400,
      statusMsg: expect.stringContaining('Bad Request'),
      error: expect.stringContaining('Datos incorrectos'),
    })
  })

  it('get email validation token', async (): Promise<void> => {
    const user = await createInitialUser(newUser)
    const emailToken = await createEmailValidationToken(user)

    const response = await request(app)
      .get(`/api/users/auth/${emailToken}`)
      .send()
      .expect(202)
    expect(response.body.success).toEqual(true)
  })

  it('get validation token with invalid param', async (): Promise<void> => {
    await createInitialUser(newUser)
    const invalidEmailToken = 'euebnbasajshjkjjdaksd'

    const response = await request(app)
      .get(`/api/users/auth/${invalidEmailToken}`)
      .send()
      .expect(400)

    expect(response.body).toEqual({
      status: 400,
      statusMsg: expect.stringContaining('Bad Request'),
      error: expect.stringContaining(
        'El recurso al que intenta acceder no existe',
      ),
    })
  })

  it('change validation status', async (): Promise<void> => {
    const user = await createInitialUser(newUser)

    const response = await request(app)
      .post('/api/users/auth')
      .send({ username: user.username })
      .expect(202)

    expect(response.body.success).toBe(true)
    expect(response.body.data.username).toBe(user.username)
  })

  it('change validation status with invalid data', async (): Promise<void> => {
    await createInitialUser(newUser)

    const response = await request(app)
      .post('/api/users/auth')
      .send({ username: 'invalid username' })
      .expect(400)

    expect(response.body).toEqual({
      status: 400,
      statusMsg: expect.stringContaining('Bad Request'),
      error: expect.stringContaining(
        'El recurso al que intenta acceder no existe',
      ),
    })
  })

  it('Login user', async (): Promise<void> => {
    const initalUser: UserType = await createInitialUser(newUser)

    const response = await request(app)
      .post('/api/users/login')
      .send({ email: newUser.email, password: newUser.password })
      .expect(202)

    expect(response.body.success).toBe(true)
    expect(response.body.data.username).toBe(initalUser.username)
    expect(response.body.data.token).not.toBeNull()
  })

  it('login with invalid credentials', async (): Promise<void> => {
    const response = await request(app)
      .post('/api/users/login')
      .send({ email: 'test@mail.com', password: 'wrong test' })
      .expect(400)

    expect(response.body.error).toContain('Usuario y/o contraseña invalidos')
  })

  it('validate token', async (): Promise<void> => {
    const user: UserType = await createInitialUser(newUser)
    const tokenUser: UserLoginPayload = await loginUser({
      username: newUser.username,
      password: newUser.password,
    })

    const response = await request(app)
      .get('/api/users/login')
      .set('Authorization', `Bearer ${tokenUser.userToken}`)
      .send()
      .expect(202)

    expect(user.username).toBe(tokenUser.username)
    expect(response.body.data.username).toBe(user.username)
  })

  it('valid token without token', async (): Promise<void> => {
    const user: UserType = await createInitialUser(newUser)

    const response = await request(app)
      .get('/api/users/login')
      .send()
      .expect(403)

    expect(response.body.status).toBe(403)
    expect(response.body.error).toEqual('Token invalido, sin autorización')
    expect(response.body).not.toContain(user.username)
  })

  it('valid token with invalid token', async (): Promise<void> => {
    const user: UserType = await createInitialUser(newUser)
    const invalidToken = 'enjkkdsjkjjfsldfjskjdfjklsjdflkjsdf'

    const response = await request(app)
      .get('/api/users/login')
      .set('Authorization', `Bearer ${invalidToken}`)
      .send()
      .expect(403)

    expect(response.body.status).toBe(403)
    expect(response.body.error).toEqual('Token invalido, sin autorización')
    expect(response.body).not.toContain(user.username)
  })

  it('Get all users', async (): Promise<void> => {
    const users: UserType[] = await fetchInitialUsers()

    const tokenUser: UserLoginPayload = await loginUser({
      username: initialUsers[1].username,
      password: initialUsers[1].password,
    })

    const response = await request(app)
      .get('/api/users/')
      .set('Authorization', `Bearer ${tokenUser.userToken}`)
      .send()
      .expect(200)

    expect(response.body.success).toBe(true)
    expect(response.body.data).toHaveLength(users.length)
  })

  it('Get all users with invalid role user', async (): Promise<void> => {
    await fetchInitialUsers()

    const tokenUser: UserLoginPayload = await loginUser({
      username: initialUsers[0].username,
      password: initialUsers[0].password,
    })

    const response = await request(app)
      .get('/api/users/')
      .set('Authorization', `Bearer ${tokenUser.userToken}`)
      .send()
      .expect(403)

    expect(response.body).toEqual({
      status: 403,
      statusMsg: expect.stringContaining('Forbidden'),
      error: expect.stringContaining('Usuario y/o contraseña invalidos'),
    })
  })
})
