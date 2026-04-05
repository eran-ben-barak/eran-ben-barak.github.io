"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../context/LanguageContext";
import PageTransition from "../../components/PageTransition";

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
  displayMode?: "infinite" | "booklet";
  pdfUrl?: string;
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
      slug: "script-in-stone",
      titleKey: "designs.script.title",
      year: "2024",
      categoryKey: "designs.category.writing",
      descriptionKey: "designs.script.description",
      type: "image",
      images: ["/images/designs/script-in-stone/cover.png"],
      pdfUrl: "/images/designs/script-in-stone/Thesis - Script In Stone_single pages_low res.pdf",
      color: "rgba(245, 245, 247, 0.05)",
      objectPosition: "center",
      objectScale: 1.1,
      scrollDuration: 60,
      displayMode: "booklet",
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
    {
      slug: "the-turing-defense",
      titleKey: "designs.turing.title",
      year: "2023",
      categoryKey: "designs.category.editorial_design",
      descriptionKey: "designs.turing.description",
      type: "video",
      videoCover: "/images/designs/the-turing-defense/booklet.mp4",
      images: [
        "/images/designs/the-turing-defense/Layer 7.png",
        "/images/designs/the-turing-defense/Layer 5.png",
        "/images/designs/the-turing-defense/Layer 6.png",
        "/images/designs/the-turing-defense/Layer 8.png",
        "/images/designs/the-turing-defense/Layer 12.png",
        "/images/designs/the-turing-defense/Layer 18.png",
      ],
      color: "rgb(0, 0, 255)",
      scrollDuration: 80,
      objectScale: 2,
    },
  ];

  return (
    <PageTransition>
      <section>
        <div 
          dir={lang === "he" ? "rtl" : "ltr"}
          className="page-header-container"
        >
          <h1 className="page-title">
            {t("nav.designs")}
          </h1>
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
  const [isMobile, setIsMobile] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % project.images.length);
    }, 1500); /* Faster rotation */
    return () => clearInterval(interval);
  }, [isMobile, project.images.length]);

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

        {/* Mobile-only Title Overlay */}
        <div className="project-modal-title-overlay">
          <h2 style={{ fontSize: "1.5rem", margin: 0 }}>
            {t(project.titleKey)}
          </h2>
        </div>

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
          {project.displayMode === "booklet" && project.pdfUrl ? (
            <PDFBooklet pdfUrl={project.pdfUrl} lang={lang} t={t} />
          ) : isMobile ? (
            <div className="mobile-slideshow-container" style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
              {(() => {
                const src = project.images[currentIdx];
                const isVideo = /\.(mp4|webm|ogg)$/i.test(src);
                const commonStyle: React.CSSProperties = {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                };
                return isVideo ? (
                  <video
                    key={`${project.slug}-${currentIdx}`}
                    src={src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={commonStyle}
                  />
                ) : (
                  <img
                    key={`${project.slug}-${currentIdx}`}
                    src={src}
                    alt={`${project.slug}-${currentIdx}`}
                    style={commonStyle}
                  />
                );
              })()}
            </div>
          ) : (
            <div className="infinite-scroll-wrapper">
              <div 
                key={project.slug}
                className="infinite-scroll-track"
                style={{ 
                  animationDuration: `${project.scrollDuration || 60}s`,
                  width: "max-content",
                  willChange: "transform",
                  backfaceVisibility: "hidden"
                }}
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
                          preload="auto"
                        />
                      ) : (
                        <img 
                          src={asset} 
                          alt={`${project.slug}-${i}`} 
                          style={{ height: "100%", width: "auto", display: "block" }} 
                          loading="eager"
                          fetchPriority={i < project.images.length ? "high" : "auto"}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function PDFBooklet({ pdfUrl, lang, t }: { pdfUrl: string; lang: string; t: (k: string) => string }) {
  const paperColor = "#f8f7f4"; // Neutral off-white, less yellow
  const paperTexture = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`;

  const [pages, setPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0); 
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState(1); // 1 = next, -1 = prev
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const pageNumbers = [2, 3, 10, 11, 20, 21, 34, 35, 48, 49, 58, 59];

  useEffect(() => {
    const loadPdf = async () => {
      try {
        if (!(window as any).pdfjsLib) {
          const script = document.createElement("script");
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
          document.head.appendChild(script);
          await new Promise((resolve) => {
            script.onload = resolve;
          });
        }
        const pdfjsLib = (window as any).pdfjsLib;
        pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        const pageImages: string[] = [];
        for (const pageNum of pageNumbers) {
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          if (context) {
            await page.render({ canvasContext: context, viewport }).promise;
            pageImages.push(canvas.toDataURL("image/webp", 0.8));
          }
        }
        setPages(pageImages);
        setLoading(false);
      } catch (err) {
        console.error("Error loading PDF:", err);
        setLoading(false);
      }
    };
    loadPdf();
  }, [pdfUrl]);

  const spreadsCount = Math.ceil(pages.length / 2);

  useEffect(() => {
    if (loading || isHovered || isFlipping) return;
    const interval = setInterval(() => {
      handleFlip(1);
    }, 5000);
    return () => clearInterval(interval);
  }, [loading, isHovered, isFlipping, spreadsCount]);

  const handleFlip = (dir: number) => {
    if (isFlipping) return;
    setFlipDirection(dir);
    setIsFlipping(true);
  };

  const finalizeFlip = () => {
    setCurrentPage((p) => {
      if (flipDirection > 0) return (p + 1) % spreadsCount;
      return (p - 1 + spreadsCount) % spreadsCount;
    });
    setIsFlipping(false);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", width: "100%", color: "var(--text-color)" }}>
        <p className="text-meta">Preparing Booklet...</p>
      </div>
    );
  }

  const currentSpread = [pages[currentPage * 2], pages[currentPage * 2 + 1]];
  const nextIdx = (currentPage + 1) % spreadsCount;
  const prevIdx = (currentPage - 1 + spreadsCount) % spreadsCount;
  const targetSpread = flipDirection > 0 ? [pages[nextIdx * 2], pages[nextIdx * 2 + 1]] : [pages[prevIdx * 2], pages[prevIdx * 2 + 1]];

  return (
    <div 
      dir="ltr"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        width: "100%", 
        height: "100%", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        perspective: "2500px",
        padding: "2rem",
        backgroundColor: "#fff",
        position: "relative",
        overflow: "hidden"
      }}
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        handleFlip(e.clientX - rect.left > rect.width / 2 ? 1 : -1);
      }}
    >
      {/* Global "Printed" Overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: paperTexture,
        backgroundColor: paperColor,
        mixBlendMode: "multiply",
        pointerEvents: "none",
        zIndex: 100
      }} />

      <div style={{ 
        position: "relative", 
        width: "95%", 
        height: "90%", 
        display: "flex",
        transformStyle: "preserve-3d",
        cursor: "pointer"
      }}>
        {/* Left Side Static */}
        <div style={{ 
          flex: 1, 
          backgroundColor: "#fff",
          boxShadow: "inset -15px 0 40px rgba(0,0,0,0.1), 0 10px 30px rgba(0,0,0,0.1)",
          overflow: "hidden",
          borderRight: "1px solid rgba(0,0,0,0.05)",
          zIndex: 1,
          position: "relative"
        }}>
          <img 
            src={isFlipping && flipDirection < 0 ? targetSpread[0] : currentSpread[0]} 
            style={{ width: "100%", height: "100%", objectFit: "contain" }} 
            alt="Page Left" 
          />
        </div>

        {/* Right Side Static */}
        <div style={{ 
          flex: 1, 
          backgroundColor: "#fff",
          boxShadow: "inset 15px 0 40px rgba(0,0,0,0.1), 0 10px 30px rgba(0,0,0,0.1)",
          overflow: "hidden",
          zIndex: 1,
          position: "relative"
        }}>
          <img 
            src={isFlipping && flipDirection > 0 ? targetSpread[1] : currentSpread[1]} 
            style={{ width: "100%", height: "100%", objectFit: "contain" }} 
            alt="Page Right" 
          />
        </div>

        {/* Flipping Leaf */}
        {isFlipping && (
          <motion.div
            initial={{ rotateY: flipDirection > 0 ? 0 : -180 }}
            animate={{ rotateY: flipDirection > 0 ? -180 : 0 }}
            onAnimationComplete={finalizeFlip}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            style={{
              position: "absolute",
              top: 0,
              left: flipDirection > 0 ? "50%" : "0",
              width: "50%",
              height: "100%",
              transformStyle: "preserve-3d",
              transformOrigin: flipDirection > 0 ? "left" : "right",
              zIndex: 10
            }}
          >
            {/* Front of leaf */}
            <div style={{
              position: "absolute",
              inset: 0,
              backfaceVisibility: "hidden",
              backgroundColor: "#fff",
              boxShadow: flipDirection > 0 ? "inset 15px 0 40px rgba(0,0,0,0.1)" : "inset -15px 0 40px rgba(0,0,0,0.1)",
              overflow: "hidden"
            }}>
              <img 
                src={flipDirection > 0 ? currentSpread[1] : currentSpread[0]} 
                style={{ width: "100%", height: "100%", objectFit: "contain" }} 
                alt="Leaf Front" 
              />
            </div>
            {/* Back of leaf */}
            <div style={{
              position: "absolute",
              inset: 0,
              backfaceVisibility: "hidden",
              backgroundColor: "#fff",
              boxShadow: flipDirection > 0 ? "inset -15px 0 40px rgba(0,0,0,0.1)" : "inset 15px 0 40px rgba(0,0,0,0.1)",
              transform: "rotateY(180deg)",
              overflow: "hidden"
            }}>
              <img 
                src={flipDirection > 0 ? targetSpread[0] : targetSpread[1]} 
                style={{ width: "100%", height: "100%", objectFit: "contain" }} 
                alt="Leaf Back" 
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
