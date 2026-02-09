import React from 'react';
import styles from './AtomFooter.module.css';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube, FaRegSmile } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { MdAccessibilityNew } from 'react-icons/md'; 

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
            <h4 className={styles.heading}>Domain Services</h4>
            <ul className={styles.linkList}>
              {["Premium Domains", "Ultra Premium Domains", ".ai Domains", "Short Domains", "3 Letter Domains", "4 Letter Domains", "5 Letter Domains", "6 Letter Domains", "7 Letter Domains", "One Word Domains", "Aged Domains", "Aftermarket Domains", "Expired Domains", "Domains for Rent", "Domain Broker", "Short AI Domains", "3 Letter AI Domains", "4 Letter AI Domains", "5 Letter AI Domains", "One Word AI Domains"].map(item => (
                <li key={item} className={styles.linkItem}>{item}</li>
              ))}
            </ul>
          </div>

          <div className={styles.column}>
            <h4 className={styles.heading}>Domain Tools</h4>
            <ul className={styles.linkList}>
              {["Domain Name Generator", "Domain Appraisal", "Domain Extensions", "WHOIS Lookup", "Domain Insights", "AtomRadar (Domain Research)"].map(item => (
                <li key={item} className={styles.linkItem}>{item}</li>
              ))}
            </ul>
            <div className={styles.subBlock}>
              <h4 className={styles.heading}>Domain Sellers</h4>
              <ul className={styles.linkList}>
                {["Become a Seller", "Domain Selling Info", "Ultra Premium Seller Info", "Sapphire Marketplace", "ccTLD Marketplace", "AtomPay", "Domain Auctions", "Discussion Forum"].map(item => (
                  <li key={item} className={styles.linkItem}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.column}>
            <h4 className={styles.heading}>Naming & Branding</h4>
            <ul className={styles.linkList}>
              {["Naming Contest", "Brand Identity Design", "Brand Naming Agency", "Business Name Generator", "Audience Research", "Startup Toolkit", "Build a Brand", "AI Logo Generator"].map(item => (
                <li key={item} className={styles.linkItem}>{item}</li>
              ))}
            </ul>
            <div className={styles.subBlock}>
              <h4 className={styles.heading}>Brand Protection</h4>
              <ul className={styles.linkList}>
                {["Premium Trademark Reports", "Brand Monitoring", "Free Trademark Checker"].map(item => (
                  <li key={item} className={styles.linkItem}>{item}</li>
                ))}
              </ul>
            </div>
            <div className={styles.subBlock}>
              <h4 className={styles.heading}>Creatives</h4>
              <ul className={styles.linkList}>
                {["Become a Creative", "Creative FAQs", "Active Contests", "Recent Winners", "Discussion Forum"].map(item => (
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
            <span>Copyright © 2025 Atom.com</span>
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
               <span className={styles.score}>4.5 / 5</span>
               <span className={styles.basedOn}>based on 756 ratings</span>
            </div>
          </div>

          <div className={styles.socials}>
            <FaFacebookF className={styles.socialIcon} />
            <FaXTwitter className={styles.socialIcon} />
            <FaInstagram className={styles.socialIcon} />
            <FaLinkedinIn className={styles.socialIcon} />
            <FaYoutube className={styles.socialIcon} />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AtomFooter;
