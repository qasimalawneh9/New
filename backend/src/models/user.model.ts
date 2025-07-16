import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface UserAttributes {
  id: number;
  email: string;
  password: string;
  role: 'student' | 'teacher' | 'admin';
  emailVerifiedAt?: Date | null;
  emailVerificationToken?: string | null;
  emailVerificationExpiresAt?: Date | null;
  twoFactorEnabled?: boolean;
  twoFactorSecret?: string | null;
  status: 'active' | 'suspended' | 'banned' | 'pending_verification' | 'deleted';
  lastLoginAt?: Date | null;
  lastLoginIp?: string | null;
  failedLoginAttempts?: number;
  lockedUntil?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type UserCreationAttributes = Optional<UserAttributes, 'id' | 'emailVerifiedAt' | 'emailVerificationToken' | 'emailVerificationExpiresAt' | 'twoFactorEnabled' | 'twoFactorSecret' | 'lastLoginAt' | 'lastLoginIp' | 'failedLoginAttempts' | 'lockedUntil' | 'createdAt' | 'updatedAt'>;

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public password!: string;
  public role!: 'student' | 'teacher' | 'admin';
  public emailVerifiedAt!: Date | null;
  public emailVerificationToken!: string | null;
  public emailVerificationExpiresAt!: Date | null;
  public twoFactorEnabled!: boolean;
  public twoFactorSecret!: string | null;
  public status!: 'active' | 'suspended' | 'banned' | 'pending_verification' | 'deleted';
  public lastLoginAt!: Date | null;
  public lastLoginIp!: string | null;
  public failedLoginAttempts!: number;
  public lockedUntil!: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init({
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('student', 'teacher', 'admin'),
    defaultValue: 'student',
  },
  emailVerifiedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'email_verified_at',
  },
  emailVerificationToken: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'email_verification_token',
  },
  emailVerificationExpiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'email_verification_expires_at',
  },
  twoFactorEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'two_factor_enabled',
  },
  twoFactorSecret: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'two_factor_secret',
  },
  status: {
    type: DataTypes.ENUM('active', 'suspended', 'banned', 'pending_verification', 'deleted'),
    defaultValue: 'pending_verification',
  },
  lastLoginAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'last_login_at',
  },
  lastLoginIp: {
    type: DataTypes.STRING(45),
    allowNull: true,
    field: 'last_login_ip',
  },
  failedLoginAttempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'failed_login_attempts',
  },
  lockedUntil: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'locked_until',
  },
}, {
  sequelize,
  tableName: 'users',
  timestamps: true,
  underscored: true,
});

export default User;
