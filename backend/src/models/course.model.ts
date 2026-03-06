import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { Major } from './major.model';
import { Section } from './section.model';

@Table({ tableName: 'courses', timestamps: true })
export class Course extends Model {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  declare id: number;

  @Column({ allowNull: false, unique: true, type: DataType.STRING(20) })
  declare code: string;

  @Column({ allowNull: false, type: DataType.STRING })
  declare name: string;

  @Column({ allowNull: false, type: DataType.INTEGER })
  declare credits: number;

  @ForeignKey(() => Major)
  @Column({ allowNull: false, type: DataType.INTEGER })
  declare major_id: number;

  @BelongsTo(() => Major)
  declare major: Major;

  @HasMany(() => Section)
  declare sections: Section[];
}
