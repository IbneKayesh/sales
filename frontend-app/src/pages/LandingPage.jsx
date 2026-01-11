import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import "./LandingPage.css";

const LandingPage = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "Is there a free trial?",
      answer:
        "Yes, we offer a 14-day free trial on all paid plans. You can also start with our Free forever plan for basic needs.",
    },
    {
      question: "Can I migrate my existing data?",
      answer:
        "Absolutely. We provide easy-to-use import tools for CSV and Excel files for contacts, inventory, and accounts.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Security is our top priority. We use bank-grade encryption and regular backups to ensure your business data is always safe.",
    },
    {
      question: "Can I upgrade later?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. Changes take effect continuously.",
    },
  ];

  return (
    <div className="landing-page">
      {/* Background Animations */}
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>
      <ul className="bouncing-elements" style={{ zIndex: 0 }}>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>

      {/* Navigation */}
      <nav className="landing-nav">
        <div className="brand">Lbusiness Pro</div>
        <div className="nav-links">
          <a href="#features" className="nav-link">
            Features
          </a>
          <a href="#how-it-works" className="nav-link">
            How it Works
          </a>
          <a href="#pricing" className="nav-link">
            Pricing
          </a>
          <a href="#faq" className="nav-link">
            FAQ
          </a>
        </div>
        <Link to="/login" className="cta-button">
          Login
        </Link>
      </nav>

      {/* 1. Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Manage Your Business <br />
            <span className="highlight">Like a Pro</span>
          </h1>
          <p>
            The ultimate all-in-one platform for Purchase, Sales, Inventory, and
            Accounting. Streamline your operations and boost productivity with
            our intuitive suite.
          </p>
          <div className="hero-buttons">
            <Link to="/login?view=register" className="cta-button">
              Start Like Pro{" "}
              <i
                className="pi pi-arrow-right"
                style={{ marginLeft: "0.5rem" }}
              ></i>
            </Link>
            <a href="#features" className="secondary-button">
              Take a Tour
            </a>
          </div>
          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            <div className="company-logo">
              <i
                className="pi pi-check-circle"
                style={{ color: "var(--accent-cyan)" }}
              ></i>{" "}
              No demo required
            </div>
            <div className="company-logo">
              <i
                className="pi pi-check-circle"
                style={{ color: "var(--accent-cyan)" }}
              ></i>{" "}
              4.7/5 Average Rating
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-circle"></div>
          {/* Dashboard Visual Placeholder */}
          <div
            style={{
              zIndex: 2,
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(10px)",
              padding: "2rem",
              borderRadius: "1rem",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
              maxWidth: "450px",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                paddingBottom: "1rem",
              }}
            >
              <div
                style={{ display: "flex", gap: "1rem", alignItems: "center" }}
              >
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    background: "#ff5f56",
                    borderRadius: "50%",
                  }}
                ></div>
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    background: "#ffbd2e",
                    borderRadius: "50%",
                  }}
                ></div>
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    background: "#27c93f",
                    borderRadius: "50%",
                  }}
                ></div>
              </div>
              <div
                style={{
                  width: "100px",
                  height: "8px",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "4px",
                }}
              ></div>
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <div
                style={{
                  width: "60px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: "40px",
                      height: "40px",
                      background: "rgba(255,255,255,0.05)",
                      borderRadius: "8px",
                    }}
                  ></div>
                ))}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      height: "80px",
                      width: "30%",
                      background:
                        "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.05))",
                      borderRadius: "8px",
                      border: "1px solid rgba(139, 92, 246, 0.2)",
                    }}
                  ></div>
                  <div
                    style={{
                      height: "80px",
                      width: "30%",
                      background: "rgba(255,255,255,0.05)",
                      borderRadius: "8px",
                    }}
                  ></div>
                  <div
                    style={{
                      height: "80px",
                      width: "30%",
                      background: "rgba(255,255,255,0.05)",
                      borderRadius: "8px",
                    }}
                  ></div>
                </div>
                <div
                  style={{
                    height: "120px",
                    width: "100%",
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: "8px",
                    marginBottom: "1rem",
                  }}
                ></div>
                <div
                  style={{
                    height: "40px",
                    width: "100%",
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: "8px",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Social Proof (Trusted By) - Moved up for credibility */}
      <section className="social-proof">
        <p style={{ marginBottom: "2rem", color: "var(--text-muted)" }}>
          TRUSTED BY FORWARD-THINKING TEAMS
        </p>
        <div className="logos-grid">
          {[
            "Acme Corp",
            "Global Tech",
            "Nebula Inc",
            "Future Systems",
            "BlueWave",
          ].map((ws, i) => (
            <div key={i} className="company-logo">
              <i className="pi pi-building" style={{ opacity: 0.5 }}></i> {ws}
            </div>
          ))}
        </div>
      </section>

      {/* 2 & 3. Value Proposition & Features */}
      <section id="features" className="features">
        <div className="section-header">
          <h2>Everything You Need in One Place</h2>
          <p>
            Stop juggling multiple apps. Get a unified view of your entire
            business operation.
          </p>
        </div>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="icon-wrapper">
              <i className="pi pi-users" style={{ color: "white" }}></i>
            </div>
            <h3>CRM & Contacts</h3>
            <p>
              Keep track of all your customer interactions and manage leads
              effectively. Never miss a follow-up with our advanced tracking
              system.
            </p>
          </div>
          <div className="feature-card">
            <div className="icon-wrapper">
              <i className="pi pi-briefcase" style={{ color: "white" }}></i>
            </div>
            <h3>Sales Management</h3>
            <p>
              Monitor your sales pipeline, generate reports, and forecast
              revenue with powerful analytics and visualization tools.
            </p>
          </div>
          <div className="feature-card">
            <div className="icon-wrapper">
              <i className="pi pi-box" style={{ color: "white" }}></i>
            </div>
            <h3>Inventory Control</h3>
            <p>
              Real-time inventory tracking, automated reordering, and
              multi-warehouse management to keep your stock optimized.
            </p>
          </div>
          <div className="feature-card">
            <div className="icon-wrapper">
              <i className="pi pi-wallet" style={{ color: "white" }}></i>
            </div>
            <h3>Accounting & Ledger</h3>
            <p>
              Seamlessly integrate your accounts, track expenses, and manage
              heads and ledgers with precision and ease.
            </p>
          </div>
        </div>
      </section>

      {/* 4. How It Works */}
      <section id="how-it-works" className="how-it-works">
        <div className="section-header">
          <h2>Get Started in Minutes</h2>
          <p>
            We designed our platform to be intuitive. No complex setup or
            training required.
          </p>
        </div>
        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Create Account</h3>
            <p>
              Sign up for free and set up your company profile in under 2
              minutes.
            </p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Initialize Data</h3>
            <p>Initilize your business data with a quick startup settings.</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Grow Business</h3>
            <p>
              Start managing business operations, tracking expenses, and viewing
              insights immediately.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Use Cases / Testimonials */}
      <section className="social-proof" style={{ marginTop: "0" }}>
        <div className="section-header">
          <h2>Loved by Businesses</h2>
          <p>See what our users have to say about their experience.</p>
        </div>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="rating">★★★★★</div>
            <p className="quote">
              "This platform completely transformed how we manage our inventory.
              We used to use spreadsheets, but this is a game changer."
            </p>
            <div className="author">
              <div
                className="author-avatar"
                style={{
                  background: "linear-gradient(45deg, #ff9a9e, #fad0c4)",
                }}
              ></div>
              <div>
                <div style={{ fontWeight: "bold" }}>Sarah Jenkins</div>
                <div style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
                  Retail Owner
                </div>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="rating">★★★★★</div>
            <p className="quote">
              "The accounting features are robust yet simple enough for
              non-accountants to understand. Highly recommended!"
            </p>
            <div className="author">
              <div
                className="author-avatar"
                style={{
                  background: "linear-gradient(45deg, #a18cd1, #fbc2eb)",
                }}
              ></div>
              <div>
                <div style={{ fontWeight: "bold" }}>Mike Ross</div>
                <div style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
                  Tech Consultant
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Pricing */}
      <section id="pricing" className="pricing">
        <div className="section-header">
          <h2>Simple, Transparent Pricing</h2>
          <p>Choose the plan that fits your business size.</p>
        </div>
        <div className="pricing-grid">
          <div className="pricing-card">
            <h3>Standard</h3>
            <div className="price">
              ৳1<span>/500 SGD</span>
            </div>
            <ul className="plan-features">
              <li>
                <i
                  className="pi pi-check"
                  style={{ color: "var(--accent-cyan)" }}
                ></i>{" "}
                5 Business
              </li>
              <li>
                <i
                  className="pi pi-check"
                  style={{ color: "var(--accent-cyan)" }}
                ></i>{" "}
                100 User
              </li>
              <li>
                <i
                  className="pi pi-check"
                  style={{ color: "var(--accent-cyan)" }}
                ></i>{" "}
                Full Features
              </li>
              <li>
                <i
                  className="pi pi-check"
                  style={{ color: "var(--accent-cyan)" }}
                ></i>{" "}
                5000 Inventory Items
              </li>
            </ul>
            <Link
              to="/login?view=register"
              className="secondary-button"
              style={{ textAlign: "center" }}
            >
              Get Started
            </Link>
          </div>
          <div className="pricing-card popular">
            <div className="popular-badge">MOST POPULAR</div>
            <h3>Pro</h3>
            <div className="price">
              ৳1<span>/250 SGD</span>
            </div>
            <ul className="plan-features">
            <li>
                <i
                  className="pi pi-check"
                  style={{ color: "var(--accent-purple)" }}
                ></i>{" "}
                10 Business
              </li>
              <li>
                <i
                  className="pi pi-check"
                  style={{ color: "var(--accent-purple)" }}
                ></i>{" "}
                500 Users
              </li>
              <li>
                <i
                  className="pi pi-check"
                  style={{ color: "var(--accent-purple)" }}
                ></i>{" "}
                Advanced Analytics
              </li>
              <li>
                <i
                  className="pi pi-check"
                  style={{ color: "var(--accent-purple)" }}
                ></i>{" "}
                Unlimited Inventory Items
              </li>
              <li>
                <i
                  className="pi pi-check"
                  style={{ color: "var(--accent-purple)" }}
                ></i>{" "}
                Limited Support
              </li>
            </ul>
            <Link to="/login?view=register" className="cta-button">
              Start Like Pro
            </Link>
          </div>
          <div className="pricing-card">
            <h3>Enterprise</h3>
            <div className="price">Custom</div>
            <ul className="plan-features">
              <li>
                <i
                  className="pi pi-check"
                  style={{ color: "var(--accent-cyan)" }}
                ></i>{" "}
                Unlimited Users
              </li>
              <li>
                <i
                  className="pi pi-check"
                  style={{ color: "var(--accent-cyan)" }}
                ></i>{" "}
                Dedicated Support
              </li>
              <li>
                <i
                  className="pi pi-check"
                  style={{ color: "var(--accent-cyan)" }}
                ></i>{" "}
                Custom Integrations
              </li>
            </ul>
            <Link
              to="/login?view=register"
              className="secondary-button"
              style={{ textAlign: "center" }}
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* 9. FAQs */}
      <section id="faq" className="faq">
        <div className="section-header">
          <h2>Frequently Asked Questions</h2>
        </div>
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <div className="faq-question" onClick={() => toggleFaq(index)}>
              {faq.question}
              <i
                className={`pi ${activeFaq === index ? "pi-minus" : "pi-plus"}`}
              ></i>
            </div>
            {activeFaq === index && (
              <div className="faq-answer">{faq.answer}</div>
            )}
          </div>
        ))}
      </section>

      {/* 8. Call to Action (Repeated) */}
      <section className="cta-section">
        <h2>Ready to transform your business?</h2>
        <p>Join thousands of companies using SalesForce Pro today.</p>
        <Link
          to="/login?view=register"
          className="cta-button"
          style={{ fontSize: "1.2rem", padding: "1rem 3rem" }}
        >
          Start Like Pro
        </Link>
      </section>

      {/* 11. Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-col">
            <div
              className="brand"
              style={{
                fontSize: "1.5rem",
                marginBottom: "1rem",
                display: "block",
              }}
            >
              Lbusiness Pro
            </div>
            <p style={{ color: "var(--text-muted)" }}>
              Make your business automated, and easy with the best all-in-one
              platform.
            </p>
            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
              <i
                className="pi pi-twitter"
                style={{ fontSize: "1.2rem", cursor: "pointer" }}
              ></i>
              <i
                className="pi pi-linkedin"
                style={{ fontSize: "1.2rem", cursor: "pointer" }}
              ></i>
              <i
                className="pi pi-github"
                style={{ fontSize: "1.2rem", cursor: "pointer" }}
              ></i>
            </div>
          </div>
          <div className="footer-col">
            <h4>Product</h4>
            <ul>
              <li>
                <a href="#features">Features</a>
              </li>
              <li>
                <a href="#pricing">Pricing</a>
              </li>
              <li>
                <a href="#how-it-works">How it works</a>
              </li>
              <li>
                <a href="/login">Login</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li>
                <a href="#">About Us</a>
              </li>
              <li>
                <a href="#">Careers</a>
              </li>
              <li>
                <a href="#">Blog</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <ul>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Terms of Service</a>
              </li>
              <li>
                <a href="#">Security</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} SalesForce Pro. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
