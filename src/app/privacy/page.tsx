import React from "react";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="space-y-2 border-b border-border pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="text-xs text-muted-foreground">Last Updated: June 5, 2026</p>
      </div>

      <div className="prose prose-zinc dark:prose-invert max-w-none text-sm text-muted-foreground leading-relaxed space-y-6">
        <p>
          At <strong>DevToolHub</strong>, accessible from our website, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that are collected and recorded by DevToolHub and how we use it.
        </p>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">1. Zero Server-Side Processing</h2>
          <p>
            Unlike typical web-based tools, DevToolHub executes calculations, conversions, and transformations <strong>100% client-side</strong>. 
            All files uploaded (such as CSV spreadsheets, Word files, and images), text inputs, secret keys, or configurations processed by the tools are analyzed directly in your web browser utilizing client threads and Web Workers. 
            <strong>No data is sent to our servers, stored, cached, or saved.</strong> Your data remains entirely inside your sandboxed browser.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">2. Information We Collect</h2>
          <p>
            Since we process everything locally in your browser, we do not require user accounts, email registration, or subscription logins to access our utility workbench. 
            We do not collect personal information (such as name, phone number, or physical address) during your interactions with our utilities.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">3. Log Files & Analytics</h2>
          <p>
            DevToolHub follows a standard procedure of using log files. These files log visitors when they visit websites. 
            The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. 
            These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">4. Advertising Partners & Cookies (Google AdSense)</h2>
          <p>
            Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on DevToolHub, which are sent directly to users' browsers. 
            They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
          </p>
          <p>
            Specifically, <strong>Google AdSense</strong> is used on our website to display advertisements. Google uses cookies (such as the DART cookie) to serve ads to our users based on their visit to our site and other sites on the Internet. 
            Users may choose to opt out of the use of the DART cookie by visiting the Google Ad and Content Network Privacy Policy at the following URL:{" "}
            <a 
              href="https://policies.google.com/technologies/ads" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-foreground underline hover:text-foreground/80 transition-colors"
            >
              Google Ads Policy
            </a>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">5. Your Privacy Rights (GDPR & CCPA Compliance)</h2>
          <p>
            We support privacy protections including CCPA and GDPR. Because we do not store or process your documents or input data on any server, we have no personal data to delete, modify, or export. 
            Your absolute safety is guaranteed by the browser sandboxing security model itself.
          </p>
        </section>
      </div>
    </div>
  );
}
