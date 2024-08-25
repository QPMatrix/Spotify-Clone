import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column({ unique: true })
  email: string;
  @Column()
  @Exclude()
  password: string;
  @Column({ nullable: true, type: 'text' })
  twoFactorAuthSecret: string;
  @Column({ default: false, type: 'boolean' })
  enabledTwoFactorAuth: boolean;
}
