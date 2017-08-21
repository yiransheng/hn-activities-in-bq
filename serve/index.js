"use latest";

var BQ = require("@google-cloud/bigquery");

function query(projectId, datasetId, tableId, credentials) {
  const bigquery = BQ({
    projectId: projectId,
    credentials: credentials
  });
  const query = `
    SELECT
      *
    FROM
      \`${projectId}.${datasetId}.${tableId}\`
    LIMIT
      10000;
  `;
  const queryConfig = {
    query: query,
    useLegacySql: false // Use standard SQL syntax for queries.
  };

  let job;
  // Runs the query as a job
  return bigquery
    .startQuery(queryConfig)
    .then(results => {
      job = results[0];
      console.log(`Job ${job.id} started.`);
      return job.promise();
    })
    .then(results => {
      // Get the job's status
      return job.getMetadata();
    })
    .then(metadata => {
      // Check the job's status for errors
      const errors = metadata[0].status.errors;
      if (errors && errors.length > 0) {
        throw errors;
      }
    })
    .then(() => {
      console.log(`Job ${job.id} completed.`);
      return job.getQueryResults();
    })
    .then(results => {
      const rows = results[0];
      return rows;
    })
    .catch(err => {
      console.error("ERROR:", err);
    });
}

module.exports = function(context, callback) {
  const bqCreds = JSON.parse(context.secrets.gcloud);
  const projectId = context.secrets.projectId;
  const datasetId = context.secrets.datasetId;
  const tableId = context.secrets.tableId;
  query(projectId, datasetId, tableId, bqCreds)
    .then(results => {
      callback(null, result);
    })
    .catch(err => callback(err, null));
};
