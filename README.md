# Draft

## Metrics to CRON

* Median age of frontpage stories (type: time interval)
* Story points delta for top frontpage stories (type: int, unit: Nat)
* Comment count delta for top frontpage stories (type: int, unit: Nat)
  - by rank

## Enity Def

```
{
  entry_uid : uuid,
  story_id : int,
  interval_begin : TIMESTAMP,
  // interval_end : TIMESTAMP,
  interval_length : TIME INTERVASL,
  story_rank_begin: int,
  story_rank_end: int,
  story_created_at: TIMESTAMP,
  story_point_begin : int,
  // story_point_end : int,
  story_point_delta : int,
  comment_count_begin: int,
  // comment_count_end : int,
  comment_count_delta : int
}
```
