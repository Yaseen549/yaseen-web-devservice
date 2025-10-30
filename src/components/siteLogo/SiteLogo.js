// app/components/SiteLogo.js
"use client";

import { Pacifico } from "next/font/google";

// Load Pacifico font for this component only
const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pacifico",
});

export default function SiteLogo() {
  return (
    <div className="text-left">
      <h1 className={`${pacifico.className} text-sm text-white leading-none`}>Yaseen's</h1>
      <h1 className="text-2xl font-extrabold text-white -mt-1">
        Mock<span className="text-violet-400">Studio</span>
      </h1>
    </div>
  );
}
