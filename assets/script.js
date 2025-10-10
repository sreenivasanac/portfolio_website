document.addEventListener("DOMContentLoaded", () => {
  const topNav = document.querySelector(".top-nav");
  const navPath = document.querySelector(".nav-path");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const basePath = navPath?.dataset.base ?? "";

  const sections = navLinks
    .map((link) => {
      const id = link.dataset.section;
      const element = id ? document.getElementById(id) : null;
      return element ? { id, element } : null;
    })
    .filter(Boolean);

  if (!topNav || navLinks.length === 0 || sections.length === 0) {
    return;
  }

  let rafId = null;

  const updatePath = (activeId) => {
    if (!navPath) {
      return;
    }
    const locationEl = navPath.querySelector(".nav-location");
    if (!locationEl) {
      return;
    }

    const suffix = activeId && activeId !== sections[0].id ? `/${activeId}` : "";
    locationEl.textContent = `~/${basePath}${suffix}`;
    navPath.classList.toggle("path-active", suffix.length > 0);
  };

  const setActiveLink = (targetId) => {
    navLinks.forEach((link) => {
      const isActive = link.dataset.section === targetId;
      link.classList.toggle("active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
    updatePath(targetId);
  };

  const updateOnScroll = () => {
    const currentScrollY = window.scrollY;

    let currentSectionId = sections[0].id;
    const anchorLine = window.innerHeight * 0.35;

    for (const { id, element } of sections) {
      const rect = element.getBoundingClientRect();
      if (rect.top <= anchorLine && rect.bottom >= anchorLine * 0.5) {
        currentSectionId = id;
      }
    }

    const nearBottom =
      window.innerHeight + currentScrollY >= document.documentElement.scrollHeight - 40;
    if (nearBottom) {
      currentSectionId = sections[sections.length - 1].id;
    }

    setActiveLink(currentSectionId);
  };

  const requestScrollUpdate = () => {
    if (rafId !== null) {
      return;
    }
    rafId = window.requestAnimationFrame(() => {
      updateOnScroll();
      rafId = null;
    });
  };

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const targetId = link.dataset.section;
      if (!targetId) {
        return;
      }
      const target = sections.find((section) => section.id === targetId);
      if (!target) {
        return;
      }

      const navOffset = topNav.offsetHeight + 24;
      const targetTop = target.element.getBoundingClientRect().top + window.scrollY - navOffset;

      window.scrollTo({
        top: Math.max(targetTop, 0),
        behavior: "smooth",
      });

      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, "", `#${targetId}`);
      }

      setActiveLink(targetId);
    });
  });

  document.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate);

  const initialHash = window.location.hash.slice(1);
  if (initialHash) {
    const initialSection = sections.find((section) => section.id === initialHash);
    if (initialSection) {
      setActiveLink(initialSection.id);
    } else {
      setActiveLink(sections[0].id);
    }
  } else {
    setActiveLink(sections[0].id);
  }

  updateOnScroll();

  // Modal functionality
  const modalContainer = document.getElementById("modal-container");
  const modalBody = document.getElementById("modal-body");
  const modalClose = document.querySelector(".modal-close");
  const seeMoreButtons = document.querySelectorAll(".see-more-link");

  // Company details data
  const companyDetails = {
    brahmasumm: {
      title: "Brahmasumm AI - AI Engineer",
      content: `
        <h3>Document Intelligence for Enterprises</h3>
        <p>Brahmasumm AI is an enterprise AI startup building Document intelligence platforms for Enterprises. We enable organizations to unlock insights from their vast knowledge bases through advanced RAG systems and agentic workflows.</p>
        
        <h3>My Role & Impact</h3>
        <ul>
          <li>As AI Engineer hire, I designed, developed and deployed production-scale RAG pipelines processing 50GB+ datasets for Fortune 500 clients.</li>
          <li>Led the implementation of multi-modal extraction capabilities for PDFs, presentations, and spreadsheets using Azure Document Intelligence API and custom LLM extractors</li>
          <li>Successfully deployed secure on-premises LLM solutions for Lawrence Berkeley National Lab (discoverers of 18+ periodic elements) and NYSE-listed ATMUS Filtration, ensuring their Intellectual Property protection.</li>
          <li>Achieved sub-second query response times through intelligent chunking strategies and vector database optimization.</li>
          <li>Evaluated and benchmarked open-source LLM models (Deepseek 67B, Qwen2.5 72B) for custom model deployment.</li>
          <li>Led technical hiring, screening 240+ candidates and mentoring a lean AI team while partnering directly with CEO Dr. Balaji Viswanathan on roadmap and delivery.</li>
        </ul>
        
        <h3>Key Technologies</h3>
        <ul>
          <li>Azure Document Intelligence API for document processing</li>
          <li>Vector databases: pgvector, etc.</li>
          <li>Multi-modal AI for processing video/audio content</li>
          <li>On-premises LLM deployment and optimization</li>
        </ul>
        
        <h3>Direct Collaboration</h3>
        <p>Worked directly with CEO Dr. Balaji Viswanathan on strategic priorities and client deliverables. Also performed technical hiring, screening 240+ candidates to build a high-performing AI engineering team.</p>
      `
    },
    google: {
      title: "Google - Senior Software Development Engineer",
      content: `
        <h3>Google Cloud Platform - Cluster Planning Team</h3>
        <p>Part of Google's compute resource planning and optimization systems team responsible for developing software systems for forecasting, planning, and ordering of compute, hardware, and network for Google's Data centers.</p>
        
        <h3>Major Accomplishments</h3>
        <ul>
          <li>Implemented Rack move automation in the task generation system for Google Cloud datacenter operations, transforming static Excel-based workflows into dynamic, automated processes</li>
          <li>System now handles 1000+ daily operations across global datacenters</li>
          <li>Engineered automated workflow for 200+ rack migrations, reducing manual intervention by 40%</li>
          <li>Developed automated IPv4 provisioning system for top-of-rack infrastructure</li>
          <li>Built intelligent reachability zone calculation system optimizing fiber utilization by 15%</li>
        </ul>
        
        <h3>Infrastructure Impact</h3>
        <ul>
          <li>Implemented comprehensive alerting framework reducing MTTD from hours to minutes</li>
          <li>Created automation that saved thousands of engineer hours annually</li>
          <li>Improved datacenter capacity planning accuracy and turn-up speed</li>
        </ul>
        
        <h3>Technologies Used</h3>
        <p>Python, Kubernetes, Microservices Architecture, Network Automation, Infrastructure as Code, Monitoring & Alerting Systems</p>
      `
    },
    apple: {
      title: "Apple - Senior Software Development Engineer",
      content: `
        <h3>Cloud Technologies Team</h3>
        <p>Worked on automation enabling data-driven customer insights and analysis into cloud technologies usage across Apple's Cloud infrastructure.</p>
        
        <h3>Cloud Usage Intelligence Platform</h3>
        <ul>
          <li>Architected platform using Python cronjob and RESTful APIs</li>
          <li>Delivered AI-driven analytics enabling $240,000 in annual cost savings</li>
          <li>Optimized cloud provider selection across 12 projects in 5 organizations</li>
        </ul>
        
        <h3>Technical Implementation</h3>
        <ul>
          <li>Developed data pipeline aggregating cloud usage metrics from multiple sources</li>
          <li>Implemented extensible design patterns (Factory, Strategy) for maintainability</li>
          <li>Deployed containerized services on Kubernetes infrastructure</li>
          <li>Created fault-tolerant cron services for automated data collection</li>
        </ul>
        
        <h3>Software Architecture</h3>
        <p>Applied advanced design patterns extensively, focusing on code extensibility for new use cases. Used inheritance and classes for creating modular, maintainable enterprise systems.</p>
      `
    },
    groupon: {
      title: "Groupon - Software Development Engineer",
      content: `
        <h3>Merchant Onboarding and Deal Creation Team</h3>
        <p>Worked on supporting thousands of merchants in self-service deal creation, contributing to key features that powered Groupon's global marketplace.</p>
        
        <h3>Card Linked Offers Platform</h3>
        <ul>
          <li>Co-architected mobile-responsive web application in AngularJS</li>
          <li>Used by 500+ sales representatives to create Groupon deals</li>
          <li>Automated contract-signing process through DocuSign API integration</li>
          <li>Saved $40,000+ monthly through process automation</li>
        </ul>
        
        <h3>Microservices Architecture</h3>
        <ul>
          <li>Owned Contract Service and Fine Print API microservices</li>
          <li>Transformed static Google Spreadsheet workflows into dynamic API-driven processes</li>
          <li>Improved system reliability and maintainability</li>
        </ul>
        
        <h3>Additional Contributions</h3>
        <ul>
          <li>Implemented Redemption Window, Fine Prints, and Groupon Delivery/Takeout features</li>
          <li>Enhanced Deal Creation Tool supporting thousands of daily transactions</li>
          <li>Led production deployments for multiple merchant tools and services</li>
          <li>Created Splunk dashboards and Nagios alerts for proactive monitoring</li>
          <li>Developed Image Asset Management features with internationalization support</li>
        </ul>
        
        <h3>Recognition</h3>
        <p>Earned transfer to Palo Alto office based on exceptional performance and technical contributions.</p>
      `
    },
    fathom: {
      title: "Fathom Health - Software Development Engineer",
      content: `
        <h3>AI Healthcare Startup - Medical Coding Automation</h3>
        <p>Fathom Health is revolutionizing medical coding through AI, automating the complex process of translating medical records into billing codes.</p>
        
        <h3>Healthcare Data Pipeline</h3>
        <ul>
          <li>Architected OCR pipeline processing 900K+ HIPAA-compliant medical records</li>
          <li>Implemented text extraction and parsing for downstream ML training.</li>
          <li>Integrated 5+ data flow processes in Apache Airflow DAG pipeline.</li>
          <li>Fed processed data into Spark/BigQuery for model training downstream.</li>
        </ul>
        
        <h3>Observability Infrastructure</h3>
        <ul>
          <li>Designed and deployed EFK (Elasticsearch, Fluentd, Kibana) stack.</li>
          <li>Enabled comprehensive log aggregation and analysis</li>
          <li>Improved system visibility and reduced troubleshooting time by 20%</li>
        </ul>
        
        <h3>Technologies & Compliance</h3>
        <p>Python, Apache Airflow, OCR Technologies, Spark, BigQuery, HIPAA Compliance, Healthcare Data Processing</p>
        
        <h3>Impact</h3>
        <p>Enabled Fathom to scale their AI medical coding platform, processing millions of medical documents while maintaining strict HIPAA compliance and data security standards.</p>
      `
    },
    invento: {
      title: "Invento Robotics - AI Engineer",
      content: `
        <h3>Humanoid Robot Platform Development</h3>
        <p>Invento Robotics builds humanoid service robots for hospitality, retail, and corporate environments. I worked on the conversational AI for their flagship robot, Mitra.</p>
        
        <h3>Offline Conversational AI System</h3>
        <ul>
          <li>Developed offline NLU and conversation system using RASA framework</li>
          <li>Deployed on NVIDIA Jetson TX2 for edge computing</li>
          <li>Created context-aware dialogue for movie recommendations and guest registration</li>
          <li>Enabled the robot to operate without cloud dependency</li>
        </ul>
        
        <h3>Voice Interface Development</h3>
        <ul>
          <li>Implemented Alexa Skills using AWS Lambda</li>
          <li>Built voice-controlled guest registration system</li>
          <li>Created recommendation engine for hospitality scenarios</li>
        </ul>
        
        <h3>Frontend Development</h3>
        <ul>
          <li>Built responsive chatbot interface using React.js/React Native</li>
          <li>Created modular, extensible components with Bootstrap styling</li>
          <li>Designed intuitive UI for robot interaction screens</li>
        </ul>
        
        <h3>Startup Experience</h3>
        <p>Collaborated directly with CEO Dr. Balaji Viswanathan on requirements and product vision. This early-stage startup experience provided valuable insights into rapid prototyping and customer-driven development.</p>
        
        <h3>Technologies</h3>
        <p>RASA NLU/Core, NVIDIA Jetson TX2, AWS Lambda, React.js, React Native, Edge Computing, Natural Language Processing</p>
      `
    }
  };

  // Show modal function
  function showModal(company) {
    const details = companyDetails[company];
    if (details) {
      modalBody.innerHTML = `<h2>${details.title}</h2>${details.content}`;
      modalContainer.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }

  // Hide modal function
  function hideModal() {
    modalContainer.classList.remove("active");
    document.body.style.overflow = "";
  }

  // Add event listeners to see more links
  seeMoreButtons.forEach(button => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const company = button.dataset.modal;
      showModal(company);
    });
  });

  // Close modal on close button click
  if (modalClose) {
    modalClose.addEventListener("click", hideModal);
  }

  // Close modal on background click
  if (modalContainer) {
    modalContainer.addEventListener("click", (e) => {
      if (e.target === modalContainer) {
        hideModal();
      }
    });
  }

  // Close modal on ESC key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalContainer.classList.contains("active")) {
      hideModal();
    }
  });

  // Email copy functionality
  const emailCopyBtn = document.getElementById("email-copy-btn");
  if (emailCopyBtn) {
    emailCopyBtn.addEventListener("click", async () => {
      const email = emailCopyBtn.dataset.email;
      try {
        await navigator.clipboard.writeText(email);
        
        // Update button text temporarily
        const textSpan = emailCopyBtn.querySelector("span:nth-child(2)");
        const originalText = textSpan.textContent;
        textSpan.textContent = "Copied!";
        emailCopyBtn.style.backgroundColor = "rgba(16, 185, 129, 0.1)";
        
        // Reset after 2 seconds
        setTimeout(() => {
          textSpan.textContent = originalText;
          emailCopyBtn.style.backgroundColor = "";
        }, 2000);
      } catch (err) {
        console.error("Failed to copy email:", err);
        // Fallback: show email in alert
        alert(`Email: ${email}`);
      }
    });
  }
});
