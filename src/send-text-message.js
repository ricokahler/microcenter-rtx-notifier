// @ts-check
const AWS = require('aws-sdk');

/**
 * @param {string} text
 */
async function sendTextMessage(text) {
  const pinpoint = new AWS.Pinpoint();
  const apps = await pinpoint.getApps().promise();
  const App = apps.ApplicationsResponse.Item.find(
    (i) => i.Name === process.env.PINPOINT_APP_NAME,
  );

  await pinpoint
    .sendMessages({
      ApplicationId: App.Id,
      MessageRequest: {
        Addresses: {
          [process.env.PHONE_NUMBER]: { ChannelType: 'SMS' },
        },
        MessageConfiguration: {
          SMSMessage: {
            Body: text,
            OriginationNumber: process.env.ORIGINATION_NUMBER,
            MessageType: 'TRANSACTIONAL',
          },
        },
      },
    })
    .promise();
}

module.exports = sendTextMessage;
