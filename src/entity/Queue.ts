import {Entity, ObjectIdColumn, Column, PrimaryGeneratedColumn, ManyToMany} from "typeorm";
import Song from "./Song";

@Entity()
export default class Queue {

   @ObjectIdColumn()
   id: string;

   @Column()
   songs: string[];
}
