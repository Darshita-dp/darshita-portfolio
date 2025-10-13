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
  return (
    <div className="min-h-screen bg-white">
      {/* Blank page */}
    </div>
  );
}