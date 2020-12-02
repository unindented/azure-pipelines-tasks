import { getBearerHandler } from "azure-devops-node-api";
import { IRequestHandler } from "azure-devops-node-api/interfaces/common/VsoBaseInterfaces";
import {
  getEndpointAuthorizationParameter,
  getEndpointUrl,
  getPathInput,
  getVariable as getVariableBuiltin,
  stats,
} from "azure-pipelines-task-lib/task";

export function assertIsDefined<T>(
  value: T,
  message: string
): asserts value is NonNullable<T> {
  if (value == null) {
    throw new Error(message);
  }
}

export const getVariable = (
  name: string,
  required?: boolean
): string | undefined => {
  const value = getVariableBuiltin(name);

  if (required) {
    assertIsDefined(value, `Variable required: ${name}`);
  }

  return value;
};

export const getFilePathInput = (
  name: string,
  required?: boolean,
  check?: boolean
): string | undefined => {
  const value = getPathInput(name, required, check);
  const isFile = value && check ? stats(value).isFile() : false;

  if (required && check && !isFile) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    throw new Error(`Input is not a file: ${value}`);
  }

  return !check || isFile ? value : undefined;
};

export const getAuthHandler = (): IRequestHandler => {
  const token = getEndpointAuthorizationParameter(
    "SYSTEMVSSCONNECTION",
    "ACCESSTOKEN",
    false
  );
  assertIsDefined(token, "Token required");
  return getBearerHandler(token);
};

export const getServerUrl = (): string =>
  getEndpointUrl("SYSTEMVSSCONNECTION", false);
