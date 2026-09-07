import React, { useState, useEffect } from "react";
import { Building2, ShieldCheck, CheckCircle2, ChevronDown, Smartphone, Check, CreditCard, Download } from "lucide-react";
import { useWalletStore, Bank } from "../../../store/walletStore";

interface WithdrawFundsFlowProps {
  onComplete: () => void;
}

export default function WithdrawFundsFlow({ onComplete }: WithdrawFundsFlowProps) {
  const [step, setStep] = useState<number>(1);
  const [amount, setAmount] = useState<string>("");
  
  // Bank Details
  const [bankCode, setBankCode] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [isVerified, setIsVerified] = useState<boolean>(false);

  // Security
  const [pin, setPin] = useState<string>("");

  const { banks, fetchBankList, walletDetails } = useWalletStore();
  const availableBalance = walletDetails?.balance || 0;

  useEffect(() => {
    fetchBankList();
  }, [fetchBankList]);

  // Auto verify account mock
  useEffect(() => {
    if (bankCode && accountNumber.length >= 10) {
      setIsVerified(true);
    } else {
      setIsVerified(false);
    }
  }, [bankCode, accountNumber]);

  // Mock processing delay for success
  useEffect(() => {
    if (step === 4) {
      const timer = setTimeout(() => {
        setStep(5);
      }, 3000); // 3 seconds mock delay
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleWithdrawAll = () => {
    setAmount(availableBalance.toString());
  };

  const handleContinueToBank = () => {
    if (amount) setStep(2);
  };

  const handleReviewWithdrawal = () => {
    if (isVerified) setStep(3);
  };

  const handleConfirmWithdrawal = () => {
    if (pin.length === 4) setStep(4);
  };

  const numAmount = parseFloat(amount.replace(/,/g, '')) || 0;
  const fee = numAmount * 0.015;
  const totalReceive = numAmount - fee;

  const selectedBank = banks.find(b => b.code === bankCode);

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
              disabled={!amount || numAmount > availableBalance}
              className={`w-full py-4 rounded-xl font-bold transition-colors mt-4 ${
                amount && numAmount <= availableBalance ? "bg-[#0F3D2E] text-white hover:bg-[#185541]" : "bg-[#8DAAA0] text-white cursor-not-allowed text-opacity-90"
              }`}
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Bank Details Form */}
        {step === 2 && (
          <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
             <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Bank Details</h2>
              <p className="text-gray-500 text-sm">Where should we send your money?</p>
            </div>

            <div className="mb-6">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                SELECT BANK
              </label>
              <div className="relative">
                <select 
                  value={bankCode}
                  onChange={(e) => setBankCode(e.target.value)}
                  className="w-full bg-gray-50/70 appearance-none border border-gray-100 text-gray-900 font-medium rounded-xl py-3.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#0F3D2E]/20"
                >
                  <option value="" disabled>Choose a bank</option>
                  {banks.map((b) => (
                    <option key={b.code} value={b.code}>{b.name}</option>
                  ))}
                  {/* Fallbacks if banks array is empty while testing */}
                  {banks.length === 0 && (
                    <>
                      <option value="000001">Sterling Bank</option>
                      <option value="000002">Guaranty Trust Bank</option>
                      <option value="000003">Access Bank</option>
                    </>
                  )}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                ACCOUNT NUMBER
              </label>
              <input 
                type="text" 
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="0123456789"
                maxLength={10}
                className="w-full bg-gray-50/70 border border-gray-100 text-gray-900 font-medium rounded-xl py-3.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#0F3D2E]/20"
              />
            </div>

            {isVerified && (
              <div className="bg-[#E6F4EA] border border-[#C3E6CB] rounded-xl p-3 flex items-center gap-2 mb-6 animate-in fade-in zoom-in duration-300">
                <CheckCircle2 size={16} className="text-[#1E7E34]" />
                <span className="text-xs font-bold text-[#1E7E34] uppercase tracking-wider">
                  ACCOUNT VERIFIED: (MOCK NAME)
                </span>
              </div>
            )}

            <button 
              onClick={handleReviewWithdrawal}
              disabled={!isVerified}
              className={`w-full py-4 rounded-xl font-bold transition-colors ${
                isVerified ? "bg-[#0F3D2E] text-white hover:bg-[#185541]" : "bg-[#8DAAA0] text-white cursor-not-allowed text-opacity-90"
              }`}
            >
              Review Withdrawal
            </button>
          </div>
        )}

        {/* Step 3: Confirm Withdrawal */}
        {step === 3 && (
          <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
             <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirm Withdrawal</h2>
              <p className="text-gray-500 text-sm">Please review the details below</p>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 mb-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-500">Amount</span>
                <span className="text-sm font-bold text-gray-900">₦{amount}</span>
              </div>
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                <span className="text-sm text-gray-500">Fee (1.5%)</span>
                <span className="text-sm font-bold text-red-500">-₦{fee.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-900">Total to Receive</span>
                <span className="text-sm font-bold text-emerald-600">₦{totalReceive.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              </div>
            </div>

            <div className="border border-gray-100 rounded-xl p-4 flex items-center gap-4 mb-4">
               <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-600">
                  <Building2 size={20} />
               </div>
               <div>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">DESTINATION BANK</p>
                 <p className="text-sm font-bold text-gray-900">{selectedBank?.name || bankCode} • {accountNumber}</p>
               </div>
            </div>

            <div className="border border-gray-100 rounded-xl p-4 flex items-center gap-4 mb-6">
               <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                  <Smartphone size={18} />
               </div>
               <div className="flex-1">
                 <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">SECURITY CHECK</p>
                 <input 
                   type="password"
                   value={pin}
                   onChange={(e) => setPin(e.target.value)}
                   placeholder="Enter 4-digit Code"
                   maxLength={4}
                   className="w-full bg-transparent text-sm font-mono tracking-widest text-gray-900 focus:outline-none placeholder:tracking-normal placeholder:font-sans"
                 />
               </div>
            </div>

            <button 
              onClick={handleConfirmWithdrawal}
              disabled={pin.length < 4}
              className={`w-full py-4 rounded-xl font-bold transition-colors mb-4 ${
                pin.length >= 4 ? "bg-[#0F3D2E] text-white hover:bg-[#185541]" : "bg-[#8DAAA0] text-white cursor-not-allowed text-opacity-90"
              }`}
            >
              Confirm & Withdraw
            </button>

            <div className="flex items-center justify-center gap-2 text-gray-400">
              <ShieldCheck size={14} />
              <span className="text-[10px] uppercase font-bold tracking-wider">SECURE 256-BIT ENCRYPTED TRANSACTION</span>
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
        {step === 5 && (
           <div className="flex flex-col items-center animate-in fade-in scale-in duration-300">
             <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-400 flex items-center justify-center text-emerald-500 mb-6">
              <Check strokeWidth={3} size={28} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Withdrawal Successful!</h2>
            <p className="text-gray-500 text-sm text-center mb-8">
              Your funds are on the way to your bank account.
            </p>

            <div className="w-full bg-gray-50 rounded-xl p-5 mb-8 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Reference ID</span>
                <span className="text-sm font-bold text-gray-900">#WD-8829-X</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Amount Sent</span>
                <span className="text-sm font-bold text-gray-900">₦{totalReceive ? totalReceive.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : "48,500.00"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Estimated Arrival</span>
                <span className="text-sm font-bold text-gray-900">Within 15 minutes</span>
              </div>
            </div>

            <div className="flex gap-4 w-full">
              <button 
                className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 py-3.5 rounded-xl font-bold transition-colors"
              >
                <Download size={18} /> Receipt
              </button>
              <button 
                onClick={onComplete}
                className="flex-1 bg-[#0F3D2E] text-white hover:bg-[#185541] py-3.5 rounded-xl font-bold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
