import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface EventGalleryProps {
  mainImage: string;
  additionalImages?: string[];
  title: string;
}

export const EventGallery: React.FC<EventGalleryProps> = ({ mainImage, additionalImages, title }) => {
  const allImages = [mainImage, ...(additionalImages || [])];
  const [selectedImage, setSelectedImage] = useState(mainImage);

  if (allImages.length === 1) {
    return (
      <div className="w-full h-full rounded-2xl overflow-hidden shadow-sm relative bg-slate-100 flex-shrink-0">
         <img src={mainImage} alt={title} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 h-[300px] md:h-[450px] w-full">
      {/* Featured Photo (Left) */}
      <div className="flex-1 rounded-2xl overflow-hidden bg-slate-100 shadow-sm relative min-h-[200px]">
        <AnimatePresence mode="wait">
          <motion.img
            key={selectedImage}
            src={selectedImage}
            alt={title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-cover absolute inset-0"
          />
        </AnimatePresence>
      </div>

      {/* Thumbnails (Right) */}
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 md:w-32 lg:w-36 flex-shrink-0 snap-x md:snap-y custom-scrollbar h-24 md:h-full">
        {allImages.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedImage(img)}
            className={`relative rounded-xl overflow-hidden aspect-square flex-shrink-0 w-24 md:w-full snap-start transition-all duration-300 border-2 ${selectedImage === img ? 'border-amber-500 shadow-md scale-[0.98]' : 'border-transparent opacity-70 hover:opacity-100 hover:scale-[0.98]'}`}
          >
            <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};
