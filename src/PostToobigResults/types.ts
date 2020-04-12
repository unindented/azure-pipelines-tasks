import { IRequestHandler } from "azure-devops-node-api/interfaces/common/VsoBaseInterfaces";

export interface Inputs {
  readonly authHandler: IRequestHandler;
  readonly serverUrl: string;
  readonly repositoryId: string;
  readonly projectId: string;
  readonly projectName: string;
  readonly pullRequestId: string;
  readonly resultsFileType: "filePath" | "url";
  readonly resultsFilePath?: string;
  readonly resultsFileUrl?: string;
  readonly baselinesFileType?: "filePath" | "url";
  readonly baselinesFilePath?: string;
  readonly baselinesFileUrl?: string;
}
