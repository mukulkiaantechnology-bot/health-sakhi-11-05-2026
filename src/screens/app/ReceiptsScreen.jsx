import React, { useMemo } from 'react';
import { Download, ReceiptIndianRupee } from 'lucide-react';
import { RECEIPT_STORAGE_KEY } from '../../data/planCatalog';

const ReceiptsScreen = () => {
  const receipts = useMemo(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem(RECEIPT_STORAGE_KEY) || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }, []);

  const downloadReceipt = (receipt) => {
    const lines = [
      'HealthSakhi - Payment Receipt',
      `Receipt ID: ${receipt.id}`,
      `Date: ${new Date(receipt.date).toLocaleString()}`,
      `Plan: ${receipt.planName}`,
      `Amount: INR ${Number(receipt.amount || 0).toLocaleString()}`,
      `Status: ${receipt.status}`
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${receipt.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto px-2 lg:px-0 mt-4 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-[#15192c]">Payment Receipts</h1>
        <p className="text-sm font-medium text-[#9A8A8E] mt-1">Recent billing receipts are available here. You can download and store them for records.</p>
      </div>

      {receipts.length === 0 ? (
        <div className="rounded-[2rem] border border-[#F5E6EA] bg-white p-10 text-center">
          <p className="text-sm font-black text-[#15192c]">No receipts yet</p>
          <p className="text-xs font-bold text-[#9A8A8E] mt-2">Receipts appear here after plan switch or payment simulation.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {receipts.map((receipt) => (
            <div key={receipt.id} className="rounded-2xl border border-[#F5E6EA] bg-white p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-[#ff69b4]">
                  <ReceiptIndianRupee size={18} />
                </div>
                <div>
                  <p className="text-sm font-black text-[#15192c]">{receipt.planName}</p>
                  <p className="text-xs font-bold text-[#9A8A8E]">{receipt.id} • {new Date(receipt.date).toLocaleString()}</p>
                  <p className="text-xs font-bold text-[#D17B88] mt-1">INR {Number(receipt.amount || 0).toLocaleString()} • {receipt.status}</p>
                </div>
              </div>
              <button
                onClick={() => downloadReceipt(receipt)}
                className="px-5 py-2.5 rounded-xl bg-[#ff69b4] text-white text-[10px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
              >
                <Download size={14} />
                Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReceiptsScreen;
