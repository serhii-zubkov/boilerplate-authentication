import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Roles } from 'constants/index';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'userId' })
  userId: number;

  @Column('character varying', { name: 'email', length: 255, unique: true })
  email: string;

  @Column('character varying', { name: 'passwordHash', length: 60 })
  passwordHash: string;

  @Column('character varying', { name: 'firstName', length: 255 })
  firstName: string;

  @Column('character varying', { name: 'lastName', length: 255 })
  lastName: string;

  @Column('text', { name: 'roles', array: true })
  roles: string[] = [Roles.User];

  @Column('timestamp', { name: 'created' })
  created: Date = new Date();

  @Column('timestamp', { name: 'updated' })
  updated: Date = new Date();

  public get id(): number {
    return this.userId;
  }

  public get dto(): Partial<User> {
    const dto = Object.assign({}, this);
    delete dto.passwordHash;
    return dto;
  }
}
