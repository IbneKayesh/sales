import { useContext } from "react";
import { BankingContext } from "../providers/bankingContext";

export function useBanking() {
  const banking = useContext(BankingContext);

  if (!banking) {
    throw new Error("useBanking must be used inside a BankingProvider");
  }

  return banking;
}
