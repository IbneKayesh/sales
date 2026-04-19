const express = require("express");
const router = express.Router();

const handleVersionedRequest = async (req, res, action) => {
  try {
    if (!req.body || !req.body.inputs || !Array.isArray(req.body.inputs)) {
      return res.json({
        success: false,
        message: "inputs array is required in request body",
        data: null,
      });
    }

    const { inputs } = req.body;
    const finalData = {};
    const versionsProcessed = new Set();

    // Grouping inputs by version to handle potential mixed-version requests
    const groups = {};
    for (const input of inputs) {
      const v = input.vers || "unknown";
      if (!groups[v]) groups[v] = [];
      groups[v].push(input);
    }

    // Process each version group
    for (const [version, versionInputs] of Object.entries(groups)) {
      if (version === "v1") {
        try {
          const v1 = require("./inventory/v1");
          if (typeof v1[action] === "function") {
            const result = await v1[action](versionInputs);
            Object.assign(finalData, result);
            versionsProcessed.add("v1");
          } else {
            // Action not implemented in v1
            versionInputs.forEach(input => {
              const key = Object.keys(input).find(k => k !== "vers" && k !== "version");
              if (key) finalData[key] = null;
            });
          }
        } catch (err) {
          console.error(`Error loading/processing v1 ${action}:`, err);
        }
      } else {
        // Unsupported version (e.g., v2): set requested keys to null as per requirements
        versionInputs.forEach(input => {
          const key = Object.keys(input).find(k => k !== "vers" && k !== "version");
          if (key) finalData[key] = null;
        });
        versionsProcessed.add(version);
      }
    }

    res.json({
      success: true,
      message: `Inventory ${action} completed for versions: ${Array.from(versionsProcessed).join(", ")}`,
      data: finalData,
    });
  } catch (error) {
    console.error(`api action ${action} error:`, error);
    return res.status(500).json({
      success: false,
      message: error.message || `an error occurred during api action ${action}`,
      data: null,
    });
  }
};

router.post("/get", (req, res) => handleVersionedRequest(req, res, "get"));
router.post("/set", (req, res) => handleVersionedRequest(req, res, "set"));
router.post("/del", (req, res) => handleVersionedRequest(req, res, "del"));

module.exports = router;

