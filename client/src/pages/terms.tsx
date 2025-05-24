import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-600 mb-6">
              Last updated: May 24, 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Acceptance of Terms</h2>
              <p className="text-slate-700 mb-4">
                By accessing and using the FiLotMicroservice API, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Service Description</h2>
              <p className="text-slate-700 mb-4">
                FiLotMicroservice provides a public REST API that interfaces with the Raydium SDK v2 for Solana blockchain operations. Our service includes:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Pool data retrieval and management</li>
                <li>Token information and metadata access</li>
                <li>Swap quote calculations</li>
                <li>Token account parsing utilities</li>
                <li>Real-time DeFi market data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Usage Guidelines</h2>
              <p className="text-slate-700 mb-4">
                When using our API, you agree to:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Use the service for legitimate business or development purposes only</li>
                <li>Respect rate limits and avoid excessive requests that could impact service availability</li>
                <li>Not attempt to reverse engineer, modify, or circumvent our security measures</li>
                <li>Comply with all applicable laws and regulations in your jurisdiction</li>
                <li>Not use the service for illegal activities, fraud, or malicious purposes</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Service Availability</h2>
              <p className="text-slate-700 mb-4">
                While we strive to maintain high uptime, we do not guarantee uninterrupted service availability. The API may be temporarily unavailable due to:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Scheduled maintenance and updates</li>
                <li>Network or infrastructure issues</li>
                <li>Third-party service dependencies (Solana network, Raydium protocol)</li>
                <li>Security incidents or abuse prevention measures</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Financial Disclaimers</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-800 font-semibold">Important Financial Warning</p>
                <p className="text-yellow-700 mt-2">
                  FiLotMicroservice provides technical tools for blockchain interaction but does not provide financial advice. 
                  All trading and investment decisions are made at your own risk.
                </p>
              </div>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Cryptocurrency trading involves substantial risk of loss</li>
                <li>Past performance does not guarantee future results</li>
                <li>Market data provided is for informational purposes only</li>
                <li>Users are responsible for their own investment decisions</li>
                <li>We are not liable for financial losses resulting from API usage</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Limitation of Liability</h2>
              <p className="text-slate-700 mb-4">
                To the maximum extent permitted by law, FiLotMicroservice shall not be liable for any direct, indirect, incidental, 
                special, or consequential damages resulting from the use of our API, including but not limited to:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Loss of profits or business opportunities</li>
                <li>Data loss or corruption</li>
                <li>Service interruptions or downtime</li>
                <li>Third-party actions or blockchain network issues</li>
                <li>Investment losses or trading decisions</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Intellectual Property</h2>
              <p className="text-slate-700 mb-4">
                The FiLotMicroservice API, documentation, and associated materials are proprietary to FiLot and protected by 
                intellectual property laws. You may not copy, modify, or distribute our proprietary content without permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibent text-slate-900 mb-4">Changes to Terms</h2>
              <p className="text-slate-700 mb-4">
                We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated 
                effective date. Continued use of the API after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Governing Law</h2>
              <p className="text-slate-700 mb-4">
                These terms are governed by the laws of the United Arab Emirates. Any disputes shall be resolved in the 
                courts of Dubai, UAE.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Contact Information</h2>
              <p className="text-slate-700 mb-4">
                For questions about these terms or our services, contact us:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Email: support@filot.io</li>
                <li>Telegram: @Fi_lotbot</li>
                <li>Address: Dubai International Financial Centre, Dubai, UAE</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}