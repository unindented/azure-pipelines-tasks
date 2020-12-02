import { resolve } from "path";

import CopyPlugin from "copy-webpack-plugin";
import { Configuration } from "webpack";

const config: Configuration = {
  entry: {
    "PostToobigResults/index": "./src/PostToobigResults/index.ts",
    "DeleteComments/index": "./src/DeleteComments/index.ts",
  },

  output: {
    filename: "[name].js",
    path: resolve(__dirname, "dist"),
  },

  target: "node" as const,
  externals: {
    "azure-devops-node-api": "commonjs2 azure-devops-node-api",
    "azure-pipelines-task-lib/task": "commonjs2 azure-pipelines-task-lib/task",
    toobig: "commonjs2 toobig",
  },

  devtool: false,

  resolve: {
    extensions: [".ts", ".js"],
  },

  module: {
    rules: [
      {
        test: /\.ts$/u,
        use: {
          loader: "ts-loader",
          options: {
            configFile: "tsconfig.dist.json",
          },
        },
        include: [resolve(__dirname, "src")],
      },
    ],
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        { context: "src", from: "*/node_modules/**", toType: "dir" },
        { context: "src", from: "*/icon.png" },
        { context: "src", from: "*/task.json" },
      ],
    }),
  ],
};

export default config;
