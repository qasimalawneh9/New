import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface SupportTicketAttributes {
  id: number;
  ticketReference: string;
  userId: number;
  subject: string;
  description: string;
  status: string;
  priority: string;
}

type SupportTicketCreationAttributes = Optional<SupportTicketAttributes, 'id'>;

class SupportTicket extends Model<SupportTicketAttributes, SupportTicketCreationAttributes> implements SupportTicketAttributes {
  public id!: number;
  public ticketReference!: string;
  public userId!: number;
  public subject!: string;
  public description!: string;
  public status!: string;
  public priority!: string;
}

SupportTicket.init({
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  ticketReference: { type: DataTypes.STRING(20), unique: true, allowNull: false, field: 'ticket_reference' },
  userId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, field: 'user_id' },
  subject: { type: DataTypes.STRING(255), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'open' },
  priority: { type: DataTypes.STRING, defaultValue: 'medium' },
}, {
  sequelize,
  tableName: 'support_tickets',
  timestamps: true,
  underscored: true,
});

export default SupportTicket;
