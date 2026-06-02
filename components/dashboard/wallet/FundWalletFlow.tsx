import React, { useState } from "react";
import { CreditCard, Building2, Smartphone, Check, ShieldCheck, CheckCircle2, Clock, Copy } from "lucide-react";
import { useWalletStore } from "../../../store/walletStore";
import toast from "react-hot-toast";

interface FundWalletFlowProps {
  onComplete: () => void;
  userId: string | null;
}

export default function FundWalletFlow({ onComplete, userId }: FundWalletFlowProps) {
  const [step, setStep] = useState<number>(1);
  const [amount, setAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("debit_card");

  // Step 2 Form
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // OTP Step
  const [otp, setOtp] = useState("");
  const [transactionReference, setTransactionReference] = useState("");
  const [tokenId, setTokenId] = useState("");

  // Details from API
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  const { fundWallet, verifyCardOtp, isLoading } = useWalletStore();

  const handleAmountSelect = (val: string) => {
    setAmount(val);
  };

  const handleContinueToPay = async () => {
    if (!amount) return;

    if (paymentMethod === "bank" || paymentMethod === "ussd") {
      try {
        const numAmount = parseFloat(amount.replace(/,/g, ''));
        const response = await fundWallet({
          userId,
          amount: numAmount,
          method: paymentMethod
        });
        setPaymentDetails(response.data || response);

        if (paymentMethod === "bank") {
          setStep(5);
        } else if (paymentMethod === "ussd") {
          setStep(6);
        }
      } catch (error: any) {
        console.error("Initiate funding error:", error);
        toast.error(error?.response?.data?.message || error?.message || "Failed to initiate funding.");
      }
    } else {
      setStep(2);
    }
  };

  const handlePaySubmit = async () => {
    if (cardNumber && expiry && cvv) {
      setStep(3); // Processing
      try {
        const numAmount = parseFloat(amount.replace(/,/g, ''));
        const [expiryMonth, expiryYearRaw] = expiry.split('/');
        const expiryYear = expiryYearRaw?.trim().length === 2 ? `20${expiryYearRaw.trim()}` : expiryYearRaw?.trim();

        const response = await fundWallet({
          userId,
          amount: numAmount,
          method: "card",
          card: {
            number: cardNumber.replace(/\s/g, ''),
            cvv,
            expiryMonth: expiryMonth?.trim(),
            expiryYear
          }
        });

        console.log("Backend Response for Card Payment:", response);

        const rawData = response?.raw || response?.data?.raw;
        const isOtpRequired = response?.requiresOtp || response?.data?.requiresOtp || rawData?.status === "OTP_AUTHORIZATION_REQUIRED";

        if (isOtpRequired) {
          setTransactionReference(rawData?.transactionReference || response?.transactionReference || response?.data?.transactionReference || "");
          setTokenId(rawData?.otpData?.id || response?.otpData?.id || response?.data?.otpData?.id || "");
          setStep(7); // Move to OTP step
        } else {
          toast.success("Wallet funded successfully!");
          setStep(4); // Success
        }
      } catch (error: any) {
        console.error("Fund wallet API error:", error);
        toast.error(error?.response?.data?.message || error?.message || "Payment failed. Please try again.");
        setStep(2); // Go back to form
      }
    }
  };

  const handleVerifyOtp = async () => {
    if (otp) {
      setStep(3); // Processing
      try {
        console.log("Sending OTP Payload:", { transactionReference, tokenId, token: otp });
        await verifyCardOtp({
          transactionReference,
          tokenId,
          token: otp
        });
        toast.success("Wallet funded successfully!");
        setStep(4); // Success
      } catch (error: any) {
        toast.error(error?.response?.data?.message || error?.message || "Invalid OTP or verification failed.");
        setStep(7); // Go back to OTP
      }
    }
  };

  const quickAmounts = ["50,000", "100,000", "200,000", "500,000"];

  return (
    <div className="w-full max-w-md mx-auto pt-8">
      {/* Container Card */}
      <div className="bg-white border text-black border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[32px] p-8 md:p-10 animation-fade-in">

        {/* Step 1: Selection */}
        {step === 1 && (
          <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Fund Wallet</h2>
              <p className="text-gray-500 text-sm">Add money to your balance instantly</p>
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

              <div className="flex gap-2 mt-4 justify-between">
                {quickAmounts.map((val) => (
                  <button
                    key={val}
                    onClick={() => handleAmountSelect(val)}
                    className="flex-1 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    +₦{val}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                PAYMENT METHOD
              </label>
              <div className="flex flex-col gap-3">
                {/* Debit Card */}
                <div
                  onClick={() => setPaymentMethod("debit_card")}
                  className={`cursor-pointer border rounded-xl p-4 flex items-center justify-between transition-colors ${paymentMethod === "debit_card"
                      ? "border-[#1E4D3E] bg-[#F7F9F8]"
                      : "border-gray-100 hover:bg-gray-50"
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#1E4D3E] flex items-center justify-center text-white">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Debit Card</p>
                      <p className="text-xs text-gray-500">Visa, Mastercard, Verve</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === "debit_card" ? "border-emerald-500 bg-white text-emerald-500" : "border-gray-200"
                    }`}>
                    {paymentMethod === "debit_card" ? <Check size={12} strokeWidth={3} /> : null}
                  </div>
                </div>

                {/* Bank Transfer */}
                <div
                  onClick={() => setPaymentMethod("bank")}
                  className={`cursor-pointer border rounded-xl p-4 flex items-center justify-between transition-colors ${paymentMethod === "bank"
                      ? "border-[#1E4D3E] bg-[#F7F9F8]"
                      : "border-gray-100 hover:bg-gray-50"
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                      <Building2 size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Bank Transfer</p>
                      <p className="text-xs text-gray-500">Transfer to a unique account</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === "bank" ? "border-emerald-500 bg-white text-emerald-500" : "border-gray-200"
                    }`}>
                    {paymentMethod === "bank" ? <Check size={12} strokeWidth={3} /> : null}
                  </div>
                </div>

                {/* USSD */}
                <div
                  onClick={() => setPaymentMethod("ussd")}
                  className={`cursor-pointer border rounded-xl p-4 flex items-center justify-between transition-colors ${paymentMethod === "ussd"
                      ? "border-[#1E4D3E] bg-[#F7F9F8]"
                      : "border-gray-100 hover:bg-gray-50"
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                      <Smartphone size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">USSD Code</p>
                      <p className="text-xs text-gray-500">Dial a code from your phone</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === "ussd" ? "border-emerald-500 bg-white text-emerald-500" : "border-gray-200"
                    }`}>
                    {paymentMethod === "ussd" ? <Check size={12} strokeWidth={3} /> : null}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleContinueToPay}
              disabled={!amount || isLoading}
              className={`w-full py-4 rounded-xl font-bold transition-colors ${amount && !isLoading ? "bg-[#0F3D2E] text-white hover:bg-[#185541]" : "bg-[#8DAAA0] text-white cursor-not-allowed text-opacity-90"
                }`}
            >
              {isLoading ? "Processing..." : "Continue to Pay"}
            </button>
          </div>
        )}

        {/* Step 2: Card Details Form */}
        {step === 2 && (
          <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Card Details</h2>
              <p className="text-gray-500 text-sm">Enter your debit card information</p>
            </div>

            <div className="mb-6">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                CARD NUMBER
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <CreditCard size={18} />
                </span>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="0000 0000 0000 0000"
                  className="w-full bg-gray-50/70 border border-gray-100 text-gray-900 font-medium rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-[#0F3D2E]/20"
                />
              </div>
            </div>

            <div className="flex gap-4 mb-8">
              <div className="flex-1">
                <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                  EXPIRY DATE
                </label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM/YY"
                  className="w-full bg-gray-50/70 border border-gray-100 text-gray-900 font-medium rounded-xl py-3.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#0F3D2E]/20"
                />
              </div>
              <div className="flex-1">
                <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                  CVV
                </label>
                <input
                  type="password"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="***"
                  maxLength={3}
                  className="w-full bg-gray-50/70 border border-gray-100 text-gray-900 font-medium tracking-[0.2em] rounded-xl py-3.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#0F3D2E]/20"
                />
              </div>
            </div>

            <button
              onClick={handlePaySubmit}
              disabled={!cardNumber || !expiry || !cvv || isLoading}
              className={`w-full py-4 rounded-xl font-bold transition-colors mb-6 ${(cardNumber && expiry && cvv && !isLoading) ? "bg-[#0F3D2E] text-white hover:bg-[#185541]" : "bg-[#8DAAA0] text-white cursor-not-allowed text-opacity-90"
                }`}
            >
              Pay ₦{amount || "0.00"}
            </button>

            <div className="flex items-center justify-center gap-2 text-gray-400">
              <ShieldCheck size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">PCI-DSS COMPLIANT SECURE PAYMENT</span>
            </div>
          </div>
        )}

        {/* Step 7: OTP Step */}
        {step === 7 && (
          <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Payment</h2>
              <p className="text-gray-500 text-sm">Enter the OTP sent to your registered phone or email</p>
            </div>

            <div className="mb-8">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2 text-center">
                ONE TIME PASSWORD
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                className="w-full text-center bg-gray-50/70 border border-gray-100 text-gray-900 text-2xl font-bold tracking-widest rounded-xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-[#0F3D2E]/20"
              />
            </div>

            <button
              onClick={handleVerifyOtp}
              disabled={otp.length < 4 || isLoading}
              className={`w-full py-4 rounded-xl font-bold transition-colors mb-4 ${(otp.length >= 4 && !isLoading) ? "bg-[#0F3D2E] text-white hover:bg-[#185541]" : "bg-[#8DAAA0] text-white cursor-not-allowed text-opacity-90"
                }`}
            >
              Verify & Complete
            </button>
          </div>
        )}

        {/* Step 3: Processing */}
        {step === 3 && (
          <div className="flex flex-col items-center justify-center py-10 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#0F3D2E] mb-6 animate-pulse">
              <CreditCard size={28} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">Payment Processing</h2>
            <p className="text-gray-500 text-sm text-center max-w-[250px] leading-relaxed">
              Please don't close this window. We're securing your transactions.
            </p>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="flex flex-col items-center animate-in fade-in scale-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-400 flex items-center justify-center text-emerald-500 mb-6">
              <Check strokeWidth={3} size={28} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Payment Successful!</h2>
            <p className="text-gray-500 text-sm text-center mb-8">
              Your wallet has been funded successfully.
            </p>

            <button
              onClick={onComplete}
              className="w-full bg-[#0F3D2E] text-white hover:bg-[#185541] py-4 rounded-xl font-bold transition-colors"
            >
              Back to Wallet
            </button>
          </div>
        )}

        {/* Step 5: Bank Transfer Details */}
        {step === 5 && (
          <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Bank Transfer</h2>
              <p className="text-gray-500 text-sm">Transfer the exact amount to the account below</p>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 mb-6">
              <div className="text-center mb-8">
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#8DAAA0] mb-2">AMOUNT TO PAY</p>
                <p className="text-[32px] font-bold text-[#0F3D2E]">{amount ? amount : "100,000"}.00</p>
              </div>
              <div className="flex flex-col gap-5 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-medium text-xs">Bank Name</span>
                  <span className="font-bold text-gray-900">{paymentDetails?.bankName || "Medals Microfinance Bank"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-medium text-xs">Account Number</span>
                  <span className="font-bold text-gray-900">{paymentDetails?.accountNumber || "0123456789"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-medium text-xs">Account Name</span>
                  <span className="font-bold text-gray-900">{paymentDetails?.accountName || "LEINE_ANAGHA_WALLET"}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#FFFBF0] text-[#D48806] rounded-xl p-4 flex gap-3 mb-8 border border-[#FFEBC2]">
              <Clock size={18} className="mt-0.5 flex-shrink-0" />
              <p className="uppercase text-[10px] sm:text-[11px] font-bold leading-relaxed tracking-wider">
                This account expires in 30 minutes. Funds will be credited automatically.
              </p>
            </div>

            <button
              onClick={onComplete}
              className="w-full bg-[#0F3D2E] text-white hover:bg-[#185541] py-4 rounded-xl font-bold transition-colors"
            >
              I've Made the Transfer
            </button>
          </div>
        )}

        {/* Step 6: USSD Payment */}
        {step === 6 && (
          <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">USSD Payment</h2>
              <p className="text-gray-500 text-sm">Dial the code below on your registered phone</p>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-xl p-8 mb-6 flex flex-col items-center justify-center">
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">
                DIAL THIS CODE
              </p>
              <p className="text-4xl sm:text-5xl font-bold text-[#0F3D2E] mb-6 tracking-tight">
                {paymentDetails?.ussdCode || "*737*50*700*1#"}
              </p>
              <button className="flex items-center gap-2 text-sm font-bold text-[#0F3D2E] hover:text-[#185541] transition-colors">
                Copy Code <Copy size={16} />
              </button>
            </div>

            <p className="text-center text-sm text-gray-500 mb-8 max-w-[280px] mx-auto leading-relaxed">
              Follow the prompts on your phone to complete the payment of <br />
              <strong className="text-gray-900 font-bold">₦{amount ? amount : "100,000"}.00</strong>
            </p>

            <button
              onClick={onComplete}
              className="w-full bg-[#0F3D2E] text-white hover:bg-[#185541] py-4 rounded-xl font-bold transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
