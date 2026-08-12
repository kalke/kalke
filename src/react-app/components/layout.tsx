import { Link } from "react-router";
import { cn } from "@/lib/utils";

export function Page({
	className,
	children,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn("relative min-h-svh overflow-x-hidden bg-bg text-fg", className)}
			{...props}
		>
			{children}
		</div>
	);
}

export function Atmosphere({ className }: { className?: string }) {
	return (
		<div
			aria-hidden
			className={cn(
				"pointer-events-none absolute inset-0 -z-10 overflow-hidden",
				className,
			)}
		>
			<div className="absolute -left-24 top-[-10%] h-[28rem] w-[28rem] rounded-full bg-accent/10 blur-3xl" />
			<div className="absolute -right-16 top-[20%] h-[22rem] w-[22rem] rounded-full bg-accent-cool/10 blur-3xl" />
			<div className="absolute bottom-[-10%] left-1/3 h-[20rem] w-[20rem] rounded-full bg-accent/5 blur-3xl" />
		</div>
	);
}

export function Topbar({
	className,
	children,
	...props
}: React.HTMLAttributes<HTMLElement>) {
	return (
		<header
			className={cn(
				"sticky top-0 z-40 border-b border-border/80 bg-bg/85 backdrop-blur-md",
				className,
			)}
			{...props}
		>
			{children}
		</header>
	);
}

type BrandMarkProps = {
	className?: string;
	to?: string;
	href?: string;
	children?: React.ReactNode;
};

export function BrandMark({
	className,
	to,
	href = "/",
	children = "kalke",
}: BrandMarkProps) {
	const classes = cn(
		"font-display text-lg font-semibold tracking-tight text-fg transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-sm",
		className,
	);
	if (to) {
		return (
			<Link className={classes} to={to}>
				{children}
			</Link>
		);
	}
	return (
		<a className={classes} href={href}>
			{children}
		</a>
	);
}

export function SurfacePanel({
	className,
	children,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<section
			className={cn(
				"rounded-lg border border-border bg-surface/90 p-6 shadow-sm",
				className,
			)}
			{...props}
		>
			{children}
		</section>
	);
}

export function ContentWidth({
	className,
	children,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn(
				"mx-auto w-full max-w-[var(--max-content)] px-4 sm:px-6",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}
