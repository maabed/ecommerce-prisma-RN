const shortid = require('shortid');
const { createWriteStream } = require('fs');
// import { createWriteStream } from 'fs';

const { getUserId } = require('../../utils');

const storeUpload = async ({ stream, filename }) => {
  const path = `images/${shortid.generate()}`
  return new Promise((resolve, reject) =>
    stream
      .pipe(createWriteStream(path))
      .on('finish', () => resolve({ path }))
      .on('error', reject),
  )
}

const processUpload = async upload => {
  const { stream, filename, mimetype, encoding } = await upload;
  const { path } = await storeUpload({ stream, filename });
  return path;
}

const product = {
  async createProduct(parent, { name, price, picture }, ctx, info) {
    const userId = getUserId(ctx)
    return ctx.db.mutation.createProduct(
      {
        data: {
          name,
          price,
          pictureUrl: await processUpload(picture),
          seller: {
            connect: { id: userId },
          },
        },
      },
      info
    )
  },
}

module.exports = { product }
