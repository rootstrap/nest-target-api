import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { IsInt, Min, Max } from 'class-validator'

import { TARGET_MAX_RADIUS, TARGET_MIN_RADIUS } from '../constants'
import { User } from '../users/user.entity'
import { Topic } from '../topics/topic.entity'

@Entity()
export class Target {
  constructor(
    title: string,
    radius: number,
    latitude: number,
    longitude: number,
    user: User,
    topic: Topic,
  ) {
    this.title = title
    this.radius = radius
    this.latitude = latitude
    this.longitude = longitude
    this.user = user
    this.topic = topic
  }

  @PrimaryGeneratedColumn()
  id: number

  @IsInt()
  @Min(TARGET_MIN_RADIUS)
  @Max(TARGET_MAX_RADIUS)
  @Column({ unique: true })
  title: string

  @Column()
  radius: number

  @Column('float')
  latitude: number

  @Column('float')
  longitude: number

  @ManyToOne(() => User, user => user.targets, { nullable: false })
  user: User

  @ManyToOne(() => Topic, { nullable: false })
  topic: Topic
}