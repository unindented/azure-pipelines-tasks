expect.assertions(1);

process.on("unhandledRejection", (err) => {
  // eslint-disable-next-line @typescript-eslint/no-throw-literal
  throw err;
});

jest.mock("azure-pipelines-task-lib/task", () => ({
  debug: jest.fn(),
}));
