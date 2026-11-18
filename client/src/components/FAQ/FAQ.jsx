import React, { useState } from 'react';
import styles from './FAQ.module.css';
import { faqData } from '../data/faq.data';

const FAQ = () => {
  const categories = Object.keys(faqData);
  const [openId, setOpenId] = useState(null);
  const [activeTab, setActiveTab] = useState(categories[0]);

  const toggleQuestion = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const scrollToSection = (category) => {
    setActiveTab(category);
    const element = document.getElementById(category);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className={styles.faqSection}>
      <h2 className={styles.mainTitle}>Frequently Asked Questions</h2>
      
      <div className={styles.navWrapper}>
        <div className={styles.tabContainer}>
          {categories.map((category) => (
            <button
              key={category}
              className={`${styles.tabBtn} ${activeTab === category ? styles.activeTabBtn : ''}`}
              aria-current={activeTab === category ? 'location' : undefined}
              onClick={() => scrollToSection(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.allContent}>
        {categories.map((category) => (
          <div key={category} id={category} className={styles.sectionBlock}>
            <h3 className={styles.categoryTitle}>{category}</h3>
            
            <div className={styles.accordionList}>
              {faqData[category].map((item) => {
                const isOpen = openId === item.id;
                const questionId = `faq-question-${item.id}`;
                const answerId = `faq-answer-${item.id}`;
                return (
                  <div key={item.id} className={`${styles.accordionItem} ${isOpen ? styles.activeItem : ''}`}>
                    <h4 className={styles.questionHeading}>
                      <button
                        id={questionId}
                        type="button"
                        className={styles.questionButton}
                        aria-expanded={isOpen}
                        aria-controls={answerId}
                        onClick={() => toggleQuestion(item.id)}
                      >
                        <span className={styles.questionText}>{item.question}</span>
                        <span className={styles.icon} aria-hidden="true">{isOpen ? '−' : '+'}</span>
                      </button>
                    </h4>
                    {isOpen && (
                      <div id={answerId} className={styles.answer} role="region" aria-labelledby={questionId}>
                        <p>{item.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
