// pages/privacy.tsx
import Head from "next/head";

export default function PrivacyPolicy() {
  return (
    <>
      <section className="min-h-[calc(100dvh-4rem)] md:min-h[calc(100dvh-5rem)] z-10 flex flex-col items-center justify-center bg-blue-50/30 ">
        <main className="mt-8 max-w-[390px] lg:max-w-6xl  w-full mx-auto container">
          <Head>
            <title>Privacy Policy | Sanv AI</title>
            <meta name="description" content="Privacy Policy for Sanv AI" />
          </Head>
          <main className="px-4 py-8 md:px-8">
            <div className="prose prose-blue max-w-prose mx-auto prose-pre:m-0 prose-pre:bg-transparent prose-pre:p-0">
              <h1>Sanv AI Privacy Policy</h1>
              <p>
                <strong>Last Updated:</strong> 2025-05-12
              </p>

              <h2>1. Introduction</h2>
              <p>
                Welcome to <strong>Sanv AI</strong>, a service provided by Sanv
                Labs. This Privacy Policy outlines how we collect, use,
                disclose, and protect your personal information when you access
                or use Sanv AI. By using Sanv AI, you agree to the terms of this
                Privacy Policy.
              </p>
              <p>
                If you do not agree with any part of this Privacy Policy, please
                do not use Sanv AI.
              </p>

              <h2>2. Information We Collect</h2>
              <h3>2.1. Information You Provide</h3>
              <ul>
                <li>
                  <strong>Account Information:</strong> If you create an
                  account, we may collect your name, email address, and other
                  identifying details.
                </li>
                <li>
                  <strong>User Content:</strong> We collect inputs,
                  conversations, and feedback (“<strong>User Content</strong>”)
                  you submit while using Sanv AI.
                </li>
              </ul>

              <h3>2.2. Information Collected Automatically</h3>
              <ul>
                <li>
                  <strong>Usage Data:</strong> Information on how you use Sanv
                  AI (features accessed, session times, etc.).
                </li>
                <li>
                  <strong>Device Information:</strong> Your IP address, browser
                  type, device ID, and OS may be collected for analytics and
                  security.
                </li>
                <li>
                  <strong>Cookies & Similar Technologies:</strong> We may use
                  cookies and other tools to improve your experience and
                  personalize responses.
                </li>
              </ul>

              <h3>2.3. Information from Third Parties</h3>
              <p>
                We may receive data from third parties such as analytics
                providers or service integrations and combine it with data
                collected directly from you.
              </p>

              <h2>3. How We Use Your Information</h2>
              <ol>
                <li>
                  <strong>Providing and Improving Sanv AI:</strong>
                  <ul>
                    <li>
                      To process interactions, enhance speech and behavioral
                      insights, and build new features.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Personalization:</strong>
                  <ul>
                    <li>
                      To tailor insights and recommendations based on your input
                      and patterns.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Analytics and Security:</strong>
                  <ul>
                    <li>
                      To monitor performance, resolve technical issues, and
                      protect our systems.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Communication:</strong>
                  <ul>
                    <li>
                      To respond to inquiries and provide customer support or
                      updates.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Compliance:</strong>
                  <ul>
                    <li>
                      To meet legal obligations and enforce our Terms of
                      Service.
                    </li>
                  </ul>
                </li>
              </ol>

              <h2>4. Sharing Your Information</h2>
              <ol>
                <li>
                  <strong>Service Providers:</strong> We may share your data
                  with third parties who help us operate Sanv AI (e.g. hosting,
                  analytics).
                </li>
                <li>
                  <strong>Business Transfers:</strong> If Sanv AI undergoes a
                  merger or sale, your data may be part of that transaction.
                </li>
                <li>
                  <strong>Legal Requirements:</strong> We may disclose your
                  information when legally required or to protect rights and
                  safety.
                </li>
                <li>
                  <strong>With Your Consent:</strong> We may share information
                  as directed or authorized by you.
                </li>
              </ol>

              <h2>5. Data Retention</h2>
              <p>
                We retain data as long as necessary for the purposes outlined in
                this policy or as required by law. When no longer needed, we
                delete or anonymize it.
              </p>

              <h2>6. Security</h2>
              <p>
                We implement industry-standard security measures. However, no
                system is completely secure, and we cannot guarantee the
                absolute safety of your data.
              </p>

              <h2>7. International Transfers</h2>
              <p>
                Your information may be processed in countries outside your own,
                including where data protection laws differ. We ensure
                appropriate safeguards are in place.
              </p>

              <h2>8. Children’s Privacy</h2>
              <p>
                Sanv AI is not intended for users under 18. We do not knowingly
                collect data from minors. If we become aware of such collection,
                we will delete it promptly.
              </p>

              <h2>9. Your Rights</h2>
              <p>
                You may have certain rights under applicable laws, including:
              </p>
              <ol>
                <li>
                  <strong>Access:</strong> Request a copy of your personal data.
                </li>
                <li>
                  <strong>Correction:</strong> Request changes to inaccurate or
                  incomplete data.
                </li>
                <li>
                  <strong>Deletion:</strong> Ask us to delete your personal
                  information.
                </li>
                <li>
                  <strong>Restriction:</strong> Request limited use of your
                  information.
                </li>
                <li>
                  <strong>Objection:</strong> Object to processing for certain
                  purposes.
                </li>
                <li>
                  <strong>Portability:</strong> Receive your data in a portable
                  format.
                </li>
              </ol>
              <p>
                To make a request, contact us at{" "}
                <a href="mailto:support@sanv.ai">support@sanv.ai</a>. We will
                respond as required by law.
              </p>

              <h2>10. Third-Party Services</h2>
              <p>
                Sanv AI may link to third-party services. We are not responsible
                for their practices. Review their privacy policies before
                sharing data.
              </p>

              <h2>11. Changes to This Privacy Policy</h2>
              <p>
                We may update this policy to reflect changes in our practices or
                legal requirements. Updates will be posted with a new “Last
                Updated” date. Continued use of Sanv AI indicates your agreement
                to the revised policy.
              </p>
            </div>
          </main>
        </main>
      </section>
    </>
  );
}
