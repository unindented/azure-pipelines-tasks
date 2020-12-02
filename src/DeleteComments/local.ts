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
  author: process.env.DELETE_AUTHOR as Inputs["author"],
  olderThan: process.env.DELETE_OLDER_THAN,
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run(inputs);
