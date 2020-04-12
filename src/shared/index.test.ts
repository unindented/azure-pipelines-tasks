jest.mock("azure-devops-node-api", () => ({
  getBearerHandler: jest.fn().mockName("getBearerHandler"),
}));
jest.mock("azure-pipelines-task-lib/task", () => ({
  getEndpointAuthorizationParameter: jest
    .fn()
    .mockName("getEndpointAuthorizationParameter"),
  getEndpointUrl: jest.fn().mockName("getEndpointUrl"),
  getPathInput: jest.fn().mockName("getPathInput"),
  getVariable: jest.fn().mockName("getVariable"),
  stats: jest.fn().mockName("stats"),
}));

import { getBearerHandler } from "azure-devops-node-api";
import {
  getEndpointAuthorizationParameter,
  getEndpointUrl,
  getPathInput,
  getVariable as getVariableBuiltin,
  stats,
} from "azure-pipelines-task-lib/task";

import {
  assertIsDefined,
  getAuthHandler,
  getFilePathInput,
  getServerUrl,
  getVariable,
} from ".";

describe(".assertIsDefined", () => {
  it("throws when the value is undefined", () => {
    expect(() => {
      assertIsDefined(undefined, "BOOM");
    }).toThrow("BOOM");
  });

  it("throws when the value is null", () => {
    expect(() => {
      assertIsDefined(null, "BOOM");
    }).toThrow("BOOM");
  });

  it("does not throw when the value is defined", () => {
    expect(() => {
      assertIsDefined("OK", "This is fine.");
    }).not.toThrow();
  });
});

describe(".getVariable", () => {
  it("does not throw when the variable is not required and is not defined", () => {
    (getVariableBuiltin as jest.Mock).mockReturnValue(undefined);
    expect(getVariable("some.variable")).toBeUndefined();
  });

  it("does not throw when the variable is not required and is defined", () => {
    (getVariableBuiltin as jest.Mock).mockReturnValue("OK");
    expect(getVariable("some.variable")).toBe("OK");
  });

  it("throws when the variable is required but is not defined", () => {
    (getVariableBuiltin as jest.Mock).mockReturnValue(undefined);
    expect(() => {
      getVariable("some.variable", true);
    }).toThrowErrorMatchingInlineSnapshot(`"Variable required: some.variable"`);
  });

  it("does not throw when the variable is required and is defined", () => {
    (getVariableBuiltin as jest.Mock).mockReturnValue("OK");
    expect(getVariable("some.variable", true)).toBe("OK");
  });
});

describe(".getFilePathInput", () => {
  it("does not throw when the input is not required, is not checked, and is not defined", () => {
    (getPathInput as jest.Mock).mockReturnValue(undefined);
    expect(getFilePathInput("some.variable")).toBeUndefined();
  });

  it("does not throw when the input is not required, is checked, and is not defined", () => {
    (getPathInput as jest.Mock).mockReturnValue(undefined);
    expect(getFilePathInput("some.variable", false, true)).toBeUndefined();
  });

  it("does not throw when the input is not required, is not checked, is defined, and points to a file", () => {
    (getPathInput as jest.Mock).mockReturnValue("path/to/file");
    expect(getFilePathInput("some.variable")).toBe("path/to/file");
  });

  it("does not throw when the input is not required, is not checked, is defined, and points to a directory", () => {
    (getPathInput as jest.Mock).mockReturnValue("path/to/dir");
    expect(getFilePathInput("some.variable")).toBe("path/to/dir");
  });

  it("does not throw when the input is not required, is checked, is defined, and points to a file", () => {
    (getPathInput as jest.Mock).mockReturnValue("path/to/file");
    (stats as jest.Mock).mockReturnValue({ isFile: () => true });
    expect(getFilePathInput("some.variable", false, true)).toBe("path/to/file");
  });

  it("does not throw when the input is not required, is checked, is defined, and points to a directory", () => {
    (getPathInput as jest.Mock).mockReturnValue("path/to/dir");
    (stats as jest.Mock).mockReturnValue({ isFile: () => false });
    expect(getFilePathInput("some.variable", false, true)).toBeUndefined();
  });

  it("does not throw when the input is required, is not checked, is defined, and points to a file", () => {
    (getPathInput as jest.Mock).mockReturnValue("path/to/file");
    expect(getFilePathInput("some.variable", true)).toBe("path/to/file");
  });

  it("does not throw when the input is required, is not checked, is defined, and points to a directory", () => {
    (getPathInput as jest.Mock).mockReturnValue("path/to/dir");
    expect(getFilePathInput("some.variable", true)).toBe("path/to/dir");
  });

  it("does not throw when the input is required, is checked, is defined, and points to a file", () => {
    (getPathInput as jest.Mock).mockReturnValue("path/to/file");
    (stats as jest.Mock).mockReturnValue({ isFile: () => true });
    expect(getFilePathInput("some.variable", true, true)).toBe("path/to/file");
  });

  it("throws when the input is required, is checked, is defined, and points to a directory", () => {
    (getPathInput as jest.Mock).mockReturnValue("path/to/dir");
    (stats as jest.Mock).mockReturnValue({ isFile: () => false });
    expect(() => {
      getFilePathInput("some.variable", true, true);
    }).toThrowErrorMatchingInlineSnapshot(`"Input is not a file: path/to/dir"`);
  });
});

describe(".getAuthHandler", () => {
  it("throws when the token is not defined", () => {
    (getEndpointAuthorizationParameter as jest.Mock).mockReturnValue(null);
    expect(() => {
      getAuthHandler();
    }).toThrowErrorMatchingInlineSnapshot(`"Token required"`);
  });

  it("returns the bearer handler when the token is defined", () => {
    (getEndpointAuthorizationParameter as jest.Mock).mockReturnValue("TOKEN");
    (getBearerHandler as jest.Mock).mockImplementation(
      (token: string): string => `Bearer for "${token}"`
    );
    expect(getAuthHandler()).toBe('Bearer for "TOKEN"');
  });
});

describe(".getServerUrl", () => {
  it("returns the server URL", () => {
    (getEndpointUrl as jest.Mock).mockReturnValue("URL");
    expect(getServerUrl()).toBe("URL");
  });
});
