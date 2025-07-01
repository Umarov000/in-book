import { Column, DataType, Model, Table } from "sequelize-typescript";

interface IAdminCreationAttr {
  full_name: string;
  email: string;
  password: string;
}

@Table({ tableName: "admins", timestamps: true })
export class Admin extends Model<Admin, IAdminCreationAttr> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare full_name: string;

  @Column({
    type: DataType.STRING(50),
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
  })
  declare password: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare is_active: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare is_creator: boolean;

  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare activation_link: string;

  @Column({
    type: DataType.STRING(2000),
  })
  declare refresh_token: string;
}
