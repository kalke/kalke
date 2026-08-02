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

/** Large planes filling the hero depth — backdrop, not side stickers. */
const basePhotos: Photo[] = [
	{ url: zaia, position: [-1.8, 0.55, -1.4], scale: 2.8, speed: 0.22, phase: 0 },
	{ url: chico, position: [2.1, 0.85, -1.8], scale: 2.4, speed: 0.18, phase: 1.1 },
	{ url: linhaca, position: [0.2, -1.15, -1.1], scale: 2.6, speed: 0.2, phase: 2.0 },
	{ url: claire, position: [2.6, -0.7, -0.9], scale: 2.15, speed: 0.24, phase: 0.6 },
];

function CatPhoto({ url, position, scale, speed, phase }: Photo) {
	const group = useRef<Group>(null);

	useFrame((state) => {
		if (!group.current) return;
		const t = state.clock.elapsedTime * speed + phase;
		group.current.position.y = Math.sin(t) * 0.05;
		group.current.rotation.z = Math.sin(t * 0.4) * 0.02;
	});

	const width = scale;
	const height = scale * 1.22;

	return (
		<group position={[position[0], position[1], position[2]]}>
			<Billboard follow>
				<group ref={group}>
					<mesh position={[0, 0, -0.02]}>
						<planeGeometry args={[width + 0.12, height + 0.12]} />
						<meshBasicMaterial color="#15120f" toneMapped={false} transparent opacity={0.85} />
					</mesh>
					<Image url={url} scale={[width, height]} toneMapped={false} transparent opacity={0.72} />
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
					photo.position[0] * (narrow ? 0.72 : 1),
					photo.position[1] * (narrow ? 0.85 : 1),
					photo.position[2],
				] as [number, number, number],
				scale: photo.scale * (narrow ? 0.72 : 1),
			})),
		[narrow],
	);

	return (
		<>
			<ambientLight intensity={0.55} />
			<pointLight position={[2, 2, 3]} intensity={0.85} color="#E7A339" />
			<pointLight position={[-3, -1, 2]} intensity={0.35} color="#4FB6B0" />
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
					dpr={[1, 1.6]}
					camera={{ position: [0, 0, 6.2], fov: 42 }}
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
