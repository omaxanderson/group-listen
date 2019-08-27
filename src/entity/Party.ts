import { Entity, ObjectIdColumn, Column } from "typeorm";
import { Queue } from './Queue';

@Entity()
export class Party {

   // some sort of short hash
   @ObjectIdColumn()
   id: string;

   // spotify user id
   @Column()
   owner: string;

   @Column(type => Queue)
   queue: Queue[];
}
