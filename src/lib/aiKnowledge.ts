// Shared knowledge base for AI chat
export type QA = { q: string; a: string; keywords: string[] };

export const KNOWLEDGE: Array<QA> = [
  {
    q: "Greeting - Hi/Hey/Hello",
    a: "Heya 🌼 I'm here, fully charged and ready to chat!",
    keywords: ["hi", "hey", "hello", "greetings", "sup", "yo"],
  },
  {
    q: "How are you?",
    a: "Running at 99% positivity and 1% curiosity 🌸 How about you?",
    keywords: ["how are you", "how's it going", "what's up", "how do you do", "how are things"],
  },
  {
    q: "What's your name?",
    a: "I'm Darshita's bot 🌼 still learning her vibes one line at a time!",
    keywords: ["what's your name", "who are you", "your name", "what do i call you", "what should i call you"],
  },
  {
    q: "User acknowledgment - Okay/Good/Fine",
    a: "Awesome! I'm all ears for your next query 🎧✨",
    keywords: ["okay", "ok", "good", "fine", "i am fine", "i'm fine", "i'm good", "i am good", "alright", "cool", "nice"],
  },
  {
    q: "Introduction & Overview",
    a: "Hi! I'm Darshita Patel, a graduate student at Illinois State University with a 4.0 GPA in Information Systems. I'm passionate about data analytics, full-stack development, and building user-friendly applications. I've worked as a Graduate Teaching Assistant, completed internships at GMP MachPro and NGOs, and built projects like SmartPlanner (iOS app) and AI-driven analytics dashboards. I'm currently preparing for AWS and Tableau certifications while seeking opportunities as a Data Analyst or Systems Analyst. Outside of tech, I enjoy cooking, playing piano, badminton, and photography!",
    keywords: ["introduce", "introduction", "about you", "about yourself", "tell me about", "overview", "summary", "yourself", "background"],
  },
  {
    q: "Master's Degree",
    a: "I completed my Master of Science in Information Systems at Illinois State University with a 4.0/4.0 GPA. Courses included: Advanced System Analysis & Design, IT Project Management, Web Development Technologies, Advanced Web Application Development, Mobile & Cloud Computing, Database Processing, Advanced Database Management, Practical Cryptography & Trusted Systems, Advanced Software Engineering, Systems Analysis & Design, Information Technology Strategy & Policy, Professional Practice in IT, Research Methodology, Information Assurance & Security, Writing for Graduate Students, C++ Programming, Information Technology Capstone.",
    keywords: ["master's degree", "ms degree", "information systems degree", "isu degree", "gpa", "courses", "graduate school", "illinois state university", "4.0", "coursework", "what did you study"],
  },
  {
    q: "Why Master's in Information Systems?",
    a: "I chose a Master's in Information Systems because it connects both sides of me — the tech thinker and the problem solver. In my undergrad, I studied Computer Applications, and I loved programming, but I also wanted to understand how technology supports business decisions and real-world operations. Information Systems felt like the perfect bridge — it gave me both the technical skills and the analytical mindset to design, manage, and improve systems that people actually use. It's not just about coding; it's about creating solutions that make work smarter and more efficient.",
    keywords: ["why master's", "why information systems", "motivation", "why did you choose", "what motivated", "why pursue", "reason for master's"],
  },
  {
    q: "Why Illinois State University?",
    a: "I chose Illinois State University because of its balance between technical depth and practical learning. When I saw courses like Advanced Systems Analysis and Design and IT Project Management, I immediately felt they matched my goals. But beyond academics, ISU has a very supportive environment — professors are approachable, and I've had great opportunities like being a Teaching Assistant and working on real projects with teams. ISU gave me the confidence and exposure I needed to grow as both a learner and a professional.",
    keywords: ["why isu", "why illinois state university", "why illinois state", "why choose isu", "why did you choose illinois state university", "why did you choose isu", "chose illinois state university", "reason for isu", "why this university"],
  },
  {
    q: "How I Got Interested in Tech & Data",
    a: "My interest started back in school when I took Computer Science in 11th grade. The first time I ran a small C++ program and saw it work, I was amazed — it felt like magic. That curiosity never left me. As I learned more, I got interested in how data helps us make smarter decisions. I realized that behind every project or product, there's data guiding the way. Over time, I found my comfort zone in analyzing, visualizing, and finding patterns — that's when I knew data was my field.",
    keywords: ["how did you get interested", "interest in tech", "interest in data", "why tech", "how started", "origin story", "first program"],
  },
  {
    q: "Proudest Achievement",
    a: "My proudest achievement is completing my Master's with a 4.0 GPA while also working as a Teaching Assistant. It was challenging to balance coursework, labs, and mentoring more than 150 students each semester — but I managed through good planning and time management. I'm proud not just of the grades, but of how I grew — helping others learn while improving my own technical and communication skills. It showed me that with discipline and passion, I can handle multiple responsibilities successfully.",
    keywords: ["proudest achievement", "proud of", "biggest accomplishment", "what are you proud of", "greatest achievement"],
  },
  {
    q: "Why Data Analyst?",
    a: "I want to be a Data Analyst because it brings together everything I enjoy — problem-solving, technology, and storytelling. I love finding insights hidden inside data and turning them into something meaningful for decision-making. I've worked with tools like Excel, Power BI, and SQL, and I really enjoy the process of cleaning, analyzing, and visualizing data to tell a clear story. It's a field where I can keep learning new tools and also make an impact — and that combination keeps me motivated.",
    keywords: ["why data analyst", "why analyst", "career choice", "why this role", "motivation for data", "want to be", "data analyst role"],
  },
  {
    q: "Challenges Overcome",
    a: "Moving from India to the U.S. for my master's was a big challenge for me. Everything was new — the culture, the education system, even the food! In the beginning, I struggled with homesickness and adapting to the pace here. But I slowly built a routine, took part-time work, handled my studies, and learned how to stay independent. That experience taught me resilience — now I feel confident that I can adjust to any environment and still give my best.",
    keywords: ["challenges", "overcome", "difficulty", "struggle", "resilience", "moving to us", "adaptation"],
  },
  {
    q: "Bachelor's Degree",
    a: "I completed my Bachelor of Computer Applications (Hons.) from Devi Ahilya Vishwavidyalaya in India with a GPA of 3.5/4.0. Courses included: Fundamentals of Programming in C, Object-Oriented Programming in C++, Core Java Programming, Data Structures & Algorithms, Digital Electronics & Computer Organization, Microprocessor & Assembly Language, Database Management Systems, Internet & Web Programming, Human-Computer Interaction, System Analysis & Design, System Programming, Computer Graphics, UNIX Operating System, Probability & Statistics, Organizational Behavior, Communication Skills & French Language, Final Year Project.",
    keywords: ["bachelor's", "undergrad", "bca", "devi ahilya", "india", "gpa", "computer applications", "courses", "subjects", "3.5", "vishwavidyalaya"],
  },
  {
    q: "Graduate Teaching Assistant",
    a: "As a Graduate Teaching Assistant at ISU, I taught IT-150 labs covering the full MS Office Suite — Word, Excel, Access, and PowerPoint — to around 150 students per semester for 2 semesters. I also graded assignments, guided projects, and provided one-on-one support.",
    keywords: ["gta", "teaching", "ta", "assistant", "professor", "ms office", "word", "excel", "access", "powerpoint", "students", "it-150", "labs", "grading"],
  },
  {
    q: "Awards",
    a: "I received a Graduate Teaching Assistantship and was honored with the Outstanding Graduate Student Award at Illinois State University.",
    keywords: ["award", "scholarship", "recognition", "outstanding", "graduate", "achievement", "teaching assistantship", "honors"],
  },
  {
    q: "Research Work",
    a: "I presented a research poster on how Artificial Intelligence is applied in the banking sector at a university symposium.",
    keywords: ["research", "symposium", "ai", "banking", "poster", "project", "artificial intelligence", "presentation"],
  },
  {
    q: "NGO Internships",
    a: "I worked with NGOs including CIIWAS and ORANGES, building accessible websites and dashboards that supported community projects and increased engagement.",
    keywords: ["ngo", "ciiwas", "oranges", "web development", "accessibility", "dashboards", "impact"],
  },
  {
    q: "GMP MachPro Internship",
    a: "During my Data Analyst Internship at GMP MachPro, I built Power BI dashboards to track daily production and quality metrics. These visualizations reduced manual reporting time by 30% and improved team decision-making.",
    keywords: ["gmp", "internship", "machpro", "data analyst", "dashboard", "metrics", "power bi", "production", "quality"],
  },
  {
    q: "Internship Impact Summary",
    a: "Across all my internships, I improved data accuracy by 25%, reduced reporting effort by 30%, and helped teams visualize trends more clearly through automated dashboards.",
    keywords: ["achievements", "metrics", "improvement", "experience", "impact", "results", "quantifiable"],
  },
  {
    q: "Certifications",
    a: "I've earned a Systems Analyst Certificate and I'm currently preparing for AWS Cloud Practitioner and Tableau Desktop Specialist certifications.",
    keywords: ["certifications", "certificate", "aws", "tableau", "systems analyst", "credentials"],
  },
  {
    q: "Learning Goals",
    a: "I plan to strengthen my skills in Snowflake, SQL optimization, and advanced Power BI DAX in the coming months.",
    keywords: ["learning goals", "upskilling", "future skills", "professional development", "growth"],
  },
  {
    q: "Technical skills",
    a: "I'm comfortable with C, C++, Java, Python, Swift/SwiftUI, JavaScript/TypeScript, React, PHP/MySQL, and data tools. I love building full‑stack and mobile experiences.",
    keywords: ["skills", "technical skills", "programming languages", "what languages", "c", "c++", "java", "python", "swift", "swiftui", "react", "php", "mysql", "javascript", "typescript", "data tools"],
  },
  {
    q: "Tableau Experience",
    a: "I designed multiple dashboards in Tableau, using calculated fields, filters, and stories to visualize trends clearly for non-technical users.",
    keywords: ["tableau", "dashboard", "visualization", "calculated fields", "stories"],
  },
  {
    q: "Power BI Experience",
    a: "In Power BI, I built KPI dashboards with DAX formulas to automate monthly reports and visualize performance insights efficiently.",
    keywords: ["power bi", "dax", "dashboard", "kpi", "reports", "automation"],
  },
  {
    q: "Snowflake Learning",
    a: "I'm learning Snowflake to manage and analyze large-scale datasets and improve my understanding of modern cloud data architecture.",
    keywords: ["snowflake", "cloud data warehouse", "sql", "cloud", "data architecture"],
  },
  {
    q: "Excel Expertise",
    a: "I've built interactive Excel dashboards using PivotTables, charts, and data cleaning formulas to make raw data easier to interpret.",
    keywords: ["excel", "pivot table", "data cleaning", "formulas", "spreadsheet"],
  },
  {
    q: "SmartPlanner iOS app",
    a: "SmartPlanner is an iOS app built with SwiftUI, Core Data, and MVVM—focused on planning and productivity with a clean mobile UX.",
    keywords: ["smartplanner", "ios", "swiftui", "core data", "mvvm", "mobile"],
  },
  {
    q: "Film-Fusion website",
    a: "Film-Fusion is a web project (movie-focused) demonstrating full-stack concepts like routing, search, and structured UI.",
    keywords: ["film-fusion", "film", "movie", "website", "web project"],
  },
  {
    q: "Course Manager app",
    a: "Course Manager is a project for organizing and tracking courses, assignments, and progress—emphasizing reliability and UX clarity.",
    keywords: ["course manager", "courses", "assignments", "tracking"],
  },
  {
    q: "Courtside Leadership capstone",
    a: "Courtside Leadership was a capstone-style WordPress build with custom IA, plugins, and SEO improvements to boost performance and engagement.",
    keywords: ["courtside leadership", "wordpress", "seo", "capstone", "performance"],
  },
  {
    q: "AI-Driven Predictive Analytics Project",
    a: "I built a predictive model that analyzed business process trends and achieved 87% prediction accuracy, helping the team identify improvement areas proactively.",
    keywords: ["ai", "predictive analytics", "data science", "model", "accuracy", "machine learning", "87%"],
  },
  {
    q: "IT Services Optimization Project",
    a: "As part of the Managed IT Services RFP project, my team proposed a new vendor system that targeted 99.9% uptime and a 30% reduction in ticket resolution time.",
    keywords: ["it services", "optimization", "rfp", "project management", "uptime", "vendor"],
  },
  {
    q: "Retail Analytics – Candle Business",
    a: "I designed Power BI dashboards to visualize sales trends for a local candle business, identifying underperforming product lines and increasing forecast accuracy by 20%.",
    keywords: ["retail analytics", "candle business", "sales", "local", "power bi", "forecast", "trends"],
  },
  {
    q: "MovieLens Data Analysis",
    a: "Using the MovieLens dataset, I analyzed user behavior and built visualizations that revealed patterns in genre preferences and rating trends.",
    keywords: ["movielens", "data analytics", "visualization", "recommendation", "user behavior", "genre"],
  },
  {
    q: "Personal interests",
    a: "I love creative design, photography, and building playful/gamified UIs. Also: I'm a twin—so collaboration is in my DNA!",
    keywords: ["interests", "creative", "design", "photography", "twin", "gamified", "ui"],
  },
  {
    q: "Hobbies & Creative Interests",
    a: "I love drawing, cooking, playing piano, watching anime, doing photography, and playing badminton. These hobbies keep me creative, calm, and balanced outside of tech life.",
    keywords: ["hobby", "hobbies", "drawing", "cooking", "piano", "anime", "photography", "badminton", "sports", "art", "music", "free time"],
  },
  {
    q: "Cooking Hobby",
    a: "I enjoy cooking daily. Being vegetarian, I love experimenting with healthy recipes and traditional dishes.",
    keywords: ["cooking", "vegetarian", "food", "meals"],
  },
  {
    q: "Piano Practice",
    a: "I've been learning piano as a way to relax — it helps me focus and refresh after long coding sessions.",
    keywords: ["piano", "music", "instrument", "hobby"],
  },
  {
    q: "Badminton Love",
    a: "I love playing badminton. It's my go-to game for both fitness and fun with friends.",
    keywords: ["badminton", "sports", "hobby", "game"],
  },
  {
    q: "Jira & Confluence",
    a: "I use Jira for sprint planning and Confluence for documentation. They help keep teamwork transparent and organized.",
    keywords: ["jira", "confluence", "agile", "sprint", "documentation"],
  },
  {
    q: "Docker Basics",
    a: "I've learned Docker basics to containerize small applications and maintain consistent development environments.",
    keywords: ["docker", "container", "devops", "environment"],
  },
  {
    q: "Figma",
    a: "I use Figma to design UI layouts and interactive prototypes before starting front-end development.",
    keywords: ["figma", "ui design", "prototype", "wireframe"],
  },
  {
    q: "Recent Achievement",
    a: "Recently, I was recognized as the Outstanding Graduate Student and completed several portfolio enhancements, including my AI chat system and SmartPlanner app.",
    keywords: ["achievement", "award", "recognition", "recent"],
  },
  {
    q: "Leadership in Projects",
    a: "I led a 4-member team for a university project, organizing weekly stand-ups, assigning Jira tasks, and ensuring delivery ahead of schedule.",
    keywords: ["leadership", "teamwork", "collaboration", "coordination", "jira", "team lead"],
  },
  {
    q: "Problem Solving Example",
    a: "In one project, when an API integration kept failing, I analyzed the JSON structure, debugged the endpoint, and implemented caching that cut load time by 40%.",
    keywords: ["problem solving", "challenge", "issue resolution", "debugging", "api", "optimization"],
  },
  {
    q: "Short-Term Career Goal",
    a: "My short-term goal is to begin as a Data Analyst or Systems Analyst, gaining real-world experience in data visualization, requirement analysis, and reporting automation.",
    keywords: ["short term goal", "entry level", "first role", "career start", "data analyst", "systems analyst"],
  },
  {
    q: "Long-Term Vision",
    a: "In the long run, I want to become a Data Strategist or Research Lead, combining analytics, AI, and creativity to design smart, ethical systems.",
    keywords: ["long term", "future", "goal", "vision", "data strategist", "research lead", "career path"],
  },
  {
    q: "What are your strengths?",
    a: "I'd say my top strengths are adaptability, communication, and problem-solving. As an international student balancing studies, work, and projects, I've learned to adjust quickly to new environments. I also communicate well — whether teaching as a Graduate Assistant or collaborating in team projects. And when problems come up, I like to stay calm and think logically to find the root cause.",
    keywords: ["strengths", "strong points", "what are you good at", "adaptability", "communication", "problem solving"],
  },
  {
    q: "What is one area you're working to improve?",
    a: "One area I'm improving is public speaking. I used to feel nervous speaking in front of large groups, but after conducting lab sessions as a Teaching Assistant, I've become much more confident. Now, I try to speak in a structured way — keeping my tone calm, steady, and clear. It's still a work in progress, but I can already see the difference.",
    keywords: ["weakness", "weaknesses", "area to improve", "improvement", "public speaking", "working on"],
  },
  {
    q: "How do you handle stress or deadlines?",
    a: "I handle stress by staying organized. Before starting anything, I break tasks into smaller goals and set mini-deadlines. When things get tight, I prioritize what's most important and remind myself that pressure can actually help me focus. Also, short breaks and a quick walk always help me reset and come back with a clearer mind.",
    keywords: ["stress", "pressure", "deadlines", "time management", "handle stress", "manage pressure"],
  },
  {
    q: "Tell me about a time you failed",
    a: "In one of my early group projects, I underestimated how long integration testing would take, and we missed the submission deadline by a few hours. It was disappointing, but it taught me how crucial time estimation and team coordination are. Since then, I've learned to plan with buffers, communicate delays early, and stay transparent with my team.",
    keywords: ["failure", "failed", "mistake", "learn from failure", "setback"],
  },
  {
    q: "What makes you different from other candidates?",
    a: "I believe my mix of technical and creative thinking makes me different. I'm not just focused on data or systems — I focus on how technology can actually make people's work easier. I combine logic with design thinking and always look for ways to make processes simpler and more meaningful. Plus, I bring a positive, calm energy to teams — which helps in high-pressure situations.",
    keywords: ["different", "unique", "stand out", "what makes you special", "why you"],
  },
  {
    q: "Tell me about your favorite course",
    a: "My favorite course was Advanced Systems Analysis and Design. It helped me think beyond coding — about how to analyze user needs, design workflows, and turn requirements into systems. I liked how it connected technology with communication and teamwork — it felt like real-world project planning.",
    keywords: ["favorite course", "best class", "liked course", "systems analysis"],
  },
  {
    q: "What was your capstone or major project about?",
    a: "For my capstone, my team and I redesigned the website for Courtside Leadership using WordPress. I handled client communication and front-end design. We improved the layout, enhanced navigation, and made the content more accessible. It was exciting because it gave me hands-on experience in stakeholder management and project delivery.",
    keywords: ["capstone", "major project", "final project", "courtside"],
  },
  {
    q: "What role did you play in your team projects?",
    a: "I usually take the role of organizer or coordinator. I make sure everyone understands their tasks, track progress, and help solve blockers. I also handle documentation and ensure the team meets deadlines. I've learned that clear communication and empathy keep teamwork running smoothly.",
    keywords: ["team role", "role in team", "team projects", "coordinator", "organizer"],
  },
  {
    q: "What tools or technologies did you use?",
    a: "I've used technologies like React, ReactStrap, and WordPress for web development projects, and SQL, Excel, and Power BI for data analysis. I've also worked with tools like Jira for project management and Git for version control. I like learning new tools quickly and applying them to improve workflow.",
    keywords: ["tools", "technologies", "tech stack", "what tools"],
  },
  {
    q: "Can you explain a technical concept to a non-technical person?",
    a: "Sure! Let's say we're talking about a database. I'd explain it like a digital filing cabinet — every file is a table, and every row is a record of information. Just like you label folders in real life, we label columns in a database. The idea is to keep data structured and easy to find, just like keeping your workspace tidy.",
    keywords: ["explain technical", "non-technical", "simplify", "database explanation"],
  },
  {
    q: "What databases have you worked with?",
    a: "I've worked with MySQL and Oracle databases. I use SQL for data extraction, cleaning, and reporting — writing queries, joining tables, and optimizing performance. I also enjoy using Excel and Power BI to visualize data after querying it.",
    keywords: ["databases", "mysql", "oracle", "sql experience", "database work"],
  },
  {
    q: "Explain the difference between front-end and back-end",
    a: "The front-end is what users see and interact with — the visual side like buttons, layouts, and forms. The back-end is what happens behind the scenes — the logic, databases, and server-side processes that make the website function. Together, they make a complete system — one handles experience, the other handles execution.",
    keywords: ["front-end", "back-end", "frontend", "backend", "difference"],
  },
  {
    q: "How do you write efficient SQL queries?",
    a: "I make my SQL queries efficient by filtering data early, using proper indexing, and avoiding unnecessary joins or subqueries. I also use LIMIT, WHERE, and GROUP BY carefully to reduce load. My focus is always on clarity first, then performance.",
    keywords: ["sql queries", "efficient sql", "query optimization", "sql performance"],
  },
  {
    q: "What's the difference between a System Analyst and a Business Analyst?",
    a: "A System Analyst focuses more on how a system works — the technical details, data flows, and integrations. A Business Analyst focuses on what the business needs — requirements, goals, and stakeholder expectations. Both work closely together — one translates business needs into technical requirements, the other turns them into actual systems.",
    keywords: ["system analyst", "business analyst", "difference", "analyst roles"],
  },
  {
    q: "How do you approach debugging or troubleshooting?",
    a: "I follow a structured approach — first, I reproduce the issue, then isolate the possible cause. I check logs, inputs, and dependencies one by one. If it's a code issue, I use debugging tools or print statements to trace the problem. And if it's system-related, I collaborate with teammates to test solutions step by step.",
    keywords: ["debugging", "troubleshooting", "problem solving", "fix issues"],
  },
  {
    q: "Tell me about a time you worked in a team",
    a: "In my capstone project, I worked with three teammates to redesign a client website. We divided tasks based on our strengths — I managed front-end design and client communication. We used weekly meetings to stay aligned, and whenever conflicts arose, we discussed them openly. It was a great experience in collaboration and learning how to work towards one shared goal.",
    keywords: ["worked in team", "team experience", "collaboration", "teamwork"],
  },
  {
    q: "Describe a time you managed multiple priorities",
    a: "During my last semester, I was handling my coursework, internship, and Teaching Assistant duties all at once. To manage it, I planned my week in advance and prioritized tasks daily. I learned that being disciplined with time helps avoid burnout and ensures quality in every task.",
    keywords: ["multiple priorities", "multitasking", "time management", "juggling tasks"],
  },
  {
    q: "Tell me about a time when you took initiative",
    a: "While interning at an NGO, I noticed their volunteer sign-up process was manual and slow. So, I proposed and helped build an online form that automatically stored data. It reduced their admin time by almost 30% and made onboarding smoother. That experience taught me how small improvements can make big differences.",
    keywords: ["initiative", "took initiative", "proactive", "self-starter"],
  },
  {
    q: "How do you handle disagreements within a team?",
    a: "When disagreements happen, I first listen to everyone's viewpoint calmly. Then, I try to find common ground and focus on what's best for the project, not individual opinions. If needed, I involve the team lead or professor for a balanced decision. I believe communication and empathy always solve conflicts faster than arguments.",
    keywords: ["disagreements", "conflict", "team conflict", "handle disagreement"],
  },
  {
    q: "What are your short-term and long-term goals?",
    a: "In the short term, I want to work as a Data Analyst where I can apply my skills in SQL, Power BI, and systems analysis to solve real business problems. In the long term, I see myself growing into a System Analyst or Data Consultant role — someone who can design data-driven strategies for organizations.",
    keywords: ["goals", "career goals", "short term", "long term", "future plans"],
  },
  {
    q: "Why do you want to work with us?",
    a: "From what I've read about your company, I really admire your focus on innovation and collaboration. Your projects align with what I'm passionate about — using data and technology to improve efficiency and decision-making. I believe I can bring value through my analytical mindset, attention to detail, and eagerness to learn and grow.",
    keywords: ["why this company", "why us", "why work here", "company interest"],
  },
  {
    q: "What kind of work environment do you thrive in?",
    a: "I thrive in an environment that's collaborative, respectful, and focused on learning. I enjoy working in teams where everyone shares ideas openly and supports each other. I also appreciate when feedback is constructive and growth-oriented — it helps me keep improving.",
    keywords: ["work environment", "ideal environment", "workplace", "thrive in"],
  },
  {
    q: "Where do you see yourself in 5 years?",
    a: "In five years, I see myself as a skilled data professional — someone who not only analyzes data but also contributes to strategic decisions. I hope to mentor new team members, take on leadership responsibilities, and continue exploring tools that make businesses more data-driven and efficient.",
    keywords: ["5 years", "five years", "future", "career path", "where do you see"],
  },
];