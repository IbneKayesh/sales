/* ==========================================================================
   usePrint — lightweight state manager for PrintModal open/close.

   Two modes:
     1. Simple (single document):
          const { open, show, hide } = usePrint();
          <Button onClick={show}>Print</Button>
          <PrintPage open={open} onClose={hide} />

     2. Typed (multiple document types):
          const { active, show, hide } = usePrint();
          <Button onClick={() => show("journal")}>Journal</Button>
          <Button onClick={() => show("invoice")}>Invoice</Button>
          {active === "journal" && <JournalPrint open onClose={hide} />}
          {active === "invoice" && <InvoicePrint open onClose={hide} />}

   The hook works identically in both modes — `open` is just a boolean
   derived from `active !== null`.
   ========================================================================== */

import { useCallback, useState } from "react";

/**
 * @param {any} [initial=null] — initial value for the active print target.
 *   Pass `null` (default) for "nothing open".
 *   Pass a truthy value to start with a specific print target open.
 * @returns {{ active, open, show, hide }}
 */
export default function usePrint(initial = null) {
  const [active, setActive] = useState(initial);

  const show = useCallback((type = true) => setActive(type), []);
  const hide = useCallback(() => setActive(null), []);

  return {
    /** Current active print target (null when closed, truthy when open). */
    active,
    /** Convenience boolean — `true` when any print target is active. */
    open: active !== null,
    /** Open the print modal. `show()` for simple, `show("journal")` for typed. */
    show,
    /** Close the print modal. */
    hide,
  };
}
