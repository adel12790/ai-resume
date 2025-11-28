"use client";

import { Mail, MapPin, Linkedin } from "lucide-react";
import styles from "./ResumeSidebar.module.css";

export default function ResumeSidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarContent}>
        {/* Profile Section */}
        <div className={styles.profileSection}>
          <div className={styles.profileAvatar}>
            <span className={styles.avatarText}>MA</span>
          </div>
          <h1 className={styles.profileName}>Mohamed Adel</h1>
          <p className={styles.profileTitle}>Senior Software Engineer</p>
          <p className={styles.profileSubtitle}>React | Node.js | AWS | Game Dev</p>
        </div>

        {/* Contact Info */}
        <div className={styles.infoSection}>
          <h2 className={styles.sectionTitle}>Contact</h2>
          <div className={styles.infoItem}>
            <Mail size={16} />
            <a href="mailto:adel12790@gmail.com">adel12790@gmail.com</a>
          </div>
          <div className={styles.infoItem}>
            <MapPin size={16} />
            <span>Msida, Malta</span>
          </div>
          <div className={styles.infoItem}>
            <Linkedin size={16} />
            <a href="https://www.linkedin.com/in/quickdevelop" target="_blank" rel="noopener noreferrer">
              linkedin.com/in/quickdevelop
            </a>
          </div>
        </div>

        {/* About */}
        <div className={styles.infoSection}>
          <h2 className={styles.sectionTitle}>About</h2>
          <p className={styles.aboutText}>
            Entrepreneur, software engineer and game developer from Cairo, Egypt, now based in Malta since 2018.
            Passionate about building engaging web and mobile applications.
          </p>
        </div>

        {/* Top Skills */}
        <div className={styles.infoSection}>
          <h2 className={styles.sectionTitle}>Top Skills</h2>
          <div className={styles.skillsGrid}>
            <span className={styles.skillTag}>React.js</span>
            <span className={styles.skillTag}>Next.js</span>
            <span className={styles.skillTag}>TypeScript</span>
            <span className={styles.skillTag}>Node.js</span>
            <span className={styles.skillTag}>Unity 3D</span>
            <span className={styles.skillTag}>AWS</span>
            <span className={styles.skillTag}>Vue.js</span>
            <span className={styles.skillTag}>Angular</span>
          </div>
        </div>

        {/* Experience Highlights */}
        <div className={styles.infoSection}>
          <h2 className={styles.sectionTitle}>Experience</h2>
          <div className={styles.experienceItem}>
            <h3 className={styles.experienceTitle}>Senior Software Engineer</h3>
            <p className={styles.experienceCompany}>SilverFrog LTD</p>
            <p className={styles.experienceDate}>Jan 2025 - Present</p>
          </div>
          <div className={styles.experienceItem}>
            <h3 className={styles.experienceTitle}>Full Stack Engineer</h3>
            <p className={styles.experienceCompany}>ClearVUE.Business</p>
            <p className={styles.experienceDate}>May 2024 - Feb 2025</p>
          </div>
          <div className={styles.experienceItem}>
            <h3 className={styles.experienceTitle}>Senior Frontend Developer</h3>
            <p className={styles.experienceCompany}>Chiliz</p>
            <p className={styles.experienceDate}>Jun 2020 - May 2024</p>
          </div>
        </div>

        {/* Languages */}
        <div className={styles.infoSection}>
          <h2 className={styles.sectionTitle}>Languages</h2>
          <ul className={styles.languageList}>
            <li>English (Full Professional)</li>
            <li>Arabic (Native)</li>
            <li>Japanese (Elementary)</li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
