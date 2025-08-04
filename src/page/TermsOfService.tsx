import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
      <h1>Terms of Service</h1>
      <p>Last updated: {new Date().toLocaleDateString('en-US')}</p>
      
      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing and using We Diet ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.
      </p>

      <h2>2. Description of Service</h2>
      <p>
        We Diet is a social wellness platform that allows users to:
      </p>
      <ul>
        <li>Track daily meals, exercise, and weight management</li>
        <li>Record and share fitness journey progress</li>
        <li>Connect with a supportive community</li>
        <li>Access health and wellness resources</li>
      </ul>

      <h2>3. User Accounts</h2>
      <p>
        To use certain features of the Service, you must register for an account. You agree to:
      </p>
      <ul>
        <li>Provide accurate and complete information</li>
        <li>Maintain the security of your account credentials</li>
        <li>Be responsible for all activities under your account</li>
        <li>Notify us of any unauthorized use</li>
      </ul>

      <h2>4. User Content and Conduct</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Post harmful, offensive, or inappropriate content</li>
        <li>Violate any applicable laws or regulations</li>
        <li>Infringe on intellectual property rights</li>
        <li>Spam or harass other users</li>
        <li>Share false or misleading health information</li>
      </ul>

      <h2>5. Privacy</h2>
      <p>
        Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
      </p>

      <h2>6. Third-Party Services</h2>
      <p>
        Our Service integrates with third-party platforms including:
      </p>
      <ul>
        <li>Facebook Login</li>
        <li>Google OAuth</li>
        <li>TikTok Login</li>
      </ul>
      <p>
        Your use of these services is subject to their respective terms and privacy policies.
      </p>

      <h2>7. Disclaimers</h2>
      <p>
        The Service is provided "as is" without warranties of any kind. We do not provide medical advice and recommend consulting healthcare professionals for medical concerns.
      </p>

      <h2>8. Limitation of Liability</h2>
      <p>
        We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service.
      </p>

      <h2>9. Modifications</h2>
      <p>
        We reserve the right to modify these terms at any time. Changes will be effective upon posting to this page.
      </p>

      <h2>10. Termination</h2>
      <p>
        We may terminate or suspend your account at any time for violations of these terms.
      </p>

      <h2>11. Contact Information</h2>
      <p>
        If you have any questions about these Terms of Service, please contact us at:<br/>
        Email: terms@we-diat.com
      </p>

      <h2>12. Governing Law</h2>
      <p>
        These terms are governed by the laws of Japan.
      </p>
    </div>
  );
};

export default TermsOfService;
