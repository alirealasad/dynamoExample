const dynamo = require('dynamodb');
dynamo.AWS.config.update({accessKeyId: 'AKID', secretAccessKey: 'SECRET', region: "REGION"});


module.exports = dynamo;
