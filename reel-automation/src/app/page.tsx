"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";

type FormatPreset = {
  id: string;
  label: string;
  description: string;
  beatCount: number;
  tempo: number;
};

type Scene = {
  id: string;
  tag: string;
  copy: string;
  duration: number;
  motion: string;
  overlay: string;
  beat: string;
};

type PipelineStage = {
  id: string;
  label: string;
  description: string;
};

type BackgroundLoop = {
  id: string;
  label: string;
  videoUrl: string;
  accent: string;
  mood: string;
};

const formatPresets: FormatPreset[] = [
  {
    id: "fast-hype",
    label: "45s Kinetic Launch",
    description: "Explosive hook with staccato pacing. Perfect for creator drops.",
    beatCount: 6,
    tempo: 1.42,
  },
  {
    id: "story-builder",
    label: "60s Story Builder",
    description: "Narrative arc that builds towards a cinematic payoff.",
    beatCount: 5,
    tempo: 1.12,
  },
  {
    id: "calm-craft",
    label: "30s Calm Craft",
    description: "Slow burn craftsmanship with pronounced overlays.",
    beatCount: 4,
    tempo: 0.78,
  },
];

const backgroundLoops: BackgroundLoop[] = [
  {
    id: "neon-lab",
    label: "Neon Creator Lab",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-10s.mp4",
    accent: "from-fuchsia-500/60 via-purple-500/40 to-sky-500/50",
    mood: "Futuristic, high-energy reels workspace",
  },
  {
    id: "city-glide",
    label: "City Glide B-Roll",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-15s.mp4",
    accent: "from-emerald-400/50 via-teal-500/40 to-cyan-400/40",
    mood: "Lifestyle vignettes with smooth drone motion",
  },
  {
    id: "studio-soft",
    label: "Soft Studio Glow",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
    accent: "from-orange-400/50 via-amber-500/40 to-pink-400/40",
    mood: "Warm, human-scale creator footage",
  },
];

const automationStages: PipelineStage[] = [
  {
    id: "script-intel",
    label: "Script Intelligence",
    description: "Hooks, pacing, and CTA auto-arranged for retention.",
  },
  {
    id: "beat-layout",
    label: "Beat Layout",
    description: "Beat matching, micro-timing, and motion directives.",
  },
  {
    id: "asset-sync",
    label: "Asset Sync",
    description: "B-roll pairings, overlay text, and motion cues.",
  },
  {
    id: "voice-fuse",
    label: "Voice Fuse",
    description: "Voiceover cadence lined up to beat map.",
  },
  {
    id: "publish",
    label: "Publish Polish",
    description: "Adaptive export for Reels, TikTok, YT Shorts.",
  },
];

const overlayFragments = [
  "Tap to steal this workflow",
  "Watch the glow up",
  "Blueprint inside",
  "Creator mode activated",
  "Realtime capture",
  "Slide to remix",
];

const motionVerbs = [
  "slow push-in",
  "snap zoom",
  "whip-pan",
  "handheld drift",
  "aerial glide",
  "macro focus pull",
];

const beatDynamics = [
  "Beat drop",
  "Secondary hook",
  "Moment of proof",
  "Texture switch",
  "Voiceover spike",
  "CTA lift",
];

const ctaPhrases = [
  "Save this so you can build yours tonight.",
  "Drop a 🔥 if you want the template pack.",
  "Send this to your future self.",
  "Comment “REEL” and I’ll DM the automation stack.",
  "Follow for the full systems breakdown.",
];

const defaultIdea =
  "Turn daily coffee rituals into cinematic reels that feel handcrafted and real-time.";

const initialFormat = formatPresets[0];
const initialScript = generateScript(defaultIdea, initialFormat);

export default function Home() {
  const [format, setFormat] = useState<FormatPreset>(initialFormat);
  const [idea, setIdea] = useState<string>(defaultIdea);
  const [script, setScript] = useState<string>(initialScript);
  const [scenes, setScenes] = useState<Scene[]>(() => deriveScenes(initialScript));
  const [selectedBackground, setSelectedBackground] = useState<BackgroundLoop>(
    backgroundLoops[0],
  );
  const [tempoBoost, setTempoBoost] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [sceneProgress, setSceneProgress] = useState<number>(0);

  const scenesRef = useRef<Scene[]>(scenes);
  const currentSceneRef = useRef<number>(currentSceneIndex);
  const playbackTempoRef = useRef<number>(format.tempo);

  useEffect(() => {
    scenesRef.current = scenes;
  }, [scenes]);

  const activeSceneIndex = useMemo(() => {
    if (scenes.length === 0) {
      return 0;
    }
    return Math.min(currentSceneIndex, scenes.length - 1);
  }, [currentSceneIndex, scenes.length]);

  useEffect(() => {
    currentSceneRef.current = activeSceneIndex;
  }, [activeSceneIndex]);

  useEffect(() => {
    playbackTempoRef.current = clamp(format.tempo + tempoBoost, 0.6, 1.8);
  }, [format.tempo, tempoBoost]);

  useEffect(() => {
    if (!isPlaying || scenesRef.current.length === 0) {
      return;
    }

    const interval = window.setInterval(() => {
      setSceneProgress((prev) => {
        const activeScenes = scenesRef.current;
        const index = currentSceneRef.current;
        const activeScene = activeScenes[index];

        if (!activeScene) {
          return 0;
        }

        const tempo = playbackTempoRef.current;
        const step = 0.12 * tempo;
        const updated = prev + step;

        if (updated >= activeScene.duration) {
          setCurrentSceneIndex((prevIndex) => {
            const nextIndex = (prevIndex + 1) % activeScenes.length;
            currentSceneRef.current = nextIndex;
            return nextIndex;
          });

          return 0;
        }

        return updated;
      });
    }, 120);

    return () => window.clearInterval(interval);
  }, [isPlaying]);

  const playbackTempo = clamp(format.tempo + tempoBoost, 0.6, 1.8);

  const totalRuntime = useMemo(
    () => calculateRuntime(scenes),
    [scenes],
  );

  const globalProgress = useMemo(() => {
    if (scenes.length === 0) {
      return 0;
    }

    const completed = scenes
      .slice(0, activeSceneIndex)
      .reduce((acc, scene) => acc + scene.duration, 0);

    const activeScene = scenes[activeSceneIndex];
    const activeProgress = activeScene
      ? Math.min(sceneProgress, activeScene.duration)
      : 0;

    return Math.min(
      100,
      ((completed + activeProgress) / Math.max(totalRuntime, 1)) * 100,
    );
  }, [sceneProgress, activeSceneIndex, scenes, totalRuntime]);

  const viralityScore = useMemo(
    () => computeViralityScore(scenes, format, idea),
    [scenes, format, idea],
  );

  const activeStageIndex = Math.min(
    automationStages.length - 1,
    Math.floor((globalProgress / 100) * automationStages.length),
  );

  const currentScene = scenes[activeSceneIndex];

  const handleScriptChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setScript(event.target.value);
  };

  const handleSyncScenes = () => {
    const updated = deriveScenes(script);
    setScenes(updated);
    setCurrentSceneIndex(0);
    setSceneProgress(0);
  };

  const handleSceneCopyChange = (index: number, copy: string) => {
    setScenes((prev) =>
      prev.map((scene, idx) =>
        idx === index ? { ...scene, copy } : scene,
      ),
    );
  };

  const handleSceneDurationChange = (index: number, duration: number) => {
    setScenes((prev) =>
      prev.map((scene, idx) =>
        idx === index ? { ...scene, duration } : scene,
      ),
    );
  };

  const handleSelectFormat = (preset: FormatPreset) => {
    setFormat(preset);
    const regenerated = generateScript(idea, preset);
    setScript(regenerated);
    setScenes(deriveScenes(regenerated));
    setCurrentSceneIndex(0);
    setSceneProgress(0);
  };

  return (
    <div className="min-h-screen bg-[#05010f] text-slate-100">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(91,33,182,0.25),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(8,145,178,0.2),_transparent_55%)]" />

      <header className="border-b border-white/10 bg-black/20 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.4em] text-fuchsia-300/80">
              Agentic Reel Studio
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-white md:text-4xl">
              Automate cinematic reels in real time
            </h1>
            <p className="mt-3 max-w-xl text-sm text-slate-300/90 md:text-base">
              Generate hooks, scenes, overlays, and motion directives on the fly.
              Every edit re-renders the preview instantly so you can publish faster
              than ever.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs uppercase tracking-wide text-slate-300/80 md:text-sm">
            <div>
              <p className="text-[11px] text-slate-400">Runtime</p>
              <p className="mt-1 text-lg font-semibold text-white md:text-xl">
                {totalRuntime.toFixed(1)}s
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Retention score</p>
              <p className="mt-1 text-lg font-semibold text-white md:text-xl">
                {viralityScore}%
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Tempo</p>
              <p className="mt-1 text-lg font-semibold text-white md:text-xl">
                {playbackTempo.toFixed(2)}x
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Stages synced</p>
              <p className="mt-1 text-lg font-semibold text-white md:text-xl">
                {activeStageIndex + 1}/{automationStages.length}
              </p>
            </div>
          </div>
        </div>

        <div className="h-1 w-full bg-white/5">
          <div
            className="h-full rounded-r-full bg-gradient-to-r from-fuchsia-400 via-purple-400 to-sky-400 transition-all duration-500"
            style={{ width: `${globalProgress}%` }}
          />
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-24 pt-10 lg:pt-16 xl:flex-row">
        <section className="flex-1 space-y-10">
          <div className="grid gap-3 sm:grid-cols-3">
            {formatPresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectFormat(preset)}
                className={classNames(
                  "rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition-all duration-200 hover:border-white/30 hover:bg-white/10",
                  preset.id === format.id &&
                    "border-fuchsia-300/60 bg-gradient-to-br from-fuchsia-500/20 via-purple-500/10 to-cyan-500/10 shadow-lg shadow-fuchsia-700/30",
                )}
              >
                <p className="text-sm font-semibold text-white">
                  {preset.label}
                </p>
                <p className="mt-2 text-xs text-slate-300/80">{preset.description}</p>
                <div className="mt-4 flex items-center gap-3 text-[11px] text-slate-400">
                  <span>{preset.beatCount} beats</span>
                  <span aria-hidden>•</span>
                  <span>{preset.tempo.toFixed(2)}x tempo</span>
                </div>
              </button>
            ))}
          </div>

          <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Idea intelligence
                </h2>
                <p className="mt-1 text-sm text-slate-300/90">
                  Drop the concept once and let the agent orchestrate every beat.
                </p>
              </div>
              <button
                onClick={() => {
                  const regenerated = generateScript(idea, format);
                  setScript(regenerated);
                  setScenes(deriveScenes(regenerated));
                  setCurrentSceneIndex(0);
                  setSceneProgress(0);
                }}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-400 to-purple-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-fuchsia-900/30 transition hover:brightness-110"
              >
                Instant blueprint
              </button>
            </div>

            <div className="space-y-3">
              <label
                htmlFor="idea"
                className="text-xs font-semibold uppercase tracking-widest text-fuchsia-200/80"
              >
                Vision prompt
              </label>
              <textarea
                id="idea"
                value={idea}
                onChange={(event) => setIdea(event.target.value)}
                className="h-28 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-fuchsia-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/40"
                placeholder="Describe the vibe, moment, or product you want in the reel."
              />
            </div>

            <div className="space-y-3">
              <label
                htmlFor="script"
                className="text-xs font-semibold uppercase tracking-widest text-fuchsia-200/80"
              >
                Script + overlays
              </label>
              <textarea
                id="script"
                value={script}
                onChange={handleScriptChange}
                className="h-48 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-6 text-white focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              />

              <div className="flex flex-col gap-3 text-xs text-slate-300 sm:flex-row sm:items-center sm:justify-between">
                <button
                  onClick={handleSyncScenes}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 font-medium text-white transition hover:border-sky-400 hover:bg-sky-500/10"
                >
                  Sync scenes with script
                </button>
                <div className="flex items-center gap-3">
                  <label htmlFor="tempo" className="text-[11px] uppercase tracking-[0.2em]">
                    Tempo trim
                  </label>
                  <input
                    id="tempo"
                    type="range"
                    min={-0.3}
                    max={0.5}
                    step={0.05}
                    value={tempoBoost}
                    onChange={(event) => setTempoBoost(parseFloat(event.target.value))}
                    className="h-1 w-40 cursor-pointer appearance-none rounded-full bg-white/10 accent-fuchsia-400"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                Scene automation
              </h2>
              <button
                onClick={() => setIsPlaying((prev) => !prev)}
                className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300 transition hover:border-purple-400 hover:bg-purple-500/10"
              >
                {isPlaying ? "Pause realtime" : "Resume realtime"}
              </button>
            </div>

            <div className="grid gap-4">
              {scenes.map((scene, index) => {
                const active = index === activeSceneIndex;

                return (
                  <div
                    key={scene.id}
                    className={classNames(
                      "space-y-3 rounded-3xl border border-white/10 bg-white/5 p-5 transition-all duration-300",
                      active &&
                        "border-sky-400/60 bg-gradient-to-r from-sky-500/20 via-blue-500/15 to-transparent shadow-lg shadow-sky-800/30",
                    )}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
                          Beat {index + 1}
                        </p>
                        <h3 className="text-lg font-semibold text-white">
                          {scene.tag}
                        </h3>
                      </div>
                      <div className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-slate-300">
                        {scene.motion} · {scene.duration.toFixed(1)}s
                      </div>
                    </div>

                    <textarea
                      value={scene.copy}
                      onChange={(event) =>
                        handleSceneCopyChange(index, event.target.value)
                      }
                      className="h-24 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                    />

                    <div className="flex flex-col justify-between gap-4 text-xs text-slate-300 sm:flex-row sm:items-center">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.2em]">
                          {scene.beat}
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.2em]">
                          Overlay: {scene.overlay}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                          Duration
                        </span>
                        <input
                          type="range"
                          min={2}
                          max={6.5}
                          step={0.1}
                          value={scene.duration}
                          onChange={(event) =>
                            handleSceneDurationChange(index, parseFloat(event.target.value))
                          }
                          className="h-1 w-32 cursor-pointer appearance-none rounded-full bg-white/10 accent-sky-400"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <aside className="xl:w-[420px]">
          <div className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">
                Live reel render
              </p>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-slate-300">
                <span className="relative mr-1 h-2 w-2">
                  <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-80 blur-[1px]" />
                  <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/80" />
                </span>
                {isPlaying ? "Realtime" : "Paused"}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap gap-3">
                {backgroundLoops.map((background) => (
                  <button
                    key={background.id}
                    onClick={() => setSelectedBackground(background)}
                    className={classNames(
                      "flex-1 rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-left text-xs transition hover:border-sky-400 hover:bg-sky-500/10",
                      background.id === selectedBackground.id &&
                        "border-emerald-400/70 bg-gradient-to-br from-emerald-500/20 via-emerald-400/10 to-transparent",
                    )}
                  >
                    <p className="font-semibold text-white">{background.label}</p>
                    <p className="mt-1 text-[11px] text-slate-300/80">{background.mood}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-black/60 shadow-xl">
              <video
                key={selectedBackground.id}
                className="h-[460px] w-full object-cover"
                src={selectedBackground.videoUrl}
                autoPlay
                loop
                muted
                playsInline
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div
                className={classNames(
                  "absolute inset-0 mix-blend-screen opacity-70 blur-3xl",
                  `bg-gradient-to-br ${selectedBackground.accent}`,
                )}
              />

              <div className="absolute inset-0 px-6 py-8">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/70">
                  <span>Beat {activeSceneIndex + 1}</span>
                  <span>{currentScene?.duration.toFixed(1) ?? "0.0"}s</span>
                </div>

                <div className="mt-6 overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl">
                  <div
                    className="h-1 bg-gradient-to-r from-emerald-400 via-sky-400 to-purple-400 transition-all duration-200"
                    style={{
                      width: currentScene
                        ? `${Math.min(
                            100,
                            (sceneProgress / currentScene.duration) * 100,
                          )}%`
                        : "0%",
                    }}
                  />
                </div>

                <div className="mt-10 space-y-3 text-left">
                  <p className="text-xs uppercase tracking-[0.4em] text-slate-200/70">
                    {currentScene?.tag ?? "Realtime render"}
                  </p>
                  <p className="text-3xl font-semibold text-white drop-shadow-[0_12px_32px_rgba(15,23,42,0.45)]">
                    {currentScene?.copy ?? "The automation agent is ready."}
                  </p>
                  <p className="text-sm text-slate-200/90">
                    Motion: {currentScene?.motion} · Overlay: {currentScene?.overlay}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              {automationStages.map((stage, index) => {
                const status =
                  index < activeStageIndex
                    ? "complete"
                    : index === activeStageIndex
                    ? "active"
                    : "pending";

                return (
                  <div
                    key={stage.id}
                    className={classNames(
                      "rounded-2xl border border-white/10 bg-black/40 p-4 transition",
                      status === "complete" && "border-emerald-400/60 bg-emerald-500/10",
                      status === "active" && "border-sky-400/50 bg-sky-500/10",
                    )}
                  >
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
                      <span>{stage.label}</span>
                      <span>
                        {status === "complete" && "Synced"}
                        {status === "active" && "Live"}
                        {status === "pending" && "Queued"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-200/90">{stage.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

function generateScript(idea: string, format: FormatPreset): string {
  const cleanedIdea = idea.trim().length > 0 ? idea.trim() : defaultIdea;

  const hook =
    "Hook: " +
    cleanedIdea.replace(/^Hook:\s*/i, "").replace(/\.$/, "") +
    ". You are inside the workflow as it happens.";

  const setup =
    "Scene 2: Fast cuts show the raw capture, time-stamped overlays validate it's real-time.";

  const proof =
    "Scene 3: Highlight the transformation with close-up texture shots and a voiceover spike.";

  const process =
    "Scene 4: Split-screen reveals automation beats: script intelligence, beat layout, asset sync.";

  const cta = "CTA: " + pickFrom(ctaPhrases, cleanedIdea.length);

  if (format.id === "calm-craft") {
    return [
      hook.replace("Fast cuts", "Soft gradients"),
      "Scene 2: Macro shots linger while captions type out the micro-steps.",
      "Scene 3: Overlay the before/after with a gentle camera drift.",
      cta,
    ].join("\n");
  }

  if (format.id === "story-builder") {
    return [
      hook,
      "Scene 2: Outline the problem with quick on-screen text and a subtle zoom.",
      proof,
      process,
      cta,
    ].join("\n");
  }

  return [hook, setup, proof, process, cta].join("\n");
}

function deriveScenes(script: string): Scene[] {
  const lines = script
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return deriveScenes(initialScript);
  }

  return lines.map((line, index) => {
    const [tag, ...rest] = line.split(":");
    const copy = rest.join(":").trim() || line;
    const duration = clamp(2.6 + copy.length / 32, 2.2, 6.4);

    return {
      id: `scene-${index}-${line.length}`,
      tag: tag ? tag.trim() : `Scene ${index + 1}`,
      copy,
      duration,
      motion: pickFrom(motionVerbs, index + copy.length),
      overlay: pickFrom(overlayFragments, line.length + index * 7),
      beat: pickFrom(beatDynamics, index * 11 + copy.length),
    };
  });
}

function calculateRuntime(scenes: Scene[]): number {
  return scenes.reduce((acc, scene) => acc + scene.duration, 0);
}

function computeViralityScore(scenes: Scene[], format: FormatPreset, idea: string): number {
  const sceneFactor = Math.min(12, scenes.length * 2.6);
  const tempoFactor = (format.tempo - 0.6) * 40;
  const ideaFactor = Math.min(25, idea.trim().split(/\s+/).length * 1.5);
  const overlayFactor = Math.min(
    20,
    scenes.filter((scene) => scene.overlay.length > 0).length * 2.5,
  );

  return Math.min(
    99,
    Math.round(54 + sceneFactor + tempoFactor + ideaFactor + overlayFactor),
  );
}

function pickFrom<T>(array: T[], seed: number): T {
  return array[(Math.abs(Math.round(seed))) % array.length];
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}
