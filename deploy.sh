#!/bin/sh

# remove previous tasks
wt rm hnstats_collect
wt rm hnstats_serve

npm run build
wt cron schedule 60m ./dist/index.js --name hnstats_collect --secrets-file $WT_SECRET_FILE
wt create ./serve/index.js --name hnstats_serve --secrets-file $WT_SECRET_FILE
