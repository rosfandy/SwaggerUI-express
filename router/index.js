const express = require("express");
const swaggerUi = require("swagger-ui-express");
const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");

const swaggerRouter = express.Router();

// Function to find swagger file in multiple possible locations
function findSwaggerFile() {
  const possiblePaths = [
    path.join(__dirname, "../docs/bundled.yaml"),
    path.join(process.cwd(), "docs/bundled.yaml"),
    path.join(__dirname, "../../docs/bundled.yaml"),
    path.join(__dirname, "../../../docs/bundled.yaml"),
    "./docs/bundled.yaml",
  ];

  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      console.log("✅ Found swagger file at:", filePath);
      return filePath;
    }
  }

  throw new Error("❌ Swagger YAML file not found in any expected location");
}

// Debug endpoint to check file system structure
swaggerRouter.get("/debug", (req, res) => {
  const currentDir = __dirname;
  const parentDir = path.join(__dirname, "..");
  const docsDir = path.join(__dirname, "../docs");

  try {
    res.json({
      environment: process.env.NODE_ENV || "development",
      currentDir,
      parentDir,
      docsDir,
      currentDirExists: fs.existsSync(currentDir),
      parentDirExists: fs.existsSync(parentDir),
      docsDirExists: fs.existsSync(docsDir),
      currentDirContents: fs.existsSync(currentDir)
        ? fs.readdirSync(currentDir)
        : [],
      parentDirContents: fs.existsSync(parentDir)
        ? fs.readdirSync(parentDir)
        : [],
      docsDirContents: fs.existsSync(docsDir) ? fs.readdirSync(docsDir) : [],
      cwd: process.cwd(),
      cwdContents: fs.readdirSync(process.cwd()),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

swaggerRouter.use("/", swaggerUi.serve);
swaggerRouter.get("/", (req, res, next) => {
  try {
    // Try to find and load the YAML file
    const yamlPath = findSwaggerFile();
    const swaggerDocument = yaml.load(fs.readFileSync(yamlPath, "utf8"));

    // Use CDN for Swagger UI assets to avoid 404 and MIME type issues
    const options = {
      explorer: true,
      customCssUrl: "https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui.css",
      customJs: [
        "https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-bundle.js",
        "https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-standalone-preset.js",
      ],
      customSiteTitle: "API Documentation",
      customfavIcon: "/favicon.ico",
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
      },
    };

    swaggerUi.setup(swaggerDocument, options)(req, res, next);
  } catch (error) {
    console.error("❌ Swagger setup error:", error.message);

    // Send detailed error response
    const errorHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>API Documentation Error</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .error { background: #fee; border: 1px solid #fcc; padding: 20px; border-radius: 4px; }
            .debug { background: #eef; border: 1px solid #ccf; padding: 20px; border-radius: 4px; margin-top: 20px; }
            pre { background: #f5f5f5; padding: 10px; overflow: auto; }
          </style>
        </head>
        <body>
          <h1>API Documentation Error</h1>
          <div class="error">
            <h3>Error Loading Swagger Documentation</h3>
            <p><strong>Error:</strong> ${error.message}</p>
            <p><strong>Current Directory:</strong> ${__dirname}</p>
            <p><strong>Working Directory:</strong> ${process.cwd()}</p>
          </div>
          <div class="debug">
            <h3>Debug Information</h3>
            <p>Visit <a href="/api-docs/debug">/api-docs/debug</a> for detailed file system information.</p>
            <p>Or check the server logs for more details.</p>
          </div>
        </body>
      </html>
    `;

    res.status(500).send(errorHtml);
  }
});

module.exports = swaggerRouter;
