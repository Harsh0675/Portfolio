document.addEventListener("DOMContentLoaded", () => {
  // 1. Mock Articles Dataset
  const INITIAL_ARTICLES = [
    {
      id: "art-101",
      title: "Architecting High-Throughput Microservices: Caching, Indexing & Rate Limiting",
      topic: "architecture",
      author: "Harsh Nagar",
      date: "Aug 12, 2026",
      readTime: "8 min read",
      tags: ["Microservices", "Redis", "PostgreSQL", "System Design"],
      likes: 142,
      bookmarked: false,
      summary: "A deep-dive into building microservices capable of serving 50,000+ Requests/Sec using Redis multi-tier caching, DB composite indexing, and Token-Bucket rate limiters.",
      content: `
        <h3>1. The Bottleneck: Unthrottled Database Hits</h3>
        <p>When scaling web applications, direct database access for every incoming HTTP request quickly becomes the primary bottleneck. Relational databases like PostgreSQL excel at ACID compliance but suffer under un-cached read spikes.</p>

        <div class="takeaway-box">
          <i class="fa-solid fa-lightbulb"></i> <strong>Key Takeaway:</strong> Never query persistent DB storage for static or hot-path read operations. Layer an in-memory datastore like Redis as your first line of defense.
        </div>

        <h3>2. Implementing Multi-Tier In-Memory Caching</h3>
        <p>By placing Redis ahead of the relational layer and implementing a cache-aside pattern with TTL expiration, latency drops from ~45ms to under <4ms.</p>

        <div class="code-box">// Cache-Aside Pattern in Node.js / Express
async function getArticle(articleId) {
  const cacheKey = \`article:\${articleId}\`;
  const cachedData = await redis.get(cacheKey);
  
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const dbData = await db.query('SELECT * FROM articles WHERE id = $1', [articleId]);
  await redis.setex(cacheKey, 3600, JSON.stringify(dbData));
  return dbData;
}</div>

        <h3>3. Token Bucket Rate Limiting</h3>
        <p>Protecting backend services from DDoS and abuse requires algorithmic rate limiting. The Token Bucket algorithm allows burst traffic while guaranteeing average throughput caps.</p>
      `
    },
    {
      id: "art-102",
      title: "Mastering Core Web Vitals: Optimizing LCP & INP in Modern Single-Page Apps",
      topic: "frontend",
      author: "Harsh Nagar",
      date: "Aug 10, 2026",
      readTime: "6 min read",
      tags: ["Performance", "Web Vitals", "LCP", "JavaScript"],
      likes: 98,
      bookmarked: false,
      summary: "Strategies for achieving 98+ Google Lighthouse performance scores by optimizing Largest Contentful Paint (LCP) and Interaction to Next Paint (INP).",
      content: `
        <h3>1. Deconstructing LCP Bottlenecks</h3>
        <p>Largest Contentful Paint measures render speed for the primary hero content. High LCP is typically caused by slow server response times, render-blocking JavaScript, or un-optimized hero images.</p>

        <div class="code-box">&lt;!-- Fetch Priority Optimization for LCP Images --&gt;
&lt;link rel="preload" fetchpriority="high" as="image" href="hero.webp" type="image/webp"&gt;</div>

        <h3>2. Minimizing Long Tasks for Smooth INP</h3>
        <p>Interaction to Next Paint (INP) measures UI responsiveness during user taps and clicks. Long synchronous tasks on the main thread cause dropped frames.</p>
      `
    },
    {
      id: "art-103",
      title: "PostgreSQL Indexing Mastery: B-Trees, GiST & Query Optimization",
      topic: "backend",
      author: "Harsh Nagar",
      date: "Aug 05, 2026",
      readTime: "10 min read",
      tags: ["PostgreSQL", "Database", "SQL", "Indexing"],
      likes: 115,
      bookmarked: false,
      summary: "How to use EXPLAIN ANALYZE to detect sequential table scans, create composite B-Tree indexes, and speed up complex SQL JOIN operations by 20x.",
      content: `
        <h3>1. Analyzing Query Plans with EXPLAIN ANALYZE</h3>
        <p>Before adding indexes, inspect actual query execution times to discover sequential table scans across millions of rows.</p>

        <div class="code-box">EXPLAIN ANALYZE 
SELECT u.name, o.total_amount 
FROM users u 
JOIN orders o ON u.id = o.user_id 
WHERE o.status = 'COMPLETED' AND o.created_at >= '2026-01-01';</div>
      `
    },
    {
      id: "art-104",
      title: "Automating CI/CD Pipelines with GitHub Actions & Docker Containers",
      topic: "devops",
      author: "Harsh Nagar",
      date: "Jul 28, 2026",
      readTime: "7 min read",
      tags: ["CI/CD", "Docker", "GitHub Actions", "DevOps"],
      likes: 87,
      bookmarked: false,
      summary: "Step-by-step guide to writing GitHub Actions workflow pipelines that build Docker images, execute unit test suites, and deploy seamlessly to production.",
      content: `
        <h3>1. Automated Test & Build Workflows</h3>
        <p>CI/CD pipelines enforce code quality by running test suites on every pull request before merging into main.</p>
      `
    }
  ];

  // 2. Storage Helpers
  const STORAGE_KEY = "techinsights_articles_db";

  const getArticles = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ARTICLES));
      return INITIAL_ARTICLES;
    }
    return JSON.parse(data);
  };

  const saveArticles = (articles) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  };

  const showToast = (message) => {
    const toast = document.getElementById("toast");
    if (toast) {
      toast.textContent = message;
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 3000);
    }
  };

  // 3. Render Views
  let currentActiveTopic = "all";

  const renderArticles = () => {
    const articles = getArticles();
    const searchVal = document.getElementById("search-input")?.value.toLowerCase().trim() || "";

    const filtered = articles.filter((art) => {
      const matchesSearch =
        art.title.toLowerCase().includes(searchVal) ||
        art.summary.toLowerCase().includes(searchVal) ||
        art.tags.some((t) => t.toLowerCase().includes(searchVal));

      if (currentActiveTopic === "bookmarks") {
        return matchesSearch && art.bookmarked;
      }
      const matchesTopic = currentActiveTopic === "all" || art.topic === currentActiveTopic;
      return matchesSearch && matchesTopic;
    });

    const countLabel = document.getElementById("article-count-label");
    if (countLabel) countLabel.textContent = `Showing ${filtered.length} article${filtered.length === 1 ? "" : "s"}`;

    // Render Featured Banner (first article in dataset)
    const featuredBanner = document.getElementById("featured-banner");
    if (featuredBanner && articles.length > 0 && currentActiveTopic === "all" && !searchVal) {
      const feat = articles[0];
      featuredBanner.style.display = "grid";
      featuredBanner.innerHTML = `
        <div>
          <span class="topic-tag">${feat.topic.toUpperCase()}</span>
          <h2 class="featured-title">${feat.title}</h2>
          <p class="text-muted" style="margin-bottom: 1.2rem; font-size: 1.05rem;">${feat.summary}</p>
          
          <div class="article-meta-flex">
            <div class="author-chip">
              <span class="avatar-mini">${feat.author.split(" ").map(n=>n[0]).join("")}</span>
              <span>${feat.author}</span>
            </div>
            <span>&bull; ${feat.date}</span>
            <span>&bull; ${feat.readTime}</span>
            <span>&bull; <i class="fa-solid fa-heart text-danger"></i> ${feat.likes} Likes</span>
            <button class="btn btn-primary btn-sm" id="btn-read-featured" data-id="${feat.id}">
              Read Full Article <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      `;

      document.getElementById("btn-read-featured")?.addEventListener("click", (e) => {
        const id = e.target.closest("button").getAttribute("data-id");
        openReaderModal(id);
      });
    } else if (featuredBanner) {
      featuredBanner.style.display = "none";
    }

    // Render Grid
    const grid = document.getElementById("articles-grid");
    if (!grid) return;

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;" class="card text-muted">
          <i class="fa-solid fa-newspaper" style="font-size: 2.5rem; margin-bottom: 1rem; display: block;"></i>
          No technical articles found matching your query.
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map((art) => `
      <article class="article-card card" data-id="${art.id}">
        <div class="article-card-header">
          <span class="topic-tag">${art.topic}</span>
          <span class="small text-muted"><i class="fa-regular fa-clock"></i> ${art.readTime}</span>
        </div>

        <h3 class="article-card-title">${art.title}</h3>
        <p class="article-card-summary">${art.summary}</p>

        <div class="article-card-footer">
          <div class="author-chip">
            <span class="avatar-mini">${art.author.split(" ").map(n=>n[0]).join("")}</span>
            <span>${art.author}</span>
          </div>

          <div class="article-card-actions">
            <button class="icon-btn-action btn-like-card" data-id="${art.id}" title="Like">
              <i class="fa-solid fa-heart text-danger"></i> ${art.likes}
            </button>
            <button class="icon-btn-action btn-bookmark-card ${art.bookmarked ? 'active' : ''}" data-id="${art.id}" title="Bookmark">
              <i class="${art.bookmarked ? 'fa-solid' : 'fa-regular'} fa-bookmark"></i>
            </button>
          </div>
        </div>
      </article>
    `).join("");

    // Attach Card Event Listeners
    grid.querySelectorAll(".article-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        if (!e.target.closest(".icon-btn-action")) {
          const id = card.getAttribute("data-id");
          openReaderModal(id);
        }
      });
    });

    grid.querySelectorAll(".btn-like-card").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.getAttribute("data-id");
        likeArticle(id);
      });
    });

    grid.querySelectorAll(".btn-bookmark-card").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.getAttribute("data-id");
        toggleBookmark(id);
      });
    });
  };

  // 4. Topic Filter Pills
  document.querySelectorAll(".filter-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".filter-pill").forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      currentActiveTopic = pill.getAttribute("data-topic");
      renderArticles();
    });
  });

  document.getElementById("search-input")?.addEventListener("input", renderArticles);

  // 5. Article Interactivity: Likes & Bookmarks
  const likeArticle = (id) => {
    const articles = getArticles();
    const art = articles.find((a) => a.id === id);
    if (art) {
      art.likes += 1;
      saveArticles(articles);
      renderArticles();
      showToast("Liked article!");
    }
  };

  const toggleBookmark = (id) => {
    const articles = getArticles();
    const art = articles.find((a) => a.id === id);
    if (art) {
      art.bookmarked = !art.bookmarked;
      saveArticles(articles);
      renderArticles();
      showToast(art.bookmarked ? "Article bookmarked!" : "Removed from bookmarks.");
    }
  };

  // 6. Article Reader Modal
  const readerModal = document.getElementById("reader-modal");
  let activeReadingId = null;

  const openReaderModal = (id) => {
    const articles = getArticles();
    const art = articles.find((a) => a.id === id);
    if (!art || !readerModal) return;

    activeReadingId = id;

    const header = document.getElementById("reader-header");
    const body = document.getElementById("reader-body");

    if (header) {
      header.innerHTML = `
        <span class="topic-tag">${art.topic.toUpperCase()}</span>
        <h2 class="reader-title">${art.title}</h2>
        <div class="article-meta-flex">
          <div class="author-chip">
            <span class="avatar-mini">${art.author.split(" ").map(n=>n[0]).join("")}</span>
            <span>${art.author}</span>
          </div>
          <span>&bull; ${art.date}</span>
          <span>&bull; ${art.readTime}</span>
        </div>
      `;
    }

    if (body) {
      body.innerHTML = art.content;
    }

    document.getElementById("like-count").textContent = art.likes;
    document.getElementById("bookmark-text").textContent = art.bookmarked ? "Bookmarked" : "Bookmark";

    readerModal.classList.add("active");
  };

  document.getElementById("reader-close-btn")?.addEventListener("click", () => readerModal?.classList.remove("active"));
  document.getElementById("reader-done-btn")?.addEventListener("click", () => readerModal?.classList.remove("active"));

  document.getElementById("btn-like-article")?.addEventListener("click", () => {
    if (activeReadingId) {
      likeArticle(activeReadingId);
      const art = getArticles().find((a) => a.id === activeReadingId);
      if (art) document.getElementById("like-count").textContent = art.likes;
    }
  });

  document.getElementById("btn-bookmark-modal")?.addEventListener("click", () => {
    if (activeReadingId) {
      toggleBookmark(activeReadingId);
      const art = getArticles().find((a) => a.id === activeReadingId);
      if (art) document.getElementById("bookmark-text").textContent = art.bookmarked ? "Bookmarked" : "Bookmark";
    }
  });

  // 7. Publish New Article Modal
  const publishModal = document.getElementById("publish-modal");
  const publishForm = document.getElementById("publish-form");

  document.getElementById("btn-publish-article")?.addEventListener("click", () => {
    if (publishModal && publishForm) {
      publishForm.reset();
      publishModal.classList.add("active");
    }
  });

  document.getElementById("publish-close-btn")?.addEventListener("click", () => publishModal?.classList.remove("active"));
  document.getElementById("publish-cancel-btn")?.addEventListener("click", () => publishModal?.classList.remove("active"));

  if (publishForm) {
    publishForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const newArt = {
        id: `art-${Date.now()}`,
        title: document.getElementById("input-title").value.trim(),
        topic: document.getElementById("input-topic").value,
        author: document.getElementById("input-author").value.trim(),
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        readTime: document.getElementById("input-readtime").value.trim(),
        tags: document.getElementById("input-tags").value.split(",").map((t) => t.trim()),
        likes: 1,
        bookmarked: false,
        summary: document.getElementById("input-summary").value.trim(),
        content: `<h3>Article Content</h3><p>${document.getElementById("input-content").value.trim()}</p>`
      };

      const articles = getArticles();
      articles.unshift(newArt);
      saveArticles(articles);

      publishModal.classList.remove("active");
      renderArticles();
      showToast("Technical article published successfully!");
    });
  }

  // Initialize View
  renderArticles();
});
