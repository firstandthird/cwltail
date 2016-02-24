/* eslint-disable no-console */
'use strict';

const AWS = require('aws-sdk');

const cwLogs = new AWS.CloudWatchLogs();

const logGroupName = process.env.AWS_GROUP_NAME || process.argv[2];

if (!logGroupName) {
  console.log('must pass in log group name');
  process.exit(1);
}

const initialParams = {
  logGroupName,
  interleaved: true
};

let count = 0;
const max = 300;
const interval = 5 * 1000;

const getLogs = (params) => {
  params.startTime = new Date().getTime() - interval;

  cwLogs.filterLogEvents(params, (error, data) => {
    if (error) {
      console.log(error);
    }

    if (data.events.length !== 0) {
      data.events.forEach((event) => {
        const d = new Date(event.timestamp);
        console.log(`${d}: ${event.message}`);
      });
    }

    params.nextToken = data.nextForwardToken;

    count++;
    if (count === max) {
      console.log('--- All Done ---');
      process.exit(0);
    }
    setTimeout(getLogs, interval, params);
  });
};

getLogs(initialParams);

