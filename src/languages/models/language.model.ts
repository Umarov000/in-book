import { Column, DataType, Model, Table } from "sequelize-typescript";

interface ILanguageCreationAttr {
  code: string;
  name: string;
  flag: string;
}
@Table({ tableName: "languages" })
export class Language extends Model<Language, ILanguageCreationAttr> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare code: string;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  declare flag: string;
}
