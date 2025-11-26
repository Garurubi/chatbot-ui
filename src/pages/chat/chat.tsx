import { ChatInput } from "@/components/custom/chatinput";
import { PreviewMessage, ThinkingMessage } from "../../components/custom/message";
import { useScrollToBottom } from '@/components/custom/use-scroll-to-bottom';
import { useState, useRef } from "react";
// import { EventSourcePolyfill } from "event-source-polyfill";
import { SSEMessage } from "../../interfaces/interfaces"
import { Overview } from "@/components/custom/overview";
import { Header } from "@/components/custom/header";
import {v4 as uuidv4} from 'uuid';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?? "/fast_api";

export function Chat() {
  const [messagesContainerRef, messagesEndRef] = useScrollToBottom<HTMLDivElement>();
  const [messages, setMessages] = useState<SSEMessage[]>([]);
  const [question, setQuestion] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const conversationIdRef = useRef<string>(uuidv4());

  async function handleSubmit(text?: string) {
    if (isLoading) return;

    const messageText = (text ?? question).trim();
    if (!messageText) return;

    // const url = `${apiBaseUrl}/test/${conversationIdRef.current}?query=${encodeURIComponent(userInput)}`;
    const url = `${apiBaseUrl}/material_chat/${conversationIdRef.current}?query=${encodeURIComponent(messageText)}`;
    const eventSource = new EventSource (url);
    const userMessageId = uuidv4();
    const assistantMessageId = uuidv4();
    
    let thinkingMessageId = uuidv4();
    
    setIsLoading(true);
    setMessages(prev => [...prev, { content: messageText, role: "user", eventId: userMessageId, data: {"":""}, stream_status:true}]);
    setQuestion("");

    // Graph Stream Listen
    eventSource.addEventListener("stream", (event: MessageEvent) => {
      const payload = JSON.parse(event.data);
      // Stream End
      if (payload.status == "end") {
        console.log("[Stream] "+payload.node+" 종료")
        setMessages(prev => [
          ...prev,
          { content: payload.final_report, role: "assistant", eventId: assistantMessageId, data: payload, stream_status: false },
        ]);
        
        setIsLoading(false);
        eventSource.close();
        return;
      }
      // Stream Start
      else{
        console.log("[Stream] "+payload.node+" 실행")
        // setMessages(prev => [
        //   ...prev,
        //   { content: "", role: "assistant", eventId: thinkingMessageId, data: payload, stream_status: true },
        // ]);
      }
    });


    // Agent Node Listen
    eventSource.addEventListener("agent", (event: MessageEvent) =>{
      const payload = JSON.parse(event.data);

      if(payload.status == "start"){
        console.log("[Agent] "+payload.node+" 실행")
        thinkingMessageId = uuidv4();
        // setMessages(prev => [
        //   ...prev,
        //   { content: payload.node, role: "thinking", eventId: thinkingMessageId, data: payload, stream_status: true },
        // ]);
      }
      else{
        console.log("[Agent] "+payload.node+" 종료")
        setMessages(prev => prev.map(m => 
          m.eventId === thinkingMessageId 
            ? { 
                ...m, 
                content: payload.node,
                data: payload,
                role: "thinking",
                stream_status: false
              } 
            : m
        ));
      }
    });


    // Node Listen
    eventSource.addEventListener("node", (event: MessageEvent) =>{
      const payload = JSON.parse(event.data);
      
      // Node Start
      if (payload.status == "start"){
        console.log("\t[Node] "+payload.node+" 실행")
        setMessages(prev => {
          // 1. 현재 thinking 메시지 있는지 확인
          const hasThinking = prev.some(m => m.eventId === thinkingMessageId);
              
          if (hasThinking) {
            // eventId  업데이트
            return prev.map(m =>
              m.eventId === thinkingMessageId
                ? {...m, content: payload.node, data: payload, role: "thinking"} 
                : m
            );
          }

          // 새로 추가
          return [
            ...prev,
            { content: payload.node, role: "thinking", eventId: thinkingMessageId, data: payload, stream_status: true }
          ];
        });
      }
      // Node End 
      else{
        console.log("\t[Node] "+payload.node+" 종료")
        setMessages(prev => prev.map(m => 
        m.eventId === thinkingMessageId 
          ? { 
              ...m, 
              content: payload.node,
              data: payload,
              role: "thinking"
            } 
          : m
      ));
        
      }
    });


    // Interrupt Listen
    eventSource.addEventListener("interrupt", (event: MessageEvent) =>{
      const payload = JSON.parse(event.data);
      payload.message = payload.message.replaceAll("\\n", "  \n")
      console.log("[Interrupt] "+payload.node+" 실행")
      setMessages(prev => [
        ...prev,
        { content: payload.message, role: "assistant", eventId: thinkingMessageId, data: payload.data, stream_status:false },
      ]);

      eventSource.close();
      setIsLoading(false);
    });

    // Backend Error
    eventSource.addEventListener("error", (event: MessageEvent) =>{
      const payload = JSON.parse(event.data);
      console.error("BackEnd Server Error:"+ payload.target + "\n" + payload.error);
      
    });

    // SSE Error
    eventSource.onerror = (event) => {
      console.error("SSE 연결 오류 발생:", event);
      eventSource.close();

      setMessages(prev => prev.map(m => 
        m.eventId === assistantMessageId 
          ? { 
              ...m, 
              content: "서버와의 연결이 끊겼습니다.\n잠시 후 다시 시도해 주세요.",
              isError: true 
            } 
          : m
      ));

      setIsLoading(false);
    };
  }

  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background">
      <Header />
      <div className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4" ref={messagesContainerRef}>
        {messages.length === 0 && <Overview />}
        {messages.map((msg, index) => (
          <PreviewMessage key={index} message={msg} />
        ))}
        {isLoading && <ThinkingMessage />}
        <div ref={messagesEndRef} className="shrink-0 min-w-[24px] min-h-[24px]" />
      </div>
      <div className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
        <ChatInput
          question={question}
          setQuestion={setQuestion}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};