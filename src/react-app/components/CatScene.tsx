import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Billboard, Image } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import type { Group } from "three";

import chico from "../assets/cats/chico.jpg";
import claire from "../assets/cats/claire.jpg";
import linhaca from "../assets/cats/linhaca.jpg";
import zaia from "../assets/cats/zaia.jpg";

type Photo = {
	url: string;
	position: [number, number, number];
	scale: number;
	speed: number;
	phase: number;
};

const basePhotos: Photo[] = [
	{ url: zaia, position: [1.15, 0.35, 0.1], scale: 1.55, speed: 0.55, phase: 0 },
	{ url: chico, position: [2.55, 0.95, -0.35], scale: 1.15, speed: 0.42, phase: 1.2 },
	{ url: linhaca, position: [2.45, -0.55, -0.2], scale: 1.25, speed: 0.48, phase: 2.1 },
	{ url: claire, position: [0.85, -0.7, -0.45], scale: 1.05, speed: 0.5, phase: 0.7 },
];

function CatPhoto({ url, position, scale, speed, phase }: Photo) {
	const group = useRef<Group>(null);

	useFrame((state) => {
		if (!group.current) return;
		const t = state.clock.elapsedTime * speed + phase;
		group.current.position.y = Math.sin(t) * 0.07;
		group.current.rotation.z = Math.sin(t * 0.55) * 0.03;
	});

	const width = scale;
	const height = scale * 1.28;

	return (
		<group position={position}>
			<Billboard follow>
				<group ref={group}>
					<mesh position={[0, 0, -0.015]}>
						<planeGeometry args={[width + 0.08, height + 0.08]} />
						<meshBasicMaterial color="#100e0c" toneMapped={false} />
					</mesh>
					<Image url={url} scale={[width, height]} toneMapped={false} />
				</group>
			</Billboard>
		</group>
	);
}

function Scene() {
	const { viewport } = useThree();
	const narrow = viewport.width < 6.2;

	const photos = useMemo(
		() =>
			basePhotos.map((photo) => ({
				...photo,
				position: [
					photo.position[0] + (narrow ? 0.55 : 0),
					photo.position[1] + (narrow ? 0.35 : 0),
					photo.position[2],
				] as [number, number, number],
				scale: photo.scale * (narrow ? 0.82 : 1),
			})),
		[narrow],
	);

	return (
		<>
			<ambientLight intensity={1} />
			{photos.map((photo) => (
				<CatPhoto key={photo.url} {...photo} />
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
					dpr={[1, 1.75]}
					camera={{ position: [0.55, 0.05, 5.4], fov: 38 }}
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
