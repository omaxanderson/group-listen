import {
  getRepository,
  getMongoManager,
  Connection,
  createConnection
} from 'typeorm';
import { ObjectId } from 'mongodb';
import Party from '../entity/Party';

export const addSongToQueue = async (opts: {
  id: string,
  song: string,
  allowDups?: boolean,
}): Promise<Object> => {
  const { id, song, allowDups } = opts;
  const manager = getMongoManager();
  const { queue: oldQueue } = await manager.findOne(Party, id);
  const queue = allowDups
    ? [ ...oldQueue, song ]
    : [...new Set([ ...oldQueue, song ])];
  const { value } = await manager.findOneAndUpdate(
    Party,
    ObjectId(id),
    { $set: { queue } },
  { returnOriginal: false }
  );
  return value;
};

export const addSongsToQueue = async (opts: {
  id: string,
  songs: string[],
  allowDups?: boolean,
}) => {
  const { id, songs, allowDups } = opts;
  const manager = getMongoManager();
  const { queue: oldQueue } = await manager.findOne(Party, id);
  const queue = allowDups
    ? [ ...oldQueue, ...songs ]
    : [...new Set([ ...oldQueue, ...songs ])];
  const { value } = await manager.findOneAndUpdate(
    Party,
    // works { _id: ObjectId(id) },
    ObjectId(id),
    { $set: { queue } },
    { returnOriginal: false }
  );
  if (!value) {
    throw new Error(`No queue with id ${id}`);
  }
  return value;
};

export const addMemberToParty = async (opts: {
  id: string,
  name: string,
}) => {
  const { id, name } = opts;
  const manager = getMongoManager();
  const { members: oldMembers } = await manager.findOne(Party, id);
  const members = [ ...new Set([...oldMembers, name ]) ];
  const { value } = await manager.findOneAndUpdate(
    Party,
    ObjectId(id),
    { $set: { members } },
    { returnOriginal: false }
  );
  return value;
};

export const resetQueue = async (opts: {
  id: string,
}) => {
  const { id } = opts;
  const manager = getMongoManager();
  const { value } = await manager.findOneAndUpdate(
    Party,
    { _id: ObjectId(id) },
    { $set: { queue: [] } },
    { returnOriginal: false },
  );
  return value;
}
