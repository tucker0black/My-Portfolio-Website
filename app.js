const { useEffect, useMemo, useRef, useState } = React;

const CV_FILE_URL = "https://drive.google.com/drive/folders/1UvRjK7ntut5_fLlqDY0N5dhJ9XYfXJ6W?usp=drive_link";

const navLinks = [
  { name: "Home", href: "#home", id: "home" },
  { name: "About", href: "#about", id: "about" },
  { name: "Resume", href: "#resume", id: "resume" },
  { name: "Testimonials", href: "#testimonials", id: "testimonials" },
  { name: "Contact", href: "#contact", id: "contact" }
];

const experiences = [
  {
    title: "Freelance Graphic Designer",
    company: "Freelance Elite",
    period: "2023 — Present",
    description: "I create visually compelling designs such as logos, posters, and social media content that effectively communicate brand identity."
  },
  {
    title: "Freelance Web Developer",
    company: "Freelance Elite",
    period: "2024 — Present",
    description: "I develop modern, responsive websites using clean code and user-focused design to help businesses build a strong online presence."
  },
  {
    title: "Freelance Digital Marketer",
    company: "Freelance Elite",
    period: "2025 — Present",
    description: "I manage social media content and apply simple strategies to increase engagement, visibility, and audience growth."
  }
];

const techStack = [
  "HTML5", "CSS3", "Tailwind CSS", "JavaScript", "React JS", "Git", "GitHub",
  "Vercel", "FastAPI", "SQLite", "Adobe Photoshop", "Adobe Illustrator", "AI Tools", "Responsive UI", "GSAP"
];

const skillGroups = [
  {
    title: "Design",
    icon: "fa-pen-ruler",
    gradient: "from-rose-500 to-orange-500",
    skills: ["Graphic Design", "Brand Identity", "Adobe Photoshop", "Illustrator"]
  },
  {
    title: "Frontend",
    icon: "fa-code",
    gradient: "from-indigo-500 to-cyan-500",
    skills: ["HTML", "CSS", "JavaScript", "React JS", "Tailwind CSS"]
  },
  {
    title: "Backend",
    icon: "fa-server",
    gradient: "from-emerald-500 to-teal-500",
    skills: ["FastAPI", "API Integration", "SQLite", "Deployment"]
  }
];

const testimonials = [
  {
    quote: "Jim delivered a polished and professional website that made our brand look far more premium online.",
    name: "Sarah Chen",
    title: "Creative Director",
    avatar: "SC"
  },
  {
    quote: "Strong communication, clean design, and smooth frontend work. Everything felt modern and well-crafted.",
    name: "Marcus Williams",
    title: "Founder",
    avatar: "MW"
  },
  {
    quote: "A great mix of visual creativity and web development skill. The final result exceeded expectations.",
    name: "Isabella Rossi",
    title: "Brand Manager",
    avatar: "IR"
  }
];

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".section-reveal");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    }, { threshold: 0.12 });
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function Toast({ toast, clearToast }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(clearToast, 2600);
    return () => clearTimeout(timer);
  }, [toast, clearToast]);

  if (!toast) return null;

  const styles = toast.type === "success"
    ? "bg-emerald-500"
    : toast.type === "error"
    ? "bg-rose-500"
    : "bg-indigo-500";

  const icon = toast.type === "success"
    ? "fa-circle-check"
    : toast.type === "error"
    ? "fa-circle-exclamation"
    : "fa-circle-info";

  return (
    <div className={`toast ${styles} text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3`}>
      <i className={`fa-solid ${icon}`}></i>
      <span className="font-medium">{toast.message}</span>
    </div>
  );
}

function SectionTitle({ eyebrow, title, subtitle }) {
  return (
    <div className="text-center mb-16">
      <p className="text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-[0.2em] text-xs">{eyebrow}</p>
      <h2 className="mt-4 text-4xl md:text-5xl font-display font-bold">{title}</h2>
      {subtitle && <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{subtitle}</p>}
    </div>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("home");
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useReveal();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const onScroll = () => {
      setNavScrolled(window.scrollY > 20);
      const top = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setProgress(height > 0 ? (top / height) * 100 : 0);

      const sections = ["home", "about", "resume", "testimonials", "contact"];
      const scrollPos = window.scrollY + 180;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el && scrollPos >= el.offsetTop && scrollPos < el.offsetTop + el.offsetHeight) {
          setActiveSection(section);
          break;
        }
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showToast = (message, type = "info") => setToast({ message, type });
  const clearToast = () => setToast(null);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      service: formData.get("service"),
      message: formData.get("message")
    };

    setSubmitting(true);
    showToast("Sending message...", "info");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const raw = await response.text();
      let data = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch (err) {
        throw new Error("Server returned an invalid response.");
      }

      if (!response.ok) throw new Error(data.message || "Failed to send message.");

      showToast(`Thank you ${payload.name}! Your message has been sent.`, "success");
      alert(`Thank you for reaching out, ${payload.name}! I'll get back to you soon.`);
      e.target.reset();
    } catch (error) {
      showToast(error.message || "Failed to send message.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      <Toast toast={toast} clearToast={clearToast} />

      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${navScrolled ? "nav-scrolled" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12 py-4 flex items-center justify-between">
          <a href="#home" className="font-display font-bold text-2xl tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            JR Portfolio
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className={`text-sm font-semibold uppercase tracking-wide transition ${activeSection === link.id ? "text-indigo-600 dark:text-indigo-400" : "text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"}`}
              >
                {link.name}
              </a>
            ))}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="h-11 w-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              <i className={`fa-solid ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
            </button>
          </div>

          <div className="md:hidden flex items-center gap-3">
            <button onClick={() => setDarkMode(!darkMode)} className="h-11 w-11 rounded-xl bg-slate-100 dark:bg-slate-800">
              <i className={`fa-solid ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
            </button>
            <button onClick={() => setMobileMenu(!mobileMenu)} className="h-11 w-11 rounded-xl bg-slate-100 dark:bg-slate-800">
              <i className={`fa-solid ${mobileMenu ? "fa-xmark" : "fa-bars"}`}></i>
            </button>
          </div>
        </div>

        {mobileMenu && (
          <div className="md:hidden max-w-7xl mx-auto px-5 pb-4">
            <div className="glass rounded-2xl p-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <a key={link.id} href={link.href} onClick={() => setMobileMenu(false)} className="px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      <main>
        <section id="home" className="min-h-screen relative overflow-hidden flex items-center">
          <div className="absolute top-24 left-10 w-56 h-56 rounded-full bg-indigo-500 hero-orb"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full bg-pink-500 hero-orb two"></div>

          <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12 pt-28 pb-16 w-full">
            <div className="grid lg:grid-cols-2 gap-14 items-center">
              <div className="section-reveal">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-sm font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
                  Available for new projects
                </div>
                <h1 className="mt-7 text-6xl md:text-7xl lg:text-8xl font-display font-bold leading-none">
                  <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">I'm Jim Rotha</span>
                </h1>
                <p className="mt-5 text-2xl md:text-3xl font-semibold text-slate-800 dark:text-slate-200">
                  Creative Developer <span className="text-indigo-500">&</span> Graphic Designer
                </p>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400">
                  I design compelling visuals that capture attention and communicate strong brand identity. I build modern, high-performance websites that seamlessly combine creativity with clean, functional code.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <a href="#contact" className="px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-xl hover:scale-105 transition">Start a Project</a>
                  <a href="#resume" className="px-8 py-4 rounded-full border-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition">Explore Resume</a>
                </div>
              </div>

              <div className="section-reveal">
                <div className="relative max-w-md mx-auto">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 opacity-30 blur-3xl"></div>
                  <div className="relative w-80 h-80 md:w-[430px] md:h-[430px] mx-auto rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-1.5 shadow-2xl spin-slow">
                    <div className="w-full h-full rounded-full bg-white dark:bg-slate-950 flex items-center justify-center overflow-hidden">
                      <i className="fa-solid fa-crown text-8xl md:text-9xl bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent"></i>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 glass rounded-2xl p-4 shadow-xl">
                    <i className="fa-solid fa-wand-magic-sparkles text-purple-500 text-2xl"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="py-24">
          <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12">
            <div className="section-reveal">
              <SectionTitle
                eyebrow="About Me"
                title={<>Where <span className="bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">Creativity</span> Meets Code</>}
                subtitle="I combine modern design, frontend development, and practical problem solving to create polished digital experiences."
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-14 items-start">
              <div className="section-reveal">
                <div className="glass rounded-3xl p-8 md:p-10 card-lift">
                  <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                    I'm Jim Rotha, a creative professional focused on graphic design and modern web development.
                  </p>
                  <p className="mt-5 text-slate-600 dark:text-slate-400 leading-8">
                    I enjoy blending clean visual design with functional frontend development to create polished digital experiences that look professional and feel smooth on every device.
                  </p>
                  <p className="mt-4 text-slate-600 dark:text-slate-400 leading-8">
                    My work focuses on brand identity, social media design, responsive websites, and user-friendly interfaces that help businesses build a stronger online presence.
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 section-reveal">
                {skillGroups.map((group) => (
                  <div key={group.title} className="glass rounded-3xl p-6 card-lift">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${group.gradient} flex items-center justify-center text-white text-2xl`}>
                      <i className={`fa-solid ${group.icon}`}></i>
                    </div>
                    <h3 className="mt-5 text-xl font-display font-semibold">{group.title}</h3>
                    <ul className="mt-4 space-y-2 text-slate-600 dark:text-slate-400">
                      {group.skills.map((skill) => (
                        <li key={skill} className="flex items-center gap-2">
                          <i className="fa-solid fa-circle text-[6px] text-indigo-500"></i>
                          <span>{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="resume" className="py-24 bg-gradient-to-b from-slate-50/60 to-transparent dark:from-slate-900/20 dark:to-transparent">
          <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12">
            <div className="section-reveal">
              <SectionTitle eyebrow="Resume" title="Professional Journey" subtitle="Experience, tools, and skills presented in a clean modern layout." />
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="glass rounded-3xl p-8 md:p-10 card-lift section-reveal">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white">
                    <i className="fa-solid fa-briefcase"></i>
                  </div>
                  <h3 className="text-2xl font-display font-semibold">Experience</h3>
                </div>

                <div className="space-y-8">
                  {experiences.map((exp) => (
                    <div key={exp.title} className="relative pl-6 border-l-2 border-indigo-500/40">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500"></div>
                      <h4 className="text-xl font-semibold">{exp.title}</h4>
                      <p className="text-indigo-600 dark:text-indigo-400 font-medium">{exp.company}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{exp.period}</p>
                      <p className="mt-2 text-slate-600 dark:text-slate-400">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass rounded-3xl p-8 md:p-10 card-lift section-reveal">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white">
                    <i className="fa-solid fa-laptop-code"></i>
                  </div>
                  <h3 className="text-2xl font-display font-semibold">Tech Arsenal</h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {techStack.map((tech) => (
                    <div key={tech} className="tech-badge rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 px-4 py-3 text-sm font-medium text-center">
                      {tech}
                    </div>
                  ))}
                </div>

                <div className="mt-10 text-center">
                  <a
                    href={CV_FILE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-700 text-white px-8 py-3.5 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    <i className="fa-solid fa-download"></i>
                    Download CV
                  </a>
                  <p className="mt-3 text-xs text-slate-500">Replace the current folder link in app.js with a direct Google Drive file download link for auto-download.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-24">
          <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12">
            <div className="section-reveal">
              <SectionTitle eyebrow="Testimonials" title="What Clients Say" subtitle="A professional testimonial section with clean layout and modern cards." />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((item) => (
                <div key={item.name} className="glass rounded-3xl p-8 card-lift section-reveal">
                  <div className="flex gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => <i key={i} className="fa-solid fa-star"></i>)}
                  </div>
                  <p className="mt-5 text-slate-600 dark:text-slate-400 leading-8 italic">"{item.quote}"</p>
                  <div className="mt-7 pt-5 border-t border-slate-200 dark:border-slate-700 flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 text-white flex items-center justify-center font-semibold">{item.avatar}</div>
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-indigo-600 dark:text-indigo-400">{item.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="py-24 bg-gradient-to-t from-slate-50/60 to-transparent dark:from-slate-900/20 dark:to-transparent">
          <div className="max-w-6xl mx-auto px-5 md:px-8 lg:px-12">
            <div className="section-reveal">
              <SectionTitle
                eyebrow="Get In Touch"
                title="Let's Create Magic"
                subtitle="The contact form submits to your backend and sends the message directly to your Telegram bot."
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="glass rounded-3xl p-8 md:p-10 card-lift section-reveal">
                <h3 className="text-2xl font-display font-semibold mb-8">Contact Info</h3>

                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex items-center justify-center">
                      <i className="fa-solid fa-envelope"></i>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Email</p>
                      <p className="font-medium">jimrothaa@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center">
                      <i className="fa-brands fa-telegram"></i>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Telegram Bot</p>
                      <p className="font-medium">@jimrothaportfolio_Bot</p>
                    </div>
                  </div>

                  <div className="pt-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-4">Social</p>
                    <div className="flex gap-3">
                      {["github", "linkedin-in", "x-twitter", "telegram"].map((icon) => (
                        <a key={icon} href="#" className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:scale-105 transition">
                          <i className={`fa-brands fa-${icon}`}></i>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass rounded-3xl p-8 md:p-10 card-lift section-reveal">
                <h3 className="text-2xl font-display font-semibold mb-8">Send Message</h3>

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Your name"
                    className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 px-5 py-4 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Email address"
                    className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 px-5 py-4 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone number (optional)"
                    className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 px-5 py-4 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <select
                    name="service"
                    className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 px-5 py-4 outline-none focus:ring-2 focus:ring-indigo-500"
                    defaultValue="Web Development"
                  >
                    <option>Web Development</option>
                    <option>Graphic Design</option>
                    <option>Brand Identity</option>
                    <option>UI/UX Design</option>
                    <option>Other</option>
                  </select>
                  <textarea
                    name="message"
                    rows="5"
                    required
                    placeholder="Tell me about your project..."
                    className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 px-5 py-4 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  ></textarea>

                  <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 transition ${submitting ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.01]"}`}
                  >
                    {submitting ? <><i className="fa-solid fa-spinner fa-spin"></i> Sending...</> : <><span>Send Message</span><i className="fa-brands fa-telegram"></i></>}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        <footer className="py-10 text-center text-sm text-slate-500 border-t border-slate-200 dark:border-slate-800">
          © 2026 Jim Rotha — Crafted with <i className="fa-solid fa-heart text-rose-500"></i>
        </footer>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
