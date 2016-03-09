'use strict';
module.exports = (cwlogs, logGroupName, logStreamName) => {
  const initialParams = {
    logGroupName,
    interleaved: true
  };

  if (logStreamName) {
    initialParams.logStreamNames = [logStreamName];
  }

  let count = 0;
  const max = 300;
  const defaultInterval = 5 * 1000;

  const getLogs = (params, startTime, limit) => {
    params.startTime = new Date().getTime() - startTime;

    params.limit = limit || null;

    console.log(`Fetching logs since ${new Date(params.startTime).toTimeString()} (${count}/${max})`);

    cwlogs.filterLogEvents(params, (error, data) => {
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
      setTimeout(getLogs, defaultInterval, params, defaultInterval);
    });
  };

  getLogs(initialParams, 1000 * 60 * 30, 30);

};
