import React from 'react';

export default function MenuItem({ icon: Icon, title, text }) {
  return (
    <div className={styles.item}>
      <div className={styles.icon}>
        <Icon size={22} />
      </div>
      <div>
        <div className={styles.title}>{title}</div>
        <div className={styles.text}>{text}</div>
      </div>
    </div>
  );
}
