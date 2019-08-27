import {Entity, ObjectIdColumn, ObjectID, Column} from "typeorm";

@Entity()
export class User {

   @ObjectIdColumn()
   id: ObjectID;

   @Column()
   spotify_id: string;

   @Column()
   firstName: string;

   @Column()
   lastName: string;
}
