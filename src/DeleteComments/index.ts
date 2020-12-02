import { getInput } from "azure-pipelines-task-lib/task";

import { getAuthHandler, getServerUrl, getVariable } from "../shared";

import { run } from "./runner";
import { Inputs } from "./types";

const inputs: Inputs = {
  authHandler: getAuthHandler(),
  serverUrl: getServerUrl(),
  repositoryId: getVariable(
    "build.repository.id",
    true
  ) as Inputs["repositoryId"],
  projectId: getVariable("system.teamProjectId", true) as Inputs["projectId"],
  projectName: getVariable("system.teamProject", true) as Inputs["projectName"],
  pullRequestId: getVariable(
    "system.pullRequest.pullRequestId",
    true
  ) as Inputs["pullRequestId"],
  author: getInput("author", true) as Inputs["author"],
  olderThan: getInput("olderThan", false),
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run(inputs);
