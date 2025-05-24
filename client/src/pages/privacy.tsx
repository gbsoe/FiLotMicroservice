import { ArrowRightLeft } from "lucide-react";
import { Link } from "wouter";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/">
              <div className="flex items-center space-x-4 cursor-pointer">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <ArrowRightLeft className="text-white w-4 h-4" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-slate-900">FiLotMicroservice</h1>
                  <p className="text-xs text-slate-500">Precision Investing</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-600 mb-6">
              Last updated: May 24, 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Information We Collect</h2>
              <p className="text-slate-700 mb-4">
                FiLotMicroservice is designed as a public API service that does not require user registration or authentication. We collect minimal information necessary to provide our services:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>API request logs including timestamps, endpoints accessed, and response times for service monitoring</li>
                <li>Network information such as IP addresses for security and rate limiting purposes</li>
                <li>Technical data including user agent strings and request headers for API compatibility</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">How We Use Information</h2>
              <p className="text-slate-700 mb-4">
                The information we collect is used exclusively for:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Maintaining and improving API service quality and performance</li>
                <li>Monitoring system health and identifying technical issues</li>
                <li>Preventing abuse and ensuring fair usage of our public API</li>
                <li>Generating anonymous usage statistics for service optimization</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Data Sharing</h2>
              <p className="text-slate-700 mb-4">
                We do not sell, trade, or otherwise transfer your information to third parties. We may share aggregated, anonymized data for research or business purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Data Security</h2>
              <p className="text-slate-700 mb-4">
                We implement industry-standard security measures to protect data in transit and at rest. Our API uses HTTPS encryption and secure hosting infrastructure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Data Retention</h2>
              <p className="text-slate-700 mb-4">
                API logs are retained for 30 days for operational purposes and then automatically deleted. No personally identifiable information is stored beyond this period.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Contact Information</h2>
              <p className="text-slate-700 mb-4">
                For privacy-related questions or concerns, please contact us:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Email: support@filot.io</li>
                <li>Telegram: @Fi_lotbot</li>
                <li>Address: Dubai International Financial Centre, Dubai, UAE</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Changes to Privacy Policy</h2>
              <p className="text-slate-700 mb-4">
                We may update this privacy policy periodically. Changes will be posted on this page with an updated revision date.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}