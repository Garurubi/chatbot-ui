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
                title: "페로브스카이트의 밴드갭과 태양전지 효율 간 상관관계를 알려주세요.",
                action: "페로브스카이트의 밴드갭과 태양전지 효율 간 상관관계를 알려주세요.",
                tag: "Device Physics"
            },
            {
                title: "페로브스카이트 태양전지 연구에서 가장 많이 사용되고 있는 HTL 및 ETL 조성을 알려주세요.",
                action: "페로브스카이트 태양전지 연구에서 가장 많이 사용되고 있는 HTL 및 ETL 조성을 알려주세요.",
                tag: "Charge Transport Layers"
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
                                className="h-full"
                                >
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                    const text = suggestedAction.action;
                                    onSubmit(text);
                                    setShowSuggestions(false);
                                    }}
                                    className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-between items-start min-h-[100px]"
                                >
                                    <span className="font-medium whitespace-normal">{suggestedAction.title}</span>
                                    <span className="text-xs text-muted-foreground whitespace-normal">{suggestedAction.tag}</span>
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