import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'

import { Target } from 'targets/target.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @OneToMany(() => Target, target => target.user, {
    cascade: true,
  })
  targets: Target[]

  constructor(email: string, password: string) {
    this.email = email
    this.password = password
  }
}
