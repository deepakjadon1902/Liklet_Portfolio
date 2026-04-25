"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, Globe, Database, ArrowRight, X, ExternalLink, CheckCircle } from "lucide-react";

interface Project {
  id: number;
  title: string;
  client: string;
  description: string;
  fullDescription: string;
  image: string;
  technologies: string[];
  results: string[];
  link?: string;
}

interface ProjectCardStackProps {
  projects: Project[];
}

const positionStyles = [
  { scale: 1, y: 0, rotateY: 0, zIndex: 10 },
  { scale: 0.95, y: -40, rotateY: 2, zIndex: 9 },
  { scale: 0.9, y: -80, rotateY: 4, zIndex: 8 },
  { scale: 0.85, y: -120, rotateY: 6, zIndex: 7 },
  { scale: 0.8, y: -160, rotateY: 8, zIndex: 6 },
];

export default function ProjectCardStack({ projects }: ProjectCardStackProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [cardOrder, setCardOrder] = useState(projects.map((_, i) => i));

  const handleCardClick = (index: number) => {
    const projectIndex = cardOrder[index];
    setSelectedProject(projects[projectIndex]);
  };

  const handleCycleCards = () => {
    setCardOrder((prev) => {
      const newOrder = [...prev];
      const first = newOrder.shift();
      if (first !== undefined) newOrder.push(first);
      return newOrder;
    });
  };

  const getIcon = (index: number) => {
    const icons = [Globe, Code, Database];
    const Icon = icons[index % icons.length];
    return Icon;
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div 
          className="relative h-[500px] w-full max-w-lg mx-auto"
          style={{ perspective: "1500px" }}
        >
          <AnimatePresence mode="popLayout">
            {cardOrder.slice(0, 5).map((projectIndex, stackIndex) => {
              const project = projects[projectIndex];
              const style = positionStyles[stackIndex] || positionStyles[4];
              const Icon = getIcon(projectIndex);

              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ 
                    opacity: 0, 
                    y: 100,
                    rotateX: 20,
                  }}
                  animate={{ 
                    opacity: stackIndex < 4 ? 1 : 0.5,
                    y: style.y,
                    scale: style.scale,
                    rotateY: style.rotateY,
                    zIndex: style.zIndex,
                  }}
                  exit={{ 
                    opacity: 0,
                    y: 200,
                    scale: 0.8,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 25,
                  }}
                  onClick={() => handleCardClick(stackIndex)}
                  className="absolute left-1/2 bottom-0 w-[90%] max-w-md cursor-pointer"
                  style={{
                    transformStyle: "preserve-3d",
                    transformOrigin: "center bottom",
                    x: "-50%",
                  }}
                >
                  <div 
                    className="relative rounded-2xl overflow-hidden border border-border bg-card shadow-2xl"
                    style={{
                      boxShadow: stackIndex === 0 
                        ? "0 25px 60px -15px hsl(210 100% 45% / 0.3), 0 10px 20px -10px rgba(0,0,0,0.2)"
                        : "0 10px 30px -10px rgba(0,0,0,0.3)",
                    }}
                  >
                    {/* Card Header with Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                      
                      {/* Floating Icon */}
                      <motion.div
                        className="absolute top-4 right-4 w-12 h-12 rounded-xl bg-accent/90 backdrop-blur-sm flex items-center justify-center"
                        animate={{
                          y: [0, -5, 0],
                          rotateZ: [0, 5, -5, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        style={{
                          boxShadow: "0 10px 30px -10px hsl(210 100% 45% / 0.5)",
                        }}
                      >
                        <Icon className="w-6 h-6 text-accent-foreground" />
                      </motion.div>

                      {/* Stack indicator */}
                      {stackIndex === 0 && (
                        <motion.div
                          className="absolute top-4 left-4 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium"
                          animate={{
                            scale: [1, 1.05, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                        >
                          Click to view
                        </motion.div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <span className="text-accent text-sm font-medium">{project.client}</span>
                      <h3 className="font-display text-xl font-bold text-foreground mt-1 mb-2">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {project.description}
                      </p>

                      {/* Technologies */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 3D Edge Effect */}
                    <div 
                      className="absolute inset-0 pointer-events-none rounded-2xl"
                      style={{
                        background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)",
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Cycle Button */}
        <motion.button
          onClick={handleCycleCards}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-secondary-foreground font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          Next Project
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.9, rotateX: -10 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-card rounded-3xl shadow-2xl border border-border"
              style={{
                perspective: "1000px",
                boxShadow: "0 50px 100px -20px hsl(215 50% 23% / 0.3)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Project Image */}
              <div className="relative h-64 md:h-80 overflow-hidden">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
              </div>

              {/* Project Details */}
              <div className="p-8 -mt-20 relative">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <span className="inline-block px-4 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
                    {selectedProject.client}
                  </span>
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3">
                    {selectedProject.title}
                  </h2>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-muted-foreground mt-4 text-lg"
                >
                  {selectedProject.fullDescription}
                </motion.p>

                {/* Technologies */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6"
                >
                  <h3 className="font-semibold text-foreground mb-3">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech, index) => (
                      <motion.span
                        key={tech}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-medium"
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

                {/* Results */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-6"
                >
                  <h3 className="font-semibold text-foreground mb-3">Key Results</h3>
                  <ul className="space-y-3">
                    {selectedProject.results.map((result, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex items-center gap-3 text-foreground"
                      >
                        <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                        {result}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 flex flex-wrap gap-4"
                >
                  {selectedProject.link && (
                    <a
                      href={selectedProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-accent"
                    >
                      View Live Project
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  )}
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="px-6 py-3 rounded-lg border border-border hover:bg-secondary transition-colors font-medium"
                  >
                    Close
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
