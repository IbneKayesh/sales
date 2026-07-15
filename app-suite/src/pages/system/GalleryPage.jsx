import React, { useState } from 'react';
import { IconEyeOpen } from '@/assets/icons';
import ButtonGroup from '@/components/ButtonGroup/ButtonGroup';
import styles from './GalleryPage.module.css';

const categories = ['All', 'Photography', 'Illustration', '3D Render'];

const mockGallery = [
  { id: 1, title: 'Mystic Mountains', category: 'Photography', ratio: 'landscape', bgStyle: styles.gradient1 },
  { id: 2, title: 'Cyberpunk Alleyway', category: '3D Render', ratio: 'portrait', bgStyle: styles.gradient2 },
  { id: 3, title: 'Minimalist Wave', category: 'Illustration', ratio: 'square', bgStyle: styles.gradient3 },
  { id: 4, title: 'Golden Hour Sahara', category: 'Photography', ratio: 'square', bgStyle: styles.gradient4 },
  { id: 5, title: 'Abstract Fluid Bubble', category: '3D Render', ratio: 'landscape', bgStyle: styles.gradient5 },
  { id: 6, title: 'Vector Workspace', category: 'Illustration', ratio: 'portrait', bgStyle: styles.gradient6 },
];

const GalleryPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredItems = activeCategory === 'All'
    ? mockGallery
    : mockGallery.filter(item => item.category === activeCategory);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTitleArea}>
          <h1 className={styles.title}>System Gallery</h1>
          <p className={styles.subtitle}>Explore visual creations and system graphics</p>
        </div>

        <ButtonGroup
          buttons={categories.map((cat) => ({ id: cat, label: cat }))}
          activeId={activeCategory}
          onChange={setActiveCategory}
          size="sm"
          variant="outline"
          ariaLabel="Gallery Categories"
        />
      </header>

      <main className={styles.grid}>
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`${styles.card} ${styles[item.ratio]}`}
          >
            <div className={`${styles.mediaContainer} ${item.bgStyle}`}>
              <div className={styles.overlay}>
                <button className={styles.previewBtn} aria-label={`View ${item.title}`}>
                  <IconEyeOpen className={styles.btnIcon} />
                </button>
              </div>
            </div>
            
            <div className={styles.metaInfo}>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <span className={styles.cardCategory}>{item.category}</span>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default GalleryPage;
