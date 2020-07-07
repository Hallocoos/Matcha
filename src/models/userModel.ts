import * as bcrypt from 'bcrypt';
import * as knex from '../../database/knex'
import { knexSelectByColumn, knexInsert, knexSelectAll, knexUpdateById } from '../services/dbService';
const saltRounds = 3;

export class User {
  // property: datatype;
  id: string;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  email: string;
  gender: string;
  interest: string;
  age: string;
  ip: string;
  countryName: string;
  regionName: string;
  city: string;
  longitude: string;
  latitude: string;
  zipcode: string;
  distance: number;
  verified: boolean;
  tags: string[];
  fame: number;
  hash: string;

  constructor(data: Partial<User>) {
    Object.assign(this, data);
  };
  // method() {};
};

// function to handle getting all users
export async function retrieveUsers(): Promise<User[]> {
  const result = await knexSelectAll('users');
  if (result)
    return (result);
  return (undefined);
};

// function to handle get user by id
export async function retrieveUserById(id: string): Promise<User> {
  const result = await knexSelectByColumn('id', id, 'users');
  if (result[0])
    return (result[0]);
  return (undefined);
};

// function to handle get user by id
export async function verifyUserByHash(hash: string): Promise<User> {
  return knex('users')
    .where('hash', hash)
    .update('verified', true)
    .then(async function () {
      return (await retrieveUserByHash(hash));
    });
};


export async function deleteUserByHash(hash: string): Promise<User> {
  return knex('notifications')
      .where('notifications', hash)
      .del()
      .returning("hash: "+hash)
      .then(deleteUsersImagesByHash(hash))
      .catch(function(error) {
        console.log(error);
      });
};

export async function deleteUsersImagesByHash(hash: String): Promise<User> {
  return knex('images')
      .where('hash', hash)
      .del().then(deleteUsersMatchesByHash(hash))
      .catch(function (error) {
        console.log(error);
      });
}

export async function deleteUsersMatchesByHash(hash: String): Promise<User> {
  return knex('matches')
      .where('hash', hash)
      .del().then(deleteUsersNotificationsByHash(hash))
      .catch(function (error) {
        console.log(error);
      });
}

export async function deleteUsersNotificationsByHash(hash: String): Promise<User> {
  return knex('users')
      .where('hash', hash)
      .del().then(function () {
        console.log("it worked [images]")
      })
      .catch(function (error) {
        console.log(error);
      });
}


// function to handle get user by username
// /login
export async function retrieveUserByUsername(username: string) {
  const result = await knexSelectByColumn('username', username, 'users');
  if (result[0])
    return (result[0]);
  return (undefined);
};

// function to handle get user by email
export async function retrieveUserByEmail(email: string) {
  const result = await knexSelectByColumn('email', email, 'users');
  if (result[0])
    return (result[0]);
  return (undefined);
};

// function to handle get user by email
export async function retrieveUserByHash(hash: string): Promise<User> {
  const result = await knexSelectByColumn('hash', hash, 'users');
  if (result[0])
    return (result[0]);
  return (undefined);
};

// function to handle adding users
export async function addUser(body: User): Promise<User> {
  const result = await knexInsert(body, 'users');
  return (await retrieveUserByUsername(body.username));
};

/*
 *  Function to handle modifying a user
 *  @Incoming Params: { hash: value, key1: value1, ... }
*/
export async function modifyUserPasswordByHash(body) {
  var user = await retrieveUserByHash(body.hash);
  if (user) {
    body.password = await hashing(body.password);
    await knexUpdateById({ password: body.password }, user.id, 'users');
    return (await retrieveUserById(user.id));
  }
  console.log(user)
  return (undefined);
};

/*
 *  Function to handle modifying a user, will insert value in column called key
 *  @Incoming Params: { id: value, key1: value1, ... }
*/
export async function modifyUserById(body) {
  const id = body.id;
  delete body.id;
  await knexUpdateById(body, id, 'users');
  return (await retrieveUserById(id));
};

/*
 *  Function to handle the increments on fame
 *  @Incoming Params: { id: value, key1: value1, ... }
*/
export async function incrementUsersFameRating(id, amount) {
  const user = await retrieveUserById(id);
  await knexUpdateById({fame: user.fame + amount}, id, 'users');
  return (await retrieveUserById(id));
};

export async function hashing(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  if (hash)
    return (hash);
  return (undefined);
}

export default User;