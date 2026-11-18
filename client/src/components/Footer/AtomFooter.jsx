import React from 'react';
import styles from './AtomFooter.module.css';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube, FaRegSmile } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { MdAccessibilityNew } from 'react-icons/md';

// Заголовки и списки ниже сверены с текущим футером atom.com
// (проверено 2026-09-16).
const AtomFooter = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.stickyLeft}>
        <div className={styles.accessibilityCircle}>
          <MdAccessibilityNew />
        </div>
      </div>

      <div className={styles.stickyRight}>
        <div className={styles.chatCircle}>
          <FaRegSmile />
        </div>
      </div>

      <div className={styles.topDivider}></div>
      <div className={styles.container}>
        <div className={styles.grid}>

          <div className={styles.column}>
            <h4 className={styles.heading}>Premium Domains</h4>
            <ul className={styles.linkList}>
              {["Premium Domain Marketplace", "Ultra Premium Domains", "Sapphire Domains", "Premium .ai Domains", "One Word Domains", "Short Domains", "3 Letter Domains", "4 Letter Domains", "5 Letter Domains", "6 Letter Domains", "7 Letter Domains", "Aged Domains", "Aftermarket Domains", "Expired Domains", "ccTLD Domains", "All Domain Collections"].map(item => (
                <li key={item} className={styles.linkItem}>{item}</li>
              ))}
            </ul>
            <div className={styles.subBlock}>
              <h4 className={styles.heading}>Domain Services</h4>
              <ul className={styles.linkList}>
                {["Domain Broker", "Domains for Rent", "Domain Auctions"].map(item => (
                  <li key={item} className={styles.linkItem}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.column}>
            <h4 className={styles.heading}>Register Domains</h4>
            <ul className={styles.linkList}>
              {["Register a Domain", "Domain Extensions", "Transfer a Domain", "Schedule Domain Transfers"].map(item => (
                <li key={item} className={styles.linkItem}>{item}</li>
              ))}
            </ul>
            <div className={styles.subBlock}>
              <h4 className={styles.heading}>Domain Tools</h4>
              <ul className={styles.linkList}>
                {["Domain Name Generator", "Domain Appraisal", "WHOIS Lookup", "AtomRadar (Domain Research)"].map(item => (
                  <li key={item} className={styles.linkItem}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.column}>
            <h4 className={styles.heading}>Naming & Branding</h4>
            <ul className={styles.linkList}>
              {["Name Your Company", "Business Name Generator", "Human Naming Contests", "AI Naming Contest", "Hire Our Naming Agency", "Audience Research", "AI Audience Testing", "Slogan & Tagline Ideas", "How to Name a Business"].map(item => (
                <li key={item} className={styles.linkItem}>{item}</li>
              ))}
            </ul>
            <div className={styles.subBlock}>
              <h4 className={styles.heading}>Branding</h4>
              <ul className={styles.linkList}>
                {["Brand Identity Design", "AI Logo Generator", "Build a Brand", "Startup Toolkit"].map(item => (
                  <li key={item} className={styles.linkItem}>{item}</li>
                ))}
              </ul>
            </div>
            <div className={styles.subBlock}>
              <h4 className={styles.heading}>Brand Protection</h4>
              <ul className={styles.linkList}>
                {["Free Trademark Checker", "Premium Trademark Reports", "Brand Monitoring"].map(item => (
                  <li key={item} className={styles.linkItem}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.column}>
            <h4 className={styles.heading}>Sell Domains</h4>
            <ul className={styles.linkList}>
              {["Become a Seller", "Domain Selling Info", "Ultra Premium Seller Info", "Sapphire Marketplace", "ccTLD Marketplace", "AtomPay"].map(item => (
                <li key={item} className={styles.linkItem}>{item}</li>
              ))}
            </ul>
            <div className={styles.subBlock}>
              <h4 className={styles.heading}>Creatives</h4>
              <ul className={styles.linkList}>
                {["Become a Creative", "Active Contests", "Recent Winners", "Creative FAQs", "Discussion Forum"].map(item => (
                  <li key={item} className={styles.linkItem}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.column}>
            <h4 className={styles.heading}>Atom</h4>
            <ul className={styles.linkList}>
              {["About", "Contact", "Case Studies", "Testimonials", "Blog", "Careers"].map(item => (
                <li key={item} className={styles.linkItem}>{item}</li>
              ))}
            </ul>
            <div className={styles.subBlock}>
              <h4 className={styles.heading}>Support</h4>
              <ul className={styles.linkList}>
                {["Customer Support", "Help & FAQs", "Report Abuse"].map(item => (
                  <li key={item} className={styles.linkItem}>{item}</li>
                ))}
              </ul>
            </div>
            <div className={styles.subBlock}>
              <h4 className={styles.heading}>Partner with Us</h4>
              <ul className={styles.linkList}>
                {["AtomConnect Partnership Program", "Distribution Network API", "Affiliate Program", "MCP Server", "White Label Marketplace"].map(item => (
                  <li key={item} className={styles.linkItem}>{item}</li>
                ))}
              </ul>
            </div>
            <div className={`${styles.subBlock} ${styles.legalBlock}`}>
              <h4 className={styles.heading}>Legal</h4>
              <ul className={styles.linkList}>
                {["Terms of Service", "Privacy Policy", "Cookie Policy", "Terms & Agreements"].map(item => (
                  <li key={item} className={styles.linkItem}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.bottomLine}></div>
        <div className={styles.footerBottom}>
          <div className={styles.copyBlock}>
            <span>Copyright © 2026 Atom.com</span>
            <span className={styles.dot}>•</span>
            <span className={styles.linkItem}>Consent Preferences</span>
          </div>

          <div className={styles.ratingSection}>
            <div className={styles.trustpilot}>
               <span className={styles.excellent}>Excellent</span>
               <div className={styles.stars}>★★★★★</div>
               <span className={styles.tpText}>Trustpilot</span>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.scoreBlock}>
               <span className={styles.score}>4.7 / 5</span>
               <span className={styles.basedOn}>based on 1089 ratings</span>
            </div>
          </div>

          <div className={styles.socials}>
            <a href="https://www.facebook.com/atomdotcom" aria-label="Facebook"><FaFacebookF className={styles.socialIcon} /></a>
            <a href="https://x.com/atomhq" aria-label="X"><FaXTwitter className={styles.socialIcon} /></a>
            <a href="https://www.instagram.com/workwithatom/" aria-label="Instagram"><FaInstagram className={styles.socialIcon} /></a>
            <a href="https://www.linkedin.com/company/atomdotcom/" aria-label="LinkedIn"><FaLinkedinIn className={styles.socialIcon} /></a>
            <a href="https://www.youtube.com/@atomdotcom" aria-label="YouTube"><FaYoutube className={styles.socialIcon} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AtomFooter;
