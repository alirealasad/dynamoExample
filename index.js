const dynamo = require('./models/dynamoClient');
const {Account, printAccountInfo, printScanResults } = require('./models/account');
const _ = require('underscore');
const util = require('util');


//more examples at https://github.com/baseprime/dynamodb/tree/master/examples

var printResults = function (msg) {
  return function (err, resp) {

    console.log('----------------------------------------------------------------------');
    if(err) {
      console.log(msg + ' - Error running query', err);
    } else {
      console.log(msg + ' - Found', resp.Count, 'items');
      console.log(util.inspect(_.pluck(resp.Items, 'attrs')));

      if(resp.ConsumedCapacity) {
        console.log('----------------------------------------------------------------------');
        console.log('Query consumed: ', resp.ConsumedCapacity);
      }
    }

    console.log('----------------------------------------------------------------------');
  };
};

dynamo.createTables(function (err) {
  if(err) {
    console.log('failed to create table', err);
  }

  //Query
  Account.query('Test 2').where('email').gte('a@example.com').attributes(['email','createdAt']).returnConsumedCapacity().exec(printResults);

  //get request
  Account.get('test11@example.com', printAccountInfo);
  Account.get('test@test.com', printAccountInfo);
  Account.scan().exec(printScanResults);

  // Create
  let params = {
    email: 'test11@example.com', name : 'test 11', age: 21, scores : [22, 55, 44],
    list : ['a', 'b', 'c', 1, 2, 3],
    settings : {nickname : 'tester'}
  };

  Account.create(params, function (err, acc) {
    printAccountInfo(err, acc);
  });


  //update
  Account.update({email : 'test11@example.com', age : {$add : 1}}, function (err, acc) {
  console.log('incremented age', acc.get('age'));
});

});
