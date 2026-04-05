"use client";
import PageTransition from "../../components/PageTransition";
import { useLanguage } from "../../context/LanguageContext";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ToolBoxPage() {
  const { t, lang } = useLanguage();
  const isRTL = lang === 'he';

  const TOOLS = [
    {
      name: t('toolbox.twister_name'),
      path: '/toolbox/twister',
      desc: t('toolbox.twister_desc'),
      category: t('toolbox.spatial'),
      video: '/images/toolbox/twister/twister_cover.mp4',
      image: '/images/toolbox/twister/twister_cover.mp4',
      color: "rgba(245, 245, 247, 0.05)"
    },
    {
      name: t('toolbox.mosaic_name'),
      path: '/toolbox/mosaic',
      desc: t('toolbox.mosaic_desc'),
      category: t('toolbox.image'),
      image: '/images/toolbox/mosaic/cover.mp4',
      color: "rgba(245, 245, 247, 0.05)"
    }
  ];

  return (
    <PageTransition>
      <section>
        <div className="page-header-container" dir={isRTL ? "rtl" : "ltr"}>
          <h1 className="page-title">
            {t('toolbox.title')}
          </h1>
          <p className="page-subtitle">
            {t('toolbox.description')}
          </p>
        </div>

        <div 
          className="designs-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
            gap: '2.5rem',
            alignItems: 'start',
            justifyContent: 'center'
          }}
        >
          {TOOLS.map((tool) => (
            <ToolboxCard key={tool.path} tool={tool} lang={lang} />
          ))}
        </div>
      </section>
    </PageTransition>
  );
}

function ToolboxCard({ tool, lang }: { tool: any; lang: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  return (
    <motion.div 
      className="design-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => router.push(tool.path)}
      style={{
        position: "relative",
        aspectRatio: "16/10",
        backgroundColor: "var(--bg-color)",
        border: "1.5px solid var(--border-color)",
        overflow: "hidden",
        cursor: "pointer",
        borderRadius: "0",
        display: "block"
      }}
    >
      <motion.div 
        animate={{ 
          filter: isHovered ? "grayscale(0%) contrast(1)" : "grayscale(100%) contrast(1.1)" 
        }}
        transition={{ duration: 0.5 }}
        style={{ 
          position: "absolute", 
          inset: 0, 
          zIndex: 0,
        }}
      >
        {tool.image.endsWith('.mp4') ? (
          <video
            src={tool.image}
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <Image 
            src={tool.image} 
            alt={tool.name} 
            fill 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ 
              objectFit: "cover", 
              objectPosition: "center",
            }} 
          />
        )}
      </motion.div>
 
      {tool.color && tool.color !== "rgba(245, 245, 247, 0.05)" && (
        <motion.div 
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: tool.color,
            mixBlendMode: "lighten",
            zIndex: 1,
            pointerEvents: "none"
          }}
        />
      )}

      {/* Gradient for text readability */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to top, rgba(18, 18, 18, 0.8) 0%, rgba(18, 18, 18, 0) 40%)",
        zIndex: 2
      }} />

      <div style={{ 
        position: "absolute", 
        bottom: 0, 
        left: 0, 
        right: 0, 
        padding: "1.5rem",
        zIndex: 3,
        color: "#F5F5F7",
        textAlign: lang === "he" ? "right" : "left"
      }}>
        <h3 className="text-meta" style={{ fontSize: "1.2rem", marginBottom: "0", color: "inherit", textTransform: "none" }}>
          {tool.name}
        </h3>
      </div>
    </motion.div>
  );
}
