import { HNApiClient } from "./hnapi";
import { sleep } from "./utils";
import { computeEntryFromStoryPair, getRank } from "./stats";
import zip from "lodash.zip";

const SAMPLE_INTERVAL = 30 * 1000; // 30 seconds

async function task() {
  const client = new HNApiClient();
  const beginTimestamp = Date.now();

  const stories = await client.frontpageStories();
  const beforeEntries = stories.map((story, index) => {
    return {
      story,
      timestamp: beginTimestamp,
      rank: index + 1
    };
  });
  const timeTook = Date.now() - beginTimestamp;

  await sleep(SAMPLE_INTERVAL - timeTook);
  const endTimestamp = Date.now();
  const updatedStories = await client.stories(
    ...stories.map(story => story.id)
  );
  const topIds = await client.topstoryIds();
  const afterEntries = updatedStories.map(story => {
    return {
      story,
      timestamp: endTimestamp,
      rank: getRank(topIds, story.id)
    };
  });
  const entries = zip(beforeEntries, afterEntries).map(([before, after]) =>
    computeEntryFromStoryPair(before, after)
  );
  return entries;
}

task().then(console.log.bind(console));
