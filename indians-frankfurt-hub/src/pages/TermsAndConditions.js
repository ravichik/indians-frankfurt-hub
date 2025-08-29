import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const TermsAndConditions = () => {
  const navigate = useNavigate();
  const lastUpdated = "August 27, 2025";
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Back
        </button>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms and Conditions</h1>
          <p className="text-sm text-gray-600 mb-8">Last updated: {lastUpdated}</p>
          
          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using Frankfurt Indians ("the Platform"), you accept and agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree to these terms, please do not use our services.
              </p>
              <p className="text-gray-700 mb-4">
                These terms comply with the General Data Protection Regulation (GDPR) (EU) 2016/679 and other applicable EU laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">2. User Registration and Account</h2>
              <p className="text-gray-700 mb-4">
                To access certain features, you must register for an account. You agree to:
              </p>
              <ul className="list-disc ml-6 text-gray-700 mb-4">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your information to keep it accurate</li>
                <li>Keep your password secure and confidential</li>
                <li>Be responsible for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>
              <p className="text-gray-700 mb-4">
                You must be at least 16 years old to create an account, in compliance with GDPR age requirements for data processing.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">3. User-Generated Content</h2>
              <p className="text-gray-700 mb-4">
                By posting content on our Platform, you:
              </p>
              <ul className="list-disc ml-6 text-gray-700 mb-4">
                <li>Grant us a non-exclusive, royalty-free license to use, display, and distribute your content on the Platform</li>
                <li>Confirm that you own or have the right to use the content</li>
                <li>Agree that your content does not violate any third-party rights</li>
                <li>Understand that you retain ownership of your content</li>
              </ul>
              
              <h3 className="text-lg font-semibold mb-2">Prohibited Content</h3>
              <p className="text-gray-700 mb-4">You agree not to post content that:</p>
              <ul className="list-disc ml-6 text-gray-700 mb-4">
                <li>Is illegal, harmful, threatening, abusive, or harassing</li>
                <li>Contains hate speech or discriminatory content</li>
                <li>Infringes any intellectual property rights</li>
                <li>Contains malware or harmful code</li>
                <li>Is spam or commercial solicitation without permission</li>
                <li>Violates any applicable laws or regulations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">4. Disclaimer of Warranties and Limitation of Liability</h2>
              <p className="text-gray-700 mb-4 font-semibold">
                THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND.
              </p>
              <p className="text-gray-700 mb-4">
                We do not warrant that:
              </p>
              <ul className="list-disc ml-6 text-gray-700 mb-4">
                <li>The Platform will be uninterrupted or error-free</li>
                <li>Any defects will be corrected</li>
                <li>The Platform is free of viruses or harmful components</li>
                <li>The information provided is accurate, complete, or current</li>
              </ul>
              
              <p className="text-gray-700 mb-4 font-semibold">
                LIMITATION OF LIABILITY: TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE PLATFORM.
              </p>
              
              <p className="text-gray-700 mb-4">
                We are not responsible for:
              </p>
              <ul className="list-disc ml-6 text-gray-700 mb-4">
                <li>Content posted by users</li>
                <li>Actions taken based on information found on the Platform</li>
                <li>Third-party websites linked from our Platform</li>
                <li>Interactions between users, whether online or offline</li>
                <li>Loss of data or content</li>
                <li>Any damages resulting from use or inability to use the Platform</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">5. Content Accuracy Disclaimer</h2>
              <p className="text-gray-700 mb-4 font-semibold">
                IMPORTANT NOTICE: ALL INFORMATION PROVIDED ON THIS PLATFORM IS FOR GENERAL INFORMATIONAL PURPOSES ONLY.
              </p>
              <p className="text-gray-700 mb-4">
                The Platform operators, administrators, and moderators:
              </p>
              <ul className="list-disc ml-6 text-gray-700 mb-4">
                <li>Do NOT guarantee the accuracy, completeness, or reliability of any content</li>
                <li>Do NOT verify the credentials or qualifications of users posting content</li>
                <li>Do NOT endorse any opinions, advice, or recommendations shared by users</li>
                <li>Are NOT responsible for any errors or omissions in content</li>
                <li>Are NOT liable for decisions made based on information found on the Platform</li>
              </ul>
              
              <h3 className="text-lg font-semibold mb-2">User-Generated Content Disclaimer</h3>
              <p className="text-gray-700 mb-4">
                This Platform contains user-generated content. We do not:
              </p>
              <ul className="list-disc ml-6 text-gray-700 mb-4">
                <li>Review, verify, or fact-check user posts before publication</li>
                <li>Guarantee that advice about visas, housing, jobs, or legal matters is accurate or current</li>
                <li>Take responsibility for business recommendations or service provider suggestions</li>
                <li>Verify the authenticity of events, meetups, or gatherings posted by users</li>
                <li>Ensure that information about Indian businesses, restaurants, or services is accurate</li>
              </ul>
              
              <p className="text-gray-700 mb-4 font-semibold">
                YOU ACKNOWLEDGE THAT ANY RELIANCE ON MATERIAL POSTED BY OTHER USERS IS AT YOUR OWN RISK.
              </p>
              
              <h3 className="text-lg font-semibold mb-2">Professional Advice Disclaimer</h3>
              <p className="text-gray-700 mb-4">
                Nothing on this Platform constitutes professional advice. Always consult qualified professionals for:
              </p>
              <ul className="list-disc ml-6 text-gray-700 mb-4">
                <li>Legal matters (consult a licensed attorney)</li>
                <li>Immigration and visa issues (consult official government sources)</li>
                <li>Medical or health concerns (consult healthcare professionals)</li>
                <li>Financial or tax matters (consult qualified advisors)</li>
                <li>Real estate transactions (consult licensed agents)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">6. Indemnification</h2>
              <p className="text-gray-700 mb-4">
                You agree to indemnify, defend, and hold harmless Frankfurt Indians, its operators, administrators, and affiliates from any claims, losses, damages, liabilities, and expenses (including legal fees) arising from:
              </p>
              <ul className="list-disc ml-6 text-gray-700 mb-4">
                <li>Your use of the Platform</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any third-party rights</li>
                <li>Any content you post or submit</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">7. Privacy and Data Protection (GDPR Compliance)</h2>
              <p className="text-gray-700 mb-4">
                We process personal data in accordance with GDPR. By using our Platform, you acknowledge that:
              </p>
              <ul className="list-disc ml-6 text-gray-700 mb-4">
                <li>We collect and process data as described in our Privacy Policy</li>
                <li>You have the right to access, rectify, and delete your personal data</li>
                <li>You have the right to data portability</li>
                <li>You can withdraw consent for data processing at any time</li>
                <li>You have the right to lodge a complaint with supervisory authorities</li>
              </ul>
              
              <h3 className="text-lg font-semibold mb-2">Data Controller</h3>
              <p className="text-gray-700 mb-4">
                Frankfurt Indians acts as the data controller for personal data collected through the Platform. For data protection inquiries, contact us at the email provided below.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">8. Community Guidelines and Events</h2>
              <p className="text-gray-700 mb-4">
                For events and meetups organized through the Platform:
              </p>
              <ul className="list-disc ml-6 text-gray-700 mb-4">
                <li>We are not responsible for events organized by users</li>
                <li>Attendees participate at their own risk</li>
                <li>Event organizers are responsible for compliance with local laws</li>
                <li>We do not verify the accuracy of event information</li>
                <li>We are not liable for any incidents occurring at events</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">9. Intellectual Property</h2>
              <p className="text-gray-700 mb-4">
                All Platform content, features, and functionality (excluding user-generated content) are owned by Frankfurt Indians and protected by international copyright, trademark, and other intellectual property laws.
              </p>
              <p className="text-gray-700 mb-4">
                You may not reproduce, distribute, modify, or create derivative works without our express written permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">10. Termination</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to:
              </p>
              <ul className="list-disc ml-6 text-gray-700 mb-4">
                <li>Terminate or suspend your account at any time, with or without notice</li>
                <li>Remove content that violates these Terms</li>
                <li>Take legal action against violators</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Upon termination, your right to use the Platform ceases immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">11. Modifications to Terms</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify these Terms at any time. We will notify users of significant changes via email or Platform notification. Continued use after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">12. Governing Law and Jurisdiction</h2>
              <p className="text-gray-700 mb-4">
                These Terms are governed by the laws of Germany and the European Union. Any disputes shall be subject to the exclusive jurisdiction of the courts in Frankfurt am Main, Germany.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">13. Severability</h2>
              <p className="text-gray-700 mb-4">
                If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">14. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                For questions about these Terms and Conditions, please contact us at:
              </p>
              <p className="text-gray-700">
                Email: frankfurtindians@gmail.com<br />
                Address: Frankfurt am Main, Germany
              </p>
            </section>

            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600">
                By creating an account, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsAndConditions;