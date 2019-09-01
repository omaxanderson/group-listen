import {Entity, ObjectIdColumn, Column, PrimaryGeneratedColumn, ManyToMany} from "typeorm";

@Entity()
export default class Queue {

   @ObjectIdColumn()
   id: string;

   @Column()
   songs: string[];
}
