import { Entity, ObjectIdColumn, Column } from "typeorm";

@Entity()
export default class Queue {

   @ObjectIdColumn()
   id: string;

   @Column()
   songs: string[];
}
