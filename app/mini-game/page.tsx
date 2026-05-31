"use client";

import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Text } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { Group, Vector3 } from "three";
import PlayerModel from "./PlayerModel";

const projectZones = [
  { name: "Smart Helmet Lab", position: [-18, 0, -18], color: "#22d3ee" },
  { name: "Sentinel SOC", position: [18, 0, -18], color: "#38bdf8" },
  { name: "ISP Tower", position: [-18, 0, 18], color: "#06b6d4" },
  { name: "Health App HQ", position: [18, 0, 18], color: "#67e8f9" },
];

const cityBuildings = [
  [-42, 5, -38, 3, 10, 3], [-32, 8, -30, 4, 16, 4],
  [-20, 6, -42, 3, 12, 3], [-6, 10, -38, 4, 20, 4],
  [24, 7, -40, 3, 14, 3], [38, 10, -30, 4, 20, 4],
  [-44, 7, 34, 4, 14, 4], [-30, 11, 42, 5, 22, 5],
  [-10, 6, 34, 3, 12, 3], [12, 8, 36, 4, 16, 4],
  [30, 7, 42, 3, 14, 3], [44, 10, 28, 5, 20, 5],
] as const;

function Player({ setNearby }: { setNearby: (name: string | null) => void }) {
  const playerRef = useRef<Group>(null);
  const zoomRef = useRef(12);
  const keys = useRef<Record<string, boolean>>({});
  const velocity = useRef(new Vector3());
  const [isMoving, setIsMoving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true;
    };

    const up = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
    };

    const wheel = (e: WheelEvent) => {
      zoomRef.current += e.deltaY * 0.01;
      zoomRef.current = Math.max(7, Math.min(24, zoomRef.current));
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("wheel", wheel);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("wheel", wheel);
    };
  }, []);

  useFrame((state, delta) => {
    const player = playerRef.current;
    if (!player) return;

    const speed = keys.current["shift"] ? 7 : 3;
    velocity.current.set(0, 0, 0);

    const forward = new Vector3(-1, 0, -1).normalize();
    const right = new Vector3(1, 0, -1).normalize();

    if (keys.current["w"] || keys.current["arrowup"]) velocity.current.add(forward);
    if (keys.current["s"] || keys.current["arrowdown"]) velocity.current.sub(forward);
    if (keys.current["d"] || keys.current["arrowright"]) velocity.current.add(right);
    if (keys.current["a"] || keys.current["arrowleft"]) velocity.current.sub(right);

    const movingNow = velocity.current.length() > 0;
    const runningNow = keys.current["shift"] && movingNow;

    if (movingNow !== isMoving) setIsMoving(movingNow);
    if (runningNow !== isRunning) setIsRunning(runningNow);

    if (movingNow) {
      velocity.current.normalize();

      player.position.x += velocity.current.x * speed * delta;
      player.position.z += velocity.current.z * speed * delta;
      player.rotation.y = Math.atan2(velocity.current.x, velocity.current.z);
    }

    let near: string | null = null;
    projectZones.forEach((zone) => {
      const dx = player.position.x - zone.position[0];
      const dz = player.position.z - zone.position[2];
      if (Math.sqrt(dx * dx + dz * dz) < 5) near = zone.name;
    });

    setNearby(near);

    const zoom = zoomRef.current;
    const cameraOffset = new Vector3(zoom, zoom, zoom);
    const targetCameraPosition = player.position.clone().add(cameraOffset);

    const smooth = 1 - Math.exp(-6 * delta);
state.camera.position.lerp(targetCameraPosition, smooth);
    state.camera.lookAt(
  player.position.x,
  player.position.y + 1.1,
  player.position.z
);
  });

  return (
    <group ref={playerRef} position={[0, 0, 40]}>
      <PlayerModel isMoving={isMoving} isRunning={isRunning} />
    </group>
  );
}

function Road({ position, scale }: { position: [number, number, number]; scale: [number, number, number] }) {
  return (
    <mesh position={position}>
      <boxGeometry args={scale} />
      <meshStandardMaterial color="#334155" />
    </mesh>
  );
}

function Sidewalk({ position, scale }: { position: [number, number, number]; scale: [number, number, number] }) {
  return (
    <mesh position={position}>
      <boxGeometry args={scale} />
      <meshStandardMaterial color="#64748b" />
    </mesh>
  );
}

function NeonStrip({ position, scale }: { position: [number, number, number]; scale: [number, number, number] }) {
  return (
    <mesh position={position}>
      <boxGeometry args={scale} />
      <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={3} />
    </mesh>
  );
}

function Building({
  position,
  size = [3, 4, 3],
  title,
  color,
  project = false,
}: {
  position: [number, number, number];
  size?: [number, number, number];
  title?: string;
  color: string;
  project?: boolean;
}) {
  const height = project ? 4 : size[1];
  const width = project ? 3.2 : size[0];
  const depth = project ? 3.2 : size[2];

  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color="#1e293b"
          emissive={color}
          emissiveIntensity={project ? 0.8 : 0.35}
        />
      </mesh>

      {[1.2, 2.1, 3, 3.9, 4.8, 5.7, 6.6, 7.5, 8.4].map((y) =>
        y < height ? (
          <mesh key={y} position={[0, y, -depth / 2 - 0.02]}>
            <boxGeometry args={[width * 0.65, 0.18, 0.04]} />
            <meshStandardMaterial
              color="#22d3ee"
              emissive="#22d3ee"
              emissiveIntensity={3}
            />
          </mesh>
        ) : null
      )}

      {project && (
        <>
          <mesh position={[0, height + 0.25, 0]}>
            <boxGeometry args={[3.8, 0.25, 3.8]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={2.5}
            />
          </mesh>

          <Text
            position={[0, height + 1.2, 0]}
            fontSize={0.45}
            color={color}
            anchorX="center"
            anchorY="middle"
          >
            {title}
          </Text>
        </>
      )}
    </group>
  );
}

function LampPost({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.3, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 2.6, 12]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>

      <mesh position={[0, 2.75, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={4} />
      </mesh>

      <pointLight position={[0, 2.75, 0]} intensity={1.8} distance={10} color="#22d3ee" />
    </group>
  );
}

function Drone({ start }: { start: [number, number, number] }) {
  const ref = useRef<Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.x = start[0] + Math.sin(state.clock.elapsedTime * 0.7) * 6;
    ref.current.position.z = start[2] + Math.cos(state.clock.elapsedTime * 0.7) * 6;
  });

  return (
    <group ref={ref} position={start}>
      <mesh>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#67e8f9" emissive="#67e8f9" emissiveIntensity={4} />
      </mesh>
      <pointLight intensity={2} distance={8} color="#67e8f9" />
    </group>
  );
}

function Billboard({ position, text }: { position: [number, number, number]; text: string }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[5, 1.6, 0.2]} />
        <meshStandardMaterial color="#020617" emissive="#22d3ee" emissiveIntensity={0.6} />
      </mesh>
      <Text position={[0, 0, 0.15]} fontSize={0.35} color="#22d3ee" anchorX="center">
        {text}
      </Text>
    </group>
  );
}

function City({ setNearby }: { setNearby: (name: string | null) => void }) {
  return (
    <>
      <fog attach="fog" args={["#020617", 40, 150]} />
      <ambientLight intensity={1.1} />
      <directionalLight position={[8, 14, 8]} intensity={3} />
      <pointLight position={[0, 8, 0]} intensity={4} color="#22d3ee" />

      <Stars radius={120} depth={60} count={5000} factor={4} fade />
      
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[220, 220]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* <gridHelper args={[220, 110, "#22d3ee", "#1e293b"]} /> */}

      <Road position={[0, 0.03, 0]} scale={[8, 0.05, 110]} />
      <Road position={[0, 0.04, 0]} scale={[110, 0.05, 8]} />
      <Road position={[-32, 0.04, 0]} scale={[5, 0.05, 110]} />
      <Road position={[32, 0.04, 0]} scale={[5, 0.05, 110]} />
      <Road position={[0, 0.04, -32]} scale={[110, 0.05, 5]} />
      <Road position={[0, 0.04, 32]} scale={[110, 0.05, 5]} />

      <Sidewalk position={[7, 0.06, 0]} scale={[1, 0.04, 110]} />
      <Sidewalk position={[-7, 0.06, 0]} scale={[1, 0.04, 110]} />
      <Sidewalk position={[0, 0.07, 7]} scale={[110, 0.04, 1]} />
      <Sidewalk position={[0, 0.07, -7]} scale={[110, 0.04, 1]} />

      <NeonStrip position={[0, 0.09, 0]} scale={[0.15, 0.02, 110]} />
      <NeonStrip position={[0, 0.1, 0]} scale={[110, 0.02, 0.15]} />

      {[-44, -32, -20, -8, 8, 20, 32, 44].map((z, i) => (
        <LampPost key={`z-${i}`} position={[-6, 0, z]} />
      ))}
      {[-44, -32, -20, -8, 8, 20, 32, 44].map((z, i) => (
        <LampPost key={`z2-${i}`} position={[6, 0, z]} />
      ))}
      {[-44, -32, -20, -8, 8, 20, 32, 44].map((x, i) => (
        <LampPost key={`x-${i}`} position={[x, 0, -6]} />
      ))}
      {[-44, -32, -20, -8, 8, 20, 32, 44].map((x, i) => (
        <LampPost key={`x2-${i}`} position={[x, 0, 6]} />
      ))}

      {cityBuildings.map(([x, , z, width, height, depth], i) => (
  <Building
    key={i}
    position={[x, 0, z]}
    size={[width, height, depth]}
    color="#22d3ee"
  />
))}

      {projectZones.map((zone) => (
        <Building
          key={zone.name}
          position={zone.position as [number, number, number]}
          title={zone.name}
          color={zone.color}
          project
        />
      ))}

      <Billboard position={[0, 5, -48]} text="RONI CYBER CITY" />
      <Billboard position={[-48, 4, 0]} text="SOC • SIEM • NETWORKING" />
      <Billboard position={[48, 4, 0]} text="SMART SYSTEMS" />

      <Drone start={[0, 8, -20]} />
      <Drone start={[24, 10, 22]} />
      <Drone start={[-26, 9, 28]} />
      <Player setNearby={setNearby} />
      <mesh position={[0, 2, -105]}>
        <boxGeometry args={[220, 4, 2]} />
        <meshStandardMaterial color="#020617" emissive="#22d3ee" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0, 2, 105]}>
        <boxGeometry args={[220, 4, 2]} />
        <meshStandardMaterial color="#020617" emissive="#22d3ee" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[-105, 2, 0]}>
        <boxGeometry args={[2, 4, 220]} />
        <meshStandardMaterial color="#020617" emissive="#22d3ee" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[105, 2, 0]}>
        <boxGeometry args={[2, 4, 220]} />
        <meshStandardMaterial color="#020617" emissive="#22d3ee" emissiveIntensity={0.2} />
      </mesh>
    </>
  );
}

export default function MiniGamePage() {
  const [nearby, setNearby] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const timer = setTimeout(() => {
    setLoading(false);
  }, 1500);

  return () => clearTimeout(timer);
}, []);
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black text-white">
      <div className="absolute left-6 top-6 z-10 rounded-2xl border border-cyan-400/40 bg-black/70 p-4 backdrop-blur">
        <h1 className="text-xl font-bold text-cyan-400">Roni Cyber City</h1>
        <p className="mt-2 text-sm text-gray-300">WASD / Arrows = Move</p>
        <p className="text-sm text-gray-300">Hold Shift = Run</p>
        <p className="text-sm text-gray-300">Mouse Wheel = Zoom</p>

        <Link
          href="/"
          className="mt-4 inline-block rounded-xl border border-cyan-400 px-4 py-2 text-sm text-cyan-400 hover:bg-cyan-400 hover:text-black"
        >
          Back to Portfolio
        </Link>
      </div>

      {nearby && (
        <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 rounded-2xl border border-cyan-400 bg-black/80 px-6 py-4 text-center backdrop-blur">
          <p className="text-sm text-gray-400">You discovered</p>
          <h2 className="text-2xl font-bold text-cyan-400">{nearby}</h2>
        </div>
      )}

<div className="absolute right-6 top-6 z-10 max-w-sm rounded-2xl border border-cyan-400/40 bg-black/80 p-5 backdrop-blur">
  <h1 className="text-3xl font-bold text-cyan-400">
    Coming Soon
  </h1>

  <h2 className="mt-3 text-xl font-semibold text-white">
    Mini Game
  </h2>

  <p className="mt-2 text-sm text-gray-300">
    A small interactive cyber portfolio game will be added here.
  </p>

  <Link
    href="/"
    className="mt-5 inline-block rounded-xl border border-cyan-400 px-4 py-2 text-sm text-cyan-400 transition hover:bg-cyan-400 hover:text-black"
  >
    Back to Portfolio
  </Link>
</div>
<div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
  {Array.from({ length: 40 }).map((_, i) => (
    <div
      key={i}
      className="absolute text-cyan-400/10 font-bold select-none"
      style={{
        left: `${(i % 8) * 14}%`,
        top: `${Math.floor(i / 8) * 22}%`,
        transform: "rotate(-25deg)",
        fontSize: "2rem",
        whiteSpace: "nowrap",
      }}
    >
      COMING SOON
    </div>
  ))}
</div>

{loading && (
  <div className="absolute inset-0 z-50 flex items-center justify-center bg-black">
    <div className="flex flex-col items-center gap-4">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-cyan-400/20 border-t-cyan-400" />
      <p className="text-cyan-400 font-semibold">
        Loading Mini Game...
      </p>
    </div>
  </div>
)}
      <Canvas camera={{ position: [9, 9, 9], fov: 55 }}>
        <City setNearby={setNearby} />
      </Canvas>
    </main>
  );
}