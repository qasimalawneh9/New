import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ReviewAttributes {
  id: number;
  bookingId: number;
  studentId: number;
  teacherId: number;
  overallRating: number;
  comment?: string;
  isVerified?: boolean;
  createdAt?: Date;
}

type ReviewCreationAttributes = Optional<ReviewAttributes, 'id'>;

class Review extends Model<ReviewAttributes, ReviewCreationAttributes> implements ReviewAttributes {
  public id!: number;
  public bookingId!: number;
  public studentId!: number;
  public teacherId!: number;
  public overallRating!: number;
  public comment!: string;
  public isVerified!: boolean;
  public readonly createdAt!: Date;
}

Review.init({
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  bookingId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, field: 'booking_id' },
  studentId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, field: 'student_id' },
  teacherId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, field: 'teacher_id' },
  overallRating: { type: DataTypes.TINYINT.UNSIGNED, allowNull: false },
  comment: { type: DataTypes.TEXT },
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_verified' },
}, {
  sequelize,
  tableName: 'reviews',
  timestamps: true,
  underscored: true,
});

export default Review;
