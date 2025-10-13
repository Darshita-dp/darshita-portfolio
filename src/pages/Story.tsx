import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";
import { useNavigate } from "react-router";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

type PageState = "cover" | number;

const storyPages = [
  {
    title: "Once Upon a Time...",
    content: "In a land where sunflowers danced with the wind and stars whispered secrets to dreamers, there lived a curious girl named Darshita. From her earliest days, she saw the world not as it was, but as it could be—a canvas of endless possibilities, where imagination painted reality in hues of wonder and hope."
  },
  {
    title: "The Garden of Solitude",
    content: "In the quiet embrace of her grandparents' home, surrounded by gentle wisdom and unconditional love, Darshita discovered the beauty of stillness. Here, in this garden of solitude, she nurtured her creative spirit—drawing worlds on paper, weaving stories in her mind, and finding strength in the gentle rhythm of peaceful days."
  },
  {
    title: "The Curious Princess",
    content: "As she grew, so did her wonder for the magic hidden in technology. She saw in every line of code a spell waiting to be cast, in every algorithm a puzzle yearning to be solved. With the heart of an artist and the mind of a scholar, she embarked on a quest to master the language of machines and the poetry of data."
  },
  {
    title: "Crossing Oceans",
    content: "One day, guided by courage and dreams that stretched beyond horizons, she crossed vast oceans to reach a new land. Leaving behind the familiar warmth of home, she ventured into the unknown—carrying with her the love of her family, the lessons of her past, and a heart full of hope for the adventures that awaited."
  },
  {
    title: "The Kingdom of Knowledge",
    content: "In the hallowed halls of Illinois State University, she found her kingdom of knowledge. As a Graduate Teaching Assistant, she shared her wisdom with 150 eager minds, guiding them through the mysteries of technology. With a perfect 4.0 GPA, she proved that dedication and passion could turn dreams into reality."
  },
  {
    title: "The Heart of Kindness",
    content: "But her journey was never just about herself. At CIIWAS NGO, she used her gifts to empower 100+ women, building bridges of opportunity through technology. Her heart, as vast as her ambition, found joy in lifting others—transforming data into hope, and code into compassion."
  },
  {
    title: "The Circle of Friendship",
    content: "Along her path, she gathered treasures more precious than gold—friendships that sparkled like stars, mentors who illuminated her way, and moments of pure joy that made her heart sing. In laughter shared and challenges overcome together, she discovered that the greatest magic lies in human connection."
  },
  {
    title: "The Dream Blooms",
    content: "With each passing season, her dreams grew like sunflowers reaching toward the sun. She learned that growth comes not from perfection, but from persistence; not from avoiding failure, but from rising each time she fell. Her vision expanded, her skills deepened, and her spirit soared ever higher."
  },
  {
    title: "A Bright and Happy Future",
    content: "And so, dear reader, this tale continues to unfold—each day a new page, each challenge a new chapter. The story of Darshita is far from over. It's a story of sunflowers and stars, of courage and kindness, of dreams that refuse to dim. To be continued... with a bright and happy future 🌻"
  }
];

export default function Story() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<PageState>("cover");
  const [isMuted, setIsMuted] = useState(true);
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  const openBook = () => {
    setIsBookOpen(true);
    setCurrentPage(0);
  };

  const nextPage = () => {
    if (typeof currentPage === "number" && currentPage < storyPages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (typeof currentPage === "number" && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else if (currentPage === 0) {
      setCurrentPage("cover");
      setIsBookOpen(false);
    }
  };

  const nextPageWithDirection = () => {
    setDirection('next');
    nextPage();
  };

  const prevPageWithDirection = () => {
    setDirection('prev');
    prevPage();
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200">
      {/* Floating Particles Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`petal-${i}`}
            className="absolute text-2xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10%`,
              filter: "drop-shadow(0 0 3px rgba(255, 192, 203, 0.6))",
            }}
            animate={{
              y: ["0vh", "110vh"],
              x: [0, Math.random() * 50 - 25],
              rotate: [0, 360],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          >
            🌸
          </motion.div>
        ))}
        {/* Glowing Particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`glow-particle-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: "0 0 8px rgba(255,255,255,0.8), 0 0 12px rgba(255,215,0,0.5)",
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-pink-100/70 via-yellow-50/70 to-blue-100/70 backdrop-blur-md border-b border-pink-300/40 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:bg-pink-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Modes
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
            className="hover:bg-pink-100"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center pt-16 pb-8 px-4">
        <AnimatePresence mode="wait">
          {currentPage === "cover" && !isBookOpen && (
            <motion.div
              key="cover"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2, rotateY: -90 }}
              transition={{ duration: 0.8 }}
              onClick={openBook}
              className="relative cursor-pointer group"
            >
              {/* Book Cover */}
              <div className="relative w-[80vw] max-w-sm aspect-[2/3] rounded-2xl shadow-2xl overflow-hidden"
                style={{
                  backgroundImage: "url('https://harmless-tapir-303.convex.cloud/api/storage/22a08587-dd5c-4b71-9f6e-4f377f58745b')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 15px 30px -10px rgba(0, 0, 0, 0.4), 0 5px 15px rgba(255, 215, 0, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.2)",
                  transform: "perspective(1200px) rotateY(-5deg) rotateX(5deg) translateZ(20px)",
                  transformStyle: "preserve-3d",
                }}>
                {/* Sunlight Glow from Top-Left */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-yellow-100/60 via-transparent to-transparent"
                  style={{
                    mixBlendMode: "overlay",
                  }}
                  animate={{
                    opacity: [0.4, 0.7, 0.4],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Soft Vignette */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: "radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.15) 100%)",
                  }}
                />

                {/* Diagonal Shine Animation */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-transparent via-white/30 to-transparent"
                  style={{
                    transform: "translateX(-100%) translateY(-100%) rotate(45deg)",
                    width: "200%",
                    height: "200%",
                  }}
                  animate={{
                    transform: [
                      "translateX(-100%) translateY(-100%) rotate(45deg)",
                      "translateX(100%) translateY(100%) rotate(45deg)",
                    ],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />

                {/* Enhanced Glow Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-yellow-200/40 to-pink-200/40"
                  animate={{
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                  }}
                />

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-start pt-8 p-8 text-center">
                  {/* Title */}
                  <motion.h1
                    className="text-3xl md:text-4xl font-serif mb-8"
                    style={{
                      fontFamily: "'Great Vibes', 'Gwendolyn', cursive",
                      color: "#8B6914",
                      textShadow: "2px 2px 6px rgba(0,0,0,0.6), 0 0 10px rgba(139,105,20,0.4)",
                    }}
                    animate={{
                      textShadow: [
                        "2px 2px 6px rgba(0,0,0,0.6), 0 0 10px rgba(139,105,20,0.4)",
                        "2px 2px 8px rgba(0,0,0,0.7), 0 0 15px rgba(139,105,20,0.6)",
                        "2px 2px 6px rgba(0,0,0,0.6), 0 0 10px rgba(139,105,20,0.4)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    The Story of Darshita
                    <br />
                    <span className="text-2xl md:text-3xl">
                      A Tale of Sunflowers and Stars
                    </span>
                  </motion.h1>
                </div>

                {/* Sparkles around cover */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={`cover-sparkle-${i}`}
                    className="absolute w-3 h-3 bg-yellow-400 rounded-full"
                    style={{
                      left: `${10 + (i % 4) * 25}%`,
                      top: `${10 + Math.floor(i / 4) * 70}%`,
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>

              {/* Click Prompt - Below Cover */}
              <motion.p
                className="text-sm md:text-base text-gray-700 font-medium mt-6"
                style={{
                  fontFamily: "'Great Vibes', 'Gwendolyn', cursive",
                }}
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ✨ Tap to open your story…
              </motion.p>
            </motion.div>
          )}

          {typeof currentPage === "number" && (
            <div className="relative" style={{ perspective: "2000px" }}>
              {/* Stacked Pages Effect - Show underlying pages */}
              {[...Array(storyPages.length - currentPage - 1)].map((_, i) => (
                <div
                  key={`stack-${i}`}
                  className="absolute w-[80vw] max-w-sm aspect-[2/3] rounded-2xl"
                  style={{
                    top: `${(i + 1) * 3}px`,
                    left: "50%",
                    transform: `translateX(-50%) scale(${1 - (i + 1) * 0.02})`,
                    zIndex: -(i + 1),
                    boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                    backgroundImage: "url('https://harmless-tapir-303.convex.cloud/api/storage/0e364737-765e-4e00-8ec0-4e75836671b3')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: 0.6,
                  }}
                />
              ))}

              {/* Current Page with Flip Animation */}
              <motion.div
                key={`page-${currentPage}`}
                initial={{ 
                  opacity: 0, 
                  rotateY: direction === 'next' ? 0 : -90,
                  scale: direction === 'next' ? 1.2 : 1,
                  transformOrigin: direction === 'next' ? "left center" : "right center" 
                }}
                animate={{ 
                  opacity: 1, 
                  rotateY: 0,
                  scale: 1,
                  transformOrigin: direction === 'next' ? "left center" : "right center" 
                }}
                exit={{ 
                  opacity: 0, 
                  rotateY: direction === 'next' ? -90 : 90,
                  scale: direction === 'next' ? 1 : 1,
                  transformOrigin: direction === 'next' ? "left center" : "right center" 
                }}
                transition={{ 
                  duration: 0.8,
                  ease: [0.43, 0.13, 0.23, 0.96]
                }}
                className="relative w-[80vw] max-w-sm aspect-[2/3] mx-auto"
                style={{
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                }}
              >
                {/* Book Page with Vintage Background */}
                <div 
                  className="relative w-full h-full rounded-2xl shadow-2xl overflow-hidden"
                  style={{
                    backgroundImage: "url('https://harmless-tapir-303.convex.cloud/api/storage/0e364737-765e-4e00-8ec0-4e75836671b3')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.3), 0 10px 20px rgba(0,0,0,0.2)",
                  }}
                >
                  {/* Semi-transparent overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-amber-50/30 to-pink-50/40" />

                  {/* Page Content */}
                  <div className="relative z-10 h-full flex flex-col p-6 md:p-8">
                    <motion.h2
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-xl md:text-2xl font-serif mb-4 text-center"
                      style={{
                        fontFamily: "'Cinzel Decorative', 'Great Vibes', serif",
                        color: "#5D4037",
                        textShadow: "1px 1px 2px rgba(255,255,255,0.8), 0 0 4px rgba(255,255,255,0.5)",
                      }}
                    >
                      {storyPages[currentPage].title}
                    </motion.h2>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-yellow-100"
                    >
                      <p
                        className="text-sm md:text-base leading-relaxed font-serif"
                        style={{
                          fontFamily: "'Crimson Text', 'Georgia', serif",
                          textAlign: "justify",
                          color: "#4E342E",
                          textShadow: "0.5px 0.5px 1px rgba(255,255,255,0.7)",
                        }}
                      >
                        {storyPages[currentPage].content}
                      </p>
                    </motion.div>

                    {/* Page Number */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="text-xs text-center mt-4"
                      style={{
                        fontFamily: "'Crimson Text', 'Georgia', serif",
                        color: "#6D4C41",
                        textShadow: "0.5px 0.5px 1px rgba(255,255,255,0.6)",
                      }}
                    >
                      {currentPage + 1} / {storyPages.length}
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Navigation Buttons - Below the page stack */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex justify-between items-center mt-6 w-[80vw] max-w-sm mx-auto"
              >
                <Button
                  onClick={prevPageWithDirection}
                  variant="outline"
                  size="sm"
                  className="bg-amber-50/80 hover:bg-amber-100 border-amber-600 backdrop-blur-sm"
                >
                  ← Previous
                </Button>
                {currentPage < storyPages.length - 1 && (
                  <Button
                    onClick={nextPageWithDirection}
                    variant="outline"
                    size="sm"
                    className="bg-amber-50/80 hover:bg-amber-100 border-amber-600 backdrop-blur-sm"
                  >
                    Next →
                  </Button>
                )}
                {currentPage === storyPages.length - 1 && (
                  <Button
                    onClick={() => navigate("/")}
                    size="sm"
                    className="bg-gradient-to-r from-pink-400 to-yellow-400 hover:from-pink-500 hover:to-yellow-500 text-white"
                  >
                    Return Home 🌻
                  </Button>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Bookmark Return Button */}
      {isBookOpen && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed top-20 right-4 z-50"
        >
          <Button
            onClick={() => navigate("/")}
            className="bg-gradient-to-b from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 text-white shadow-lg rounded-t-lg rounded-b-sm px-3 py-6 text-xs"
            style={{
              writingMode: "vertical-rl",
            }}
          >
            📖 Menu
          </Button>
        </motion.div>
      )}
    </div>
  );
}