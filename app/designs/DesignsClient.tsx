"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../context/LanguageContext";
import PageTransition, { titleVariants } from "../../components/PageTransition";

interface Project {
  slug: string;
  titleKey: string;
  year: string;
  categoryKey: string;
  collaborators?: string;
  descriptionKey: string;
  type: "video" | "image";
  videoCover?: string;
  images: string[];
  color?: string;
  objectPosition?: string;
  objectScale?: number;
  scrollDuration?: number;
}

export function DesignsClient() {
  const { t, lang } = useLanguage();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const projects: Project[] = [
    {
      slug: "manofim-17",
      titleKey: "designs.manofim.title",
      year: "2025",
      categoryKey: "designs.category.branding",
      collaborators: "Rotem Cohen-Soaye, Eitan Zelwer",
      descriptionKey: "designs.manofim.description",
      type: "video",
      videoCover: "/images/designs/manofim-17/MANOFIM_STD_STORY_1.mp4",
      images: [
        "/images/designs/manofim-17/MAN%20BILL1.jpg",
        "/images/designs/manofim-17/MAN%20BILL2.jpg",
        "/images/designs/manofim-17/MAN%20FLAG.jpg",
        "/images/designs/manofim-17/RICK-POST%202.png",
        "/images/designs/manofim-17/DRAG-ADD.png",
        "/images/designs/manofim-17/MANOFIM%20TWINSHIP-POST.png",
        "/images/designs/manofim-17/MANOFIM%20TICHO%20HOUSE-01.png",
        "/images/designs/manofim-17/MANOFIM-INVITATION-FORM-HEADER-01.png",
      ],
      color: "rgba(245, 245, 247, 0.05)",
      scrollDuration: 90, 
    },
    {
      slug: "bustana",
      titleKey: "designs.bustana.title",
      year: "2026",
      categoryKey: "designs.category.visual_language",
      collaborators: "Rotem Cohen-Soaye",
      descriptionKey: "designs.bustana.description",
      type: "image",
      images: [
        "/images/designs/bustana/ROOF%20MOCK.jpg",
        "/images/designs/bustana/BUSTANA%20CHILDREN-05.jpg",
        "/images/designs/bustana/BUSTANA%20CHILDREN-10.jpg",
        "/images/designs/bustana/BUSTANA%20CHILDREN-17.jpg",
        "/images/designs/bustana/BUSTANA%20TABNIOT-10.jpg",
        "/images/designs/bustana/BUSTANA%20TABNIOT-13.jpg",
        "/images/designs/bustana/BUSTANA%20TABNIOT-16.jpg",
        "/images/designs/bustana/BUSTANA%20TABNIOT-21.jpg",
      ],
      color: "rgba(245, 245, 247, 0.05)",
      objectPosition: "25% 30%", 
      objectScale: 1.5,
      scrollDuration: 64,
    },
    {
      slug: "sticky",
      titleKey: "designs.sticky.title",
      year: "2023",
      categoryKey: "designs.category.editorial_design",
      collaborators: "Simon Memel, Lucrezia Noro",
      descriptionKey: "designs.sticky.description",
      type: "video",
      videoCover: "/images/designs/sticky/Sticky1(B&W).mp4",
      images: [
        "/images/designs/sticky/2.jpg",
        "/images/designs/sticky/10.jpg",
        "/images/designs/sticky/Sticky_post5.mp4",
        "/images/designs/sticky/4.jpg",
        "/images/designs/sticky/Untitled-1.mp4",
        "/images/designs/sticky/story.mp4",
        "/images/designs/sticky/workspace6.jpg",
      ],
      color: "#E36D2B",
      objectPosition: "center 40%", 
      objectScale: 1.05,
      scrollDuration: 70,
    },
  ];

  return (
    <PageTransition>
      <section>
        <div 
          dir={lang === "he" ? "rtl" : "ltr"}
          className="page-header-container"
        >
          <motion.h1 
            className="page-title" 
            variants={titleVariants}
          >
            {t("nav.designs")}
          </motion.h1>
        </div>

        <div className="designs-grid" style={{ 
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
          gap: "2.5rem",
          alignItems: "start",
          justifyContent: "center" /* Center the grid items */
        }}>
          {projects.map((project) => (
            <DesignCard 
              key={project.slug} 
              project={project} 
              onClick={() => setSelectedProject(project)} 
              lang={lang}
            />
          ))}
        </div>
      </section>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
            lang={lang}
            t={t}
          />
        )}
      </AnimatePresence>
    </PageTransition>
  );
}

function DesignCard({ project, onClick, lang }: { project: Project; onClick: () => void; lang: string }) {
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      className="design-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      style={{
        position: "relative",
        aspectRatio: "16/10",
        backgroundColor: "var(--bg-color)",
        border: "1.5px solid var(--border-color)",
        overflow: "hidden",
        cursor: "pointer",
        borderRadius: "0"
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
        {project.type === "video" ? (
          <video 
            src={project.videoCover || project.images[0]} 
            autoPlay 
            muted 
            loop 
            playsInline
            style={{ 
              width: "100%", 
              height: "100%", 
              objectFit: "cover",
              objectPosition: project.objectPosition || "center",
              transform: `scale(${project.objectScale || 1})`,
              transformOrigin: project.objectPosition || "center"
            }}
          />
        ) : (
          <Image 
            src={project.images[0]} 
            alt={t(project.titleKey)} 
            fill 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ 
              objectFit: "cover", 
              objectPosition: project.objectPosition || "center",
              transform: `scale(${project.objectScale || 1})`,
              transformOrigin: project.objectPosition || "center"
            }} 
          />
        )}
      </motion.div>
 
      {project.color && project.color !== "rgba(245, 245, 247, 0.05)" && (
        <motion.div 
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: project.color,
            mixBlendMode: "lighten",
            zIndex: 1,
            pointerEvents: "none"
          }}
        />
      )}

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
        <h3 className="text-meta" style={{ fontSize: "1.1rem", marginBottom: "0.25rem", color: "inherit", textTransform: "none" }}>
          {t(project.titleKey)}
        </h3>
        <div className="text-meta" style={{ 
          opacity: 0.8, 
          display: "flex", 
          gap: "1rem", 
          fontSize: "0.75rem",
          color: "inherit",
          justifyContent: lang === "he" ? "flex-end" : "flex-start"
        }}>
          <span>{project.year}</span>
          <span>—</span>
          <span>{t(project.categoryKey)}</span>
        </div>
      </div>
    </motion.div>
  );
}

function ProjectModal({ project, onClose, lang, t }: { project: Project; onClose: () => void; lang: string; t: (k: string) => string }) {
  const isRTL = lang === "he";
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      dir={isRTL ? "rtl" : "ltr"}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(18, 18, 18, 0.95)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem"
      }}
    >
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="project-modal-grid"
        style={{
          backgroundColor: "var(--bg-color)",
          color: "var(--text-color)",
          maxWidth: "1650px",
          border: "1.5px solid var(--border-color)",
          position: "relative",
          borderRadius: "0"
        }}
      >
        <button 
          className="modal-close-mobile"
          onClick={onClose}
        >
          ✕
        </button>
        <div 
          className="project-modal-info"
        >
          <div>
            <h2 className="page-title" style={{ fontSize: "2.5rem", marginBottom: "1.5rem" }}>
              {t(project.titleKey)}
            </h2>
            
            <div className="project-modal-metadata text-meta" style={{ 
              display: "flex",
              flexDirection: "column",
              gap: "0.8rem",
              opacity: 0.8,
              borderTop: "1.5px solid var(--border-color)",
              paddingTop: "1.5rem",
              marginBottom: "3rem"
            }}>
              <div style={{ display: "flex", gap: "1rem" }}>
                <span style={{ opacity: 0.5 }}>{t("specimen.year")}</span>
                <span>{project.year}</span>
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <span style={{ opacity: 0.5 }}>{t("specimen.category")}</span>
                <span>{t(project.categoryKey)}</span>
              </div>
              {project.collaborators && (
                <div style={{ display: "flex", gap: "1rem" }}>
                  <span style={{ opacity: 0.5 }}>{t("designs.collaborators")}</span>
                  <span>{project.collaborators}</span>
                </div>
              )}
            </div>

            <p className="text-editorial" style={{ fontSize: "1.1rem" }}>
              {t(project.descriptionKey)}
            </p>
          </div>
        </div>

        <div className="project-modal-media">
          <div className="infinite-scroll-wrapper">
            <div 
              className="infinite-scroll-track"
              style={{ animationDuration: `${project.scrollDuration || 60}s` }}
            >
              {[...project.images, ...project.images, ...project.images, ...project.images].map((asset, i) => {
                const isVideo = asset.toLowerCase().endsWith(".mp4") || asset.toLowerCase().endsWith(".webm");
                return (
                  <div key={i} className="infinite-scroll-item">
                    {isVideo ? (
                      <video 
                        src={asset} 
                        autoPlay 
                        muted 
                        loop 
                        playsInline
                        style={{ height: "100%", width: "auto", display: "block" }} 
                      />
                    ) : (
                      <img 
                        src={asset} 
                        alt={`${project.slug}-${i}`} 
                        style={{ height: "100%", width: "auto", display: "block" }} 
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
