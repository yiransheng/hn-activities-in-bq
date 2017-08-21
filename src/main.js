import zip from "lodash.zip";
import shortid from "shortid";

import { HNApiClient } from "./hnapi";
import { sleep } from "./utils";
import { computeEntryFromStoryPair, getRank } from "./stats";
import { bqjob } from "./bqjob";

const SAMPLE_INTERVAL = 60 * 1000; // 60 seconds

async function fetchStats() {
  const taskId = shortid();
  const client = new HNApiClient();
  const beginTimestamp = new Date();

  const stories = await client.frontpageStories();
  const beforeEntries = stories.map(story => {
    return {
      story,
      timestamp: beginTimestamp,
      rank: story.rank
    };
  });
  const timeTook = new Date() - beginTimestamp;

  await sleep(SAMPLE_INTERVAL - timeTook);
  const endTimestamp = new Date();
  const updatedStories = await client.stories(
    ...stories.map(story => story.id)
  );
  const topIdsAfter = await client.topitemIds();
  const afterEntries = updatedStories.map(story => {
    return {
      story,
      timestamp: endTimestamp,
      rank: getRank(topIdsAfter, story.id)
    };
  });
  const entries = zip(beforeEntries, afterEntries).map(([before, after]) =>
    Object.assign(computeEntryFromStoryPair(before, after), { task_id: taskId })
  );
  return entries;
}

async function task(credentials) {
  const bqSubmitJob = bqjob(credentials);
  try {
    await fetchStats().then(bqSubmitJob);
    console.log("Submited to BigQuery");
  } catch (err) {
    console.error("Task failed, reason: ", err);
    return Promise.reject(err);
  }
}

module.exports = function(context, callback) {
  const bqCreds = JSON.parse(context.secrets.key);
  task(bqCreds)
    .then(() => {
      console.log("Task Completed");
      callback(null, { success: true });
    })
    .catch(err => {
      console.error("Task failed, reason: ", err);
      callback(err, null);
    });
};
