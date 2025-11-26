import { useState, useRef, useEffect } from "react";

interface Message {
	node: string;
	status?: string;
	data: Record<string, string>;
	stream_status?: boolean;
}

interface ComponentProps {
	node: string;
	node_id: string;
	data?: Record<string, string>;
}

export function ThinkAccordion({ node, status, data, stream_status }: Message) {
  const [isOpen, setIsOpen] = useState(true);
	const [isTitle, setIsTitle] = useState("Thinking")
  const [ismessages, setMessages] = useState<ComponentProps[]>([]);
	const timelineColors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-slate-500'];

  const contentRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevNodeRef = useRef<string>('');
	
  
  // 새 노드 추가용
  useEffect(() => {
    if (!data || !node || node === prevNodeRef.current) {
      return;}
    
    const keysToRemove = ["node_id", "node"];
    const filter_data = Object.fromEntries(
      Object.entries(data).filter(([key]) => !keysToRemove.includes(key)));

    setMessages(prev => [
      ...prev,
      { node: node, node_id: data.node_id, data: filter_data }
    ]);

    prevNodeRef.current = node;
  }, [node, data]);


  // 메시지 업데이트용
  useEffect(() => {
    if (!data || status !== "end" ) return;
    
    const keysToRemove = ["node_id", "node"];
    const filter_data = Object.fromEntries(
      Object.entries(data).filter(([key]) => !keysToRemove.includes(key)));

    setMessages(prev =>
      prev.map(m =>
        m.node_id === data.node_id
          ? { ...m, data: filter_data }
          : m
    ));
  }, [status, data]);


  // UI 상태용
  useEffect(() => {
    
    if (!stream_status) {
      setIsOpen(false);
      setIsTitle("Response");
    } else if (node?.includes("_agent") && status === "end") {
      setIsOpen(false);
      setIsTitle("Response");
    } else if ((node === "clarify_with_user" || node === "criteria_generation") && status === "end" ){
      setIsOpen(false);
      setIsTitle("Response");
    }else {
      setIsOpen(true);
      setIsTitle("Thinking");
    }
  }, [node, status, stream_status]);


  // 아코디언 열릴 때, 메시지 추가될 때 (아래로 스크롤)
  useEffect(() => {
    if (!isOpen || !scrollContainerRef.current) return;

    const timer = setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [isOpen, ismessages]);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  

  return (
    <div className="border-b border-slate-200 max-w-2xl">
      {/* Head */}
      <button
        onClick={toggleAccordion}
        className="w-full flex justify-between items-center py-5 text-slate-800 hover:text-slate-600 transition-colors"
      >
        <span className="font-medium">{isTitle}</span>
        <span className="text-slate-800 transition-transform duration-700">
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M3.75 7.25a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Z" />
            </svg>
          ) : (
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
      {/* Content */}
      <div
        ref={contentRef} 
        style={{
          maxHeight: isOpen ? "300px" : "0px",
        }}
        className="overflow-hidden transition-all duration-700 ease-in-out"
      >
        <div ref={scrollContainerRef} className="pb-5 text-sm text-slate-500 max-h-[300px] overflow-y-auto pr-2">
          <div className="space-y-8">
            {ismessages.map((item, index) => (
              <div key={index} className="relative flex gap-4">
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-3 h-3 rounded-full ${timelineColors[index % timelineColors.length]} border-2 border-white shadow-md flex-shrink-0`}
                  />
                  {index < ismessages.length - 1 && (
                    <div className="w-0.5 h-full bg-slate-200 mt-2" />
                  )}
                </div>
                {/* LLM Output */}
                <div className="flex-1 pb-8">
                  <h6 className="text-base font-semibold text-slate-700 mb-2">
                    {item.node}
                  </h6>
                  {item.data && (
                    <div className="text-sm text-slate-600 leading-relaxed">
                      {Object.entries(item.data).map(([key, value]) => (
                        <div key={key} className="mb-1">
                          <span className="font-medium">{key}: </span>
													<span>
													{typeof value === "object" 
														? JSON.stringify(value, null, 2).slice(0, 1000) + (JSON.stringify(value, null, 2).length > 1000 ? '\n...' : '')
														: value}
													</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}