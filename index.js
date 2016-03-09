#!/usr/bin/env node
'use strict';

const AWS = require('aws-sdk');

const cwLogs = new AWS.CloudWatchLogs();

if (process.argv.length === 2) {
  const groups = require('./lib/groups');
  groups(cwLogs);
} else {
  const logs = require('./lib/logs');

  const logGroupName = process.env.AWS_GROUP_NAME || process.argv[2];
  const logStreamName = process.env.AWS_STREAM_NAME || process.argv[3];

  logs(cwLogs, logGroupName, logStreamName);
}
