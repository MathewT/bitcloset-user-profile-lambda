'use strict';

var jwt = require('jsonwebtoken');
var request = require('request');
var AWS = require('aws-sdk');

exports.handler = function(event, context, callback){
    console.log('bitcloset test: user profile lambda.');

    if (!event.myAuthToken) {
        callback("Err: bitcloset-user-profile-lambda: Could not find myAuthToken.");
        return;
    }

    var token = event.myAuthToken.split(' ')[1];
    var secretBuffer = new Buffer(process.env.AUTH0_SECRET);
    jwt.verify(token, secretBuffer, function(err, decoded){
        if(err){
                console.log('Failed jwt verification: ', err, 'auth: ', event.myAuthToken);
                callback('Authorization Failed');
        } else {
        console.log("jwt verification success!");
        var body = {
          'id_token': token
        };

        var options = {
          url: 'https://'+ process.env.DOMAIN + '/tokeninfo',
          method: 'POST',
          json: true,
          body: body
        };

        request(options, function(error, response, body){
          if (!error && response.statusCode === 200) {
            callback(null, body);
          } else {
            callback(error);
          }
        });
        }
    })
};
