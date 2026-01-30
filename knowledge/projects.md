## Projects

## refrAIme — Intelligent AI Journal

**Project Type:** Full Stack Application  
**Technologies:** RAG | Prompt Engineering | Python | React/JavaScript

### Description
An AI-powered CBT journaling app that helps users reflect and reframe their thoughts through guided, evidence-based prompts. The product combines a calm, trust-centered UI with a RAG chatbot grounded in vetted mental-health resources. It was iteratively tested with real users, with a strong emphasis on safety, transparency, and responsible AI design.

### My Role
Focused on product design, UI/UX research, and backend integration. I worked on designing the journaling flows, trust-centered interface, and overall user experience, conducted UX research and testing, and connected the frontend to the backend and AI systems to ensure reliable, grounded behavior in production.

### Key Features
- Retrieval-Augmented Generation (RAG) system for grounded responses
- Evidence-based mental health prompts
- Trust-centered UX with safety and transparency considerations
- Iterative user testing and product refinement

### Why It Mattered / What I Learned
This project taught me how much the effectiveness of AI systems depends on UX, framing, and trust — especially in sensitive domains. I learned how to translate LLM capabilities into calm, usable product experiences, and how backend integration and system constraints shape what’s realistically shippable.

### Resources
- **Presentation:** Available in portfolio (ai_journal_pres.pdf)  
- **External Link:** https://www.ischool.berkeley.edu/projects/2025/refraime  
- **Video Demo:** capstone-refraime-final-demo-presentation.mp4  

### Technical Details
- Python backend with RAG pipeline
- React/JavaScript frontend
- Vector database for retrieval
- Prompt engineering aligned with CBT principles
- Model: Gemma2-9B-IT with 4-bit AWQ quantization
- vLLM with continuous batching and KV caching

---

## Doctor Gender Bias Study

**Project Type:** Causal Experiment / Statistical Analysis  
**Technologies:** Design of Experiments | Causal Inference | R

### Description
A causal experiment examining whether provider gender influences patient selection in a mock doctor-booking platform. Participants chose between male- and female-presenting doctors with equivalent qualifications, using randomized profiles to isolate gender effects. The study emphasized experimental design, internal validity, and bias measurement.

### My Role
Designed the experiment, implemented the survey platform, and conducted the statistical analysis, with a focus on isolating causal effects and avoiding confounding.

### Key Features
- Randomized experimental design
- Causal inference methodology
- Bias measurement and analysis
- Strong focus on internal validity

### Why It Mattered / What I Learned
This project strengthened my understanding of how subtle design choices can introduce bias and how careful experimental design is essential when making causal claims from human behavior data.

### Resources
- **GitHub Repository:** https://github.com/hanmmac/doctor-gender-bias-study/tree/main  
- **Survey Demo:** https://doctor-survey.web.app/  
- **Final Report:** doc_bias_final_report.pdf  

### Technical Details
- Statistical analysis in R
- Randomization inference and regression analysis
- Survey platform development

---

## Graph-Based Investment Analysis

**Project Type:** Data Science / Financial Analysis  
**Technologies:** Graph Algorithms | Network Analysis | Neo4j | Python

### Description
A graph-based financial analysis using Neo4j to model relationships between stocks, sectors, and shared risk factors. The project applied graph algorithms to identify influential stocks, sector clusters, and systemic connections that are difficult to detect with traditional correlation-based methods.

### My Role
Collaborated equally with teammates to design the graph model and implement graph algorithms. We split algorithm development and analysis across PageRank, community detection, and centrality measures, working together to interpret results and translate them into diversification and risk insights.

### Key Features
- Graph database modeling with Neo4j
- PageRank for stock influence
- Community detection using Louvain
- Betweenness centrality and shortest-path analysis
- Jaccard similarity for volume regime analysis

### Methodology
- Modeled NASDAQ-100 equities as a graph
- Computed Pearson correlations for price co-movement
- Identified strong positive (ρ ≥ +0.80), weak (|ρ| ≤ 0.20), and strong negative (ρ ≤ −0.80) relationships
- Applied graph algorithms to surface clusters, bridges, and systemic risk

### Why It Mattered / What I Learned
This project showed me how graph-based approaches can reveal structural market risks and diversification insights that are invisible in pairwise correlation analysis.

### Resources
- **GitHub Repository:** https://github.com/hanmmac/graph-stock-analysis-project  
- **Presentation:** https://github.com/hanmmac/graph-stock-analysis-project/blob/main/slides/205%20Final%20Presentation.pdf  
- **Medium Article:** https://medium.com/@maia_kennedy/beyond-the-matrix-a-graph-data-science-approach-to-smarter-stock-portfolio-diversification-e220047548ac  

### Team
Hannah MacDonald, Maia Kennedy, Ryan Farhat-Sabet, Krishna Tummalapalli

---

## Air Pollution Analysis

**Project Type:** Machine Learning / Data Analysis  
**Technologies:** ML | EDA | Feature Engineering | Python

### Description
A machine learning project analyzing the relationship between electric vehicle adoption, environmental factors, and PM2.5 air pollution levels across Europe. The work emphasized data preprocessing, feature engineering, and model interpretability to identify key drivers of pollution rather than pure forecasting.

### Key Features
- Exploratory data analysis (EDA)
- Feature engineering
- Emphasis on model interpretability
- Environmental and policy-relevant data analysis

### Why It Mattered / What I Learned
This project reinforced the importance of careful preprocessing and interpretability when working with noisy, real-world environmental data.

### Technical Details
- Python-based ML workflows
- Data preprocessing and aggregation
- Feature engineering across heterogeneous data sources

---

## Dilo — Spanish Phrase Generator

**Project Type:** Web Application  
**Technologies:** UX Design | OpenAI API | React | Supabase

### Description
An AI-powered language tool designed to help users practice practical Spanish through region-aware, context-specific phrases. The project generated multiple phrasing variants tailored to real-world scenarios, emphasizing usability, cultural nuance, and lightweight AI integration.

### My Role
Designed the product concept and UX flows, structured the AI prompt logic, and implemented the frontend and backend integration.

### Key Features
- Region-aware Spanish phrase generation
- Context-specific translations
- Multiple phrasing variants
- Rapid prototyping and iteration

### Why It Mattered / What I Learned
This project highlighted how thoughtful prompt design and UX choices can make AI outputs feel more useful and culturally grounded without heavy model complexity.

### Resources
- **GitHub Repository:** https://github.com/hanmmac/dilo_spanish_app  
- **Live Website:** https://dilo-spanish-app.vercel.app/  
- **Site Password:** ilovebmo  
- **Demo Credentials:** demo@gmail.com / dilodemo  

### Technical Details
- React/JavaScript frontend
- Supabase backend
- OpenAI API integration
- Prompt engineering for language learning
- Vercel deployment

---

## macOS Portfolio Website

**Project Type:** Interactive Web Application / Portfolio  
**Technologies:** Next.js | React | TypeScript | Tailwind CSS | Product Design | UX Design

### Description
An interactive, macOS-inspired portfolio website that showcases projects, skills, and experience through a fully functional desktop-style interface. The site recreates familiar macOS interactions — including draggable windows, a dock, launchpad, and spotlight search — to present data science and product work in a playful yet professional format.

The project emphasizes creative UX design and product thinking, using interface design as a way to make complex information more approachable and engaging.

### My Role
Designed and built the site end-to-end, owning product concept, UX design, and frontend implementation. Iterated on interactions, layout, and navigation to balance creativity with usability and clarity.

### Key Features
- Interactive desktop-style interface with draggable and resizable windows  
- Multiple “apps” for browsing projects, skills, notes, and media  
- Window management system with dynamic layering and state handling  
- Spotlight search, launchpad navigation, and dock-style app switching  
- Embedded project content including PDFs, videos, and external links  
- Light/dark mode theming with custom wallpapers  

### Why It Mattered / What I Learned
This project let me explore how interface design can shape how users engage with information. I learned how far thoughtful interaction design can go in making technical work feel more intuitive, memorable, and human — without sacrificing clarity or usability.

### Resources
- **Live Website:** https://hannah-marie-macdonald.com  
- **GitHub Repository:** https://github.com/hanmmac/macos-portfolio
- **Template Credit:** Based on a template by Daniel Prior, heavily customized and extended  

### Technical Details
- Next.js App Router with React and TypeScript  
- Tailwind CSS with custom animations and transitions  
- Component-based architecture with custom window management logic  
- Client-side state management with React hooks  
- Embedded media (PDF, video, audio) and interactive dashboards  