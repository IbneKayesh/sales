/* ==========================================================================
   PrintFooter — clean, data-driven footer for PrintModal.
   Renders the computer-generated disclaimer note and signature block.
   Adapts to A4 and 80MM modes.
   ========================================================================== */

/**
 * @param {string} docName           — Document name used in note (default: "document")
 * @param {string} note              — Custom disclaimer note
 * @param {string} signerName        — Name under "Prepared By"
 * @param {Array}  roles             — Signature role columns (default: ["Prepared By", "Authorized"])
 * @param {string} mode              — "a4" | "80mm"
 */
export default function PrintFooter({
  docName = "document",
  note,
  signerName,
  roles = ["Prepared By", "Authorized"],
  mode = "a4",
}) {
  const is80mm = mode === "80mm" || mode === "pos80";

  if (is80mm) {
    return (
      <div className="print-ftr-80">
        <div className="print-ftr-80__note">
          {note || `Computer generated ${docName}.`}
        </div>
        <div className="print-ftr-80__thankyou">*** THANK YOU ***</div>
      </div>
    );
  }

  return (
    <div className="print-ftr">
      {/* Note */}
      <div className="print-ftr__note">
        {note ||
          `This is a computer generated ${docName} and does not require a signature when printed from the system.`}
      </div>

      {/* Signatures */}
      {roles && roles.length > 0 && (
        <div
          className="print-ftr__signatures"
          style={{ gridTemplateColumns: `repeat(${roles.length}, 1fr)` }}
        >
          {roles.map((role) => (
            <div key={role} className="print-ftr__sig-col">
              <div className="print-ftr__sig-name">
                {role === "Prepared By" && signerName ? signerName : "\u00A0"}
              </div>
              <div className="print-ftr__sig-line">{role}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
