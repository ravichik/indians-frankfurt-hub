import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          <p className="text-sm text-gray-600 mb-8">Last updated: {lastUpdated}</p>
          
          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                Frankfurt Indians ("we," "our," or "the Platform") respects your privacy and is committed to protecting your personal data. This Privacy Policy complies with the General Data Protection Regulation (GDPR) (EU) 2016/679 and explains how we collect, use, and protect your information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">2. Data Controller</h2>
              <p className="text-gray-700 mb-4">
                Frankfurt Indians is the data controller responsible for your personal data. You can contact us at:
              </p>
              <p className="text-gray-700 mb-4">
                Email: frankfurtindians@gmail.com<br />
                Address: Frankfurt am Main, Germany
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">3. Legal Basis for Processing</h2>
              <p className="text-gray-700 mb-4">
                We process your personal data under the following legal bases:
              </p>
              <ul className="list-disc ml-6 text-gray-700 mb-4">
                <li><strong>Consent:</strong> When you explicitly agree to processing (Article 6(1)(a) GDPR)</li>
                <li><strong>Contract:</strong> To provide our services to you (Article 6(1)(b) GDPR)</li>
                <li><strong>Legal Obligation:</strong> To comply with legal requirements (Article 6(1)(c) GDPR)</li>
                <li><strong>Legitimate Interests:</strong> For our business operations, provided your rights don't override these interests (Article 6(1)(f) GDPR)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">4. Information We Collect</h2>
              
              <h3 className="text-lg font-semibold mb-2">Information You Provide:</h3>
              <ul className="list-disc ml-6 text-gray-700 mb-4">
                <li>Account information (name, email, username, password)</li>
                <li>Profile information (bio, location, interests)</li>
                <li>Content you post (forum posts, comments, events)</li>
                <li>Communications with us or other users</li>
              </ul>
              
              <h3 className="text-lg font-semibold mb-2">Information Collected Automatically:</h3>
              <ul className="list-disc ml-6 text-gray-700 mb-4">
                <li>IP address and device information</li>
                <li>Browser type and operating system</li>
                <li>Usage data (pages viewed, time spent, clicks)</li>
                <li>Cookies and similar technologies</li>
              </ul>
              
              <h3 className="text-lg font-semibold mb-2">Third-Party Information:</h3>
              <ul className="list-disc ml-6 text-gray-700 mb-4">
                <li>Google OAuth data (if you use Google login)</li>
                <li>Payment information (processed by secure third-party providers)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">5. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">
                We use your information to:
              </p>
              <ul className="list-disc ml-6 text-gray-700 mb-4">
                <li>Provide and maintain our services</li>
                <li>Create and manage your account</li>
                <li>Enable community features (forums, events, messaging)</li>
                <li>Send important updates and notifications</li>
                <li>Respond to your inquiries and support requests</li>
                <li>Improve and personalize our services</li>
                <li>Ensure safety and prevent fraud</li>
                <li>Comply with legal obligations</li>
                <li>With your consent, send marketing communications</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">6. Data Sharing and Disclosure</h2>
              <p className="text-gray-700 mb-4">
                We do not sell your personal data. We may share your information with:
              </p>
              <ul className="list-disc ml-6 text-gray-700 mb-4">
                <li><strong>Other Users:</strong> Profile information and content you post publicly</li>
                <li><strong>Service Providers:</strong> Third parties who help us operate the Platform (hosting, analytics)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect rights and safety</li>
                <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
                <li><strong>With Your Consent:</strong> When you explicitly agree to sharing</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">7. International Data Transfers</h2>
              <p className="text-gray-700 mb-4">
                Your data may be transferred to and processed in countries outside the European Economic Area (EEA). We ensure appropriate safeguards are in place, including:
              </p>
              <ul className="list-disc ml-6 text-gray-700 mb-4">
                <li>Standard Contractual Clauses approved by the European Commission</li>
                <li>Adequacy decisions by the European Commission</li>
                <li>Your explicit consent for specific transfers</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">8. Data Retention</h2>
              <p className="text-gray-700 mb-4">
                We retain your personal data only as long as necessary for the purposes outlined in this policy:
              </p>
              <ul className="list-disc ml-6 text-gray-700 mb-4">
                <li>Account data: Until account deletion plus legal retention period</li>
                <li>Content: Until you delete it or account termination</li>
                <li>Communication logs: Up to 2 years</li>
                <li>Analytics data: Up to 26 months</li>
                <li>Legal compliance data: As required by law</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">9. Your Rights Under GDPR</h2>
              <p className="text-gray-700 mb-4">
                You have the following rights regarding your personal data:
              </p>
              <ul className="list-disc ml-6 text-gray-700 mb-4">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Rectification:</strong> Request correction of inaccurate data</li>
                <li><strong>Erasure:</strong> Request deletion of your data ("right to be forgotten")</li>
                <li><strong>Restriction:</strong> Request limited processing of your data</li>
                <li><strong>Portability:</strong> Receive your data in a portable format</li>
                <li><strong>Objection:</strong> Object to certain processing activities</li>
                <li><strong>Withdraw Consent:</strong> Withdraw previously given consent</li>
                <li><strong>Complaint:</strong> Lodge a complaint with supervisory authorities</li>
              </ul>
              <p className="text-gray-700 mb-4">
                To exercise these rights, contact us at frankfurtindians@gmail.com. We will respond within 30 days.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">10. Data Security</h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organizational measures to protect your data:
              </p>
              <ul className="list-disc ml-6 text-gray-700 mb-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication measures</li>
                <li>Employee training on data protection</li>
                <li>Incident response procedures</li>
              </ul>
              <p className="text-gray-700 mb-4">
                However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">11. Cookies and Tracking</h2>
              <p className="text-gray-700 mb-4">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc ml-6 text-gray-700 mb-4">
                <li>Keep you logged in</li>
                <li>Remember your preferences</li>
                <li>Analyze usage patterns</li>
                <li>Improve our services</li>
              </ul>
              <p className="text-gray-700 mb-4">
                You can control cookies through your browser settings. Essential cookies cannot be disabled as they are necessary for the Platform to function.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">12. Children's Privacy</h2>
              <p className="text-gray-700 mb-4">
                Our Platform is not intended for children under 16. We do not knowingly collect data from children under 16. If you believe we have collected data from a child, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">13. Third-Party Links</h2>
              <p className="text-gray-700 mb-4">
                Our Platform may contain links to third-party websites. We are not responsible for their privacy practices. We encourage you to read their privacy policies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">14. Changes to This Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of significant changes via email or Platform notification. The "Last updated" date indicates the latest revision.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">15. Data Protection Officer</h2>
              <p className="text-gray-700 mb-4">
                For data protection inquiries, you can contact our Data Protection Officer at:
              </p>
              <p className="text-gray-700 mb-4">
                Email: frankfurtindians@gmail.com
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">16. Supervisory Authority</h2>
              <p className="text-gray-700 mb-4">
                You have the right to lodge a complaint with the relevant supervisory authority:
              </p>
              <p className="text-gray-700 mb-4">
                Hessischer Datenschutzbeauftragter<br />
                Gustav-Stresemann-Ring 1<br />
                65189 Wiesbaden, Germany<br />
                Website: https://datenschutz.hessen.de
              </p>
            </section>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                By using Frankfurt Indians, you acknowledge that you have read and understood this Privacy Policy.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;