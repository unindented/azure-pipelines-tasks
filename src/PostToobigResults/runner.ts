import { Writable } from "stream";

import { WebApi } from "azure-devops-node-api";
import {
  Comment,
  GitPullRequestCommentThread,
} from "azure-devops-node-api/interfaces/GitInterfaces";
import { TaskResult, debug, setResult } from "azure-pipelines-task-lib/task";
import { ReturnValues, loadAndReport } from "toobig";

import { Inputs } from "./types";

export const run = async (inputs: Inputs): Promise<void> => {
  debugInputs(inputs);

  try {
    const {
      anyOverBudget,
      anyUnderBaseline,
      anyOverBaseline,
      report,
    } = await getReport(inputs);

    if (anyOverBudget || anyUnderBaseline || anyOverBaseline) {
      await postComment({ ...inputs, content: report });
    }

    setResult(TaskResult.Succeeded, "");
  } catch (error) {
    setResult(TaskResult.Failed, error);
  }
};

export const debugInputs = (inputs: Inputs): void => {
  Object.keys(inputs).forEach((key) => {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    debug(`${key}: ${inputs[key as keyof Inputs]}`);
  });
};

const getReport = async ({
  resultsFileType,
  resultsFilePath,
  resultsFileUrl,
  baselinesFileType,
  baselinesFilePath,
  baselinesFileUrl,
}: Inputs): Promise<ReturnValues & { report: string }> => {
  const results = (resultsFileType === "filePath"
    ? resultsFilePath
    : resultsFileUrl) as string;
  const baselines =
    baselinesFileType === "filePath" ? baselinesFilePath : baselinesFileUrl;

  const tableOutput: string[] = [];
  const tableStream = new Writable({
    write(chunk: Buffer | string, _encoding, callback): void {
      tableOutput.push(chunk.toString());
      callback();
    },
  });

  const returnValues = await loadAndReport({
    results,
    baselines,
    reporters: [
      [
        "table",
        {
          template: "markdown",
          color: false,
          maxPathLength: 36,
          verbose: false,
          output: tableStream,
        },
      ],
    ],
  });

  const report = tableOutput
    .join("")
    .replace(
      /\u{2717}/gu,
      "![Fail](https://unindented.github.io/toobig/failMark.svg)"
    )
    .replace(
      /\u{2713}/gu,
      "![Pass](https://unindented.github.io/toobig/passMark.svg)"
    )
    .replace(
      /\u{25B2}/gu,
      "![Up](https://unindented.github.io/toobig/upArrow.svg)"
    )
    .replace(
      /\u{25BC}/gu,
      "![Down](https://unindented.github.io/toobig/downArrow.svg)"
    );

  return { ...returnValues, report };
};

const postComment = async ({
  serverUrl,
  authHandler,
  repositoryId,
  projectId,
  pullRequestId,
  content,
}: Inputs & { content: string }): Promise<void> => {
  const reportComment: Comment = { content };
  const commentThread: GitPullRequestCommentThread = {
    comments: [reportComment],
  };

  const webApi = new WebApi(serverUrl, authHandler);
  await webApi.connect();

  const gitApi = await webApi.getGitApi();
  await gitApi.createThread(
    commentThread,
    repositoryId,
    parseInt(pullRequestId, 10),
    projectId
  );
};
