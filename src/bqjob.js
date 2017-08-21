import BigQuery from "./bqclient.js";
import config from "./config";

export function bqjob(credentials) {
  const bq = new BigQuery(credentials);
  return function(rows) {
    const { projectId, datasetId, tableId } = config;
    return bq.insert(projectId, datasetId, tableId, rows);
  };
}
