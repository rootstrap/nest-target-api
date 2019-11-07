import { Test } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { INestApplication } from '@nestjs/common'
import io from 'socket.io-client'

import { AuthModule } from 'auth/auth.module'
import { ConversationsModule } from 'conversations/conversations.module'
import { TopicsModule } from 'topics/topics.module'
import { ConfigModule } from 'config/config.module'
import { Topic } from 'topics/topic.entity'
import { User } from 'users/user.entity'
import applyGlobalConfig from 'apply-global-conf'
import { UsersRepoService } from 'test/users-repo.service'
import { TopicsRepoService } from 'test/topics-repo.service'
import ormAsyncOptions from 'test/orm-config'

describe('Socket', () => {
  let app: INestApplication
  let users
  let accessToken
  let socket
  let connected
  let disconnected

  const connectSocket = (token?) => {
    let options
    token &&
      (options = {
        transportOptions: {
          polling: {
            extraHeaders: {
              token,
            },
          },
        },
      })
    return io.connect('ws://localhost:3000', options)
  }

  function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync(ormAsyncOptions),
        TypeOrmModule.forFeature([Topic, User]),
        AuthModule,
        ConfigModule,
        TopicsModule,
        ConversationsModule,
      ],
      providers: [TopicsRepoService, UsersRepoService],
    }).compile()

    app = module.createNestApplication()
    applyGlobalConfig(app)
    await app.init()
    await app.listen(3000)

    connected = jest.fn()
    disconnected = jest.fn()

    users = module.get<UsersRepoService>(UsersRepoService)
    ;({ accessToken } = await users.mockWithToken(app))
  })

  afterEach(async () => {
    socket && socket.destroy()
    await app.close()
  })

  describe('When using a correct token', () => {
    it('should mantain the connection', async () => {
      socket = connectSocket(accessToken)
      socket.on('connect', connected)
      socket.on('disconnect', disconnected)
      await timeout(100)
      expect(connected).toHaveBeenCalled()
      expect(disconnected).not.toHaveBeenCalled()
    })
  })

  describe('When using an incorrect token', () => {
    it('should be disconneted', done => {
      socket = connectSocket('incorrect token')
      socket.on('disconnect', () => done())
    })
  })

  describe('When using no token', () => {
    it('should be disconnetedg', done => {
      socket = connectSocket()
      socket.on('disconnect', () => done())
    })
  })
})
