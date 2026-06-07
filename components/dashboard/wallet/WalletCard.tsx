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
    <div className="bg-[#0F3D2E] rounded-2xl p-5 text-white relative overflow-hidden flex flex-col shadow-lg">
      {/* Background decoration */}
      <div className="absolute -right-5 top-5 opacity-10 transform rotate-12">
        <CreditCard size={160} />
      </div>

      <div className="relative z-10 flex flex-col gap-4">
        {/* Top specific section */}
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[9px] text-gray-300 uppercase tracking-widest font-semibold mb-0.5">
              Available Balance
            </p>
            <h2 className="text-3xl font-bold mb-1">₦{balance}</h2>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              ACTIVE & SECURED
            </div>
          </div>
          
          <div className="text-right">
            <div className="inline-flex justify-center items-center w-9 h-9 rounded-lg bg-white/10 mb-1 border border-white/20">
              <CreditCard size={18} className="text-white" />
            </div>
            <p className="text-[9px] text-gray-300 uppercase tracking-widest font-semibold mb-0.5">
              Card Holder
            </p>
            <p className="text-sm font-semibold">{cardHolder}</p>
          </div>
        </div>

        {/* Account Details */}
        <div className="flex gap-8 mt-2">
          <div>
            <p className="text-[9px] text-gray-300 uppercase tracking-widest font-semibold mb-0.5">
              Account Number
            </p>
            <p className="text-base font-medium tracking-[0.15em]">{accountNumber}</p>
          </div>
          <div>
            <p className="text-[9px] text-gray-300 uppercase tracking-widest font-semibold mb-0.5">
              Expires
            </p>
            <p className="text-base font-medium">{expiryDate}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onFundWallet}
            className="flex-1 bg-[#F3B659] hover:bg-[#e0a64e] text-[#0F3D2E] font-semibold py-2 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm text-sm"
          >
            <Plus size={16} />
            Fund Wallet
          </button>
          <button
            onClick={onWithdrawFunds}
            className="flex-1 border border-white/30 hover:bg-white/10 text-white font-semibold py-2 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <ArrowUpRight size={16} />
            Withdraw Funds
          </button>
        </div>
      </div>
    </div>
  );
}
