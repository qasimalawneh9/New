import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './user.model';

interface TeacherProfileAttributes {
  id: number;
  userId: number;
  teachingLanguages: object;
  nativeLanguages: object;
  qualifications?: object;
  experienceYears?: number;
  hourlyRate: number;
  currency?: string;
  videoIntroduction?: string;
  teachingStyle?: string;
  specializations?: object;
  meetingPlatform?: string;
  meetingLink?: string;
  isVerified?: boolean;
}

type TeacherProfileCreationAttributes = Optional<TeacherProfileAttributes, 'id'>;

class TeacherProfile extends Model<TeacherProfileAttributes, TeacherProfileCreationAttributes> implements TeacherProfileAttributes {
  public id!: number;
  public userId!: number;
  public teachingLanguages!: object;
  public nativeLanguages!: object;
  public qualifications!: object;
  public experienceYears!: number;
  public hourlyRate!: number;
  public currency!: string;
  public videoIntroduction!: string;
  public teachingStyle!: string;
  public specializations!: object;
  public meetingPlatform!: string;
  public meetingLink!: string;
  public isVerified!: boolean;
}

TeacherProfile.init({
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, field: 'user_id' },
  teachingLanguages: { type: DataTypes.JSON, allowNull: false },
  nativeLanguages: { type: DataTypes.JSON, allowNull: false },
  qualifications: { type: DataTypes.JSON },
  experienceYears: { type: DataTypes.INTEGER, defaultValue: 0 },
  hourlyRate: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  currency: { type: DataTypes.STRING(3), defaultValue: 'USD' },
  videoIntroduction: { type: DataTypes.STRING(500) },
  teachingStyle: { type: DataTypes.TEXT },
  specializations: { type: DataTypes.JSON },
  meetingPlatform: { type: DataTypes.STRING(50), defaultValue: 'zoom' },
  meetingLink: { type: DataTypes.STRING(500) },
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  sequelize,
  tableName: 'teacher_profiles',
  timestamps: true,
  underscored: true,
});

TeacherProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default TeacherProfile;
