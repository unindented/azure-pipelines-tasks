import { WebApi } from "azure-devops-node-api";
import { CommentThread } from "azure-devops-node-api/interfaces/GitInterfaces";
import { TaskResult, debug, setResult } from "azure-pipelines-task-lib/task";

import { Inputs } from "./types";

export const run = async (inputs: Inputs): Promise<void> => {
  debugInputs(inputs);

  try {
    await deleteComments(inputs);

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

const deleteComments = async ({
  serverUrl,
  authHandler,
  repositoryId,
  projectId,
  pullRequestId,
  author,
  olderThan,
}: Inputs): Promise<void> => {
  const pullRequestIdNum = parseInt(pullRequestId, 10);
  const olderThanNum = olderThan ? parseInt(olderThan, 10) : undefined;

  const webApi = new WebApi(serverUrl, authHandler);
  await webApi.connect();

  const gitApi = await webApi.getGitApi();

  const threads: CommentThread[] = await gitApi.getThreads(
    repositoryId,
    pullRequestIdNum,
    projectId
  );

  for (const thread of threads) {
    if (thread.id == null) {
      continue;
    }

    const comments = await gitApi.getComments(
      repositoryId,
      pullRequestIdNum,
      thread.id,
      projectId
    );

    for (const comment of comments) {
      if (comment.id == null || comment.isDeleted) {
        continue;
      }

      const cutoffDate = olderThanNum
        ? new Date(new Date().getTime() - olderThanNum * 1000)
        : undefined;
      const isTargetDate = cutoffDate
        ? comment.publishedDate && comment.publishedDate < cutoffDate
        : true;
      const isTargetAuthor = comment.author?.id === author;

      if (!isTargetAuthor || !isTargetDate) {
        continue;
      }

      await gitApi.deleteComment(
        repositoryId,
        pullRequestIdNum,
        thread.id,
        comment.id,
        projectId
      );
    }
  }
};
