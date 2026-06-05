import React from "react";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="space-y-2 border-b border-border pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Terms of Service
        </h1>
        <p className="text-xs text-muted-foreground">Last Updated: June 5, 2026</p>
      </div>

      <div className="prose prose-zinc dark:prose-invert max-w-none text-sm text-muted-foreground leading-relaxed space-y-6">
        <p>
          Welcome to <strong>ApexToolHub</strong>. These Terms of Service outline the rules and regulations for the use of our website and utility workbench.
        </p>
        <p>
          By accessing this website, we assume you accept these terms and conditions. Do not continue to use ApexToolHub if you do not agree to take all of the terms and conditions stated on this page.
        </p>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">1. License & Acceptable Use</h2>
          <p>
            Unless otherwise stated, ApexToolHub owns the intellectual property rights for all code and components on this platform. You may access our tools for your personal or professional software development workflow.
          </p>
          <p>You must not:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Republish entire portions of the ApexToolHub core source code on competing commercial platforms.</li>
            <li>Use our utilities to systematically generate malicious payloads, spam, or automated attack scripts.</li>
            <li>Incorporate our client-side tools in iframe-wrappers loaded with malicious overlays or clickjacking modules.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">2. "As-Is" Disclaimer</h2>
          <p>
            All tools and calculators available on ApexToolHub are provided on an <strong>"as-is" and "as-available"</strong> basis without any warranty, express or implied. 
            We do not warrant that the tools are free of mathematical or formatting edge-case errors, or that their operation will be continuous or uninterrupted.
          </p>
          <p>
            Because all logic is executed client-side on your device, you are solely responsible for verifying the accuracy of output data (such as converted CSVs or generated cryptographic hashes) before deploying them in production environments.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">3. Limitation of Liability</h2>
          <p>
            In no event shall ApexToolHub, its founder, or its affiliates be liable for any direct, indirect, incidental, special, or consequential damages (including, but not limited to, loss of profits, system downtime, data corruption, or business interruption) arising out of the use or inability to use the tools, even if advised of the possibility of such damage.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">4. Revisions & Errata</h2>
          <p>
            The tools appearing on ApexToolHub's website could include technical, typographical, or photographic errors. ApexToolHub does not promise that any of the materials on its website are accurate, complete, or current. ApexToolHub may make changes to the materials contained on its website at any time without notice.
          </p>
        </section>
      </div>
    </div>
  );
}
