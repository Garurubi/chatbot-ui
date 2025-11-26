import { useEffect, useState } from "react";
import { Markdown } from './markdown';

interface TypewriterMarkdownProps {
	text: string;
	speed?: number;
}

export function TypewriterMarkdown({ text, speed = 15 } : TypewriterMarkdownProps) {
	const [displayText, setDisplayText] = useState("");

	useEffect(() => {
		if (!text) return;

		let index = 0;
		const interval = setInterval(() => {
			setDisplayText(text.slice(0, index));
			index++;
			if (index > text.length) clearInterval(interval);
		}, speed);

		return () => clearInterval(interval);
	}, [text, speed]);

	return <Markdown>{displayText}</Markdown>;
}