import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, Code, Lightbulb, Target, Users } from "lucide-react";
import { useNavigate } from "react-router";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { projects } from "@/lib/projects";

export default function Story() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "200%"]);

  const storySteps = [
    {
      title: "The Beginning",
      content: "Every great developer starts with curiosity. My journey began with a simple question: How can technology solve real-world problems?",
      icon: Lightbulb,
      color: "from-yellow-400 to-orange-500"
    },
    {
      title: "Learning & Growing",
      content: "Through academic projects and real-world applications, I discovered my passion for full-stack development and systems thinking.",
      icon: Code,
      color: "from-blue-400 to-purple-500"
    },
    {
      title: "Building Solutions",
      content: "Each project became an opportunity to create meaningful impact, from accessibility-focused NGO websites to performance-optimized business solutions.",
      icon: Target,
      color: "from-green-400 to-blue-500"
    },
    {
      title: "Connecting People",
      content: "Technology is about people. Every line of code I write aims to improve user experiences and solve genuine human needs.",
      icon: Users,
      color: "from-pink-400 to-red-500"
    }
  ];

  return (
    <div ref={containerRef} className="relative">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Modes
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <motion.div
          style={{ y: backgroundY }}
          className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20"
        />
        <motion.div
          style={{ y: textY }}
          className="text-center text-white z-10"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="text-6xl md:text-8xl font-bold mb-6"
          >
            My Story
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-xl md:text-2xl text-white/80"
          >
            A journey through code, creativity, and connection
          </motion.p>
        </motion.div>
      </section>

      {/* Story Steps */}
      {storySteps.map((step, index) => (
        <section key={index} className="min-h-screen flex items-center py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className={`flex flex-col lg:flex-row items-center gap-12 ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className="flex-1">
                <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center mb-6`}>
                  <step.icon className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">{step.title}</h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {step.content}
                </p>
              </div>
              <div className="flex-1">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative"
                >
                  <div className={`aspect-square rounded-2xl bg-gradient-to-br ${step.color} opacity-20`} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <step.icon className="w-24 h-24 text-primary" />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      ))}

      {/* Projects Timeline */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16"
          >
            Project Journey
          </motion.h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-primary/20" />
            
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`flex items-center mb-16 ${
                  index % 2 === 0 ? "justify-start" : "justify-end"
                }`}
              >
                <div className={`w-full max-w-md ${index % 2 === 0 ? "mr-8" : "ml-8"}`}>
                  <Card className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                      <p className="text-muted-foreground mb-4">{project.summary}</p>
                      <div className="flex flex-wrap gap-1">
                        {project.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                {/* Timeline dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing Section */}
      <section className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            The Story Continues...
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Ready to write the next chapter together?
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate("/classic")}
          >
            Explore My Work
          </Button>
        </motion.div>
      </section>
    </div>
  );
}
