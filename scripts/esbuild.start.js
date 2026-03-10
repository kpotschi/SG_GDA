import esbuild from "esbuild";
import { copy } from "esbuild-plugin-copy";

const context = await esbuild.context({
  logLevel: "info",
  entryPoints: ["src/main.ts", "src/index.html"],
  bundle: true,
  outdir: "dist",
  sourcemap: true,
  platform: "browser",
  loader: {
    ".html": "copy",
    // ".css": "css",
    // ".png": "file",
  },
  format: "esm",
  define: {
    "process.env.NODE_ENV": `"${process.env.NODE_ENV}"`,
  },
  plugins: [
    copy({
      assets: {
        from: ["./src/assets/**/*"],
        to: ["./assets"],
      },
      watch: true,
    }),
  ],
});

// Manually do an incremental build
const result = await context.rebuild();

// Enable watch mode
await context.watch();

// Enable serve mode
await context.serve({ servedir: "./dist" });

// Dispose of the context
// context.dispose();
