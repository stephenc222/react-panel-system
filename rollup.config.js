import babel from "@rollup/plugin-babel"
import external from "rollup-plugin-peer-deps-external"
import peerDepsExternal from "rollup-plugin-peer-deps-external"
import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import typescript from "rollup-plugin-typescript2"
import css from "rollup-plugin-merge-and-inject-css"
import pkg from "./package.json"

export default {
  external: ["react", "react-dom"],
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      exports: "named",
    },
    {
      file: pkg.module,
      format: "esm",
      exports: "named",
    },
  ],
  plugins: [
    external({
      packageJsonPath: "./package.json",
      includeDependencies: true,
    }),
    css({
      id: "react-panel-system",
    }),
    resolve(),
    peerDepsExternal(),
    typescript({ useTsconfigDeclarationDir: true }),
    commonjs({
      include: ["node_modules/**"],
      exclude: "node_modules/react**",
    }),
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
    }),
  ],
}
