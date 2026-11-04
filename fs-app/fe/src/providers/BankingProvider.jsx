import { useCallback, useEffect, useMemo, useState } from "react";
import { BankingContext } from "./bankingContext";
import {
  accountsApi,
  banksApi,
  dpsApi,
  fdApi,
  savingsApi,
  transactionsApi,
} from "../lib/api/repositories";

const INITIAL_DATA = {
  banks: [],
  accounts: [],
  savings: [],
  dps: [],
  fd: [],
  transactions: [],
};

async function fetchPortfolio() {
  const [banks, accounts, savings, dps, fd, transactions] = await Promise.all([
    banksApi.list(),
    accountsApi.list(),
    savingsApi.list(),
    dpsApi.list(),
    fdApi.list(),
    transactionsApi.list(),
  ]);

  return { banks, accounts, savings, dps, fd, transactions };
}

export function BankingProvider({ children }) {
  const [data, setData] = useState(INITIAL_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setData(await fetchPortfolio());
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const portfolio = await fetchPortfolio();
        if (cancelled) return;
        setData(portfolio);
        setError("");
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const upsert = useCallback((collection, document) => {
    setData((current) => {
      const list = current[collection] ?? [];
      const exists = list.some((item) => item._id === document._id);

      return {
        ...current,
        [collection]: exists
          ? list.map((item) => (item._id === document._id ? document : item))
          : [document, ...list],
      };
    });
  }, []);

  const remove = useCallback((collection, id) => {
    setData((current) => ({
      ...current,
      [collection]: (current[collection] ?? []).filter((item) => item._id !== id),
    }));
  }, []);

  const value = useMemo(
    () => ({ ...data, loading, error, reload, upsert, remove }),
    [data, loading, error, reload, upsert, remove]
  );

  return <BankingContext.Provider value={value}>{children}</BankingContext.Provider>;
}
