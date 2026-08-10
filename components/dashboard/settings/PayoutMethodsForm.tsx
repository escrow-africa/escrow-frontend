"use client";

import React, { useState } from "react";
import { ArrowLeft, Landmark, MoreVertical, ChevronDown } from "lucide-react";
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
  // Set default state to match Mockup exactly
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
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  
  // Default bank selection to GTBank as shown in the mockup
  const [newBank, setNewBank] = useState({
    bankName: "GTBank",
    accountNumber: "",
  });

  const handleDelete = (id: string) => {
    const accountToDelete = accounts.find((acc) => acc.id === id);
    const updated = accounts.filter((acc) => acc.id !== id);
    
    // If we deleted the default account, make the next one default
    if (accountToDelete?.isDefault && updated.length > 0) {
      updated[0].isDefault = true;
      updated[0].accountName = "Primary Clearing Account";
    }
    
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
    if (!newBank.bankName || !newBank.accountNumber) {
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
    setNewBank({ bankName: "GTBank", accountNumber: "" });
    setShowAddForm(false);
    toast.success("New payout bank account added successfully!");
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in pb-12 text-gray-900 dark:text-gray-200">
      {/* Back Button */}
      <button
        onClick={onCancel}
        className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-[#0F3D2E] dark:hover:text-[#F3B659] mb-6 transition-colors font-semibold text-sm focus:outline-none cursor-pointer"
      >
        <ArrowLeft size={16} />
        <span>Back to Settings</span>
      </button>

      {/* Main Payment Methods Card */}
      <div className="bg-white dark:bg-[#18181b] border border-[#E4E3E3CC] dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-xs">
        {/* Header Section */}
        <div className="pb-6 border-b border-gray-100 dark:border-zinc-800 mb-8 flex justify-between items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment Methods</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage the physical banking institutions connected to your trade pipeline.
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-2.5 bg-[#0F3D2E] dark:bg-emerald-700 hover:bg-[#185541] dark:hover:bg-emerald-600 text-white text-xs font-bold rounded-full shadow-sm transition-colors cursor-pointer shrink-0"
          >
            Add Bank
          </button>
        </div>

        {/* Accounts List */}
        <div className="space-y-4">
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className="border border-[#E4E3E3CC] dark:border-zinc-800 bg-[#FAFBFA] dark:bg-zinc-900/30 rounded-2xl p-5 flex items-center justify-between gap-4 transition-all relative"
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
              <div className="flex items-center gap-4">
                {acc.isDefault ? (
                  <span className="bg-[#0F3D2E] dark:bg-[#185541] text-white text-[10px] px-3.5 py-1.5 rounded-md font-bold tracking-wider uppercase select-none">
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

                {/* More options menu */}
                <div className="relative">
                  <button
                    onClick={() => setActiveMenuId(activeMenuId === acc.id ? null : acc.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {/* Dropdown Menu */}
                  {activeMenuId === acc.id && (
                    <>
                      {/* Backdrop overlay to close menu */}
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setActiveMenuId(null)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-950 border border-[#E4E3E3CC] dark:border-zinc-800 rounded-xl shadow-lg z-20 overflow-hidden py-1 animate-scale-in">
                        {!acc.isDefault && (
                          <button
                            onClick={() => {
                              handleSetDefault(acc.id);
                              setActiveMenuId(null);
                            }}
                            className="w-full text-left px-4 py-2.5 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors"
                          >
                            Set as Default
                          </button>
                        )}
                        <button
                          onClick={() => {
                            handleDelete(acc.id);
                            setActiveMenuId(null);
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                        >
                          Remove Account
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Close button at the bottom */}
        <div className="flex justify-end pt-8 mt-6 border-t border-gray-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-3 bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Close Payment Settings
          </button>
        </div>
      </div>

      {/* Add Bank Modal Overlay */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setShowAddForm(false)}
          />

          {/* Modal Container */}
          <div className="bg-white dark:bg-zinc-900 border border-[#E4E3E3CC] dark:border-zinc-800 w-full max-w-[440px] rounded-[32px] p-8 md:p-10 shadow-2xl relative z-10 animate-scale-in flex flex-col items-center">
            <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
              Add Clearing Bank
            </h3>
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
              Enter the official banking details to process settlements.
            </p>

            <form onSubmit={handleAddAccount} className="w-full space-y-6">
              {/* SELECT BANK PROVIDER */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-[0.15em] mb-2 uppercase">
                  Select Bank Provider
                </label>
                <div className="relative">
                  <select
                    value={newBank.bankName}
                    onChange={(e) => setNewBank({ ...newBank, bankName: e.target.value })}
                    className="w-full !bg-[#F4F4F5] dark:!bg-zinc-950 border !border-transparent dark:!border-zinc-800 text-gray-900 dark:text-white px-4 py-3.5 rounded-xl appearance-none font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] dark:focus:ring-emerald-500 cursor-pointer pr-10"
                    required
                  >
                    <option value="GTBank">GTBank</option>
                    <option value="Access Bank">Access Bank</option>
                    <option value="Zenith Bank">Zenith Bank</option>
                    <option value="UBA">UBA</option>
                    <option value="First Bank">First Bank</option>
                    <option value="Kuda Bank">Kuda Bank</option>
                    <option value="OPay">OPay</option>
                  </select>
                  {/* Custom Arrow Down */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              {/* ACCOUNT NUMBER (10 DIGITS) */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-[0.15em] mb-2 uppercase">
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
                  className="w-full !bg-[#F4F4F5] dark:!bg-zinc-950 border !border-transparent dark:!border-zinc-800 text-gray-950 dark:text-white px-4 py-3.5 rounded-xl font-mono text-center text-lg font-bold tracking-[0.25em] focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] dark:focus:ring-emerald-500 placeholder-gray-400"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="w-1/2 py-3.5 bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-bold hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3.5 bg-[#0F3D2E] dark:bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-[#185541] dark:hover:bg-emerald-600 transition-colors cursor-pointer text-center"
                >
                  Add Bank Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

