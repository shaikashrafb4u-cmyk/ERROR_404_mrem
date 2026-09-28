import React from 'react';
import { useToast, ToastItem } from '../hooks/useToast';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <ToastMessage key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

const ToastMessage: React.FC<{ toast: ToastItem; onDismiss: () => void }> = ({ toast, onDismiss }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-blue-400 shrink-0" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success':
        return 'border-emerald-500/30 bg-[#121a14]';
      case 'error':
        return 'border-rose-500/30 bg-[#1d1214]';
      case 'warning':
        return 'border-amber-500/30 bg-[#1d1912]';
      default:
        return 'border-blue-500/30 bg-[#121620]';
    }
  };

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 transform translate-y-0 opacity-100 ${getBorderColor()}`}
    >
      {getIcon()}
      <div className="flex-1 text-sm text-zinc-100 font-medium leading-relaxed">{toast.message}</div>
      <button
        onClick={onDismiss}
        className="text-zinc-400 hover:text-white transition-colors p-0.5 rounded-md hover:bg-white/10"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
