// app/components/sections/PricingSection.js
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

// Section Wrapper
const Section = ({ id, title, highlight, children }) => (
  <section id={id} className="max-w-7xl mx-auto px-6 py-24 z-10">
    <h2 className="text-4xl font-bold text-center mb-16">
      {title} <span className="text-violet-400">{highlight}</span>
    </h2>
    {children}
  </section>
);

// Data specific to this section
const pricing = [
    {
      title: "Starter",
      price: "$49",
      features: ["1-3 Page Site", "Responsive Design", "Contact Form", "Basic SEO", "1 Week Delivery"],
    },
    {
      title: "Growth",
      price: "$199",
      features: [
        "Up to 5 Pages", "Custom UI/UX", "CMS Integration", "Blog Setup",
        "Analytics Integration", "Priority Support",
      ],
      popular: true,
    },
    {
      title: "Pro",
      price: "$599",
      features: [
        "Full-stack Web App", "Database & Auth", "API Integration", "Dashboard",
        "Advanced Analytics", "Dedicated Support",
      ],
    },
];

export default function PricingSection() {
  return (
    <Section id="pricing" title="Pricing" highlight="Plans">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pricing.map((p) => (
          <motion.div
            key={p.title}
            className={`relative flex flex-col bg-gray-950/60 backdrop-blur-sm rounded-xl text-center shadow-lg divide-y divide-gray-800 cursor-pointer ${
              p.popular
                ? "border-2 border-violet-500 md:scale-105 shadow-2xl shadow-violet-900/30"
                : "border border-gray-800"
            }`}
          >
            {p.popular && (
              <div className="absolute -top-3 right-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                Most Popular
              </div>
            )}
            <div className="p-8">
              <h3 className="text-xl font-bold text-violet-400 mb-2">{p.title}</h3>
              <p className="text-4xl font-extrabold text-white mb-4">{p.price}</p>
            </div>
            <ul className="p-8 text-gray-400 space-y-3 text-left text-sm flex-grow">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}