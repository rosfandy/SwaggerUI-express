#!/usr/bin/env node
const { Command } = require("commander");
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const program = new Command();

const HTTP_METHODS = [
  { method: "get", label: "get" },
  { method: "getId", label: "get", path: "/{id}" },
  { method: "post", label: "post" },
  { method: "put", label: "put", path: "/{id}" },
  { method: "delete", label: "delete", path: "/{id}" },
];

program
  .name("generate")
  .description("Generate resource folder and YAML entries in OpenAPI docs")
  .argument(
    "<resource>",
    'Nama resource, misalnya "user", "product", atau "squads"'
  )
  .action((resource) => {
    const baseDir = path.join(__dirname, "docs", "paths", resource);
    fs.mkdirSync(baseDir, { recursive: true });

    HTTP_METHODS.forEach(({ method }) => {
      const filename = `${resource}.${method}.yaml`;
      const filePath = path.join(baseDir, filename);

      if (!fs.existsSync(filePath)) {
        const yamlContent = {
          tags: [resource],
        };

        const content =
          `# ${filename}\n` + yaml.dump(yamlContent, { lineWidth: -1 });
        fs.writeFileSync(filePath, content);
        console.log(`✔️ Created: ${filePath}`);
      } else {
        console.log(`⚠️ Already exists: ${filePath}`);
      }
    });

    // Update openapi.yaml
    const openapiPath = path.join(__dirname, "docs", "openapi.yaml");
    if (!fs.existsSync(openapiPath)) {
      console.error("❌ openapi.yaml tidak ditemukan!");
      return;
    }

    const doc = yaml.load(fs.readFileSync(openapiPath, "utf8"));

    if (!doc.paths) doc.paths = {};

    const basePath = `/${resource}`;
    if (!doc.paths[basePath]) doc.paths[basePath] = {};

    HTTP_METHODS.forEach(({ method, label, path: subpath }) => {
      const targetPath = subpath ? `${basePath}${subpath}` : basePath;

      if (!doc.paths[targetPath]) doc.paths[targetPath] = {};
      if (!doc.paths[targetPath][label]) {
        doc.paths[targetPath][label] = {
          $ref: `./paths/${resource}/${resource}.${method}.yaml`,
        };
        console.log(`➕ Added path: ${targetPath} [${label}]`);
      }
    });

    fs.writeFileSync(openapiPath, yaml.dump(doc, { lineWidth: -1 }));
    console.log("✅ openapi.yaml updated.");
  });

program.parse();
