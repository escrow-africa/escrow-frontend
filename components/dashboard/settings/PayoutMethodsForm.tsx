"use client";

import React, { useState } from "react";
import { ArrowLeft, Landmark, Plus, Trash2 } from "lucide-react";
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
  // Set default state to match Mockup 4 exactly
  const [accounts, setAccounts] = useState<BankAccount[]>([
    {
      id: "1",
      bankName: "GTBank",
      accountNumber: "0123456789",
      accountName: "Primary Clearing Account",
      isDefault: true,
    },
    {
      id: "2",
      bankName: "Access Bank",
      accountNumber: "9876543210",
      accountName: "Secondary Clearing Account",
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
      accountName: acc.id === id ? "Primary Clearing Account" : "Secondary Clearing Account",
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

    const isFirst = accounts.length === 0;
    const newAcc: BankAccount = {
      id: Date.now().toString(),
      bankName: newBank.bankName,
      accountNumber: newBank.accountNumber,
      accountName: isFirst ? "Primary Clearing Account" : "Secondary Clearing Account",
      isDefault: isFirst,
    };

    setAccounts([...accounts, newAcc]);
    setNewBank({ bankName: "", accountNumber: "", accountName: "" });
    setShowAddForm(false);
    toast.success("New payout bank account added successfully!");
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in pb-12">
      {/* Back Button */}
      <button
        onClick={onCancel}
        className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-[#0F3D2E] dark:hover:text-[#F3B659] mb-6 transition-colors font-medium text-sm focus:outline-none cursor-pointer"
      >
        <ArrowLeft size={16} />
        <span>Back to Settings</span>
      </button>

      {/* Main Payment Methods Card */}
      <div className="bg-white dark:bg-[#18181b] border border-[#E4E3E3CC] dark:border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xs">
        {/* Header Section */}
        <div className="pb-6 border-b border-gray-100 dark:border-zinc-800 mb-8 flex justify-between items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment Methods</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage the physical banking institutions connected to your trade pipeline.
            </p>
          </div>
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#0F3D2E] dark:bg-emerald-700 hover:bg-[#185541] dark:hover:bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer shrink-0"
            >
              <Plus size={14} className="stroke-[3]" />
              <span>Add Bank</span>
            </button>
          )}
        </div>

        {showAddForm ? (
          /* Add Account Form container */
          <form onSubmit={handleAddAccount} className="space-y-6 max-w-xl animate-fade-in">
            <h3 className="font-bold text-gray-900 dark:text-white text-base">Add Settlement Bank Account</h3>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 tracking-[0.15em] mb-2 uppercase">
                Select Bank
              </label>
              <select
                value={newBank.bankName}
                onChange={(e) => setNewBank({ ...newBank, bankName: e.target.value })}
                className="w-full px-4 py-3.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] dark:focus:ring-[#F3B659] transition-all"
                required
              >
                <option value="">-- Choose a Bank --</option>
                <option value="GTBank">GTBank (Guaranty Trust)</option>
                <option value="Access Bank">Access Bank Plc</option>
                <option value="Zenith Bank">Zenith Bank Plc</option>
                <option value="UBA">United Bank for Africa (UBA)</option>
                <option value="First Bank">First Bank of Nigeria</option>
                <option value="Kuda Bank">Kuda Bank</option>
                <option value="OPay">OPay</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 tracking-[0.15em] mb-2 uppercase">
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
                className="w-full px-4 py-3.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] dark:focus:ring-[#F3B659] transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 tracking-[0.15em] mb-2 uppercase">
                Account Label / Description
              </label>
              <input
                type="text"
                placeholder="e.g. Primary Corporate Account"
                value={newBank.accountName}
                onChange={(e) => setNewBank({ ...newBank, accountName: e.target.value })}
                className="w-full px-4 py-3.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] dark:focus:ring-[#F3B659] transition-all"
                required
              />
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-5 py-2.5 bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-zinc-800 rounded-lg text-xs font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#0F3D2E] dark:bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-[#185541] dark:hover:bg-emerald-600 transition-colors cursor-pointer"
              >
                Verify & Add Bank
              </button>
            </div>
          </form>
        ) : (
          /* Accounts List */
          <div className="space-y-4">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                className="border border-[#E4E3E3CC] dark:border-zinc-800 bg-[#FAFBFA] dark:bg-zinc-900/30 rounded-xl p-5 flex items-center justify-between gap-4 transition-all"
              >
                {/* Left Side: Bank Landmark Icon + Names */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-zinc-900 border border-[#E4E3E3CC] dark:border-zinc-800 flex items-center justify-center text-[#0F3D2E] dark:text-[#F3B659] shrink-0 shadow-2xs">
                    <Landmark size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm md:text-base">
                      {acc.bankName} &bull; Account {acc.accountNumber}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {acc.accountName}
                    </p>
                  </div>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-6">
                  {acc.isDefault ? (
                    <span className="bg-[#0F3D2E] dark:bg-[#185541] text-white text-[10px] px-3.5 py-1.5 rounded-md font-bold tracking-wider uppercase">
                      Default
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSetDefault(acc.id)}
                      className="text-xs font-bold text-[#0F3D2E] hover:text-[#185541] dark:text-[#F3B659] dark:hover:text-amber-400 hover:underline cursor-pointer focus:outline-none"
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(acc.id)}
                    className="p-2 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-400 hover:text-red-500 hover:border-red-200 dark:hover:bg-red-950/20 rounded-lg transition-all cursor-pointer shadow-2xs"
                    title="Remove Account"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back and Close buttons at the bottom */}
        <div className="flex justify-end pt-8 mt-6 border-t border-gray-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-3 bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-zinc-800 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Close Payment Settings
          </button>
        </div>
      </div>
    </div>
  );
}
