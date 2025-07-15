import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './user.model';

interface UserProfileAttributes {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  phone?: string;
  timezone?: string;
  profilePicture?: string;
  bio?: string;
  dateOfBirth?: Date;
  country?: string;
  city?: string;
  preferredLanguage?: string;
  notificationPreferences?: object;
  privacySettings?: object;
}

type UserProfileCreationAttributes = Optional<UserProfileAttributes, 'id'>;

class UserProfile extends Model<UserProfileAttributes, UserProfileCreationAttributes> implements UserProfileAttributes {
  public id!: number;
  public userId!: number;
  public firstName!: string;
  public lastName!: string;
  public phone!: string;
  public timezone!: string;
  public profilePicture!: string;
  public bio!: string;
  public dateOfBirth!: Date;
  public country!: string;
  public city!: string;
  public preferredLanguage!: string;
  public notificationPreferences!: object;
  public privacySettings!: object;
}

UserProfile.init({
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, field: 'user_id' },
  firstName: { type: DataTypes.STRING(100), allowNull: false, field: 'first_name' },
  lastName: { type: DataTypes.STRING(100), allowNull: false, field: 'last_name' },
  phone: { type: DataTypes.STRING(20) },
  timezone: { type: DataTypes.STRING(50), defaultValue: 'UTC' },
  profilePicture: { type: DataTypes.STRING(500) },
  bio: { type: DataTypes.TEXT },
  dateOfBirth: { type: DataTypes.DATEONLY, field: 'date_of_birth' },
  country: { type: DataTypes.STRING(100) },
  city: { type: DataTypes.STRING(100) },
  preferredLanguage: { type: DataTypes.STRING(10), defaultValue: 'en', field: 'preferred_language' },
  notificationPreferences: { type: DataTypes.JSON, field: 'notification_preferences' },
  privacySettings: { type: DataTypes.JSON, field: 'privacy_settings' },
}, {
  sequelize,
  tableName: 'user_profiles',
  timestamps: true,
  underscored: true,
});

UserProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default UserProfile;
