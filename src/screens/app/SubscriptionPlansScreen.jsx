import React, { useMemo, useState } from 'react';
import { Check, CreditCard } from 'lucide-react';
import { defaultPlans, MEMBER_PLAN_KEY, PLAN_STORAGE_KEY, RECEIPT_STORAGE_KEY } from '../../data/planCatalog';

const SubscriptionPlansScreen = () => {
  const plans = useMemo(() => {
    const savedPlans = localStorage.getItem(PLAN_STORAGE_KEY);
    if (!savedPlans) return defaultPlans;
    try {
      const parsedPlans = JSON.parse(savedPlans);
      return Array.isArray(parsedPlans) && parsedPlans.length > 0 ? parsedPlans : defaultPlans;
    } catch (error) {
      return defaultPlans;
    }
  }, []);

  const [activePlanId, setActivePlanId] = useState(() => localStorage.getItem(MEMBER_PLAN_KEY) || 'PLN-02');
  const [feedback, setFeedback] = useState('');

  const handleChoosePlan = (plan) => {
    if (plan.status !== 'Active') {
      setFeedback(`${plan.name} is currently inactive. Please ask admin to activate it.`);
      return;
    }

    localStorage.setItem(MEMBER_PLAN_KEY, plan.id);
    setActivePlanId(plan.id);

    const receipts = JSON.parse(localStorage.getItem(RECEIPT_STORAGE_KEY) || '[]');
    const newReceipt = {
      id: `RCPT-${Date.now()}`,
      planId: plan.id,
      planName: plan.name,
      amount: Number(plan.price || 0),
      date: new Date().toISOString(),
      status: 'Paid'
    };
    localStorage.setItem(RECEIPT_STORAGE_KEY, JSON.stringify([newReceipt, ...receipts].slice(0, 20)));
    setFeedback(`Plan switched to ${plan.name}. A receipt has been generated.`);
  };

  return (
    <div className="max-w-6xl mx-auto px-2 lg:px-0 mt-4 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-[#15192c]">Subscription & Billing</h1>
        <p className="text-sm font-medium text-[#9A8A8E] mt-1">Upgrade or downgrade your plan and manage billing history from here.</p>
      </div>

      {feedback && (
        <div className="mb-6 rounded-2xl border border-[#F5E6EA] bg-[#FFF7F8] px-5 py-4 text-sm font-bold text-[#D17B88]">
          {feedback}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isActivePlan = activePlanId === plan.id;
          const isInactive = plan.status !== 'Active';

          return (
            <div
              key={plan.id}
              className={`rounded-[2rem] p-7 border shadow-sm ${isActivePlan ? 'bg-[#1A0B13] text-white border-[#1A0B13]' : 'bg-white border-[#F5E6EA]'} ${isInactive ? 'opacity-70' : ''}`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black">{plan.name}</h3>
                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${isActivePlan ? 'bg-white/20' : 'bg-rose-50 text-[#ff69b4]'}`}>
                  {isActivePlan ? 'Current Plan' : plan.status}
                </span>
              </div>

              <p className={`text-sm font-medium mb-4 ${isActivePlan ? 'text-white/70' : 'text-[#9A8A8E]'}`}>
                {plan.shortDescription || 'Plan details curated for member wellbeing.'}
              </p>

              <p className={`text-3xl font-black mb-5 ${isActivePlan ? 'text-white' : 'text-[#D17B88]'}`}>
                {Number(plan.price || 0) === 0 ? 'Free' : `₹${Number(plan.price).toLocaleString()}`}
              </p>

              <div className="space-y-2.5 mb-6">
                {(plan.features || []).slice(0, 6).map((feat, index) => (
                  <div key={`${plan.id}-${index}`} className={`flex items-center gap-2 text-xs font-bold ${isActivePlan ? 'text-white/85' : 'text-[#6B5E63]'}`}>
                    <Check size={12} className={isActivePlan ? 'text-[#B197B0]' : 'text-[#D17B88]'} />
                    {feat}
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleChoosePlan(plan)}
                disabled={isInactive}
                className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  isActivePlan
                    ? 'bg-white text-[#15192c]'
                    : 'bg-[#ff69b4] text-white hover:brightness-110 active:scale-95'
                } ${isInactive ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {isActivePlan ? 'Already Active' : 'Switch Plan'}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-10 rounded-[2rem] bg-white border border-[#F5E6EA] p-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-[#ff69b4]">
          <CreditCard size={22} />
        </div>
        <div>
          <p className="text-sm font-black text-[#15192c]">Auto-billing simulation active</p>
          <p className="text-xs font-bold text-[#9A8A8E]">A receipt is auto-generated on plan switch and appears in the `Receipts` section.</p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlansScreen;
