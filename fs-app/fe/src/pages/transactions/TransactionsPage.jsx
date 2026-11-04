import { TransactionForm } from "./TransactionForm";
import { TransactionList } from "./TransactionList";
import { useTransactions } from "../../hooks/useTransactions";

export function TransactionsPage() {
  const transaction = useTransactions();

  return (
    <>
      <TransactionList {...transaction} />
      {transaction.formOpen ? (
        <TransactionForm
          transaction={transaction.editing}
          onClose={transaction.closeForm}
          onSave={transaction.save}
        />
      ) : null}
    </>
  );
}
