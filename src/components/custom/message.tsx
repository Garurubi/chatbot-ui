import { motion } from 'framer-motion';
import { cx } from 'classix';
import { SparklesIcon } from './icons';
import { Markdown } from './markdown';
import { SSEMessage } from "../../interfaces/interfaces"
import { MessageActions } from '@/components/custom/actions';
import {TypewriterMarkdown} from "@/components/custom/Typewriter"
import {ThinkAccordion} from "@/components/custom/ThinkAccordion"


export const PreviewMessage = ({ message }: { message: SSEMessage; }) => {

  return (
    <motion.div
    className="w-full mx-auto max-w-3xl px-4 group/message"
    initial={{ y: 5, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    data-role={message.role}
    >
      <div
        className={cx(
          'group-data-[role=user]/message:bg-zinc-700 dark:group-data-[role=user]/message:bg-muted group-data-[role=user]/message:text-white flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl'
        )}
        >
        {message.role === 'assistant' && (
          <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
            <SparklesIcon size={14} />
          </div>
        )}
        <div className="flex flex-col w-full">
          {message.content && (
              <div className="flex flex-col gap-4 text-left">
                {(() => {
                  if (message.role === 'assistant') {
                    return <TypewriterMarkdown text={message.content} speed={25} />;
                  }  
                  else if (message.role === 'thinking') {
                    return <ThinkAccordion node={message.content} status={message.data?.status} data={message.data} stream_status={message.stream_status} />;
                  }else {
                    return <Markdown>{message.content}</Markdown>;
                  }
                })()}
              </div>
            )}

            {message.role === 'assistant' && (
              <MessageActions message={message} />
            )}
        </div>
      </div>
    </motion.div>
  );
};


export const ThinkingMessage = () => {
  const role = 'assistant';

  return (
    <motion.div
      className="w-full mx-auto max-w-3xl px-4 group/message "
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
      data-role={role}
    >
      <div
        className={cx(
          'flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl',
          'group-data-[role=user]/message:bg-muted'
        )}
      >
        <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
          <SparklesIcon size={14} />
        </div>
        {/* spinner */}
        <div className="w-full flex items-center gap-2 text-muted-foreground">
          <svg
            className="animate-spin h-5 w-5"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25 text-sky-400"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <span>응답 생성 중...</span>
        </div>
      </div>
    </motion.div>
  );
};