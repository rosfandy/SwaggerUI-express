#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");

try {
  execSync("npx swagger-cli --version", { stdio: "ignore" });
} catch (err) {
  console.error("Error: swagger-cli is not installed.");
  console.error("Please install it globally using: npm install -g swagger-cli");
  process.exit(1);
}

const inputFile = "docs/openapi.yaml";
const outputFile = "docs/bundled.yaml";

try {
  execSync(
    `npx swagger-cli bundle ${inputFile} --outfile ${outputFile} --type yaml`,
    { stdio: "inherit" }
  );
  console.log(`✅ Successfully bundled OpenAPI spec to ${outputFile}`);
} catch (err) {
  console.error("❌ Failed to bundle OpenAPI spec:", err.message);
  process.exit(1);
}
