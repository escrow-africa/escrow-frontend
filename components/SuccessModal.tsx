import React from 'react';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  buttonText?: string;
  redirectTo?: string;
  onAction?: () => void;
}

export default function SuccessModal({
  isOpen,
  onClose,
  title = 'Success',
  description = 'Your request completed successfully.',
  buttonText = 'Continue',
  redirectTo,
  onAction,
}: SuccessModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleAction = () => {
    onClose();

    if (onAction) {
      onAction();
      return;
    }

    if (redirectTo) {
      router.push(redirectTo);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-white dark:bg-black border border-gray-200 dark:border-[#333] rounded-4xl p-8 flex flex-col items-center text-center shadow-2xl">
        <div className="w-18 h-18 rounded-full bg-[#E5F7F0] dark:bg-[#013B2E]/30 flex items-center justify-center mb-6 border border-[#B3E6CF] dark:border-[#013B2E]/50">
          <Check className="w-8 h-8 text-[#013B2E] dark:text-[#34D399]" strokeWidth={2.5} />
        </div>

        <h2 className="text-2xl font-bold text-[#013B2E] dark:text-white mb-2">{title}</h2>
        <p className="text-[#767676] text-sm mb-8">{description}</p>

        <button
          onClick={handleAction}
          className="w-full py-4 px-4 bg-[#013B2E] hover:bg-[#012a20] text-white rounded-xl font-medium transition-colors"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
