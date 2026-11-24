const assert = require("node:assert/strict");
const { readFileSync, readdirSync } = require("node:fs");
const { join } = require("node:path");
const { extractFile } = require("@electron/asar");

const output = "dist-electron";
const archive = readdirSync(output, { recursive: true })
  .find((entry) => /(?:^|[/\\])app\.asar$/.test(entry));
assert.ok(archive, "Packaged app.asar is missing");

const packagedApp = join(output, archive);
const asset = "assets/default-pet-spritesheet.webp";
assert.deepEqual(extractFile(packagedApp, asset), readFileSync(asset));
assert.match(
  extractFile(packagedApp, "dist/built-in-pet.js").toString("utf8"),
  /displayName: "鎏金与紫蝶"/,
);
console.log("Packaged Pixel Duo name and default atlas verified");
