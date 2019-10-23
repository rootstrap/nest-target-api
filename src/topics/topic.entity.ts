
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Topic {
  constructor(name: string) {
    this.name = name
  }

  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  name: string
}
