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

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-pink-100 via-yellow-50 to-blue-100">
      {/* Floating Particles Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute w-2 h-2 bg-yellow-300 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`petal-${i}`}
            className="absolute text-2xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10%`,
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
              ease: "linear",
            }}
          >
            🌸
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-md border-b border-pink-200">
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
              <div className="relative w-[90vw] max-w-md aspect-[3/4] bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200 rounded-2xl shadow-2xl border-4 border-yellow-300 overflow-hidden">
                {/* Glow Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-yellow-200/50 to-pink-200/50"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center">
                  {/* Title */}
                  <motion.h1
                    className="text-3xl md:text-4xl font-serif mb-8"
                    style={{
                      fontFamily: "'Great Vibes', 'Gwendolyn', cursive",
                      color: "#D4AF37",
                      textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                    }}
                    animate={{
                      textShadow: [
                        "2px 2px 4px rgba(0,0,0,0.3)",
                        "2px 2px 8px rgba(212,175,55,0.6)",
                        "2px 2px 4px rgba(0,0,0,0.3)",
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

                  {/* Illustration Placeholder */}
                  <motion.div
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-pink-300 to-yellow-200 flex items-center justify-center text-6xl mb-6 shadow-lg"
                    animate={{
                      boxShadow: [
                        "0 10px 30px rgba(255,192,203,0.4)",
                        "0 10px 40px rgba(255,215,0,0.6)",
                        "0 10px 30px rgba(255,192,203,0.4)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🌻
                  </motion.div>

                  {/* Click Prompt */}
                  <motion.p
                    className="text-sm md:text-base text-gray-700 font-medium"
                    animate={{
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Click to open the book ✨
                  </motion.p>
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
            </motion.div>
          )}

          {typeof currentPage === "number" && (
            <motion.div
              key={`page-${currentPage}`}
              initial={{ opacity: 0, rotateY: -90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: 90 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-3xl"
            >
              {/* Book Page */}
              <div className="relative bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl shadow-2xl border-4 border-yellow-600 p-8 md:p-12 min-h-[60vh]">
                {/* Decorative Border */}
                <div className="absolute inset-4 border-2 border-yellow-400/30 rounded-xl pointer-events-none" />

                {/* Page Content */}
                <div className="relative z-10">
                  <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl md:text-4xl font-serif mb-6 text-center"
                    style={{
                      fontFamily: "'Cinzel Decorative', 'Great Vibes', serif",
                      color: "#8B4513",
                    }}
                  >
                    {storyPages[currentPage].title}
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-lg md:text-xl leading-relaxed text-gray-800 font-serif"
                    style={{
                      fontFamily: "'Crimson Text', 'Georgia', serif",
                      textAlign: "justify",
                    }}
                  >
                    {storyPages[currentPage].content}
                  </motion.p>

                  {/* Page Number */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="absolute bottom-4 right-4 text-sm text-gray-500 font-serif"
                  >
                    {currentPage + 1} / {storyPages.length}
                  </motion.div>
                </div>

                {/* Navigation Buttons */}
                <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center">
                  <Button
                    onClick={prevPage}
                    variant="outline"
                    className="bg-yellow-100 hover:bg-yellow-200 border-yellow-600"
                  >
                    ← Previous
                  </Button>
                  {currentPage < storyPages.length - 1 && (
                    <Button
                      onClick={nextPage}
                      variant="outline"
                      className="bg-yellow-100 hover:bg-yellow-200 border-yellow-600"
                    >
                      Next →
                    </Button>
                  )}
                  {currentPage === storyPages.length - 1 && (
                    <Button
                      onClick={() => navigate("/")}
                      className="bg-gradient-to-r from-pink-400 to-yellow-400 hover:from-pink-500 hover:to-yellow-500 text-white"
                    >
                      Return Home 🌻
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
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