import { useEffect, useState, type KeyboardEvent } from "react";

/** Track Caps Lock from keyboard events (getModifierState). */
export function useCapsLock() {
	const [capsOn, setCapsOn] = useState(false);

	useEffect(() => {
		const sync = (e: Event) => {
			const ke = e as globalThis.KeyboardEvent;
			if (typeof ke.getModifierState === "function") {
				setCapsOn(ke.getModifierState("CapsLock"));
			}
		};
		window.addEventListener("keydown", sync);
		window.addEventListener("keyup", sync);
		return () => {
			window.removeEventListener("keydown", sync);
			window.removeEventListener("keyup", sync);
		};
	}, []);

	function onKeyEvent(e: KeyboardEvent<HTMLInputElement>) {
		if (typeof e.getModifierState === "function") {
			setCapsOn(e.getModifierState("CapsLock"));
		}
	}

	return { capsOn, onKeyEvent };
}
