import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from 'constants/index';

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
  roles: string[];

  @Column('timestamp', { name: 'created' })
  created: Date;

  @Column('timestamp', { name: 'updated' })
  updated: Date;

  public get id(): number {
    return this.userId;
  }

  public get dto(): Partial<User> {
    const dto = Object.assign({}, this);
    delete dto.passwordHash;
    return dto;
  }

  public hasAllRoles(roles?: string[]): boolean {
    if (!roles) {
      return true;
    }

    const missingRoles = roles.filter(
      (value) => this.roles.indexOf(value) === -1,
    );
    return missingRoles.length === 0;
  }

  public hasOneOfRoles(roles?: string[]): boolean {
    if (!roles) {
      return false;
    }

    const missingRoles = roles.filter(
      (value) => this.roles.indexOf(value) === -1,
    );
    return missingRoles.length < roles.length;
  }
}
