import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { copy, type Lang } from "../content";

type Props = { lang: Lang };

function scrollToHash(href: string) {
	if (!href.startsWith("#")) return;
	const el = document.querySelector(href);
	el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function resolveCommand(
	raw: string,
	lines: { cmd: string; out: string; href?: string }[],
): { out: string; href?: string } | null {
	const cmd = raw.trim().toLowerCase();
	if (!cmd) return null;
	if (cmd === "whoami" || cmd.startsWith("whoami ")) {
		return lines.find((l) => l.cmd === "whoami") ?? null;
	}
	if (cmd === "ls" || cmd.startsWith("ls ") || cmd.includes("work")) {
		return lines.find((l) => l.cmd.startsWith("ls")) ?? null;
	}
	if (cmd.includes("contact") || cmd.startsWith("cat ")) {
		return lines.find((l) => l.cmd.includes("contact")) ?? null;
	}
	return null;
}

function prefersReducedMotion(): boolean {
	if (typeof window === "undefined") return false;
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function TerminalHero({ lang }: Props) {
	const t = copy[lang].hero.terminal;
	const [reduceMotion, setReduceMotion] = useState(prefersReducedMotion);
	const [typedCount, setTypedCount] = useState(0);
	const [charIndex, setCharIndex] = useState(0);
	const [input, setInput] = useState("");
	const [extra, setExtra] = useState<{ cmd: string; out: string; href?: string }[]>([]);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		const sync = () => setReduceMotion(mq.matches);
		mq.addEventListener("change", sync);
		return () => mq.removeEventListener("change", sync);
	}, []);

	useEffect(() => {
		if (reduceMotion) return;
		if (typedCount >= t.lines.length) return;
		const line = t.lines[typedCount];
		const fullLen = line.cmd.length;
		if (charIndex >= fullLen) {
			const id = window.setTimeout(() => {
				setTypedCount((n) => n + 1);
				setCharIndex(0);
			}, 420);
			return () => window.clearTimeout(id);
		}
		const id = window.setTimeout(() => setCharIndex((c) => c + 1), 28);
		return () => window.clearTimeout(id);
	}, [charIndex, typedCount, reduceMotion, t.lines]);

	function runCommand(raw: string) {
		const hit = resolveCommand(raw, t.lines);
		if (!hit) {
			setExtra((prev) => [...prev, { cmd: raw, out: t.unknown }]);
			return;
		}
		setExtra((prev) => [...prev, { cmd: raw, out: hit.out, href: hit.href }]);
		if (hit.href) scrollToHash(hit.href);
	}

	function onSubmit(e: FormEvent) {
		e.preventDefault();
		const value = input.trim();
		if (!value) return;
		runCommand(value);
		setInput("");
	}

	function onLineClick(href?: string) {
		if (href) scrollToHash(href);
	}

	function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Tab") e.preventDefault();
	}

	const visibleLines = reduceMotion ? t.lines.length : typedCount;
	const currentLine = !reduceMotion && typedCount < t.lines.length ? t.lines[typedCount] : null;
	const typedCmd = currentLine ? currentLine.cmd.slice(0, charIndex) : "";
	const sessionReady = reduceMotion || typedCount >= t.lines.length;

	return (
		<div className="terminal">
			<div className="terminal-chrome">
				<span className="terminal-dot" />
				<span className="terminal-dot" />
				<span className="terminal-dot" />
				<span className="terminal-title">~/kalke — session</span>
			</div>
			<div className="terminal-body" onClick={() => inputRef.current?.focus()}>
				{t.lines.slice(0, visibleLines).map((line) => (
					<button
						key={line.cmd}
						type="button"
						className="terminal-block"
						onClick={() => onLineClick(line.href)}
					>
						<div className="terminal-cmd">
							<span className="terminal-prompt">{t.prompt}</span> {line.cmd}
						</div>
						<div className="terminal-out">{line.out}</div>
					</button>
				))}
				{currentLine ? (
					<div className="terminal-cmd terminal-typing">
						<span className="terminal-prompt">{t.prompt}</span> {typedCmd}
						<span className="terminal-caret" aria-hidden="true" />
					</div>
				) : null}
				{extra.map((line, i) => (
					<div key={`${line.cmd}-${i}`} className="terminal-block static">
						<div className="terminal-cmd">
							<span className="terminal-prompt">{t.prompt}</span> {line.cmd}
						</div>
						<button
							type="button"
							className="terminal-out linkish"
							onClick={() => line.href && scrollToHash(line.href)}
							disabled={!line.href}
						>
							{line.out}
						</button>
					</div>
				))}
				{sessionReady ? (
					<form className="terminal-input-row" onSubmit={onSubmit}>
						<span className="terminal-prompt">{t.prompt}</span>
						<input
							ref={inputRef}
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={onKeyDown}
							placeholder={t.inputPlaceholder}
							aria-label={t.inputPlaceholder}
							autoComplete="off"
							spellCheck={false}
						/>
					</form>
				) : null}
			</div>
			<p className="terminal-hint">{t.hint}</p>
		</div>
	);
}
