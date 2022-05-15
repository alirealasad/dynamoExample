const dynamo = require('./dynamoClient');
const Joi = require('joi');
const _ = require('underscore');
const util = require('util');

let Account = dynamo.define('Foobar', {
  hashKey : 'email',
  schema : {
    email   : Joi.string(),
    name    : Joi.string(),
    age     : Joi.number(),
    scores  : dynamo.types.numberSet(),
    created : Joi.date().default(Date.now),
    list    : Joi.array(),
    settings : {
      nickname    : Joi.string(),
      luckyNumber : Joi.number().min(1).default(7)
    }
  }
});

let printAccountInfo = function (err, acc) {
  if(err) {
    console.log('got error', err);
  } else if (acc) {
    console.log('got account', acc.get());
  } else {
    console.log('account not found');
  }
};

let printScanResults = function (err, data) {
  if(err) {
    console.log('got scan error', err);
  } else if (data.Items) {
    let items = _.map(data.Items, function (d) { return d.get(); });
    console.log('scan finished, got ', util.inspect(items, { showHidden: false, depth: null }));
  } else {
    console.log('scan returned empty result set');
  }
};

exports.Account = Account;
exports.printAccountInfo = printAccountInfo;
exports.printScanResults = printScanResults;
