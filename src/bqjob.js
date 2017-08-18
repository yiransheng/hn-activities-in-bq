import bq from "@google-cloud/bigquery";
import config from "./config";

export function bqjob(rows) {
  const { projectId, datasetId, tableId } = config;
  const table = bq({
    projectId
  })
    .dataset(datasetId)
    .table(tableId);

  return table.insert(rows, {
    load: {
      autodetect: true,
      createDisposition: "CREATE_IF_NEEDED",
      writeDisposition: "WRITE_APPEND",
      destinationTable: {
        projectId: projectId,
        datasetId: datasetId,
        tableId: tableId
      },
      sourceFormat: "NEWLINE_DELIMITED_JSON"
    },
    ignoreUnknownValues: true
  });
}
