/* ==========================================================================
   PrintFooter — shared footer for printed documents (MRR, Journal, Invoice)
   Renders the optional "Amount in words" line, the computer-generated
   disclaimer note, and the signature grid.

   Parameters:
     currency        — currency shown in the note (defaults to "BDT")
     docName         — document name used in the note ("MRR" / "voucher" /
                       "invoice"); defaults to "document"
     note            — optional custom note text (overrides the default note)
     amountInWords   — optional amount-in-words string to show above the note
     signerName      — name printed under "Prepared By"
     roles           — signature role labels, e.g. ["Prepared By","Authorized"];
                       defaults to a single "Authorized" column
     marginTop       — spacing above the signature grid (default 16)
   ========================================================================== */

const PrintFooter = ({
  currency = "BDT",
  docName = "document",
  note,
  amountInWordsText,
  signerName,
  roles = ["Authorized"],
  marginTop = 16,
}) => (
  <>
    {amountInWordsText && (
      <div style={{ fontSize: 9, margin: "6px 2px 4px", fontWeight: 600 }}>
        Amount in words: {amountInWordsText}
      </div>
    )}

    {/* Footer note */}
    <div style={{ fontSize: 8, color: "#555", margin: "2px 2px" }}>
      {note ||
        `Amounts are in ${currency}. This is a computer generated ${docName} and does not require a signature when printed from the system.`}
    </div>

    {/* Signatures */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${roles.length}, 1fr)`,
        gap: 12,
        marginTop,
      }}
    >
      {roles.map((role) => (
        <div key={role} style={{ textAlign: "center", fontSize: 9 }}>
          <div
            style={{ marginTop: 18, borderTop: "1px solid #000", paddingTop: 2 }}
          >
            {role}
          </div>
          {role === "Prepared By" && signerName && (
            <div style={{ marginTop: 2, fontWeight: 600 }}>{signerName}</div>
          )}
        </div>
      ))}
    </div>
  </>
);

export default PrintFooter;
