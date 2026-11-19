/**
 * Ask box (hero section).
 *
 * Answers plain-language questions about the portfolio by scoring the
 * question's words against a small local knowledge base. No network and no
 * LLM: everything it can say is in KB below, so edit the answers there.
 *
 * Each answer can cite blocks on the page (by element id) or external links;
 * clicking a citation scrolls to the block and highlights it briefly.
 * A question can be linked to directly with ?q=your+question.
 * Append ?asktest to the URL to run the matcher self-check in the console.
 */
(function () {
  'use strict';

  // ---- Easy-to-change constants ----
  const EMAIL = 'sreenivasan.nitt@gmail.com';
  const RESUME_URL = 'https://drive.google.com/file/d/1dQNSDMnKY2ZJGlvO_liYfB3oQCCnbAiz/view?usp=sharing';
  const CALL_URL = 'https://calendar.app.google/MynJqdZbzM6Z7JfPA';
  // Projects mentioned in answers that no longer have a card on the page: cited by link instead.
  const LONGEVITY_URL = 'https://devpost.com/software/healthgod-personalised-ai-health-longevity-coach';
  const QUORA_URL = 'https://github.com/sreenivasanac/quora_analysis';
  const HIGHLIGHT_MS = 2600; // how long a cited block stays highlighted
  const STARTERS = [
    'Have you shipped RAG in production?',
    'Which agent systems have you built?',
    'What did you build at Keystone?',
    'What did you do at Google?',
    "What's your stack?",
    'How do I reach you?',
  ];

  /**
   * Knowledge base. Order matters: on a tied score the earlier entry wins,
   * so specific topics come before the general ones at the bottom.
   *   keys  - lowercase single words that suggest this topic
   *   a     - the answer, plain text
   *   cites - [label, element id | URL] pairs shown under the answer
   *   next  - follow-up questions offered afterwards (defaults to STARTERS)
   */
  const KB = [
    {
      keys: ['keystone', 'marketing', 'sales', 'crm', 'lead', 'leads', 'social', 'instagram', 'facebook', 'meta', 'brick', 'mortar', 'salon', 'salons', 'medspa', 'medspas', 'figma', 'voice', 'frontdesk', 'eval', 'evals', 'evaluation', 'evaluations'],
      a: 'I was a founding engineer at Keystone from January to December 2026, one of the first engineers at an early-stage startup whose AI agents run sales and marketing for brick-and-mortar businesses such as salons, medspas and fitness studios. I built a major part of the codebase from scratch and made early decisions on the agentic architecture, engineering practices and hiring. My work included a voice agent that answers a business\'s missed calls, with evals for it, social posting with AI-generated content, lead and contact management, and LLM-based import of a business\'s existing website data.',
      cites: [['Keystone', 'xp-keystone']],
      next: ['Which agent systems have you built?', 'Have you led a team?', "What's your stack?"],
    },
    {
      keys: ['google', 'gcp', 'datacenter', 'datacenters', 'rack', 'fiber', 'alerting', 'mttd', 'planning'],
      a: 'I was a Senior Software Development Engineer on Google Cloud Platform from March 2020 to June 2022. I built the planning and task-generation system for datacenter operations, which turned static Excel workflows into automated ones handling 1000+ operations a day. I also automated 200+ rack migrations, cutting manual intervention by 80%, and built a reachability-zone calculation that reduced infrastructure costs by 15%.',
      cites: [['Google', 'xp-google']],
      next: ['And at Apple?', 'Have you shipped RAG in production?', "What's your stack?"],
    },
    {
      keys: ['apple', 'cost', 'savings', 'saved', 'usage', 'insights', 'finops'],
      a: 'At Apple I was a Senior Software Development Engineer (contract) in Cloud Technologies, from June 2022 to April 2023. I designed and built the Cloud Usage Insights platform with Python microservices and REST APIs. Its analytics enabled $240,000 in cost savings.',
      cites: [['Apple', 'xp-apple']],
      next: ['What did you do at Google?', 'Which agent systems have you built?'],
    },
    {
      keys: ['rag', 'retrieval', 'vector', 'vectors', 'chunking', 'pinecone', 'chromadb', 'chroma', 'faiss', 'citation', 'citations', 'document', 'documents', 'multimodal', 'semantic', 'search', 'knowledge'],
      a: 'Yes. At Brahmasumm AI I designed and built RAG pipelines over 50GB+ datasets for Fortune 500 clients, with multimodal extraction from PDFs, presentations and spreadsheets, citations, and sub-second query times through chunking and vector-database tuning. Outside work I built Longevity Coach, a FAISS-based RAG app that won a hackathon.',
      cites: [['Brahmasumm AI', 'xp-brahmasumm'], ['Brahmasumm Document AI', 'pj-brahmasumm'], ['Longevity Coach', LONGEVITY_URL]],
      next: ['Have you deployed LLMs on-prem?', 'Which agent systems have you built?'],
    },
    {
      keys: ['prem', 'premises', 'onprem', 'llm', 'llms', 'deploy', 'deployed', 'deployment', 'deployments', 'secure', 'security', 'private', 'privacy', 'local', 'lawrence', 'berkeley', 'atmus', 'fortune', 'enterprise', 'clients'],
      a: 'Yes. At Brahmasumm AI I deployed secure on-premises LLM solutions for Lawrence Berkeley National Lab and NYSE-listed ATMUS Filtration, so their intellectual property stayed inside their own infrastructure.',
      cites: [['Brahmasumm AI', 'xp-brahmasumm'], ['Brahmasumm Document AI', 'pj-brahmasumm']],
      next: ['Have you shipped RAG in production?', 'Have you led a team?'],
    },
    {
      keys: ['agent', 'agents', 'agentic', 'multi', 'langgraph', 'agno', 'autonomous', 'automation', 'orchestration', 'workflow', 'workflows', 'namesmith', 'receptionist', 'organiser', 'organizer', 'vyasa', 'chatbot'],
      a: 'At Keystone I built a voice agent that answers a business\'s missed calls, and agents that generate and schedule social posts and blogs for brick-and-mortar businesses. Outside work there are four, all with code you can read. CallEnvoy is a phone-call server that lets any AI agent call a business, get through the phone menu and wait on hold. Namesmith Agents is a LangGraph multi-agent system that takes domain names from discovery and scoring through to purchase. The file organiser is a desktop agent built with Tauri and Agno that proposes folder structures and moves files only with human approval. AI Receptionist is a booking, CRM and marketing chatbot for salons, medspas and fitness studios.',
      cites: [['CallEnvoy', 'pj-callenvoy'], ['Namesmith Agents', 'pj-namesmith'], ['File organiser agent', 'pj-filevyasa'], ['AI Receptionist', 'pj-receptionist'], ['Keystone', 'xp-keystone']],
      next: ['What did you build at Keystone?', 'Have you shipped RAG in production?', "What's your stack?"],
    },
    {
      keys: ['health', 'healthcare', 'healthtech', 'medical', 'hipaa', 'ocr', 'fathom', 'longevity', 'clinical'],
      a: 'At Fathom Health I architected an OCR pipeline that processed 900K+ HIPAA-compliant medical records for ML training on Spark and BigQuery, and set up an EFK logging stack that cut troubleshooting time by 60%. More recently I built Longevity Coach, a research-grounded health assistant that won a hackathon.',
      cites: [['Fathom Health', 'xp-fathom'], ['Longevity Coach', LONGEVITY_URL]],
    },
    {
      keys: ['callenvoy', 'holdforme', 'hold', 'pipecat', 'twilio', 'mcp', 'telephony'],
      a: 'CallEnvoy is a phone-call server for AI agents. Any MCP client, such as Claude Code or Codex, asks it to call a business; the AI presses the menu keys, waits on hold and talks to the person, and you can listen in and take over at any time. It is one Python process built on FastAPI and Pipecat, with Twilio for telephony and a voice bot per call.',
      cites: [['CallEnvoy', 'pj-callenvoy']],
      next: ['What did you build at Keystone?', 'Which agent systems have you built?'],
    },
    {
      keys: ['review', 'reviews', 'sieve', 'yelp', 'tripadvisor', 'trustpilot', 'rating', 'ratings', 'fake'],
      a: 'Review Sieve reads a business\'s reviews on Google Maps, Yelp, Tripadvisor and Trustpilot and has models judge each one, so you get an honest rating and the problems to watch for. A cheap model tags every review and an expensive one reads only the genuine ones, which keeps a run low-cost.',
      cites: [['Review Sieve', 'pj-reviewsieve']],
    },
    {
      keys: ['deskrecall', 'macos', 'swift', 'window', 'windows', 'apartment', 'three', 'threejs', '3d', 'webgl', 'sandhya', 'sandhyavandanam', 'mantra', 'mantras', 'pwa'],
      a: 'Three recent builds outside AI. DeskRecall is a macOS menu bar app in Swift that restores your window layout for whichever displays are connected. Spruce Apartment 3D is a walkable, to-scale Three.js model of an apartment with every surface drawn procedurally. Sandhyāvandanam is a web app that guides practitioners through the practice step by step, with mantras in the script of their choice.',
      cites: [['DeskRecall', 'pj-deskrecall'], ['Spruce Apartment 3D', 'pj-apartment'], ['Sandhyāvandanam', 'pj-sandhya']],
    },
    {
      keys: ['robot', 'robots', 'robotics', 'invento', 'mitra', 'voice', 'alexa', 'rasa', 'conversational', 'jetson', 'nvidia', 'humanoid'],
      a: 'At Invento Robotics I built the offline NLU and conversation system for the humanoid robot Mitra, using RASA on an NVIDIA Jetson TX2, plus Alexa skills on AWS Lambda for guest registration and recommendations.',
      cites: [['Invento Robotics', 'xp-invento']],
    },
    {
      keys: ['groupon', 'rails', 'ruby', 'docusign', 'contract', 'contracts', 'deals', 'sales'],
      a: 'At Groupon, from 2014 to 2017, I co-architected a ReactJS app for Card Linked Offers used by 500+ sales reps, automated contract signing through the DocuSign API, saving $40,000+ a month, and owned the Contract Service and Fine Print API microservices.',
      cites: [['Groupon', 'xp-groupon']],
    },
    {
      keys: ['scraping', 'scrape', 'scraper', 'scrapy', 'quora', 'etl', 'clustering', 'cluster', 'constella', 'umap', 'kmeans', 'means', 'embeddings', 'bookmarks', 'analytics', 'airflow', 'kafka', 'pipeline', 'pipelines'],
      a: 'Two projects. Quora Activity Analytics is a scraping pipeline with anti-bot handling that turns 20K+ Quora answers into dashboards on PostgreSQL. Constella groups and labels large text collections using embeddings, deterministic K-Means and UMAP.',
      cites: [['Quora Activity Analytics', QUORA_URL], ['Constella', 'pj-constella']],
    },
    {
      keys: ['startup', 'startups', 'founding', 'founder', 'brahmasumm', 'team', 'lead', 'led', 'leadership', 'mentor', 'mentoring', 'manage', 'ceo'],
      a: 'I was the founding engineer at Brahmasumm AI, an enterprise document-intelligence startup, from November 2024 to July 2025. I built its core features end to end, including multimodal file processing, citations and knowledge-base partitioning. I also ran technical hiring, screening 240+ candidates, and worked directly with the CEO. After that I was one of the first engineers at Keystone, where I made early decisions on architecture and engineering practices and helped hire the team.',
      cites: [['Brahmasumm AI', 'xp-brahmasumm'], ['Keystone', 'xp-keystone']],
      next: ['Have you deployed LLMs on-prem?', 'How do I reach you?'],
    },
    {
      keys: ['education', 'degree', 'degrees', 'study', 'studied', 'university', 'college', 'school', 'masters', 'master', 'ms', 'georgia', 'gatech', 'nit', 'nitt', 'trichy', 'btech', 'icpc', 'rank', 'jee', 'achievement', 'achievements', 'award', 'awards', 'teaching', 'competitive'],
      a: 'I have an MS in Computer Science from Georgia Tech, focused on AI and machine learning, where I was a graduate teaching assistant for Deep Learning (CS7643). Before that I did a B.Tech in Computer Science at NIT Tiruchirappalli, where I was an ACM ICPC regional finalist, ranked #30 of 300+ teams.',
      cites: [['Education', 'education']],
    },
    {
      keys: ['contact', 'email', 'mail', 'reach', 'hire', 'hiring', 'call', 'book', 'meeting', 'meet', 'schedule', 'linkedin', 'available', 'availability', 'open', 'opportunity', 'opportunities', 'role', 'roles', 'job', 'location', 'located', 'based', 'bay', 'area', 'remote', 'phone', 'talk', 'looking'],
      a: "I'm open to AI Engineer roles at AI startups and mid-stage companies in the Bay Area. Email is the fastest way to reach me and I reply within 24 hours. You can also book a 15-minute call.",
      cites: [['Email me', 'mailto:' + EMAIL], ['Book a 15-min call', CALL_URL], ['All contact details', 'contact']],
    },
    {
      keys: ['resume', 'cv', 'pdf', 'download'],
      a: 'My resume is a PDF on Google Drive.',
      cites: [['Open resume', RESUME_URL]],
    },
    {
      keys: ['skill', 'skills', 'stack', 'tech', 'technologies', 'technology', 'language', 'languages', 'python', 'typescript', 'javascript', 'node', 'react', 'next', 'nextjs', 'fastapi', 'flask', 'framework', 'frameworks', 'tools', 'aws', 'azure', 'kubernetes', 'langchain', 'openai', 'postgres', 'postgresql', 'mongodb', 'sql', 'database', 'databases', 'devops', 'terraform', 'frontend', 'backend', 'fullstack', 'cloud'],
      a: 'Python and TypeScript day to day. For AI work: LangChain, LangGraph, the OpenAI APIs and vector databases. For product: FastAPI, React and Next.js. For infrastructure: AWS, Azure, Kubernetes and Terraform, with PostgreSQL, Airflow and Kafka for data.',
      cites: [['All skills', 'skills']],
    },
    {
      keys: ['project', 'projects', 'built', 'build', 'portfolio', 'side', 'demo', 'demos', 'github', 'code', 'show'],
      a: "Ten are on this page. The ones I'd open first are CallEnvoy for voice agents that make phone calls, Namesmith Agents for multi-agent orchestration, and Review Sieve for a model-judged review pipeline.",
      cites: [['All projects', 'projects'], ['CallEnvoy', 'pj-callenvoy'], ['Namesmith Agents', 'pj-namesmith'], ['Review Sieve', 'pj-reviewsieve']],
    },
    {
      // Keep these few and generic: every extra word here can outvote a specific topic above.
      keys: ['experience', 'background', 'career', 'years', 'history', 'companies', 'faang', 'why', 'strengths', 'summary', 'who', 'whoami', 'about', 'yourself', 'intro', 'introduce'],
      a: "I'm an AI software engineer with 9+ years of shipping production systems, at Google, Apple and Groupon and at startups including Keystone, Brahmasumm AI and Fathom Health. These days I work on agentic systems, RAG pipelines and on-prem LLM deployments, mostly for enterprise, customer support, healthtech and legal teams.",
      cites: [['Experience', 'experience'], ['Projects', 'projects']],
    },
    {
      keys: ['help', 'commands'],
      a: 'Ask in plain words about my experience, projects, skills, education or how to reach me. Press / anywhere on the page to jump back here, and Esc to clear the answer.',
    },
    {
      keys: ['sudo'],
      a: "Nice try. You don't have sudo access here.",
    },
  ];

  const FALLBACK = {
    a: "I can only answer from what's on this page, and nothing here matched that. Try one of the questions below, or email me the real one.",
    cites: [['Email me', 'mailto:' + EMAIL]],
  };

  // ---- Matching ----

  // 2 for an exact word, 1 when the word is an inflection of a key ("deploying" ~ "deploy").
  // Short keys must match exactly so "ms" or "cv" can't hit by accident.
  function wordHit(token, key) {
    if (token === key) return 2;
    return key.length >= 4 && token.startsWith(key) ? 1 : 0;
  }

  // Returns the best-scoring KB entry for a question, or FALLBACK if nothing hits.
  function match(question) {
    // Strip diacritics first so "Sandhyāvandanam" matches the plain-letter key.
    const plain = question.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const tokens = plain.match(/[a-z0-9$+#]+/g) || [];
    let best = FALLBACK;
    let bestScore = 0;
    for (const entry of KB) {
      let score = 0;
      for (const t of tokens) score += Math.max(...entry.keys.map((k) => wordHit(t, k)));
      if (score > bestScore) { best = entry; bestScore = score; }
    }
    return best;
  }

  // Smallest check that fails if the matcher or the key lists break.
  function selfCheck() {
    const expect = {
      'Have you shipped RAG in production?': 'xp-brahmasumm',
      'Which agent systems have you built?': 'pj-callenvoy',
      'tell me about callenvoy': 'pj-callenvoy',
      'how does review sieve work': 'pj-reviewsieve',
      'have you built a macos app': 'pj-deskrecall',
      'what is Sandhyāvandanam': 'pj-deskrecall',
      'what is sandhyavandanam': 'pj-deskrecall',
      'What did you do at Google?': 'xp-google',
      'And at Apple?': 'xp-apple',
      "What's your stack?": 'skills',
      'How do I reach you?': 'mailto:' + EMAIL,
      'Have you deployed LLMs on-prem?': 'xp-brahmasumm',
      'Have you led a team?': 'xp-brahmasumm',
      'What did you build at Keystone?': 'xp-keystone',
      'do you know sales and marketing agents': 'xp-keystone',
      'have you built a voice agent': 'xp-keystone',
      'do you write evals': 'xp-keystone',
      'where did you study': 'education',
      'tell me about fathom': 'xp-fathom',
      'tell me about yourself': 'experience',
      'what is your experience with kubernetes': 'skills',
    };
    for (const [q, target] of Object.entries(expect)) {
      console.assert(match(q).cites?.[0][1] === target, 'ask.js: wrong match for', q);
    }
    console.assert(match('do you like pizza') === FALLBACK, 'ask.js: expected fallback');
    console.log('ask.js self-check done');
  }

  // ---- Rendering ----

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function init() {
    const box = document.getElementById('ask');
    const form = document.getElementById('ask-form');
    const input = document.getElementById('ask-input');
    const answer = document.getElementById('ask-answer');
    const chips = document.getElementById('ask-chips');
    if (!box || !form || !input || !answer || !chips) return;

    const asked = []; // question history for the up/down keys
    let cursor = 0;

    function setChips(questions) {
      chips.replaceChildren(...questions.map((q) => {
        const chip = el('button', 'chip', q);
        chip.type = 'button';
        chip.dataset.q = q;
        return chip;
      }));
    }

    function reset() {
      answer.hidden = true;
      answer.replaceChildren();
      input.value = '';
      setChips(STARTERS);
    }

    function render(question, entry) {
      const text = el('p', 'ask-a');
      // One span per word so CSS can reveal them in sequence.
      entry.a.split(' ').forEach((word, i) => {
        const span = el('span', '', word + ' ');
        span.style.setProperty('--i', i);
        text.append(span);
      });

      const row = el('div', 'ask-cites');
      for (const [label, target] of entry.cites || []) {
        const isLink = /^(https?:|mailto:)/.test(target);
        const cite = el(isLink ? 'a' : 'button', 'cite', label);
        if (isLink) {
          cite.href = target;
          if (target.startsWith('http')) { cite.target = '_blank'; cite.rel = 'noreferrer'; }
        } else {
          cite.type = 'button';
          cite.dataset.cite = target;
        }
        row.append(cite);
      }
      if (entry !== FALLBACK) {
        // interactions.js handles [data-copy]
        const share = el('button', 'ask-share', 'Copy link to this answer');
        share.type = 'button';
        share.dataset.copy = location.origin + location.pathname + '?q=' + encodeURIComponent(question);
        row.append(share);
      }

      answer.replaceChildren(el('p', 'ask-q', '› ' + question), text, row);
      answer.hidden = false;
      setChips(entry.next || STARTERS);
    }

    function ask(question) {
      const q = question.trim();
      if (!q) return;
      if (q.toLowerCase() === 'clear') { reset(); return; }
      asked.push(q);
      cursor = asked.length;
      input.value = q;
      render(q, match(q));
    }

    // Scroll to the cited block (opening it if it is a collapsed role) and flash it.
    function showCited(id) {
      const target = document.getElementById(id);
      if (!target) return;
      if (target.tagName === 'DETAILS') target.open = true;
      target.scrollIntoView({ block: 'start' });
      target.classList.add('cited');
      setTimeout(() => target.classList.remove('cited'), HIGHLIGHT_MS);
    }

    function focusAsk() {
      input.focus({ preventScroll: true });
      box.scrollIntoView({ block: 'center' });
    }

    form.addEventListener('submit', (e) => { e.preventDefault(); ask(input.value); });

    box.addEventListener('click', (e) => {
      const chip = e.target.closest('[data-q]');
      const cite = e.target.closest('[data-cite]');
      if (chip) ask(chip.dataset.q);
      if (cite) showCited(cite.dataset.cite);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') reset();
      if (e.key === 'ArrowUp' && cursor > 0) { e.preventDefault(); input.value = asked[--cursor]; }
      if (e.key === 'ArrowDown' && cursor < asked.length) { e.preventDefault(); input.value = asked[++cursor] || ''; }
    });

    // "/" anywhere on the page jumps to the ask box.
    document.addEventListener('keydown', (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
      if (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) { e.preventDefault(); focusAsk(); }
    });
    document.querySelectorAll('[data-ask-focus]').forEach((b) => b.addEventListener('click', focusAsk));

    setChips(STARTERS);

    const params = new URLSearchParams(location.search);
    if (params.has('asktest')) selfCheck();
    if (params.get('q')) ask(params.get('q'));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
