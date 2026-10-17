import React from 'react';
import { Sparkles, MessageSquare, CheckCircle, Cake, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Share Your Idea',
      description: 'Choose a cake from our catalogue, build your custom recipe online, or share a reference photo for a personalized birthday theme.',
      icon: Sparkles,
      accent: 'bg-[#FBE6EC] text-[#C9365B]',
    },
    {
      num: '02',
      title: 'Confirm Details & Quote',
      description: 'Our baker verifies your date, confirms eggless or dietary needs, and provides a transparent quote without hidden surprises.',
      icon: MessageSquare,
      accent: 'bg-[#FFE7A3] text-[#382722]',
    },
    {
      num: '03',
      title: 'Freshly Baked & Celebrate',
      description: 'Your cake is freshly baked on celebration morning for pickup at Krupasindu Nagar Road, Kavisuryanagar, ready to impress your guests!',
      icon: Cake,
      accent: 'bg-[#EFF7EA] text-[#55853B]',
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-gradient-to-b from-[#FFFDF9] to-[#FFF9F2] border-b border-[#F0E5D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C9365B] mb-2">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Simple 3-Step Process</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#382722] tracking-tight">
            How to order your custom cake
          </h2>
          <p className="text-sm sm:text-base text-[#664E46] mt-2">
            No complicated apps or rigid menus. We keep cake ordering human, friendly, and reliable.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative bg-white rounded-3xl p-6 sm:p-8 border border-[#F0E5D8] bakery-card-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#C9365B]/30">
                      {step.num}
                    </span>
                    <div className={`w-12 h-12 rounded-2xl ${step.accent} flex items-center justify-center shadow-xs`}>
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#382722] mb-2.5">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#664E46] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#FAF5EF] flex items-center text-xs font-bold text-[#C9365B]">
                  <span>Step {idx + 1} of 3</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Link */}
        <div className="mt-10 text-center">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#C9365B] hover:text-[#A92244] underline decoration-2 underline-offset-4"
          >
            <span>Ready to plan your cake? Submit an enquiry form</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};
