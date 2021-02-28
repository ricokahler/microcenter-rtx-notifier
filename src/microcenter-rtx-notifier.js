// @ts-check
const scraper = require('./scraper');
const sendTextMessage = require('./send-text-message');
const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB();

/**
 * @param {string} message
 */
async function hasStockChanged(message) {
  const item = await dynamo
    .getItem({
      TableName: process.env.DYNAMO_TABLE_NAME,
      Key: { id: { S: 'singleton' } },
    })
    .promise();

  // no previous message, then no stock
  const previousMessage = item?.Item?.message?.S;

  if (!previousMessage) {
    return true;
  }

  return message !== previousMessage;
}

async function handler() {
  const products = await scraper();

  const message =
    products.length > 0
      ? products
          .map(
            ({ description, price, stock }) =>
              `${description}\n${price}\n${stock}\n`,
          )
          .join('-----\n')
      : 'No RTX cards.';

  if (!(await hasStockChanged(message))) {
    return;
  }

  await dynamo
    .putItem({
      TableName: process.env.DYNAMO_TABLE_NAME,
      Item: {
        id: { S: 'singleton' },
        message: { S: message },
      },
    })
    .promise();

  await sendTextMessage(message);

  return {};
}

exports.handler = handler;
