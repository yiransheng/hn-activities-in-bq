import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import json from "rollup-plugin-json";
import pkg from "./package.json";

export default [
  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // the `targets` option which can specify `dest` and `format`)
  {
    entry: "src/main.js",
    external: [
      "axios",
      "crypto",
      "request",
      "util",
      "events",
      "stream",
      "readable-stream",
      "concat-stream",
      "through2",
      "duplexify",
      "buffer",
      "punycode",
      "duplexify",
      "fs",
      "path",
      "querystring",
      "child_process",
      "os"
      // "@google-cloud/bigquery"
    ],
    plugins: [resolve(), commonjs(), json()],
    targets: [
      { dest: pkg.main, format: "cjs" }
      // { dest: pkg.module, format: "es" }
    ]
  }
];
