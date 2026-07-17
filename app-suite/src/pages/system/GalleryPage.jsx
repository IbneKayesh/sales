import { useState } from 'react';

import { IconEyeOpen } from '@/assets/icons';
import ButtonGroup from '@/components/ButtonGroup/ButtonGroup';
import './GalleryPage.css';
const categories = ['All', 'Photography', 'Illustration', '3D Render'];

const mockGallery = [
  { id: 1, title: 'Mystic Mountains', category: 'Photography', ratio: 'landscape', bgStyle: 'gradient1' },
  { id: 2, title: 'Cyberpunk Alleyway', category: '3D Render', ratio: 'portrait', bgStyle: 'gradient2' },
  { id: 3, title: 'Minimalist Wave', category: 'Illustration', ratio: 'square', bgStyle: 'gradient3' },
  { id: 4, title: 'Golden Hour Sahara', category: 'Photography', ratio: 'square', bgStyle: 'gradient4' },
  { id: 5, title: 'Abstract Fluid Bubble', category: '3D Render', ratio: 'landscape', bgStyle: 'gradient5' },
  { id: 6, title: 'Vector Workspace', category: 'Illustration', ratio: 'portrait', bgStyle: 'gradient6' },
];

const GalleryPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredItems = activeCategory === 'All'
    ? mockGallery
    : mockGallery.filter(item => item.category === activeCategory);

  return (
    <div className="container">
      <header className="header">
        <div className="headerTitleArea">
          <h1 className="title">System Gallery</h1>
          <p className="subtitle">Explore visual creations and system graphics</p>
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

      <main className="grid">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`card ${item.ratio}`}
          >
            <div className={`mediaContainer ${item.bgStyle}`}>
              <div className="overlay">
                <button className="previewBtn" aria-label={`View ${item.title}`}>
                  <IconEyeOpen className="w-16 h-16" />
                </button>
              </div>
            </div>
            
            <div className="metaInfo">
              <h3 className="fs-13 fw-600" style={{fontFamily:'var(--font-display)',color:'var(--color-text-primary)'}}>{item.title}</h3>
              <span className="fs-10 text-muted">{item.category}</span>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default GalleryPage;
