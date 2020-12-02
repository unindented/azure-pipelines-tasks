import { IRequestHandler } from "azure-devops-node-api/interfaces/common/VsoBaseInterfaces";

export interface Inputs {
  readonly authHandler: IRequestHandler;
  readonly serverUrl: string;
  readonly repositoryId: string;
  readonly projectId: string;
  readonly projectName: string;
  readonly pullRequestId: string;
  readonly author: string;
  readonly olderThan?: string;
}
