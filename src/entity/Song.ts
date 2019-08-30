import {Entity, ObjectIdColumn, Column, PrimaryGeneratedColumn, ManyToMany, PrimaryColumn, JoinTable} from "typeorm";
import Queue from "./Queue";

@Entity
export default class Song {

  @ManyToMany(type => Queue)
  @JoinTable()
  @PrimaryColumn()
  queue_id: string;

  @PrimaryColumn()
  song_id: string
}
