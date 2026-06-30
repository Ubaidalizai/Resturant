import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useApi } from "../context/ApiContext";
import InputField from "../Components/UI/InputField";

export default function Accounting() {
  const { get } = useApi();
  const { t } = useTranslation("common");
  const [accounts, setAccounts] = useState([]);
  const [entries, setEntries] = useState([]);
  const [summary, setSummary] = useState(null);
  const [trialBalance, setTrialBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ledger");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [accRes, entryRes, summaryRes, trialRes] = await Promise.all([
        get("/api/v1/accounting/accounts"),
        get("/api/v1/accounting/entries"),
        get("/api/v1/accounting/summary"),
        get("/api/v1/accounting/trial-balance"),
      ]);
      setAccounts(accRes.data.data || []);
      setEntries(entryRes.data.data || []);
      setSummary(summaryRes.data.data || null);
      setTrialBalance(trialRes.data.data || null);
    } catch (err) {
      console.error(err);
      toast.error(t("FailedToLoadData", { defaultValue: "Failed to load accounting data" }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatMoney = (n) => `$${Number(n || 0).toFixed(2)}`;

  return (
    <div className="space-y-4">
      {summary && (
        <div className="erp-stat-grid">
          {[
            { label: t("Assets", { defaultValue: "Assets" }), value: formatMoney(summary.assets), color: "text-blue-700" },
            { label: t("Liabilities", { defaultValue: "Liabilities" }), value: formatMoney(summary.liabilities), color: "text-red-600" },
            { label: t("Equity", { defaultValue: "Equity" }), value: formatMoney(summary.equity) },
            { label: t("Revenue", { defaultValue: "Revenue" }), value: formatMoney(summary.revenue), color: "text-green-600" },
            { label: t("Expenses", { defaultValue: "Expenses" }), value: formatMoney(summary.expenses), color: "text-red-600" },
            { label: t("NetIncome", { defaultValue: "Net Income" }), value: formatMoney(summary.netIncome), color: summary.netIncome >= 0 ? "text-green-600" : "text-red-600" },
          ].map((card) => (
            <div key={card.label} className="erp-stat-card">
              <div className="erp-stat-label">{card.label}</div>
              <div className={`erp-stat-value ${card.color || ""}`}>{card.value}</div>
            </div>
          ))}
        </div>
      )}

      <div className="erp-panel p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { key: "ledger", label: t("JournalLedger", { defaultValue: "Journal Ledger" }) },
            { key: "accounts", label: t("ChartOfAccounts", { defaultValue: "Chart of Accounts" }) },
            { key: "trial", label: t("TrialBalance", { defaultValue: "Trial Balance" }) },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={activeTab === tab.key ? "btn-primary" : "btn-secondary"}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-slate-500 py-8 text-center">{t("Loading", { defaultValue: "Loading..." })}</p>
        ) : activeTab === "accounts" ? (
          <div className="erp-table-wrap">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>{t("Code", { defaultValue: "Code" })}</th>
                  <th>{t("Name", { defaultValue: "Name" })}</th>
                  <th>{t("Type", { defaultValue: "Type" })}</th>
                  <th>{t("Balance", { defaultValue: "Balance" })}</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((acc) => (
                  <tr key={acc._id}>
                    <td>{acc.code}</td>
                    <td className="font-medium">{acc.name}</td>
                    <td><span className="erp-badge erp-badge-neutral">{acc.type}</span></td>
                    <td className="font-semibold">{formatMoney(acc.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : activeTab === "trial" ? (
          <div>
            {trialBalance && (
              <>
                <div className={`mb-4 p-3 rounded text-sm font-medium ${trialBalance.isBalanced ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                  {trialBalance.isBalanced
                    ? t("BooksBalanced", { defaultValue: "Books are balanced — debits equal credits" })
                    : t("BooksUnbalanced", { defaultValue: "Warning: Books are not balanced" })}
                </div>
                <div className="erp-table-wrap">
                  <table className="erp-table">
                    <thead>
                      <tr>
                        <th>{t("Account", { defaultValue: "Account" })}</th>
                        <th>{t("Debit", { defaultValue: "Debit" })}</th>
                        <th>{t("Credit", { defaultValue: "Credit" })}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trialBalance.rows.map(({ account, debit, credit }) => (
                        <tr key={account._id}>
                          <td>{account.code} — {account.name}</td>
                          <td>{debit > 0 ? formatMoney(debit) : "—"}</td>
                          <td>{credit > 0 ? formatMoney(credit) : "—"}</td>
                        </tr>
                      ))}
                      <tr className="font-bold bg-slate-50">
                        <td>{t("Total", { defaultValue: "Total" })}</td>
                        <td>{formatMoney(trialBalance.totalDebits)}</td>
                        <td>{formatMoney(trialBalance.totalCredits)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="erp-table-wrap">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>{t("Date", { defaultValue: "Date" })}</th>
                  <th>{t("Description", { defaultValue: "Description" })}</th>
                  <th>{t("Type", { defaultValue: "Type" })}</th>
                  <th>{t("Debit", { defaultValue: "Debit" })}</th>
                  <th>{t("Credit", { defaultValue: "Credit" })}</th>
                  <th>{t("Entries", { defaultValue: "Entries" })}</th>
                </tr>
              </thead>
              <tbody>
                {entries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-500">
                      {t("NoJournalEntries", { defaultValue: "No journal entries yet" })}
                    </td>
                  </tr>
                ) : (
                  entries.map((entry) => (
                    <tr key={entry._id}>
                      <td>{new Date(entry.date).toLocaleDateString()}</td>
                      <td className="font-medium">{entry.description}</td>
                      <td><span className="erp-badge erp-badge-neutral">{entry.referenceType}</span></td>
                      <td className="text-green-700 font-medium">{formatMoney(entry.totalDebit)}</td>
                      <td className="text-red-600 font-medium">{formatMoney(entry.totalCredit)}</td>
                      <td>
                        <div className="text-xs space-y-1">
                          {(entry.lines || []).map((line, i) => (
                            <div key={i}>
                              {line.accountId?.code} {line.accountId?.name}:{" "}
                              {line.debit > 0 ? `Dr ${formatMoney(line.debit)}` : `Cr ${formatMoney(line.credit)}`}
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
