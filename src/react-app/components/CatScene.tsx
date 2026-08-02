import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import type { Mesh } from "three";

import chico from "../assets/cats/chico.jpg";
import claire from "../assets/cats/claire.jpg";
import linhaca from "../assets/cats/linhaca.jpg";
import zaia from "../assets/cats/zaia.jpg";

const textures = [zaia, chico, linhaca, claire];

function CatOrb({
	url,
	radius,
	speed,
	phase,
	y,
}: {
	url: string;
	radius: number;
	speed: number;
	phase: number;
	y: number;
}) {
	const mesh = useRef<Mesh>(null);
	const map = useTexture(url);

	useFrame((state) => {
		if (!mesh.current) return;
		const t = state.clock.elapsedTime * speed + phase;
		mesh.current.position.x = Math.cos(t) * radius;
		mesh.current.position.z = Math.sin(t) * radius * 0.55;
		mesh.current.position.y = y + Math.sin(t * 1.4) * 0.12;
		mesh.current.rotation.y = t * 0.35;
	});

	return (
		<mesh ref={mesh}>
			<sphereGeometry args={[0.55, 48, 48]} />
			<meshStandardMaterial map={map} roughness={0.45} metalness={0.15} />
		</mesh>
	);
}

function Scene() {
	return (
		<>
			<color attach="background" args={["#141210"]} />
			<ambientLight intensity={0.45} />
			<directionalLight position={[4, 6, 2]} intensity={1.1} color="#f0e2b8" />
			<pointLight position={[-3, 1, -2]} intensity={0.55} color="#c4a35a" />
			{textures.map((url, i) => (
				<CatOrb
					key={url}
					url={url}
					radius={1.35 + i * 0.22}
					speed={0.18 + i * 0.04}
					phase={(i * Math.PI) / 2}
					y={0.15 - i * 0.08}
				/>
			))}
		</>
	);
}

export default function CatScene() {
	const host = useRef<HTMLDivElement>(null);
	const [visible, setVisible] = useState(true);
	const [reduceMotion, setReduceMotion] = useState(false);

	useEffect(() => {
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		const sync = () => setReduceMotion(mq.matches);
		sync();
		mq.addEventListener("change", sync);
		return () => mq.removeEventListener("change", sync);
	}, []);

	useEffect(() => {
		const el = host.current;
		if (!el) return;
		const io = new IntersectionObserver(
			([entry]) => setVisible(entry.isIntersecting),
			{ threshold: 0.05 },
		);
		io.observe(el);
		return () => io.disconnect();
	}, []);

	if (reduceMotion) {
		return <div className="cat-scene cat-scene-fallback" aria-hidden="true" />;
	}

	return (
		<div ref={host} className="cat-scene" aria-hidden="true">
			{visible ? (
				<Canvas
					dpr={[1, 1.5]}
					camera={{ position: [0, 0.35, 4.2], fov: 42 }}
					gl={{ antialias: true, alpha: true }}
				>
					<Suspense fallback={null}>
						<Scene />
					</Suspense>
				</Canvas>
			) : null}
		</div>
	);
}
