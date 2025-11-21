import { useState, useRef } from "react";

interface MyComponentProps {
	node: string;
	status?: string;
	data?: Record<string, string>;
}

export const ThinkAccordion = ({node}: MyComponentProps) =>{
	const [isOpen, setIsOpen] = useState(true);
	const contentRef = useRef<HTMLDivElement>(null);
	
	const toggleAccordion = () => {
    	setIsOpen(!isOpen);
	};
	
	return (
		<div className="border-b border-slate-200">
			<button
			onClick={toggleAccordion}
			className="w-full flex justify-between items-center py-5 text-slate-800"
			>
			<span>Thinking</span>
			<span
				className="text-slate-800 transition-transform duration-300"
			>
				{isOpen ? (
				// Minus icon
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 16 16"
					fill="currentColor"
					className="w-4 h-4"
				>
					<path d="M3.75 7.25a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Z" />
				</svg>
				) : (
				// Plus icon
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 16 16"
					fill="currentColor"
					className="w-4 h-4"
				>
					<path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
				</svg>
				)}
			</span>
			</button>

			<div
			ref={contentRef}
			style={{
				maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : "0px",
			}}
			className="overflow-hidden transition-all duration-300 ease-in-out"
			>
			<div className="pb-5 text-sm text-slate-500">{node}</div>
			</div>
		</div>
	);
	
};