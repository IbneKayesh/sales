import { BankForm } from "./BankForm";
import { BankList } from "./BankList";
import { useBank } from "../../hooks/useBank";

export function BankPage() {
  const bank = useBank();

  return (
    <>
      <BankList {...bank} />
      {bank.formOpen ? (
        <BankForm
          bank={bank.editing}
          onClose={bank.closeForm}
          onSave={bank.save}
        />
      ) : null}
    </>
  );
}
