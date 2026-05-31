"use client";

import { useFBX } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { AnimationAction, AnimationClip, AnimationMixer } from "three";

type AnimationName = "idle" | "walking" | "running";

function removeRootMotion(clip: AnimationClip) {
  const cloned = clip.clone();

  cloned.tracks = cloned.tracks.filter(
    (track) =>
      !track.name.toLowerCase().includes("hips.position") &&
      !track.name.toLowerCase().includes("root.position")
  );

  return cloned;
}

export default function PlayerModel({
  isMoving,
  isRunning,
}: {
  isMoving: boolean;
  isRunning: boolean;
}) {
  const model = useFBX("/models/Y_Bot.fbx");
  const idle = useFBX("/models/Idle.fbx");
  const walking = useFBX("/models/Walking.fbx");
  const running = useFBX("/models/Running.fbx");

  const clips = useMemo(
    () => ({
      idle: removeRootMotion(idle.animations[0]),
      walking: removeRootMotion(walking.animations[0]),
      running: removeRootMotion(running.animations[0]),
    }),
    [idle, walking, running]
  );

  const mixer = useRef<AnimationMixer | null>(null);
  const actions = useRef<Record<AnimationName, AnimationAction | null>>({
    idle: null,
    walking: null,
    running: null,
  });

  const current = useRef<AnimationName>("idle");

  useEffect(() => {
    mixer.current = new AnimationMixer(model);

    actions.current = {
      idle: mixer.current.clipAction(clips.idle),
      walking: mixer.current.clipAction(clips.walking),
      running: mixer.current.clipAction(clips.running),
    };

    actions.current.idle?.reset().play();
    current.current = "idle";

    return () => {
      mixer.current?.stopAllAction();
      mixer.current = null;
    };
  }, [model, clips]);

  useEffect(() => {
    if (!mixer.current) return;

    const nextName: AnimationName = isRunning
      ? "running"
      : isMoving
      ? "walking"
      : "idle";

    if (current.current === nextName) return;

    const previousAction = actions.current[current.current];
    const nextAction = actions.current[nextName];

    if (!nextAction) return;

    nextAction.reset().fadeIn(0.25).play();
    previousAction?.fadeOut(0.25);

    current.current = nextName;
  }, [isMoving, isRunning]);

  useFrame((_, delta) => {
    mixer.current?.update(delta);
  });

  return (
    <primitive
      object={model}
      scale={[0.01, 0.01, 0.01]}
      position={[0, 0.35, 0]}
    />
  );
}