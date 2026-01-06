gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true
});

function raf(time) {
  lenis.raf(time);
  ScrollTrigger.update();
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

lenis.on("scroll", ScrollTrigger.update);


window.addEventListener("load", () => {
  gsap.utils.toArray(".reveal").forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 80 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none"
        }
      }
    );
  });
});

function animateScore(el, target) {
  const duration = 900;
  const startTime = performance.now();

  function getColor(value) {
    if (value < 40) return "#ff5f5f";   // red
    if (value < 70) return "#f5c542";   // yellow
    return "#4ade80";                   // green
  }

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(eased * target);

    el.innerText = value + "%";
    el.style.color = getColor(value);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

function animateConfidenceBar(bar, target) {
  let color = "#ff5f5f"; // red
  if (target >= 70) {
    color = "#4ade80";   // green
  } else if (target >= 40) {
    color = "#f5c542";   // yellow
  }

  const wrap = bar.parentElement;
  if (wrap) {
    wrap.style.display = "block";
    wrap.style.height = "8px";
    wrap.style.overflow = "hidden";
  }

  bar.style.display = "block";
  bar.style.opacity = "1";
  bar.style.height = "100%";

  bar.style.backgroundColor = color;

  bar.style.width = "1%";
  requestAnimationFrame(() => {
    bar.style.width = target + "%";
  });
}

function updateConfidenceContext(score) {
  const ctx = document.getElementById("confidenceContext");
  if (!ctx) return;

  let text = "";
  let level = "low";

  if (score >= 70) {
    level = "high";
    text =
      "Most claims are supported by relevant citations or are low-risk factual statements. The content shows strong alignment between claims and sources, resulting in high confidence.";
  } else if (score >= 40) {
    level = "medium";
    text =
      "Some claims lack strong supporting evidence or use weakly related citations. While not entirely unreliable, parts of the content require closer verification.";
  } else {
    level = "low";
    text =
      "Several claims rely on misleading or unverifiable citations. This creates false confidence and significantly reduces the overall trustworthiness of the content.";
  }

  ctx.className = `confidence-context ${level}`;
  ctx.textContent = text;

  ctx.style.display = "block";
  ctx.style.opacity = "1";
  ctx.style.marginTop = "12px";
}


async function verify() {
  const text = document.getElementById("inputText").value;
  const scoreSection = document.getElementById("result");
  const analysisBox = document.getElementById("analysis");

  analysisBox.innerHTML = "";

  const res = await fetch("http://127.0.0.1:8000/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });

  const data = await res.json();

  scoreSection.innerHTML = `
  <div class="score">
    TruthLens Score: <strong id="scoreValue">0%</strong>

    <div class="confidence-bar-wrap">
      <div class="confidence-bar" id="confidenceBar"></div>
    </div>

    <div id="confidenceContext" class="confidence-context">
      <!-- Explanation appears here -->
    </div>
  </div>
`;

  const scoreEl = document.getElementById("scoreValue");
  const barEl = document.getElementById("confidenceBar");

  const score =
    typeof data.trust_score === "number"
      ? data.trust_score
      : 0;

  scoreEl.innerText = score + "%";

  requestAnimationFrame(() => {
    animateScore(scoreEl, score);
    animateConfidenceBar(barEl, score);
  });

  updateConfidenceContext(score);

  data.sentences.forEach((item, i) => {
    const div = document.createElement("div");
    div.classList.add("sentence");

    if (item.label === "verified") {
      div.classList.add("verified");
    } else {
      div.classList.add("hallucinated");
    }

    div.textContent = item.text;
    analysisBox.appendChild(div);

    gsap.from(div, {
      opacity: 0,
      y: 24,
      duration: 1,
      ease: "power3.out",
      delay: i * 0.35
    });
  });

  // Smooth auto-scroll to analysis (Apple-like)
  lenis.scrollTo(analysisBox, { offset: -80 });
}


gsap.utils.toArray(".story").forEach((section) => {
  const elements = section.querySelectorAll(".story-text, .step");

  gsap.from(elements, {
    opacity: 0,
    y: 80,
    duration: 1.2,
    ease: "power3.out",
    stagger: 0.2,
    scrollTrigger: {
      trigger: section,
      start: "top 75%",
      toggleActions: "play none none none"
    }
  });

  ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: "+=80%",
    pin: true,
    pinSpacing: false
  });
});


gsap.utils.toArray(".story").forEach(section => {
  const bg = section.querySelector(".story-bg");
  if (!bg) return;

  gsap.to(bg, {
    y: -80, // subtle depth
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      scrub: true
    }
  });
});
