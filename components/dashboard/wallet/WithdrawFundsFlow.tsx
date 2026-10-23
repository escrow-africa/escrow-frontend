import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Building2, ShieldCheck, Check, CreditCard, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useWalletStore } from "../../../store/walletStore";
import { walletApi } from "../../../api/wallet";

interface WithdrawFundsFlowProps {
  onComplete: () => void;
}

interface PayoutAccount {
  id: string;
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  isDefault: boolean;
}

export default function WithdrawFundsFlow({ onComplete }: WithdrawFundsFlowProps) {
  const [step, setStep] = useState<number>(1);
  const [amount, setAmount] = useState<string>("");

  const [payoutAccounts, setPayoutAccounts] = useState<PayoutAccount[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ reference: string } | null>(null);

  const { walletDetails } = useWalletStore();
  const availableBalance = walletDetails?.balance || 0;

  useEffect(() => {
    walletApi
      .getPayoutAccounts()
      .then((res) => {
        const list: PayoutAccount[] = res?.data || res || [];
        setPayoutAccounts(list);
        const defaultAccount = list.find((a) => a.isDefault) || list[0];
        if (defaultAccount) setSelectedAccountId(defaultAccount.id);
      })
      .catch(() => toast.error("Failed to load payout accounts."))
      .finally(() => setLoadingAccounts(false));
  }, []);

  const handleWithdrawAll = () => {
    setAmount(availableBalance.toString());
  };

  const handleContinueToBank = () => {
    if (amount) setStep(2);
  };

  const handleReviewWithdrawal = () => {
    if (selectedAccountId) setStep(3);
  };

  const handleConfirmWithdrawal = async () => {
    setStep(4);
    setSubmitting(true);
    setError(null);
    try {
      const res = await walletApi.withdraw({ amount: numAmount, payoutAccountId: selectedAccountId });
      setResult({ reference: res.reference });
      setStep(5);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Unable to process withdrawal right now.");
      setStep(3);
    } finally {
      setSubmitting(false);
    }
  };

  const numAmount = parseFloat(amount.replace(/,/g, "")) || 0;
  const selectedAccount = payoutAccounts.find((a) => a.id === selectedAccountId);

  return (
    <div className="w-full max-w-md mx-auto pt-8">
      {/* Container Card */}
      <div className="bg-white border text-black border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[32px] p-8 md:p-10 animation-fade-in">

        {/* Step 1: Amount Selection */}
        {step === 1 && (
          <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Withdraw Funds</h2>
              <p className="text-gray-500 text-sm">Enter the amount you'd like to withdraw</p>
            </div>

            <div className="mb-6">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                ENTER AMOUNT
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₦</span>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-gray-50/50 border border-gray-100 text-gray-900 font-bold text-lg rounded-xl py-4 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#0F3D2E]/20"
                />
              </div>

              <div className="flex justify-between items-center mt-3 px-1">
                <span className="text-xs text-gray-500 font-medium">Available: ₦{availableBalance.toLocaleString()}</span>
                <button
                  onClick={handleWithdrawAll}
                  className="text-xs text-[#0F3D2E] font-bold hover:underline"
                >
                  Withdraw All
                </button>
              </div>
            </div>

            <button
              onClick={handleContinueToBank}
              disabled={!amount || numAmount <= 0 || numAmount > availableBalance}
              className={`w-full py-4 rounded-xl font-bold transition-colors mt-4 ${
                amount && numAmount > 0 && numAmount <= availableBalance ? "bg-[#0F3D2E] text-white hover:bg-[#185541]" : "bg-[#8DAAA0] text-white cursor-not-allowed text-opacity-90"
              }`}
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Select payout account */}
        {step === 2 && (
          <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
             <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Destination</h2>
              <p className="text-gray-500 text-sm">Where should we send your money?</p>
            </div>

            {loadingAccounts ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                <Loader2 size={24} className="animate-spin mb-2" />
                <p className="text-xs">Loading payout accounts...</p>
              </div>
            ) : payoutAccounts.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-gray-500 mb-4">
                  You haven't added a payout bank account yet.
                </p>
                <Link
                  href="/dashboard/settings"
                  className="inline-block px-6 py-3 bg-[#0F3D2E] text-white rounded-xl font-bold text-sm hover:bg-[#185541] transition-colors"
                >
                  Add a Payout Account
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-6">
                  {payoutAccounts.map((acc) => (
                    <button
                      key={acc.id}
                      onClick={() => setSelectedAccountId(acc.id)}
                      className={`w-full text-left border rounded-xl p-4 flex items-center gap-4 transition-colors ${
                        selectedAccountId === acc.id ? "border-[#0F3D2E] bg-[#0F3D2E]/5" : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-600 shrink-0">
                        <Building2 size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">{acc.bankName} • {acc.accountNumber}</p>
                        <p className="text-xs text-gray-500">{acc.accountName}</p>
                      </div>
                      {selectedAccountId === acc.id && (
                        <div className="w-5 h-5 rounded-full bg-[#0F3D2E] flex items-center justify-center shrink-0">
                          <Check size={12} className="text-white stroke-[3]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleReviewWithdrawal}
                  disabled={!selectedAccountId}
                  className={`w-full py-4 rounded-xl font-bold transition-colors ${
                    selectedAccountId ? "bg-[#0F3D2E] text-white hover:bg-[#185541]" : "bg-[#8DAAA0] text-white cursor-not-allowed text-opacity-90"
                  }`}
                >
                  Review Withdrawal
                </button>
              </>
            )}
          </div>
        )}

        {/* Step 3: Confirm Withdrawal */}
        {step === 3 && selectedAccount && (
          <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
             <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirm Withdrawal</h2>
              <p className="text-gray-500 text-sm">Please review the details below</p>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-900">Amount</span>
                <span className="text-sm font-bold text-gray-900">₦{numAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="border border-gray-100 rounded-xl p-4 flex items-center gap-4 mb-6">
               <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-600">
                  <Building2 size={20} />
               </div>
               <div>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">DESTINATION BANK</p>
                 <p className="text-sm font-bold text-gray-900">{selectedAccount.bankName} • {selectedAccount.accountNumber}</p>
               </div>
            </div>

            {error && <p className="text-sm text-red-500 text-center mb-4">{error}</p>}

            <button
              onClick={handleConfirmWithdrawal}
              disabled={submitting}
              className="w-full py-4 rounded-xl font-bold transition-colors mb-4 bg-[#0F3D2E] text-white hover:bg-[#185541] disabled:opacity-70"
            >
              Confirm & Withdraw
            </button>

            <div className="flex items-center justify-center gap-2 text-gray-400">
              <ShieldCheck size={14} />
              <span className="text-[10px] uppercase font-bold tracking-wider">SECURE ENCRYPTED TRANSACTION</span>
            </div>
          </div>
        )}

        {/* Step 4: Processing */}
        {step === 4 && (
          <div className="flex flex-col items-center justify-center py-10 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#0F3D2E] mb-6 animate-pulse">
              <CreditCard size={28} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">Processing Withdrawal</h2>
            <p className="text-gray-500 text-sm text-center max-w-[280px] leading-relaxed">
              We're communicating with your bank. This usually takes a few seconds.
            </p>
          </div>
        )}

        {/* Step 5: Success */}
        {step === 5 && result && (
           <div className="flex flex-col items-center animate-in fade-in scale-in duration-300">
             <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-400 flex items-center justify-center text-emerald-500 mb-6">
              <Check strokeWidth={3} size={28} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Withdrawal Initiated!</h2>
            <p className="text-gray-500 text-sm text-center mb-8">
              Your funds are on the way to your bank account. We'll update your transaction history once your bank confirms receipt.
            </p>

            <div className="w-full bg-gray-50 rounded-xl p-5 mb-8 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Reference ID</span>
                <span className="text-sm font-bold text-gray-900">{result.reference}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Amount</span>
                <span className="text-sm font-bold text-gray-900">₦{numAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Status</span>
                <span className="text-sm font-bold text-amber-600">Processing</span>
              </div>
            </div>

            <button
              onClick={onComplete}
              className="w-full bg-[#0F3D2E] text-white hover:bg-[#185541] py-3.5 rounded-xl font-bold transition-colors"
            >
              Done
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
