/* ==========================================================================
   PrintFooter — clean, data-driven footer for PrintModal.
   Renders amount in words, computer-generated disclaimer note,
   and signature block. Adapts to A4 and 80MM modes.
   ========================================================================== */

/**
 * @param {string} currency          — Currency shown in note (default: "BDT")
 * @param {string} docName           — Document name used in note (default: "document")
 * @param {string} note              — Custom disclaimer note
 * @param {string} amountInWords     — Amount in words string
 * @param {string} amountInWordsText — Alias for amountInWords
 * @param {string} signerName        — Name under "Prepared By"
 * @param {Array}  roles             — Signature role columns (default: ["Prepared By", "Authorized"])
 * @param {string} mode              — "a4" | "80mm"
 */
export default function PrintFooter({
  currency = "BDT",
  docName = "document",
  note,
  amountInWords,
  amountInWordsText,
  signerName,
  roles = ["Prepared By", "Authorized"],
  mode = "a4",
}) {
  const wordsText = amountInWords || amountInWordsText;
  const is80mm = mode === "80mm" || mode === "pos80";

  if (is80mm) {
    return (
      <div className="print-ftr-80">
        {wordsText && <div className="print-ftr-80__words">In words: {wordsText}</div>}
        <div className="print-ftr-80__note">
          {note || `Amounts in ${currency}. Computer generated ${docName}.`}
        </div>
        <div className="print-ftr-80__thankyou">*** THANK YOU ***</div>
      </div>
    );
  }

  return (
    <div className="print-ftr">
      {/* Amount in words */}
      {wordsText && <div className="print-ftr__words">Amount in words: {wordsText}</div>}

      {/* Note */}
      <div className="print-ftr__note">
        {note ||
          `Amounts are in ${currency}. This is a computer generated ${docName} and does not require a signature when printed from the system.`}
      </div>

      {/* Signatures */}
      {roles && roles.length > 0 && (
        <div
          className="print-ftr__signatures"
          style={{ gridTemplateColumns: `repeat(${roles.length}, 1fr)` }}
        >
          {roles.map((role) => (
            <div key={role} className="print-ftr__sig-col">
              <div className="print-ftr__sig-line">{role}</div>
              {role === "Prepared By" && signerName && (
                <div className="print-ftr__sig-name">{signerName}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
