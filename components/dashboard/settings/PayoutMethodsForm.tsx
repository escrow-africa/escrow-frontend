"use client";

import React, { useState } from "react";
import { ArrowLeft, CreditCard, Plus, Trash2, Landmark } from "lucide-react";
import toast from "react-hot-toast";

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  isDefault: boolean;
}

interface PayoutMethodsFormProps {
  onCancel: () => void;
  onSave: (data: any) => Promise<void>;
}

export default function PayoutMethodsForm({
  onCancel,
  onSave,
}: PayoutMethodsFormProps) {
  const [accounts, setAccounts] = useState<BankAccount[]>([
    {
      id: "1",
      bankName: "Access Bank Plc",
      accountNumber: "******4567",
      accountName: "Madeleine Nkiru",
      isDefault: true,
    },
    {
      id: "2",
      bankName: "Guaranty Trust Bank (GTB)",
      accountNumber: "******8912",
      accountName: "Madeleine Creative Studio",
      isDefault: false,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newBank, setNewBank] = useState({
    bankName: "",
    accountNumber: "",
    accountName: "",
  });

  const handleDelete = (id: string) => {
    const updated = accounts.filter((acc) => acc.id !== id);
    setAccounts(updated);
    toast.success("Bank account removed.");
  };

  const handleSetDefault = (id: string) => {
    const updated = accounts.map((acc) => ({
      ...acc,
      isDefault: acc.id === id,
    }));
    setAccounts(updated);
    toast.success("Default payout method updated.");
  };

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBank.bankName || !newBank.accountNumber || !newBank.accountName) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (newBank.accountNumber.length !== 10) {
      toast.error("NUBAN Account Number must be exactly 10 digits.");
      return;
    }

    const newAcc: BankAccount = {
      id: Date.now().toString(),
      bankName: newBank.bankName,
      accountNumber: `******${newBank.accountNumber.slice(-4)}`,
      accountName: newBank.accountName,
      isDefault: accounts.length === 0,
    };

    setAccounts([...accounts, newAcc]);
    setNewBank({ bankName: "", accountNumber: "", accountName: "" });
    setShowAddForm(false);
    toast.success("New payout bank account added successfully!");
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <button
        onClick={onCancel}
        className="flex items-center gap-2 text-gray-500 hover:text-primary mb-6 transition-colors font-medium text-sm focus:outline-none"
      >
        <ArrowLeft size={16} />
        <span>Back to Settings</span>
      </button>

      <div className="bg-white dark:bg-[#18181b] border border-border dark:border-zinc-800 rounded-2xl p-6 md:p-8 shadow-sm">
        {/* Header */}
        <div className="pb-6 border-b border-gray-100 dark:border-zinc-800 mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-primary dark:text-[#F3B659]">Payout Methods</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage bank accounts, settlement preferences, and default routing ledger.
            </p>
          </div>
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#0F3D2E] dark:bg-[#185541] hover:bg-[#185541] dark:hover:bg-[#236b53] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Account</span>
            </button>
          )}
        </div>

        {showAddForm ? (
          /* Add Account Form */
          <form onSubmit={handleAddAccount} className="space-y-6 max-w-xl animate-fade-in">
            <h3 className="font-bold text-primary dark:text-white text-base">Add Settlement Bank Account</h3>

            <div>
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 tracking-[0.2em] mb-2 uppercase">
                Select Bank
              </label>
              <select
                value={newBank.bankName}
                onChange={(e) => setNewBank({ ...newBank, bankName: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border bg-[#E4E3E3CC] dark:bg-zinc-800 border-[#E4E3E3CC] dark:border-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] dark:focus:ring-[#F3B659] transition-all"
                required
              >
                <option value="">-- Choose a Bank --</option>
                <option value="Access Bank Plc">Access Bank Plc</option>
                <option value="Guaranty Trust Bank (GTB)">Guaranty Trust Bank (GTB)</option>
                <option value="Zenith Bank Plc">Zenith Bank Plc</option>
                <option value="United Bank for Africa (UBA)">United Bank for Africa (UBA)</option>
                <option value="First Bank of Nigeria">First Bank of Nigeria</option>
                <option value="Kuda Bank">Kuda Bank</option>
                <option value="OPay">OPay</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 tracking-[0.2em] mb-2 uppercase">
                Account Number (10 Digits)
              </label>
              <input
                type="text"
                pattern="[0-9]{10}"
                maxLength={10}
                placeholder="0123456789"
                value={newBank.accountNumber}
                onChange={(e) =>
                  setNewBank({ ...newBank, accountNumber: e.target.value.replace(/\D/g, "") })
                }
                className="w-full px-4 py-3 rounded-lg border bg-[#E4E3E3CC] dark:bg-zinc-800 border-[#E4E3E3CC] dark:border-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] dark:focus:ring-[#F3B659] transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 tracking-[0.2em] mb-2 uppercase">
                Account Name
              </label>
              <input
                type="text"
                placeholder="MADELEINE NKIRU"
                value={newBank.accountName}
                onChange={(e) => setNewBank({ ...newBank, accountName: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border bg-[#E4E3E3CC] dark:bg-zinc-800 border-[#E4E3E3CC] dark:border-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] dark:focus:ring-[#F3B659] transition-all"
                required
              />
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-5 py-2 bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-zinc-700 rounded-lg text-xs font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#0F3D2E] dark:bg-[#185541] text-white rounded-lg text-xs font-semibold hover:bg-[#185541] dark:hover:bg-[#236b53] transition-colors cursor-pointer"
              >
                Verify & Add Bank
              </button>
            </div>
          </form>
        ) : (
          /* Accounts List */
          <div className="space-y-4">
            {accounts.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-gray-200 dark:border-zinc-800 rounded-xl">
                <Landmark className="mx-auto text-gray-400 mb-3" size={32} />
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">No bank accounts linked yet</p>
                <p className="text-xs text-gray-400 mt-1">Add a settlement bank account to receive payouts.</p>
              </div>
            ) : (
              accounts.map((acc) => (
                <div
                  key={acc.id}
                  className={`border rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                    acc.isDefault
                      ? "border-[#0F3D2E]/40 bg-[#0F3D2E]/[0.02] dark:border-emerald-900/40 dark:bg-emerald-950/[0.05]"
                      : "border-border dark:border-zinc-800 bg-white dark:bg-zinc-900/30"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-primary dark:text-[#F3B659] border border-gray-200 dark:border-zinc-700 shrink-0">
                      <Landmark size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-800 dark:text-white text-sm">
                          {acc.bankName}
                        </h4>
                        {acc.isDefault && (
                          <span className="bg-[#0F3D2E]/10 dark:bg-[#185541]/30 text-[#0F3D2E] dark:text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {acc.accountNumber} • {acc.accountName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    {!acc.isDefault && (
                      <button
                        onClick={() => handleSetDefault(acc.id)}
                        className="text-xs text-[#0F3D2E] dark:text-[#F3B659] hover:underline font-semibold cursor-pointer"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(acc.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer"
                      title="Remove Account"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}

            <div className="flex justify-end pt-6 border-t border-gray-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2.5 bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Close Payout Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
