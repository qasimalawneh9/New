const AdmZip = require("adm-zip");
const fs = require("fs");

try {
  const zip = new AdmZip("./talkcon-full-project.zip");
  console.log("Extracting zip file...");
  zip.extractAllTo("./", true);
  console.log("Extraction completed!");

  // List extracted files
  console.log("Extracted files:");
  const entries = zip.getEntries();
  entries.forEach((entry) => {
    console.log(" -", entry.entryName);
  });
} catch (error) {
  console.error("Error extracting zip:", error);
}
