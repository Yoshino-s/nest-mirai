import * as fs from "fs";

import { validationMetadatasToSchemas } from "class-validator-jsonschema";

import "../src/config/config.interface.ts";
const outputPath = "./.vscode/config.schema.json";

const schemas = validationMetadatasToSchemas();

const schema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$ref": "#/definitions/ConfigInterface",
  "definitions": schemas,
};

const schemaString = JSON.stringify(schema, null, 2);
fs.writeFile(outputPath, schemaString, (err) => {
  if (err) throw err;
});
