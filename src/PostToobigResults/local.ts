import { getPersonalAccessTokenHandler } from "azure-devops-node-api";

import { run } from "./runner";
import { Inputs } from "./types";

const inputs: Inputs = {
  authHandler: getPersonalAccessTokenHandler(process.env.ADO_TOKEN as string),
  serverUrl: process.env.ADO_SERVER_URL as Inputs["serverUrl"],
  repositoryId: process.env.ADO_REPOSITORY_ID as Inputs["repositoryId"],
  projectId: process.env.ADO_PROJECT_ID as Inputs["projectId"],
  projectName: process.env.ADO_PROJECT_NAME as Inputs["projectName"],
  pullRequestId: process.env.ADO_PULL_REQUEST_ID as Inputs["pullRequestId"],
  resultsFileType: process.env
    .TOOBIG_RESULTS_FILE_TYPE as Inputs["resultsFileType"],
  resultsFilePath: process.env.TOOBIG_RESULTS_FILE_PATH,
  resultsFileUrl: process.env.TOOBIG_RESULTS_FILE_URL,
  baselinesFileType: process.env
    .TOOBIG_BASELINES_FILE_TYPE as Inputs["baselinesFileType"],
  baselinesFilePath: process.env.TOOBIG_BASELINES_FILE_PATH,
  baselinesFileUrl: process.env.TOOBIG_BASELINES_FILE_URL,
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run(inputs);
