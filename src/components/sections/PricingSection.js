"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const Section = ({ id, title, highlight, children }) => (
  <section id={id} className="max-w-7xl mx-auto px-6 py-24 z-10">
    <h2 className="text-4xl font-bold text-center mb-16">
      {title} <span className="text-violet-400">{highlight}</span>
    </h2>
    {children}
  </section>
);

const pricing = [
  {
    title: "Starter",
    price: "$99",
    tagline: "Perfect for individuals or small startups getting online.",
    features: [
      "Up to 3 Pages (Landing, About, Contact)",
      "Responsive Design (Mobile + Desktop)",
      "Basic SEO Setup",
      "Contact Form Integration",
      "Delivery in 5-7 Days",
      "Email Support",
    ],
  },
  {
    title: "Professional",
    price: "$299",
    tagline: "Ideal for growing businesses that need a scalable web presence.",
    popular: true,
    features: [
      "Up to 6 Custom Pages",
      "Custom UI/UX Design",
      "CMS (Blog / Products / Content)",
      "Google Analytics + Search Console Setup",
      "Basic Animations & Interactivity",
      "Priority Support (24-48 hrs)",
    ],
  },
  {
    title: "Ultimate",
    price: "$799",
    tagline: "For teams who want advanced, fully custom web solutions.",
    features: [
      "Full-Stack Web App (with Auth + Database)",
      "Admin Dashboard",
      "API + Third-Party Integrations",
      "Custom Animations / Dynamic Components",
      "Performance & SEO Optimization",
      "Dedicated Slack / Zoom Support",
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
            whileHover={{ y: -5, scale: 1.02 }}
            className={`relative flex flex-col bg-gray-950/60 backdrop-blur-sm rounded-2xl text-center shadow-xl divide-y divide-gray-800 border ${p.popular
                ? "border-violet-500 md:scale-105 shadow-violet-900/20"
                : "border-gray-800"
              }`}
          >
            {p.popular && (
              <div className="absolute -top-3 right-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                Most Popular
              </div>
            )}
            <div className="p-8">
              <h3 className="text-2xl font-bold text-white mb-2">{p.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{p.tagline}</p>
              <p className="text-5xl font-extrabold text-white mb-6">{p.price}</p>
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
