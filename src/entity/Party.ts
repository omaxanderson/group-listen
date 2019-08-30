import {Entity, ObjectIdColumn, Column, BeforeInsert, PrimaryGeneratedColumn} from "typeorm";
import Queue from './Queue';

@Entity()
export default class Party {

   // some sort of short hash
   @ObjectIdColumn()
   id: string;

   @Column()
   name: string;

   // spotify user id
   @Column()
   owner: string;

   @Column()
   queue: string[];

   @Column({
      default: [],
   })
   members: string[];

   @BeforeInsert()
   addDefaults() {
      if (!this.members) {
         this.members = [];
      }
      if (!this.queue) {
         this.queue = [];
      }
   }
}
