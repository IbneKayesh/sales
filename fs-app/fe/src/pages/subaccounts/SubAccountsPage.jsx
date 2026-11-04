import { SubAccountForm } from "./SubAccountForm";
import { SubAccountList } from "./SubAccountList";
import { useSubAccounts } from "../../hooks/useSubAccounts";

export function SubAccountsPage() {
  const subAccount = useSubAccounts();

  return (
    <>
      <SubAccountList {...subAccount} />
      {subAccount.formOpen ? (
        <SubAccountForm
          account={subAccount.editing}
          onClose={subAccount.closeForm}
          onSave={subAccount.save}
        />
      ) : null}
    </>
  );
}
