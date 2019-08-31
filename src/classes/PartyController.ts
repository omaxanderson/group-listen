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
  const full = await manager.findOne(Party, id);
  console.log(full);
  const { queue: oldQueue } = await manager.findOne(Party, id);
  const queue = allowDups
    ? [ ...oldQueue, song ]
    : [...new Set([ ...oldQueue, song ])];
  const { value } = await manager.findOneAndUpdate(
    Party,
    { _id: ObjectId(id) },
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
    { _id: ObjectId(id) },
    { $set: { queue } },
    { returnOriginal: false }
  );
  if (!value) {
    throw new Error(`No queue with id ${id}`);
  }
  return value;
};

// can probably do that for the queue too
const updateMembers = async (opts: {
  id: string,
  name: string,
  func: Function,
}) => {
  const { id, name, func } = opts;
  const manager = getMongoManager();
  const { members: oldMembers } = await manager.findOne(Party, id);
  const members = func(oldMembers, name);
  const { value } = await manager.findOneAndUpdate(
    Party,
    { _id: ObjectId(id) },
    { $set: { members } },
    { returnOriginal: false }
  );
  return value;
};

export const addMemberToParty = async ({ id, name }: {
  id: string,
  name: string,
}) => {
  return await updateMembers({
    id,
    name,
    func: (members, name) => [ ...new Set([...members, name])],
  });
};

export const deleteMemberFromParty = async ({ id, name, }: {
  id: string;
  name: string;
}) => {
  return await updateMembers({
    id,
    name,
    func: (members, name) => members.filter(m => m !== name),
  });
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

export const playQueue = async (opts) => {
  // send spotify request
  // get owner user_id
  // get song id
  // send play request
}
