import { Textarea } from "../ui/textarea";
import { cx } from 'classix';
import { Button } from "../ui/button";
import { ArrowUpIcon } from "./icons"
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface ChatInputProps {
    question: string;
    setQuestion: (question: string) => void;
    onSubmit: (text?: string) => void;
    isLoading: boolean;
}

const suggestedActions = [
    {
        label: "Single Atom Catalyst(SAC)",
        actions: [
            {
                title: "수소 생산에 가장 적합한 단원자 금속은 무엇일까?",
                action: "수소 생산에 가장 적합한 단원자 금속은 무엇일까?",
                tag: "HER",
            },
            {
                title: "CO₂RR용 단원자 촉매는 어떤 지지체가 더 안정적인가?",
                action: "CO₂RR용 단원자 촉매는 어떤 지지체가 더 안정적인가?",
                tag: "Structural Stability",
            }
        ]
    },
    {
        label: "Perovskite",
        actions: [
            {
                title: "MAPbI3 조성을 가지는 페로브스카이트 적층구조는?",
                action: "MAPbI3 조성을 가지는 페로브스카이트 적층구조는?",
                tag: "Device Physics"
            },
            {
                title: "Jsc, Voc, FF 간의 상관관계(correlation)는?",
                action: "Jsc, Voc, FF 간의 상관관계(correlation)는?",
                tag: "Dimensionality"
            }
        ]
    },
];

export const ChatInput = ({ question, setQuestion, onSubmit, isLoading }: ChatInputProps) => {
    const [showSuggestions, setShowSuggestions] = useState(true);

    return(
    <div className="relative w-full flex flex-col gap-4">
        {showSuggestions && (
            <div className="hidden md:grid sm:grid-cols-2 gap-3 w-full">
                {suggestedActions.map((group, groupIndex) => (
                    <div key={group.label} className="flex flex-col gap-2">
                        {/* 파트 제목 (좌: CO₂RR / 우: HER) */}
                        <p className="text-s font-medium text-muted-foreground">
                            {group.label}
                        </p>

                        {group.actions.map((suggestedAction, index) => (
                            <motion.div
                                key={suggestedAction.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ delay: 0.05 * (groupIndex * 3 + index) }}
                                >
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                    const text = suggestedAction.action;
                                    onSubmit(text);
                                    setShowSuggestions(false);
                                    }}
                                    className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
                                >
                                    <span className="font-medium">{suggestedAction.title}</span>
                                    <span className="text-xs text-muted-foreground">{suggestedAction.tag}</span>
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                ))}
            </div>
        )}

        <input
        type="file"
        className="fixed -top-4 -left-4 size-0.5 opacity-0 pointer-events-none"
        multiple
        tabIndex={-1}
        />

        <Textarea
        placeholder="Send a message..."
        className={cx(
            'min-h-[24px] max-h-[calc(75dvh)] overflow-hidden resize-none rounded-xl text-base bg-muted',
        )}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();

                if (isLoading) {
                    toast.error('Please wait for the model to finish its response!');
                } else {
                    setShowSuggestions(false);
                    onSubmit();
                }
            }
        }}
        rows={3}
        autoFocus
        />

        <Button 
            className="rounded-full p-1.5 h-fit absolute bottom-2 right-2 m-0.5 border dark:border-zinc-600"
            onClick={() => onSubmit(question)}
            disabled={question.length === 0}
        >
            <ArrowUpIcon size={14} />
        </Button>
    </div>
    );
}