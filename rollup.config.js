import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import json from "rollup-plugin-json";
import alias from "rollup-plugin-alias";
import pkg from "./package.json";

import path from "path";

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
      "mime",
      "stream",
      "request",
      "util",
      "events",
      "buffer",
      "punycode",
      "fs",
      "path",
      "querystring",
      "child_process",
      "os",
      "array-uniq",
      "arrify",
      "extend"
      // "google-service-account"
    ],
    plugins: [
      babel({
        exclude: "node_modules/**"
      }),
      alias({
        "google-p12-pem": path.resolve(__dirname, "./empty-module.js")
      }),
      resolve(),
      commonjs(),
      json()
    ],
    targets: [
      { dest: pkg.main, format: "cjs" }
      // { dest: pkg.module, format: "es" }
    ]
  }
];
