import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface PaymentAttributes {
  id: number;
  paymentReference: string;
  userId: number;
  bookingId?: number;
  amount: number;
  currency: string;
  status: string;
}

type PaymentCreationAttributes = Optional<PaymentAttributes, 'id'>;

class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
  public id!: number;
  public paymentReference!: string;
  public userId!: number;
  public bookingId!: number;
  public amount!: number;
  public currency!: string;
  public status!: string;
}

Payment.init({
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  paymentReference: { type: DataTypes.STRING(30), unique: true, allowNull: false, field: 'payment_reference' },
  userId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, field: 'user_id' },
  bookingId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true, field: 'booking_id' },
  amount: { type: DataTypes.DECIMAL(12,2), allowNull: false },
  currency: { type: DataTypes.STRING(3), defaultValue: 'USD' },
  status: { type: DataTypes.STRING, defaultValue: 'pending' },
}, {
  sequelize,
  tableName: 'payments',
  timestamps: true,
  underscored: true,
});

export default Payment;
