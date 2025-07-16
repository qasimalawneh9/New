import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface BookingAttributes {
  id: number;
  bookingReference: string;
  studentId: number;
  teacherId: number;
  lessonDate: Date;
  duration: number;
  status: string;
  totalAmount: number;
  currency: string;
}

type BookingCreationAttributes = Optional<BookingAttributes, 'id'>;

class Booking extends Model<BookingAttributes, BookingCreationAttributes> implements BookingAttributes {
  public id!: number;
  public bookingReference!: string;
  public studentId!: number;
  public teacherId!: number;
  public lessonDate!: Date;
  public duration!: number;
  public status!: string;
  public totalAmount!: number;
  public currency!: string;
}

Booking.init({
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  bookingReference: { type: DataTypes.STRING(20), unique: true, allowNull: false, field: 'booking_reference' },
  studentId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, field: 'student_id' },
  teacherId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, field: 'teacher_id' },
  lessonDate: { type: DataTypes.DATE, allowNull: false, field: 'lesson_date' },
  duration: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'pending' },
  totalAmount: { type: DataTypes.DECIMAL(10,2), allowNull: false, field: 'total_amount' },
  currency: { type: DataTypes.STRING(3), defaultValue: 'USD' },
}, {
  sequelize,
  tableName: 'bookings',
  timestamps: true,
  underscored: true,
});

export default Booking;
