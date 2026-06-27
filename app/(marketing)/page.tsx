"use client";

import { useState } from "react";
import { 
  FiRefreshCw, 
  FiGitBranch, 
  FiZap, 
  FiBell, 
  FiSend, 
  FiLock, 
  FiBarChart2, 
  FiCheckCircle,
  FiCheck,
  FiPhone,
  FiMail,
  FiMapPin,
  FiChevronDown,
  FiArrowRight,
  FiCloud
} from "react-icons/fi";
import Swal from 'sweetalert2';

export default function Home() {
  const [activeTab, setActiveTab] = useState("send");
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please fill in all the fields.',
        confirmButtonColor: '#4338ca'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Message Sent!',
          text: 'We have received your message and will get back to you shortly.',
          confirmButtonColor: '#4338ca'
        });
        setName("");
        setEmail("");
        setMessage("");
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message || 'Something went wrong!',
        confirmButtonColor: '#4338ca'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    "What is the difference between Masking and Non-Masking SMS?",
    "Which mobile operators do you support in Bangladesh?",
    "How fast are OTP and verification messages delivered?",
    "Is your service BTRC compliant?",
    "How do I integrate the SMS API into my system?",
    "What happens if a message fails to deliver?",
    "Do you offer a free trial before purchasing?"
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="hero container">
        <div className="hero-badge">
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></span>
          Systems Fully Operational
        </div>
        <h1 className="hero-title">
          Bangladesh's Fastest Bulk<br />
          <span>Foxses Cloude</span>
        </h1>
        <p className="hero-subtitle">
          Enterprise-grade SMS infrastructure for Bangladesh. Send Masking & Non-Masking messages across all operators with automatic failover for guaranteed delivery.
        </p>
        <div className="hero-actions">
          <a href="#" className="btn btn-primary">
            Start Sending <FiArrowRight />
          </a>
          <a href="#" className="btn btn-secondary">
            View Documentation
          </a>
        </div>
      </section>

      {/* Smart Engine Features */}
      <section id="features" className="section container">
        <div className="section-header">
          <span className="section-badge">Infrastructure</span>
          <h2 className="section-title">Smart Engine</h2>
          <p className="section-subtitle">
            Intelligent SMS Routing. Automated failovers, masking fallback, and multi-gateway rerouting to ensure your messages are delivered instantly.
          </p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><FiRefreshCw /></div>
            <h3 className="feature-title">Masking Auto-Fallback</h3>
            <p className="feature-desc">If a masked SMS fails due to carrier issues, our engine automatically falls back to a non-masked route to guarantee delivery.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FiGitBranch /></div>
            <h3 className="feature-title">Multi-Gateway</h3>
            <p className="feature-desc">Intelligently tries multiple operator gateways sequentially.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FiZap /></div>
            <h3 className="feature-title">Smart Retry API</h3>
            <p className="feature-desc">Resend failed messages with a single API call.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FiBell /></div>
            <h3 className="feature-title">Automated Balance Alerts</h3>
            <p className="feature-desc">Set custom balance thresholds. Our system monitors your wallet and automatically dispatches email notifications when your credits are low.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FiLock /></div>
            <h3 className="feature-title">IP Whitelisting & Keys</h3>
            <p className="feature-desc">Regenerate your secure API key, and restrict API access to specific server IP addresses. Total security for your enterprise data.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FiBarChart2 /></div>
            <h3 className="feature-title">Live Delivery Reports</h3>
            <p className="feature-desc">Get real-time DLR statuses. Our logs precisely track if a message was Delivered, Switched, or Rerouted in real-time.</p>
          </div>
          <div className="feature-card">
            <div>
              <div className="feature-icon"><FiSend /></div>
              <h3 className="feature-title">Bulk & API Messaging</h3>
              <p className="feature-desc">Send high-volume messages instantly through our interactive dashboard or directly via our robust API built for massive scale.</p>
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ marginBottom: '1rem', height: '40px', width: '40px', fontSize: '1.25rem' }}><FiCheckCircle /></div>
            <h3 className="feature-title" style={{ fontSize: '1.25rem' }}>BTRC Compliant</h3>
            <p className="feature-desc" style={{ fontSize: '0.9rem' }}>Fully compliant with BTRC regulations. All Sender IDs and templates are properly vetted to ensure delivery without interruptions.</p>
          </div>
        </div>
      </section>

      {/* Developer First Section */}
      <section id="api" className="section dev-section">
        <div className="container dev-container">
          <div className="dev-content">
            <span className="section-badge" style={{ color: '#818cf8' }}>For Engineers</span>
            <h2 className="section-title">Developer First</h2>
            <p className="section-subtitle" style={{ marginLeft: 0 }}>
              Integrate in minutes, go live today. Our lightweight REST API works seamlessly with any language or framework. No complex SDKs to install or maintain — simply use your API key to authenticate and make standard HTTP requests to start sending messages instantly.
            </p>
            <div className="dev-features">
              <div className="dev-feature">
                <div className="dev-feature-icon"><FiCheck /></div>
                <div>
                  <h4>Simple HTTP API</h4>
                  <p className="feature-desc">Trigger messages instantly using a standard POST request. Our API is completely language-agnostic.</p>
                </div>
              </div>
              <div className="dev-feature">
                <div className="dev-feature-icon"><FiCheck /></div>
                <div>
                  <h4>Secure API Keys</h4>
                  <p className="feature-desc">Access your unique API key directly from your dashboard. Restrict access to whitelisted IP addresses.</p>
                </div>
              </div>
              <div className="dev-feature">
                <div className="dev-feature-icon"><FiCheck /></div>
                <div>
                  <h4>Intelligent Routing & 99.99% Delivery</h4>
                  <p className="feature-desc">Our system automatically reroutes messages through non-masking channels when necessary.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="dev-code">
            <div className="code-header">
              <div className="mac-buttons">
                <div className="mac-btn mac-close"></div>
                <div className="mac-btn mac-min"></div>
                <div className="mac-btn mac-max"></div>
              </div>
              <div className="code-tabs">
                <div className={`code-tab ${activeTab === "send" ? "active" : ""}`} onClick={() => setActiveTab("send")}>cURL (Send)</div>
                <div className={`code-tab ${activeTab === "resend" ? "active" : ""}`} onClick={() => setActiveTab("resend")}>cURL (Resend)</div>
                <div className={`code-tab ${activeTab === "balance" ? "active" : ""}`} onClick={() => setActiveTab("balance")}>cURL (Balance)</div>
              </div>
            </div>
            <div className="code-body">
              <pre>
                <code>
                  {activeTab === "send" && (
                    <>
                      <span className="code-highlight">curl</span> <span className="code-key">-X</span> POST https://cloude.foxses.com/api/send-message \<br />
                      &nbsp;&nbsp;<span className="code-key">-H</span> <span className="code-string">"Content-Type: application/json"</span> \<br />
                      &nbsp;&nbsp;<span className="code-key">-d</span> <span className="code-string">'{`{
    "client_id": "client_Zy8Bc",
    "key": "VOXwtt7mRkAs8B16FboT",
    "sender_id": "MyBrand",
    "recipient": "01XXXXXXXXX",
    "message": "Hello, World!"
  }`}'</span>
                    </>
                  )}
                  {activeTab === "resend" && (
                    <>
                      <span className="code-highlight">curl</span> <span className="code-key">-X</span> POST https://cloude.foxses.com/api/resend-message \<br />
                      &nbsp;&nbsp;<span className="code-key">-H</span> <span className="code-string">"Content-Type: application/json"</span> \<br />
                      &nbsp;&nbsp;<span className="code-key">-d</span> <span className="code-string">'{`{
    "client_id": "client_Zy8Bc",
    "key": "VOXwtt7mRkAs8B16FboT",
    "message_id": "msg_99x82jfL"
  }`}'</span>
                    </>
                  )}
                  {activeTab === "balance" && (
                    <>
                      <span className="code-highlight">curl</span> <span className="code-key">-X</span> GET https://cloude.foxses.com/api/balance \<br />
                      &nbsp;&nbsp;<span className="code-key">-H</span> <span className="code-string">"Authorization: Bearer VOXwtt7mRkAs8B16FboT"</span>
                    </>
                  )}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="section container">
        <div className="section-header">
          <span className="section-badge">Pricing</span>
          <h2 className="section-title">Transparent Pricing</h2>
          <p className="section-subtitle">
            Prepaid & pay-as-you-go. Top up your credit balance and only pay for what you send. Credits never expire as long as your account is active.
          </p>
        </div>
        <div className="pricing-grid">
          <div className="pricing-card">
            <h3 className="pricing-title">Non-Masking</h3>
            <p className="pricing-desc">Numeric sender ID — instant activation. Perfect for small businesses running OTP, alerts, and promotional campaigns.</p>
            <div className="pricing-price">৳0.60<span className="pricing-period">/per SMS</span></div>
            <div className="pricing-features">
              <div className="pricing-feature">
                <FiCheckCircle />
                Web Dashboard & REST API Access
              </div>
              <div className="pricing-feature">
                <FiCheckCircle />
                Real-Time Analytics & DLR
              </div>
              <div className="pricing-feature">
                <FiCheckCircle />
                Unlimited Credit Validity
              </div>
              <div className="pricing-feature">
                <FiCheckCircle />
                Standard Support
              </div>
            </div>
            <a href="#" className="btn btn-secondary" style={{ width: "100%" }}>Get Started</a>
          </div>

          <div className="pricing-card popular">
            <div className="popular-badge">Most Popular</div>
            <h3 className="pricing-title">Masking</h3>
            <p className="pricing-desc">Send with your brand name as the sender ID. Ideal for growing business who need a professional, trusted appearance.</p>
            <div className="pricing-price">৳1.20<span className="pricing-period">/per SMS</span></div>
            <div className="pricing-features">
              <div className="pricing-feature">
                <FiCheckCircle />
                Everything in Non-Masking
              </div>
              <div className="pricing-feature">
                <FiCheckCircle />
                Custom Brand Sender ID
              </div>
              <div className="pricing-feature">
                <FiCheckCircle />
                High Throughput
              </div>
              <div className="pricing-feature">
                <FiCheckCircle />
                Priority Support
              </div>
            </div>
            <a href="#" className="btn btn-primary" style={{ width: "100%" }}>Get Started</a>
          </div>

          <div className="pricing-card">
            <h3 className="pricing-title">Enterprise</h3>
            <p className="pricing-desc">Custom volume pricing with dedicated infrastructure. For large organizations requiring SLA guarantees and high volume.</p>
            <div className="pricing-price">Custom<span className="pricing-period">/per SMS</span></div>
            <div className="pricing-features">
              <div className="pricing-feature">
                <FiCheckCircle />
                Everything in Masking
              </div>
              <div className="pricing-feature">
                <FiCheckCircle />
                Dedicated Account Manager
              </div>
              <div className="pricing-feature">
                <FiCheckCircle />
                Custom API Integration
              </div>
              <div className="pricing-feature">
                <FiCheckCircle />
                SLA-Backed Uptime Guarantee
              </div>
            </div>
            <a href="#" className="btn btn-secondary" style={{ width: "100%" }}>Contact Sales</a>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section container">
        <div className="section-header">
          <span className="section-badge">Testimonials</span>
          <h2 className="section-title">Client Success</h2>
          <p className="section-subtitle">
            Loved by developers and founders. See how scaling businesses optimize their notification pipelines and 2-factor customer logins.
          </p>
        </div>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p className="testimonial-quote">"Using Foxses Cloude for our OTP delivery has been a game-changer. Lightning-fast delivery, clean API integration, and a smooth dashboard. They understood our volume needs perfectly. Overall, a solid and satisfying experience."</p>
            <div className="testimonial-author">
              <div className="author-avatar">SH</div>
              <div className="author-info">
                <h4>Sharkz</h4>
                <p>Marketing Manager, Influencify</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <p className="testimonial-quote">"Great experience with Foxses Cloude! They power all SMS notifications for ShopOS BD, our all-in-one SaaS for print shops in Bangladesh. High delivery rates, instant routing, and smooth performance. Highly recommended."</p>
            <div className="testimonial-author">
              <div className="author-avatar">SA</div>
              <div className="author-info">
                <h4>Sarowar</h4>
                <p>CEO at ShopOS BD</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <p className="testimonial-quote">"It was great switching to Foxses Cloude. Their masking auto-fallback works flawlessly! Quick response times and highly reliable infrastructure. We are now scaling all our projects using their API."</p>
            <div className="testimonial-author">
              <div className="author-avatar">CJ</div>
              <div className="author-info">
                <h4>Cjbyfield</h4>
                <p>CEO at The Social Construct</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section container">
        <div className="section-header">
          <span className="section-badge">Support</span>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">
            Have questions? We have answers. Find answers to common technical, operational, and billing questions about our messaging infrastructure.
          </p>
        </div>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <div className="faq-question" onClick={() => toggleFaq(index)}>
                {faq}
                <FiChevronDown style={{ transition: 'transform 0.3s ease', transform: faqOpen === index ? 'rotate(180deg)' : 'rotate(0)' }} />
              </div>
              {faqOpen === index && (
                <div className="faq-answer">
                  Our team is constantly updating our knowledge base. Please contact support if you need more details regarding this specific question. We are always here to help you integrate seamlessly.
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="section contact-section">
        <div className="container contact-container">
          <div className="contact-info-wrapper">
            <span className="section-badge">Contact</span>
            <h2 className="section-title" style={{ fontSize: '2.5rem' }}>Get in Touch</h2>
            <p className="section-subtitle" style={{ marginLeft: 0, marginBottom: '3rem', fontSize: '1.1rem' }}>
              Have questions, need custom integration help, or want to discuss enterprise volumes? Our team is ready to assist you.
            </p>
            
            <div className="contact-info-item">
              <div className="contact-info-title">
                <FiPhone />
                Support Hotline
              </div>
              <div className="contact-info-desc">+880 1617-643566</div>
            </div>
            
            <div className="contact-info-item">
              <div className="contact-info-title">
                <FiMail />
                Email Address
              </div>
              <div className="contact-info-desc">info@foxses.com</div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-title">
                <FiMapPin />
                Headquarters
              </div>
              <div className="contact-info-desc">Dhaka, Bangladesh</div>
            </div>
          </div>

          <div className="contact-form">
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem' }}>Send us a message</h3>
            <form onSubmit={handleContactSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Rahim Rahman"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="rahim@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea 
                  className="form-textarea" 
                  placeholder="How can we help you?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isSubmitting}
                ></textarea>
              </div>
              <button 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-logo">
            <FiCloud /> Foxses Cloude
          </div>
          <p className="footer-desc">Enterprise-grade Masking and Non-Masking SMS infrastructure powering businesses across Bangladesh with 99.99% guaranteed uptime.</p>
          <div className="footer-copy">© 2026 Foxses Cloude. A product of Foxses. All rights reserved.</div>
        </div>
      </footer>
    </main>
  );
}
