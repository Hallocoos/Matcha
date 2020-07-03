import * as knex from '../../database/knex'
import { knexSelectByColumn, knexInsert, knexSelectAll, knexUpdateById, knexClearProfilePicture, knexDeleteById } from '../services/dbService';

class Image {
  id: string;
  profilePicture: true;
  userId: number;
  image: string;

  constructor(data: Partial<Image>) {
    Object.assign(this, data);
  };
  // method() {};
};

// function to handle get images by userId
export async function retrieveImagesByUserId(userId: string): Promise<Image> {
  const result = await knexSelectByColumn('userId', userId, 'images');
  if (result) {
    // console.log(result)
    return (result);
  } else {
    return (undefined);
  }
};

// function to handle get images by image.id
export async function retrieveImageById(id: string): Promise<Image> {
  const result = await knexSelectByColumn('id', id, 'images');
  if (result) {
    return (result[0]);
  } else {
    return (undefined);
  }
};

// function to handle creation of new images
// body = { userId: 1, image: <base64 string> "nhvf4qnhnhvqvfqnuhqwevfnuh", profilePicture: false }
export async function createImage(body): Promise<Image> {
  if (body.profilePicture)
    await knexClearProfilePicture(body.userId, 'images');
  const result = await knexInsert(body, 'images');
  return (retrieveImageById(result[0]));
};

//function to delete an image by Id
//body = { id: 3 userId: 1, image: <base64 string> "nhvf4qnhnhvqvfqnuhqwevfnuh", profilePicture: false }
export async function deleteImageById(body): Promise<Image> {
  const id = body.id;
  const result = await knexDeleteById(id, 'images');
  if (result) {
    return (result);
  } else {
    return (undefined);
  }
};

export default Image;