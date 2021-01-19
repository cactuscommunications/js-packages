const awsServerlessExpress = require("aws-serverless-express");
const app = require("./app");

const server = awsServerlessExpress.createServer(app);

async function getEnvFromSecretManager() {
  // Load the AWS SDK
  if (!process.env.SECRET_NAME) {
    // TODO: remove this after testing is done
    console.log("No SECRET_NAME set!");
    return null;
  }
  var AWS = require("aws-sdk"),
    region = process.env.AWS_REGION,
    secretName = process.env.SECRET_NAME;

  // Create a Secrets Manager client
  var client = new AWS.SecretsManager({
    region: region,
  });

  return new Promise((resolve, reject) => {
    client.getSecretValue({ SecretId: secretName }, function (err, data) {
      // In this sample we only handle the specific exceptions for the 'GetSecretValue' API.
      // See https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
      // We rethrow the exception by default.
      if (err) {
        reject(err);
      } else {
        // Decrypts secret using the associated KMS CMK.
        // Depending on whether the secret is a string or binary, one of these fields will be populated.
        if ("SecretString" in data) {
          resolve(data.SecretString);
        } else {
          let buff = Buffer.from(data.SecretBinary, "base64");
          resolve(buff.toString("ascii"));
        }
      }
    });
  });
}

module.exports = async function handler(event, context) {
  try {
    const secrets = await getEnvFromSecretManager();
    if (secrets) {
      process.env.DB_NAME = secrets.DB_NAME;
      process.env.DB_USER = secrets.DB_USER;
      process.env.DB_PASS = secrets.DB_PASS;
      process.env.DB_HOST = secrets.DB_HOST;
      process.env.DB_PORT = secrets.DB_PORT;
    }
  } catch (e) {
    console.error(e);
    console.error("Couldn't fetch creds");
  }
  awsServerlessExpress.proxy(server, event, context);
};
