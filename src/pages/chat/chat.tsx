import { ChatInput } from "@/components/custom/chatinput";
import { PreviewMessage, ThinkingMessage } from "../../components/custom/message";
import { useScrollToBottom } from '@/components/custom/use-scroll-to-bottom';
import { useState, useRef } from "react";
import { message } from "../../interfaces/interfaces"
import { Overview } from "@/components/custom/overview";
import { Header } from "@/components/custom/header";
import {v4 as uuidv4} from 'uuid';

const apiBaseUrl = "http://220.89.167.202:54859";

export function Chat() {
  const [messagesContainerRef, messagesEndRef] = useScrollToBottom<HTMLDivElement>();
  const [messages, setMessages] = useState<message[]>([]);
  const [question, setQuestion] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const conversationIdRef = useRef<string>(uuidv4());

async function handleSubmit(text?: string) {
  if (isLoading) return;

  const messageText = (text ?? question).trim();
  if (!messageText) return;

  const userMessageId = uuidv4();
  const assistantMessageId = uuidv4();

  setIsLoading(true);
  setMessages(prev => [...prev, { content: messageText, role: "user", id: userMessageId }]);
  setQuestion("");

  try {
    const response = await fetch(`${apiBaseUrl}/material_chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: messageText,
        conversation_id: conversationIdRef.current,
      }),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const payload = await response.json().catch(() => ({}));
    const assistantReply =
      payload?.response_str ??
      payload?.results ??
      payload?.response ??
      "";

    if (!assistantReply) {
      throw new Error("Empty response from server");
    }

    setMessages(prev => [
      ...prev,
      { content: assistantReply, role: "assistant", id: assistantMessageId },
    ]);
  } catch (error) {
    console.error("FastAPI request error:", error);
    setMessages(prev => [
      ...prev,
      { content: "요청 처리 중 오류가 발생했습니다.", role: "assistant", id: assistantMessageId },
    ]);
  } finally {
    setIsLoading(false);
  }
}

  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background">
      <Header/>
      <div className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4" ref={messagesContainerRef}>
        {messages.length == 0 && <Overview />}
        {messages.map((message, index) => (
          <PreviewMessage key={index} message={message} />
        ))}
        {isLoading && <ThinkingMessage />}
        <div ref={messagesEndRef} className="shrink-0 min-w-[24px] min-h-[24px]"/>
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
