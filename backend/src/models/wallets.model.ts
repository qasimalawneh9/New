import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface WalletAttributes {
  id: number;
  userId: number;
  balance: number;
  currency: string;
}

type WalletCreationAttributes = Optional<WalletAttributes, 'id'>;

class Wallet extends Model<WalletAttributes, WalletCreationAttributes> implements WalletAttributes {
  public id!: number;
  public userId!: number;
  public balance!: number;
  public currency!: string;
}

Wallet.init({
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, field: 'user_id' },
  balance: { type: DataTypes.DECIMAL(12,2), defaultValue: 0.00 },
  currency: { type: DataTypes.STRING(3), defaultValue: 'USD' },
}, {
  sequelize,
  tableName: 'wallets',
  timestamps: true,
  underscored: true,
});

export default Wallet;
