import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import pkg from "./package.json";

export default [
  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // the `targets` option which can specify `dest` and `format`)
  {
    entry: "src/main.js",
    external: ["axios"],
    plugins: [
			resolve(),
      commonjs()
		],
    targets: [
      { dest: pkg.main, format: "cjs" },
      // { dest: pkg.module, format: "es" }
    ]
  }
];
