const chokidar = require("chokidar");
const { exec } = require("child_process");

const pathsToWatch = ["docs/openapi.yaml", "docs/paths"];

const watcher = chokidar.watch(pathsToWatch, {
  persistent: true,
  ignoreInitial: true,
});

console.log("👀 Watching OpenAPI files for changes...");

watcher.on("change", (path) => {
  console.log(`📄 File changed: ${path}`);
  console.log("🔄 Running script...");
  exec("node script.js", (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Error during bundling: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`⚠️ stderr: ${stderr}`);
    }
    console.log(`✅ Bundling complete:
${stdout}`);
  });
});
