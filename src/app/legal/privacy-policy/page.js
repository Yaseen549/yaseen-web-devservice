"use client";

import React from "react";
import Header from "@/app/partials/Header";
import StarsBackground from "@/components/StarsBackground";

// Helper component for styling legal sections
const LegalSection = ({ title, children }) => (
    <div className="mb-10 text-left">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-500 mb-4">
            {title}
        </h2>
        <div className="space-y-4 text-gray-300 text-lg">
            {children}
        </div>
    </div>
);

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen w-full bg-black text-gray-100 font-sans overflow-hidden">
            <StarsBackground />
            <Header />

            {/* ===== Page Content ===== */}
            <section className="relative z-10 max-w-4xl mx-auto px-6 py-24 pt-40">
                {/* Page Header */}
                <div className="text-left mb-16">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-lg text-gray-400">
                        Last Updated: 31-10-2025
                    </p>
                </div>

                {/* Legal Content */}
                <LegalSection title="1. Information We Collect">
                    <p>We may collect information about you in several ways:</p>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                        <li>
                            <strong>Client Personal Information:</strong> We collect
                            personally identifiable information, such as your
                            <strong> name</strong>, <strong> email address</strong>, and
                            <strong> company details</strong>, that you voluntarily give to
                            us when you sign up as a client to use our services.
                        </li>
                        <li>
                            <strong>Project Data:</strong> We collect and store information
                            related to your projects, such as project status, URLs, and
                            other details you provide, which are necessary for our service.
                        </li>
                        <li>
                            <strong>Usage Data:</strong> We may automatically collect
                            information your browser sends when you visit our site, such as
                            your <strong>IP address</strong>, <strong>browser type</strong>,
                            and pages visited.
                        </li>
                    </ul>
                </LegalSection>

                {/* --- UPDATED SECTION --- */}
                <LegalSection title="2. How We Use Your Information">
                    <p>
                        We use the information we collect strictly to provide and maintain
                        our services to you. We do not sell or share your data for
                        marketing purposes. Your data is used for:
                    </p>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                        <li>
                            <strong>To Provide Your Services:</strong> To create your client
                            account, manage your projects, and display your project
                            information and status on your personal dashboard.
                        </li>
                        <li>
                            <strong>For Client Records:</strong> We maintain records of our
                            clients for internal administrative, billing, and project
                            management purposes only.
                        </li>
                        <li>
                            <strong>To Communicate with You:</strong> To respond to your
                            inquiries, send you project updates, and provide customer
                            support related to your account.
                        </li>
                        <li>
                            <strong>To Process Payments:</strong> To bill you for services
                            rendered, including development and maintenance fees.
                        </li>
                    </ul>
                </LegalSection>

                <LegalSection title="3. Data Sharing and Disclosure">
                    <p>
                        We do not sell your personal information. We may share your
                        information in the following limited situations:
                    </p>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                        <li>
                            <strong>Third-Party Vendors:</strong> With trusted third-party
                            service providers who perform essential services for us (e.g.,
                            payment processors, hosting providers). These vendors only have
                            access to the information necessary to perform their tasks.
                        </li>
                        <li>
                            <strong>Legal Requirements:</strong> If required by law, such as
                            in response to a subpoena, court order, or other legal process.
                        </li>
                    </ul>
                </LegalSection>

                <LegalSection title="4. Client Data and Hosting">
                    <p>
                        If you use our hosting services, you are the
                        <strong>"Data Controller"</strong> for any personal data
                        collected on your website, and MockStudio (or YMS) acts as the
                        <strong>"Data Processor."</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                        <li>
                            <strong>Your Responsibility:</strong> You are solely responsible
                            for ensuring you have a valid legal basis (e.g., consent) to
                            collect and process your users' data and for having your own
                            privacy policy for your website.
                        </li>
                        <li>
                            <strong>Our Responsibility:</strong> We will only process your
                            users' data on your behalf and in accordance with our client
                            agreement to host your site.
                        </li>
                    </ul>
                </LegalSection>

                <LegalSection title="5. Data Security">
                    <p>
                        We use administrative, technical, and physical security measures to
                        help protect your personal information. While we have taken
                        reasonable steps to secure the data you provide to us, please be
                        aware that no security system is impenetrable.
                    </p>
                </LegalSection>

                <LegalSection title="6. Changes to This Policy">
                    <p>
                        We may update this Privacy Policy from time to time. We will notify
                        you of any changes by posting the new policy on this page and
                        updating the "Last Updated" date.
                    </p>
                </LegalSection>

                {/* --- UPDATED SECTION --- */}
                <LegalSection title="7. Contact Us">
                    <p>
                        As a virtual company, our primary point of contact is via email.
                        If you have any questions about this Privacy Policy, please
                        contact us at:
                    </p>
                    <p className="mt-4 not-italic">
                        <strong>MockStudio / YMS</strong>
                        <br />
                        contact@snippkit.com
                    </p>
                </LegalSection>
            </section>
        </main>
    );
}