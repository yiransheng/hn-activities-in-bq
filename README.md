# Draft

## Metrics to CRON

* Median age of frontpage stories (type: time interval)
* Story points delta for top frontpage stories (type: int, unit: Nat)
* Comment count delta for top frontpage stories (type: int, unit: Nat)
  - by rank

## Entity Def

```
{
  task_id : uid,
  story_id : int,
  interval_begin : TIMESTAMP,
  interval_end : TIMESTAMP,
  story_rank_begin: int,
  story_rank_end: int,
  story_createdat: TIMESTAMP,
  story_point_begin : int,
  story_point_delta : int,
  comment_count_begin: int,
  comment_count_delta : int
}
```



## LESSON learned: _RTFM_

I was wondering how to `require` or `import` npm modules in my `webtask` script, as it was fairly obvious I would need libraries, particularly a BigQuery node client.



When reading through `webtask`'s documentation, I found the section on [pre-installed modules](https://webtask.io/docs/modules). And for some reason, I came to the conclusion that for anything outside the provided list - I would need to inline it into final script myself. And missed entirely the part about associating custom module with a webtask script. 



Thanks to this misconception, I was sent to a path of hunting dozens of npm packages and unconventional `rollup` sorcery. Lesson learned: read the *damn* manual. 



Packaging library and application code into a single bundle is a very common task in client-side javascript, accomplished by great tools such as `webpack`, `browserify` and `rollup`. I picked `rollup` as it has the nicest output in terms or readability: every library export is flattened into a single scope. 



Little did I know, how bloated even the simplest npm libraries truly are!

## Journey to a Small Bundle

The official node client for BigQuery is `@google-clould/bigquery`, and it is something I have worked with in the past. Unfortunately when bundled by `rollup` its source (and sources of its dependencies) bloats my `dist/index.js` to an enormous 50k lines. The bundle exceeds `webtask`'s file size limit by a wild margin.



Of course, after checking [here](https://tehsis.github.io/webtaskio-canirequire/), this `@google-clould/bigquery` is not included in `webtask`'s default module libraries. Therefore, I cannot simply tell `rollup` to treat `@google-clould/bigquery` as an external dependency and exclude it from the final output. However, there _still_ is an angle of attack: dependencies of the library and their dependencies. For starter, `@google-clould/bigquery` depends on `@google-clould/common` which depends on a big list of nodejs stream related libs such as:

* `stream`
* `concat-stream`
* `events`
* `duplexify`
* ...

Many of these libraries are included on `webtask`, and I could safely mark them as "external". So I dove into `node_modules` and started cross-referencing the dependency graph of `@google-clould/bigquery` and `webtask`. Unfortunately, even after marking all available modules as "external" remaining bundle was still enormous (I even tried to minify it, the final version was still 10 times the size limit). At this time, I'd already wasted a few hours, it was quite frustrating to hit a dead end.



My next step was not to use the _official_ BigQuery client. There are a number of leaner unoffical client libraries on npm, unfortunately none of them supports `tabledata.insertAll` api (which is a relatively new feature from BigQuery). I am left with the choice of rolling my own. 



Talking to BigQuery (or most google cloud service) programmable involves three steps:

1. Create a Service Account, and generate a JSON key
2. Use the private key and make an OAuth request to google with correct [scopes]()
3. Add OAuth token to subsequent http api calls as `Authorization` header

Step 2 is infeasible to do by hand - as a lot intricacies are involved with respect to both OAuth and Google's token signing process. I would still need a library and bundle it into my final `webtask` script. After trying many options, I finally settled on `google-service-account` (https://github.com/stephenplusplus/google-service-account).



Once included this library and marking some of its dependencies as "external" (eg. `request`), I was excited to run `npm run build`. Final file size: about 300k - very close, yet still not ready. Further digging reveals most of the bloat comes from `gtoken` library, which has the following `package.json`:

```
"dependencies": {
  "google-p12-pem": "^0.1.0",
  "jws": "^3.0.0",
  "mime": "^1.2.11",  // provided by webtask
  "request": "^2.72.0"  // provied by webtask
}
```



Among these four, `google-p12-pem` is the biggest offender. Based on its name it has something to do with Google's P12 key (legacy bq credential). Since I am using JSON key, I suspected this module is entirely unnecessary. Reading the source of `gtoken` confirmed my suspicion. Unfortunately as `gtoken` is a commonjs package, `rollup` was not able to do it magic and tree-shake away `google-p12-pem`. Time for some manual intervention. 



A few google searches later, I found the perfect solution: [rollup-plugin-alias](https://www.npmjs.com/package/rollup-plugin-alias). By adding the following to my `rollup.config.js`, I was able to replace the exports of `google-p12-pem` with an empty object:

```
      alias({
        "google-p12-pem": path.resolve(__dirname, "./empty-module.js")
      })
```

Contents of `empty-module.js`:

```
module.exports = {};
```



With that, my bundle was shrunk to 86kb. Success!