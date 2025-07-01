import { Column, DataType, Model, Table } from "sequelize-typescript";

interface IGenreCreationAttr {
  name: string;
}
@Table({ tableName: "genre" })
export class Genre extends Model<Genre, IGenreCreationAttr> {
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
  declare name: string;
}
