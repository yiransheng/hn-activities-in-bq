export function getRank(topIds, storyId) {
  const index = topIds.indexOf(storyId);
  // return null if story is not among top500
  // rationale: this value will be written to a BigQuery
  // nullable column
  return index > -1 ? index + 1 : null;
}

export function compareStoryPair(before, after) {
  const {
    story: story_begin,
    timestamp: interval_begin,
    rank: story_rank_begin
  } = before;
  const {
    story: story_end,
    timestamp: interval_end,
    rank: story_rank_end
  } = after;
  const interval_length = interval_end - interval_begin;
  const story_point_begin = story_begin.score;
  const story_point_delta = story_end.score - story_point_begin;
  const comment_count_begin = story_begin.decendents;
  const comment_count_delta = story_end.decendents - comment_count_begin;
  const story_createdat = story_begin.time;
  return {
    story_id: story_begin.id,
    story_createdat,
    interval_begin,
    interval_length,
    story_point_begin,
    story_point_delta,
    comment_count_begin,
    comment_count_delta,
    story_rank_begin,
    story_rank_end
  };
}
