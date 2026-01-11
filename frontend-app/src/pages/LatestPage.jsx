import React from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Tag } from "primereact/tag";

const features = [
  {
    title: "Transparent Development",
    description:
      "Track fixes, updates, and known issues in real time with a public development log.",
    icon: "pi pi-eye",
  },
  {
    title: "Fast Iterations",
    description:
      "We ship improvements frequently with clear versioning and change history.",
    icon: "pi pi-bolt",
  },
  {
    title: "User-Driven Fixes",
    description:
      "Reported issues are prioritized and publicly acknowledged.",
    icon: "pi pi-users",
  },
];

const LandingPage = () => {
  return (
    <div className="bg-surface-50 min-h-screen">
      {/* ================= HERO ================= */}
      <section className="flex flex-column align-items-center text-center px-5 py-8">
        <Tag value="LIVE UPDATES" severity="info" className="mb-3" />

        <h1 className="text-4xl font-bold mb-3">
          Product Development, Made Transparent
        </h1>

        <p className="text-600 text-lg mb-4 max-w-30rem">
          A single place to track releases, fixes, and known issues —
          keeping users and teams aligned.
        </p>

        <div className="flex gap-3">
          <Button label="View Dev Log" icon="pi pi-list" />
          <Button
            label="Get Started"
            icon="pi pi-arrow-right"
            outlined
          />
        </div>
      </section>

      <Divider />

      {/* ================= FEATURES ================= */}
      <section className="px-5 py-6">
        <div className="text-center mb-5">
          <h2 className="text-2xl mb-2">Why This Platform?</h2>
          <p className="text-600">
            Built to improve trust, communication, and product quality.
          </p>
        </div>

        <div className="grid">
          {features.map((feature, index) => (
            <div key={index} className="col-12 md:col-4">
              <Card className="h-full text-center shadow-1">
                <i
                  className={`${feature.icon} text-primary text-4xl mb-3`}
                />
                <h3 className="mb-2">{feature.title}</h3>
                <p className="text-600">{feature.description}</p>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* ================= ACTIVITY PREVIEW ================= */}
      <section className="px-5 py-6 bg-surface-100">
        <div className="text-center mb-4">
          <h2 className="text-2xl mb-2">Recent Activity</h2>
          <p className="text-600">
            Always know what’s changing and what’s being worked on.
          </p>
        </div>

        <div className="max-w-40rem mx-auto">
          <Card className="mb-3 shadow-1">
            <div className="flex justify-content-between align-items-center">
              <div>
                <span className="font-semibold">v1.0.1</span>
                <div className="text-600 text-sm">January 11, 2026</div>
              </div>
              <Tag value="FIX" severity="success" />
            </div>
            <p className="mt-3 text-600">
              Profile validation issue resolved.
            </p>
          </Card>

          <Card className="shadow-1">
            <div className="flex justify-content-between align-items-center">
              <div>
                <span className="font-semibold">Known Issue</span>
                <div className="text-600 text-sm">Under investigation</div>
              </div>
              <Tag value="BUG" severity="danger" />
            </div>
            <p className="mt-3 text-600">
              Session timeout on Safari browsers.
            </p>
          </Card>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="px-5 py-7 text-center">
        <h2 className="text-2xl mb-3">
          Stay Informed. Build Trust.
        </h2>
        <p className="text-600 mb-4">
          Transparency isn’t optional — it’s expected.
        </p>
        <Button
          label="Open Development Log"
          icon="pi pi-arrow-right"
          size="large"
        />
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="px-5 py-4 text-center text-600 text-sm">
        © 2026 Your Company. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
