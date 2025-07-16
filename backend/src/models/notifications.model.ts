import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface NotificationAttributes {
  id: number;
  userId: number;
  notificationType: string;
  category: string;
  title: string;
  message: string;
  isRead?: boolean;
}

type NotificationCreationAttributes = Optional<NotificationAttributes, 'id'>;

class Notification extends Model<NotificationAttributes, NotificationCreationAttributes> implements NotificationAttributes {
  public id!: number;
  public userId!: number;
  public notificationType!: string;
  public category!: string;
  public title!: string;
  public message!: string;
  public isRead!: boolean;
}

Notification.init({
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, field: 'user_id' },
  notificationType: { type: DataTypes.STRING(50), allowNull: false, field: 'notification_type' },
  category: { type: DataTypes.STRING(50), allowNull: false },
  title: { type: DataTypes.STRING(255), allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'is_read' },
}, {
  sequelize,
  tableName: 'notifications',
  timestamps: true,
  underscored: true,
});

export default Notification;
