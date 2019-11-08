import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm'
import { IsInt, Min, Max } from 'class-validator'

import { TARGET_MAX_RADIUS, TARGET_MIN_RADIUS } from 'targets/target.constants'
import { User } from 'users/user.entity'
import { Topic } from 'topics/topic.entity'

@Entity()
export class Target {
  constructor(
    title: string,
    radius: number,
    latitude: string,
    longitude: string,
    user: User,
    topic: Topic,
    matches?: Target[],
  ) {
    this.title = title
    this.radius = radius
    this.latitude = latitude
    this.longitude = longitude
    this.user = user
    this.topic = topic
    this.matches = matches
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

  @Column()
  latitude: string

  @Column()
  longitude: string

  @ManyToOne(() => User, user => user.targets, { nullable: false })
  user: User

  @ManyToOne(() => Topic, { nullable: false })
  topic: Topic

  @ManyToMany(() => Target, target => target.matches, { cascade: ['update'] })
  @JoinTable()
  matches: Target[]

  @CreateDateColumn()
  createdAt: Date
}
