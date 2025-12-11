import { useEffect, useState } from "react";
import { Markdown } from './markdown';

interface TypewriterMarkdownProps {
   text: string;
   speed?: number;
}

export function TypewriterMarkdown({ text, speed = 10 }: TypewriterMarkdownProps) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    if (!text) return;
    
    let index = 0;
    const charsPerUpdate = 2; // 한번에 3글자씩 추가
    
    const interval = setInterval(() => {
      index += charsPerUpdate;
      if (index >= text.length) {
        setDisplayText(text);
        clearInterval(interval);
      } else {
        setDisplayText(text.slice(0, index));
      }
    }, speed);
    
    return () => clearInterval(interval);
  }, [text, speed]);

  return <Markdown>{displayText}</Markdown>;
}