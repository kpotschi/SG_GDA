import DemoApp from "./DemoApp.js";

if (process.env.NODE_ENV === "LOCAL") {
  console.log("Loaded esbuild watch listener");
  new EventSource("/esbuild").addEventListener("change", () =>
    location.reload(),
  );
}

new DemoApp();
