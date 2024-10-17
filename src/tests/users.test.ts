import app from '../app'
import User from '../models/User'
import request from 'supertest'
import {
  newUser,
  invalidUser,
  createInitialUser,
  createEmailValidationToken,
} from './helpers/userHelper'
import { IUser } from '../types'

describe('User API', (): void => {
  beforeEach(async (): Promise<void> => {
    await User.deleteMany({})
  })

  it('create a new user', async (): Promise<void> => {
    const response = await request(app)
      .post('/api/users')
      .send(newUser)
      .expect(201)

    expect((response.body.data as Pick<IUser, 'email'>).email).toBe(
      newUser.email,
    )
    expect((response.body.data as Pick<IUser, 'name'>).name).toBe(newUser.name)

    const user: IUser | null = await User.findOne({ email: newUser.email })
    expect(user as IUser).not.toBeNull()
    expect((user as IUser).name).toBe(newUser.name)
  })

  it('create user already exist', async (): Promise<void> => {
    const user = await createInitialUser(newUser)

    const response = await request(app)
      .post('/api/users')
      .send({ name: user.name, email: user.email })
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

  it.only('get validation token with invalid param', async (): Promise<void> => {
    await createInitialUser(newUser)
    const invalidEmailToken = 'euebnbasajshjkjjdaksd'

    const response = await request(app)
      .get(`/api/users/auth/${invalidEmailToken}`)
      .send()
      .expect(400)

    expect(response.body).toEqual({
      status: 400,
      statusMsg: expect.stringContaining('Bad Request'),
      error: expect.stringContaining('Datos incorrectos'),
    })
  })

  // it('Get all users', async (): Promise<void> => {
  //   const initialUsers: IUser[] = await fetchInitialUsers()
  //   const response = await request(app).get('/api/users').expect(200)

  //   expect(response.body).toHaveLength(initialUsers.length)
  // })

  // it('Login user', async (): Promise<void> => {
  //   const initalUser: IUser = await createInitialUser(newUser)

  //   const response = await request(app)
  //     .post('/api/users/login')
  //     .send({ email: newUser.email, password: newUser.password })
  //     .expect(200)

  //   expect((response.body as Pick<IUser, 'name'>).name).toBe(initalUser.name)
  //   expect(response.body.token).not.toBeNull()
  // })

  // it('login with invalid credentials', async (): Promise<void> => {
  //   const response = await request(app)
  //     .post('/api/users/login')
  //     .send({ email: 'test@mail.com', password: 'wrong test' })
  //     .expect(400)

  //   expect(response.body.error).toContain('Usuario o contraneña invalida')
  // })
})
