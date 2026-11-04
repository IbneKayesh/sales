import { AccountForm } from "./AccountForm";
import { AccountList } from "./AccountList";
import { useAccounts } from "../../hooks/useAccounts";

export function AccountsPage() {
  const account = useAccounts();

  return (
    <>
      <AccountList {...account} />
      {account.formOpen ? (
        <AccountForm
          account={account.editing}
          onClose={account.closeForm}
          onSave={account.save}
        />
      ) : null}
    </>
  );
}
