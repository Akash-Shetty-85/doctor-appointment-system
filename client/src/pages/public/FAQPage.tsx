import React, { useState, useEffect } from 'react';
import { mockStore } from '../../lib/mockStore';
import { Card } from '../../components/ui/Card';
import { HelpCircle } from 'lucide-react';

export const FAQPage: React.FC = () => {
  const [, setTick] = useState(0);

  useEffect(() => {
    return mockStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const clinic = mockStore.getActiveClinic();
  const faqs = mockStore.getFAQs();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">
          Help & Information
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-slate-600">
          Answers to common questions regarding appointments, queue tokens, prescriptions, and clinic policies.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq) => (
          <Card key={faq.id} className="p-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-sky-50 text-sky-600 rounded-lg shrink-0 mt-0.5">
                <HelpCircle className="h-4 w-4" />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                  {faq.category}
                </span>
                <h3 className="font-bold text-slate-900 text-base">{faq.question}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
