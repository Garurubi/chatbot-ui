import { ChatInput } from "@/components/custom/chatinput";
import { PreviewMessage, ThinkingMessage } from "../../components/custom/message";
import { useScrollToBottom } from '@/components/custom/use-scroll-to-bottom';
import { useState, useRef } from "react";
// import { EventSourcePolyfill } from "event-source-polyfill";
import { message } from "../../interfaces/interfaces"
import { Overview } from "@/components/custom/overview";
import { Header } from "@/components/custom/header";
import {v4 as uuidv4} from 'uuid';

const apiBaseUrl = "http://192.168.2.106:11280";

export function Chat() {
  const [messagesContainerRef, messagesEndRef] = useScrollToBottom<HTMLDivElement>();
  const [messages, setMessages] = useState<message[]>([]);
  const [question, setQuestion] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const conversationIdRef = useRef<string>(uuidv4());

  async function handleSubmit(text?: string) {
    if (isLoading) return;

    const userMessageId = uuidv4();
    const assistantMessageId = uuidv4();
    const thinkingMessageId = uuidv4();
    
    const messageText = (text ?? question).trim();
    if (!messageText) return;
    
    setIsLoading(true);
    setMessages(prev => [...prev, { content: messageText, role: "user", id: userMessageId }]);
    setQuestion("");


    // const url = `${apiBaseUrl}/test/${conversationIdRef.current}?query=${encodeURIComponent(userInput)}`;
    const url = `${apiBaseUrl}/material_chat/${conversationIdRef.current}?query=${encodeURIComponent(messageText)}`;
    
    const eventSource = new EventSource (url);

    // eventSource.onopen = function() {
    //   console.log('SSE 연결 성공');
    // };

    eventSource.addEventListener("stream", (event: MessageEvent) => {
      const payload = JSON.parse(event.data);
      if (payload.status == "end") {
        
        setMessages(prev => [
          ...prev,
          { content: payload.final_report, role: "assistant", id: assistantMessageId },
        ]);
        
        setIsLoading(false);
        eventSource.close();
        return;
      }
      else{
        // console.log(payload.thread_id + " 실행");
        setMessages(prev => [
          ...prev,
          { content: "", role: "thinking", id: thinkingMessageId },
        ]);
      }
    });

    eventSource.addEventListener("node", (event: MessageEvent) =>{
      const payload = JSON.parse(event.data);

      if (payload.status == "start"){
        console.log(payload.status + " 실행");
        setMessages(prev => prev.map(m => 
        m.id === thinkingMessageId 
          ? { 
              ...m, 
              content: payload.node + " 실행",
            } 
          : m
      ));
      }
      else{
        console.log(payload.node + " 종료")
      }
    });

    eventSource.addEventListener("interrupt", (event: MessageEvent) =>{
      console.log("interrupt 수신: " + assistantMessageId)
      const payload = JSON.parse(event.data);
      console.log(payload.message)
      payload.message = payload.message.replaceAll("\\n", "  \n")
      setMessages(prev => [
        ...prev,
        { content: payload.message, role: "assistant", id: assistantMessageId },
      ]);

      eventSource.close();
      setIsLoading(false);
    });

    eventSource.addEventListener("error", (e) =>{
      console.log("BackEnd Server Error");
      alert(e)
    });

    eventSource.onerror = (event) => {
      console.error("SSE 연결 오류 발생:", event);

      // 1. 대부분의 경우 event 자체에 유의미한 데이터가 없음
      //    → 서버에서 명시적으로 error 이벤트를 보내지 않는 한
      eventSource.close();

      setMessages(prev => prev.map(m => 
        m.id === assistantMessageId 
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