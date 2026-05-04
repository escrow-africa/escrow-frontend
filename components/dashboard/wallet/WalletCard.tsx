import React from "react";
import { Plus, ArrowUpRight, CreditCard } from "lucide-react";

interface WalletCardProps {
  balance: string;
  accountNumber: string;
  expiryDate: string;
  cardHolder: string;
  onFundWallet: () => void;
  onWithdrawFunds: () => void;
}

export default function WalletCard({
  balance,
  accountNumber,
  expiryDate,
  cardHolder,
  onFundWallet,
  onWithdrawFunds,
}: WalletCardProps) {
  return (
    <div className="bg-[#0F3D2E] rounded-2xl p-6 text-white relative overflow-hidden flex flex-col justify-between shadow-lg h-full">
      {/* Background decoration */}
      <div className="absolute right-[-20px] top-[20px] opacity-10 transform rotate-12">
        <CreditCard size={180} />
      </div>

      <div className="relative z-10 flex flex-col gap-6">
        {/* Top specific section */}
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] text-gray-300 uppercase tracking-widest font-semibold mb-1">
              Available Balance
            </p>
            <h2 className="text-4xl font-bold mb-2">₦{balance}</h2>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              ACTIVE & SECURED
            </div>
          </div>
          
          <div className="text-right">
            <div className="inline-flex justify-center items-center w-10 h-10 rounded-lg bg-white/10 mb-2 border border-white/20">
              <CreditCard size={20} className="text-white" />
            </div>
            <p className="text-[10px] text-gray-300 uppercase tracking-widest font-semibold mb-1">
              Card Holder
            </p>
            <p className="text-sm font-semibold">{cardHolder}</p>
          </div>
        </div>

        {/* Account Details */}
        <div className="flex gap-12 mt-4">
          <div>
            <p className="text-[10px] text-gray-300 uppercase tracking-widest font-semibold mb-1">
              Account Number
            </p>
            <p className="text-lg font-medium tracking-[0.2em]">{accountNumber}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-300 uppercase tracking-widest font-semibold mb-1">
              Expires
            </p>
            <p className="text-lg font-medium">{expiryDate}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={onFundWallet}
            className="flex-1 bg-[#F3B659] hover:bg-[#e0a64e] text-[#0F3D2E] font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Plus size={18} />
            Fund Wallet
          </button>
          <button
            onClick={onWithdrawFunds}
            className="flex-1 border border-white/30 hover:bg-white/10 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <ArrowUpRight size={18} />
            Withdraw Funds
          </button>
        </div>
      </div>
    </div>
  );
}
