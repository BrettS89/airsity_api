const AWS = require('aws-sdk');
const axios = require('axios');
const keys = require('../config');

let s3Bucket = new AWS.S3({
  accessKeyId: keys.accessKeyId,
  secretAccessKey: keys.secretAccessKey,
  Bucket: keys.Bucket,
});

exports.getFile = async (url, ContentType, name, type) => {
  try {
    const { data } = await axios({ url, method: 'GET', responseType: 'arraybuffer', encoding : null });
    const params = {
      Bucket: keys.Bucket,
      Key: `${type}/${name}`,
      Body: data,
      ContentType
    };
    await s3Bucket.upload(params).promise();
    return `https://s3.amazonaws.com/${keys.Bucket}/${type}/${name}`;
  } catch(e) {
    throw e;
  }
};
