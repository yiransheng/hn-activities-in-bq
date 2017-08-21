import axios from "axios";
import serviceAccount from "google-service-account";

export default class BigQuery {
  constructor(credentials) {
    this._authorize = serviceAccount({
      credentials,
      scopes: [
        "https://www.googleapis.com/auth/bigquery",
        // "https://www.googleapis.com/auth/cloud-platform",
        "https://www.googleapis.com/auth/bigquery.insertdata"
      ]
    });
  }
  insert(projectId, datasetId, tableId, rows) {
    // https://cloud.google.com/bigquery/docs/reference/rest/v2/tabledata/insertAll
    // https://github.com/GoogleCloudPlatform/google-cloud-node/blob/ebcda2036a750a0c93ba4cc159e55d9441031f46/packages/bigquery/src/table.js#L1170

    const url = `https://www.googleapis.com/bigquery/v2/projects/${projectId}/datasets/${datasetId}/tables/${tableId}/insertAll`;
    const requestBody = {
      kind: "bigquery#tableDataInsertAllRequest",
      skipInvalidRows: true,
      ignoreUnknownValues: true,
      // templateSuffix: string,
      rows: rows.map(r => ({ json: r }))
    };
    return new Promise((resolve, reject) => {
      this._authorize((err, headers) => {
        if (err) {
          reject(err);
        } else {
          resolve(headers);
        }
      });
    }).then(options => {
      return axios.post(url, requestBody, options);
    });
  }
}
