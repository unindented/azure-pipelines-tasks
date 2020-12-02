/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import glob from "fast-glob";
import { readJson, writeJson } from "fs-extra";
import semanticRelease from "semantic-release";

const pkg = require("../../package.json") as { version: string };

const run = async (): Promise<void> => {
  const result = await semanticRelease({ dryRun: true });
  const newVersion = result ? result.nextRelease.version : pkg.version;

  await updateTasks(newVersion);
  await updateExtension(newVersion);
};

const tasksGlob = "src/**/task.json";

const updateTasks = async (version: string): Promise<void> => {
  const [major, minor, patch] = version.split(".");
  const taskPaths = await glob(tasksGlob);
  await Promise.all(
    taskPaths.map(async (taskPath) => {
      const taskFile = await readJson(taskPath);
      taskFile.version = {
        Major: parseInt(major, 10),
        Minor: parseInt(minor, 10),
        Patch: parseInt(patch, 10),
      };
      await writeJson(taskPath, taskFile, { spaces: 2 });
    })
  );
};

const extensionPath = "vss-extension.json";

const updateExtension = async (version: string): Promise<void> => {
  const extensionFile = await readJson(extensionPath);
  extensionFile.version = version;
  await writeJson(extensionPath, extensionFile, { spaces: 2 });
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run();
