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

export default function TermsOfServicePage() {
    return (
        <main className="min-h-screen w-full bg-black text-gray-100 font-sans overflow-hidden">
            <StarsBackground />
            <Header />

            {/* ===== Page Content ===== */}
            <section className="relative z-10 max-w-4xl mx-auto px-6 py-24 pt-40">
                {/* Page Header */}
                <div className="text-left mb-16">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
                        Terms of Service
                    </h1>
                    <p className="text-lg text-gray-400">
                        Last Updated: 31-10-2025
                    </p>
                </div>

                {/* Legal Content */}
                <p className="text-lg text-gray-300 mb-10">
                    Please read these Terms of Service ("Terms") carefully. This is a
                    binding legal agreement between you (the "Client") and MockStudio /
                    YMS ("MockStudio," "we," or "us") regarding your use of our web
                    development, hosting, and maintenance services (the "Services").
                    By using our Services, you agree to be bound by these Terms.
                </p>

                <LegalSection title="1. Description of Services">
                    <p>
                        MockStudio provides custom web development, website hosting, and
                        ongoing website maintenance. All project details, timelines, and
                        deliverables will be defined in a separate, written
                        <strong> Project Proposal</strong> or
                        <strong> Statement of Work (SOW)</strong>, which becomes part of
                        this agreement.
                    </p>
                </LegalSection>

                <LegalSection title="2. Fees and Payment">
                    <p>Our business model is structured as follows:</p>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                        <li>
                            <strong>Development Fees:</strong> You are charged for the
                            development work required to build your project, as outlined in
                            the SOW.
                        </li>
                        <li>
                            <strong>Maintenance Fees:</strong> Ongoing maintenance (e.g.,
                            software updates, security monitoring) is an optional, separate
                            service, billed as a recurring fee.
                        </li>
                        <li>
                            <strong> Hosting Fees:</strong> Website hosting is a separate,
                            recurring fee.
                        </li>
                    </ul>
                    <p>
                        <strong>Payment Terms:</strong> All invoices are due upon receipt
                        (or as otherwise specified in the SOW). Late payments may be
                        subject to a late fee. MockStudio reserves the right to suspend
                        all Services, including hosting, for non-payment.
                    </p>
                </LegalSection>

                <LegalSection title="3. Intellectual Property">
                    <p>
                        <strong>YMS/MockStudio Intellectual Property:</strong> We retain
                        all right, title, and interest in our name ("MockStudio" / "YMS"),
                        trademarks, logos, brand identity, and the content of our own
                        website. You may not reuse, copy, or imitate any part of our
                        brand identity or website without our express written permission.
                    </p>
                    <p className="text-violet-300">
                        <strong>
                            Unauthorized use of MockStudio intellectual property is strictly
                            prohibited and will be subject to penalties and immediate legal
                            action.
                        </strong>
                    </p>
                    <p>
                        <strong>Client Intellectual Property:</strong> Upon our receipt of
                        full and final payment from you, MockStudio grants to you all
                        right, title, and interest in the
                        <strong> Final Product</strong> (the unique design and code created
                        specifically for your project).
                    </p>
                    <p>
                        <strong>MockStudio Pre-existing IP:</strong> We retain ownership
                        of all pre-existing code, libraries, and tools used to create
                        your project ("MockStudio Tools"). You are granted a non-exclusive
                        license to use the MockStudio Tools as part of your Final
                        Product, but you may not extract, resell, or redistribute them.
                    </p>
                </LegalSection>

                <LegalSection title="4. Project Timelines">
                    <p>
                        MockStudio will use commercially reasonable efforts to complete the
                        project in a timely manner. This timeline is contingent upon your
                        timely provision of all necessary content (e.g., text, images)
                        and timely feedback. Delays on your part may extend the project
                        timeline and may incur additional fees.
                    </p>
                </LegalSection>

                <LegalSection title="5. Client Responsibilities">
                    <p>You agree to:</p>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                        <li>
                            Provide all content, feedback, and approvals in a timely
                            manner.
                        </li>
                        <li>
                            Ensure all content you provide does not infringe on any
                            third-party copyrights or trademarks.
                        </li>
                        <li>
                            Maintain a valid backup of your website data, even if using our
                            hosting services.
                        </li>
                        <li>
                            If you use our hosting, you are responsible for your users'
                            compliance with all applicable laws.
                        </li>
                    </ul>
                </LegalSection>

                <LegalSection title="6. Limitation of Liability">
                    <p>
                        To the maximum extent permitted by law, MockStudio shall not be
                        liable for any indirect, special, incidental, or consequential
                        damages (including but not limited to loss of profits or data)
                        arising out of or in connection with our Services.
                    </p>
                    <p>
                        Our total liability to you for any and all claims is limited to
                        the total amount of fees you have paid to MockStudio for the
                        specific Service in question during the preceding [e.g., three (3)]
                        months.
                    </p>
                </LegalSection>

                <LegalSection title="7. Disclaimer of Warranties">
                    <p>
                        All Services are provided "as-is." MockStudio does not warrant
                        that the Services will be uninterrupted, error-free, or
                        completely secure.
                    </p>
                </LegalSection>

                <LegalSection title="8. Termination">
                    <p>
                        Either party may terminate this agreement with [e.g., thirty (30)]
                        days' written notice. Upon termination, you agree to pay
                        MockStudio for all work completed up to the date of termination.
                    </p>
                </LegalSection>

                {/* --- UPDATED SECTION --- */}
                {/* IMPORTANT: Even as a "virtual company," you must
					choose a jurisdiction (e.g., your state or country of
					residence) for legal purposes. This is a critical clause.
					You MUST consult a lawyer to fill this in correctly.
				*/}
                <LegalSection title="9. Governing Law">
                    <p>
                        These Terms shall be governed by and construed in accordance with
                        the laws of Bangalore/India, without regard to its conflict
                        of law principles.
                    </p>
                </LegalSection>

                {/* --- UPDATED SECTION --- */}
                <LegalSection title="10. Contact Us">
                    <p>
                        If you have any questions about these Terms, please contact us at
                        our official email address: contact@snippkit.com
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