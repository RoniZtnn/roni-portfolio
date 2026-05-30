"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { motion } from "framer-motion";
import {
  FaShieldAlt,
  FaServer,
  FaCode,
  FaNetworkWired,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
} from "react-icons/fa";

const skills = [
  { Icon: FaShieldAlt, title: "Cybersecurity", desc: "Microsoft Sentinel, KQL, SIEM Monitoring, Incident Detection." },
  { Icon: FaNetworkWired, title: "Networking", desc: "MikroTik, TCP/IP, routing, troubleshooting, ISP infrastructure." },
  { Icon: FaCode, title: "Development", desc: "React, Node.js, Python, PostgreSQL, APIs, full-stack apps." },
  { Icon: FaServer, title: "Systems", desc: "Linux, Raspberry Pi, automation, system troubleshooting." },
];

const projects = [
  {
    title: "Smart Fall Detection Helmet",
    desc: "Raspberry Pi 5 system using sensors, camera, GPS, Discord alerts, audio alerts, and cancel button logic.",
    media: [
      { type: "image", src: "/projects/sh_all_p.jpeg" },
      { type: "image", src: "/projects/sh_brochure.png" },
      { type: "image", src: "/projects/sh_helmet.png" },
      { type: "image", src: "/projects/sh_poster_senior.png" },
      { type: "image", src: "/projects/sh_us.jpeg" },
      { type: "video", src: "/projects/sh_video_smart_helmet.mp4" },
    ],
  },
  {
    title: "Health App",
    desc: "Full-stack health platform with React Native, Node.js, PostgreSQL, authentication, email verification, and QR features.",
    media: [
      { type: "image", src: "/projects/ha_verify_code.png" },
      { type: "video", src: "/projects/ha_healthapp_vid.mp4" },
    ],
  },
  {
    title: "Microsoft Sentinel SIEM Lab",
    desc: "SOC monitoring lab focused on Microsoft Sentinel alerts, KQL queries, log analysis, incidents, and security events.",
    media: [
      { type: "image", src: "/projects/ms_3.png" },
      { type: "image", src: "/projects/ms_6.png" },
      { type: "image", src: "/projects/ms_7.png" },
      { type: "image", src: "/projects/ms_8.png" },
      { type: "image", src: "/projects/ms_9.png" },
      { type: "image", src: "/projects/ms_10.png" },
      { type: "image", src: "/projects/ms_12.png" },
      { type: "image", src: "/projects/ms_security_events.png" },
    ],
  },
  {
    title: "ISP / Networking Experience",
    desc: "Managed MikroTik configuration, troubleshooting, subnetting, connectivity, and support for many clients.",
    media: [
      { type: "image", src: "/projects/isp1.jpeg" },
      { type: "image", src: "/projects/isp2.jpeg" },
      { type: "image", src: "/projects/isp3.jpeg" },
      { type: "image", src: "/projects/isp4.jpeg" },
      { type: "image", src: "/projects/isp5.jpeg" },
      { type: "image", src: "/projects/isp6.jpeg" },
      { type: "image", src: "/projects/isp7.jpeg" },
      { type: "image", src: "/projects/isp8.jpeg" },
      { type: "image", src: "/projects/isp9.jpeg" },
      { type: "image", src: "/projects/isp10.jpeg" },
      { type: "image", src: "/projects/isp11.jpeg" },
      { type: "image", src: "/projects/isp13.jpeg" },
      { type: "image", src: "/projects/isp15.jpeg" },
      { type: "image", src: "/projects/isp16.jpeg" },
      { type: "image", src: "/projects/isp17.jpeg" },
      { type: "image", src: "/projects/isp18.jpeg" },
    ],
  },
];

export default function Home() {
  const [openProject, setOpenProject] = useState<number | null>(null);
  const [currentMedia, setCurrentMedia] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearSlideTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const startSlideTimer = useCallback(() => {
    clearSlideTimer();

    if (openProject === null) return;

    const activeMedia = projects[openProject].media[currentMedia];
    if (activeMedia.type === "video") return;

    intervalRef.current = setInterval(() => {
      setCurrentMedia((prev) => {
        const total = projects[openProject].media.length;
        return (prev + 1) % total;
      });
    }, 5000);
  }, [clearSlideTimer, openProject, currentMedia]);

  useEffect(() => {
    startSlideTimer();
    return () => clearSlideTimer();
  }, [startSlideTimer, clearSlideTimer]);

  const openCard = (index: number) => {
    setOpenProject(openProject === index ? null : index);
    setCurrentMedia(0);
  };

  const nextMedia = () => {
    if (openProject === null) return;
    setCurrentMedia((prev) => (prev + 1) % projects[openProject].media.length);
  };

  const prevMedia = () => {
    if (openProject === null) return;
    setCurrentMedia((prev) =>
      prev === 0 ? projects[openProject].media.length - 1 : prev - 1
    );
  };

  return (
    <main className="relative z-10 min-h-screen bg-transparent text-white">
      

      <nav className="fixed top-0 z-50 w-full border-b border-cyan-400/20 bg-black/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="font-bold text-cyan-400">RZ</h1>
          <div className="flex gap-6 text-sm text-gray-300">
            <a href="#about" className="hover:text-cyan-400">About</a>
            <a href="#projects" className="hover:text-cyan-400">Projects</a>
            <a href="#contact" className="hover:text-cyan-400">Contact</a>
          </div>
        </div>
      </nav>

      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10">
          <p className="mb-4 text-sm uppercase tracking-[0.4em] text-cyan-400">Cybersecurity Portfolio</p>
          <h1 className="text-6xl font-extrabold md:text-8xl">Roni Zeitouni</h1>
          <p className="mt-6 text-xl text-gray-300">Cybersecurity Engineer • SOC Analyst • Networking • Full Stack</p>
          <p className="mx-auto mt-5 max-w-3xl text-gray-500">
            I build and troubleshoot secure systems, from SIEM monitoring and network infrastructure to Raspberry Pi safety devices and full-stack applications.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a href="#projects" className="rounded-2xl bg-cyan-400 px-6 py-3 font-semibold text-black transition hover:scale-105">View Projects</a>
            <a href="/Roni_CV.pdf" target="_blank" className="rounded-2xl border border-cyan-400 px-6 py-3 transition hover:bg-cyan-400 hover:text-black">View CV</a>
          </div>
        </motion.div>
      </section>

      <section id="about" className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-4xl font-bold text-cyan-400">About Me</h2>
        <p className="mt-6 max-w-4xl text-lg leading-8 text-gray-400">
          I am a Computer and Communications Engineering graduate with hands-on experience in cybersecurity, IT support, networking, and software development. My experience includes SOC monitoring with Microsoft Sentinel, log analysis, KQL, incident detection, Linux systems, networking support, and real-world technical troubleshooting.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-4xl font-bold text-cyan-400">Skills</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map(({ Icon, title, desc }) => (
            <motion.div key={title} whileHover={{ scale: 1.05 }} className="rounded-3xl border border-cyan-400/30 bg-white/5 p-8 backdrop-blur">
              <Icon className="text-4xl text-cyan-400" />
              <h3 className="mt-4 text-2xl font-bold">{title}</h3>
              <p className="mt-3 text-gray-400">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="projects" className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-4xl font-bold text-cyan-400">Projects</h2>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {projects.map((project, index) => {
            const isOpen = openProject === index;
            const media = project.media[currentMedia];

            return (
              <div key={project.title} className={isOpen ? "md:col-span-2" : ""}>
                <motion.div
                  whileHover={{ y: -8 }}
                  onClick={() => openCard(index)}
                  className="cursor-pointer rounded-3xl border border-cyan-400/30 bg-white/5 p-8 transition hover:border-cyan-400 hover:bg-cyan-400/10"
                >
                  <h3 className="text-2xl font-bold">{project.title}</h3>
                  <p className="mt-4 leading-7 text-gray-400">{project.desc}</p>
                  <p className="mt-4 text-sm text-cyan-400">Click to view media</p>
                </motion.div>

                {isOpen && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mx-auto mt-6 max-w-5xl rounded-3xl border border-cyan-400/30 bg-black/70 p-6 shadow-[0_0_30px_rgba(34,211,238,0.2)] backdrop-blur-md">
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="text-lg font-bold text-cyan-400">{project.title}</h4>
                      <button onClick={() => setOpenProject(null)} className="rounded-full border border-cyan-400 p-2 hover:bg-cyan-400 hover:text-black">
                        <FaTimes />
                      </button>
                    </div>

                    <div className="relative overflow-hidden rounded-2xl border border-cyan-400/20 bg-black/60">
                      {media.type === "image" ? (
                        <div className="relative h-[420px] w-full md:h-[720px]">
                          <Image src={media.src} alt={project.title} fill className="object-contain" />
                        </div>
                      ) : (
                        <video
                          src={media.src}
                          controls
                          autoPlay
                          muted
                          playsInline
                          className="h-[420px] w-full object-contain md:h-[720px]"
                          onLoadedMetadata={(e) => {
                            e.currentTarget.muted = true;
                            e.currentTarget.volume = 0;
                          }}
                          onEnded={nextMedia}
                        />
                      )}

                      <button onClick={prevMedia} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/70 p-3 text-cyan-400 hover:bg-cyan-400 hover:text-black">
                        <FaChevronLeft />
                      </button>
                      <button onClick={nextMedia} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/70 p-3 text-cyan-400 hover:bg-cyan-400 hover:text-black">
                        <FaChevronRight />
                      </button>
                    </div>

                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                      {project.media.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentMedia(i)}
                          className={`h-2 w-8 rounded-full ${currentMedia === i ? "bg-cyan-400" : "bg-gray-700"}`}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-6xl px-6 py-24 text-center">
        <h2 className="text-4xl font-bold text-cyan-400">Contact</h2>
        <p className="mx-auto mt-6 max-w-2xl text-gray-400">
          I am open to cybersecurity, IT support, networking, technical support, and internship opportunities.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a href="mailto:ronizeitouni22@gmail.com" className="rounded-2xl bg-cyan-400 px-6 py-3 font-semibold text-black transition hover:scale-105">Email Me</a>
          <a href="https://www.linkedin.com/in/roni-zeitouni/" target="_blank" className="rounded-2xl border border-cyan-400 px-6 py-3 transition hover:bg-cyan-400 hover:text-black">LinkedIn</a>
          <a href="https://github.com/RoniZtnn" target="_blank" className="rounded-2xl border border-cyan-400 px-6 py-3 transition hover:bg-cyan-400 hover:text-black">GitHub</a>
        </div>
      </section>
    </main>
  );
}