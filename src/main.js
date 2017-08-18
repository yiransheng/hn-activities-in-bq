import zip from "lodash.zip";
import shortid from "shortid";

import { HNApiClient } from "./hnapi";
import { sleep } from "./utils";
import { computeEntryFromStoryPair, getRank } from "./stats";

const SAMPLE_INTERVAL = 30 * 1000; // 30 seconds

async function task() {
  const taskId = shortid();
  const client = new HNApiClient();
  const beginTimestamp = Date.now();

  const stories = await client.frontpageStories();
  const topIdsBefore = await client.topitemIds();
  const beforeEntries = stories.map(story => {
    return {
      story,
      timestamp: beginTimestamp,
      rank: getRank(topIdsBefore, story.id)
    };
  });
  const timeTook = Date.now() - beginTimestamp;

  await sleep(SAMPLE_INTERVAL - timeTook);
  const endTimestamp = Date.now();
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
    Object.assign(computeEntryFromStoryPair(before, after), { taskId })
  );
  return entries;
}

task().then(console.log.bind(console));
