import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Major } from './major.model';

@Table({ tableName: 'faculties', timestamps: true })
export class Faculty extends Model {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  declare id: number;

  @Column({ allowNull: false, type: DataType.STRING })
  declare name: string;

  @Column({ allowNull: false, unique: true, type: DataType.STRING(20) })
  declare code: string;

  @HasMany(() => Major)
  declare majors: Major[];
}
