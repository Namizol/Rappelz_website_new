import React from 'react';
import { Shield, Lock, Eye, Database, Cookie, Bell, Trash2 } from 'lucide-react';

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-black/50 rounded-2xl p-8 backdrop-blur-sm border border-yellow-500/10">
          <h1 className="text-4xl font-bold text-yellow-500 mb-8">Privacy Policy</h1>
          
          <div className="space-y-8">
            <Section
              icon={<Shield />}
              title="Introduction"
              content="At Rappelz, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and game services. Please read this privacy policy carefully. By continuing to use our services, you agree to the terms of this privacy policy."
            />

            <Section
              icon={<Database />}
              title="Information We Collect"
              content={
                <ul className="list-disc pl-5 space-y-2">
                  <li>Account information (email address, username)</li>
                  <li>Game data (character information, gameplay statistics)</li>
                  <li>Device information (IP address, browser type)</li>
                  <li>Payment information (processed securely by our payment providers)</li>
                </ul>
              }
            />

            <Section
              icon={<Lock />}
              title="How We Use Your Information"
              content={
                <ul className="list-disc pl-5 space-y-2">
                  <li>To provide and maintain our game services</li>
                  <li>To notify you about changes to our services</li>
                  <li>To provide customer support</li>
                  <li>To detect, prevent, and address technical issues</li>
                  <li>To improve our services and develop new features</li>
                </ul>
              }
            />

            <Section
              icon={<Cookie />}
              title="Cookies and Tracking"
              content="We use cookies and similar tracking technologies to track activity on our website and store certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent."
            />

            <Section
              icon={<Eye />}
              title="Information Sharing"
              content="We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates, and advertisers."
            />

            <Section
              icon={<Bell />}
              title="Communications"
              content="We may use your personal information to contact you with newsletters, marketing or promotional materials, and other information that may be of interest to you. You may opt out of receiving any, or all, of these communications from us by following the unsubscribe link or instructions provided in any email we send."
            />

            <Section
              icon={<Trash2 />}
              title="Data Retention and Deletion"
              content="We will retain your personal information only for as long as is necessary for the purposes set out in this privacy policy. You can request deletion of your account and associated data by contacting our support team."
            />
          </div>

          <div className="mt-12 pt-8 border-t border-yellow-500/10">
            <p className="text-gray-400 text-sm">
              Last updated: March 15, 2024
            </p>
            <p className="text-gray-400 text-sm mt-4">
              If you have any questions about this Privacy Policy, please contact us at privacy@rappelz.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ icon, title, content }: { icon: React.ReactNode, title: string, content: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="text-yellow-500 w-6 h-6">
          {icon}
        </div>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <div className="text-gray-300 leading-relaxed pl-9">
        {content}
      </div>
    </div>
  );
}