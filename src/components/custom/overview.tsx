import { motion } from "framer-motion";

const agents = [
  {
    name: "Data Retrieval Agent",
    desc: "논문·DB에서 신소재 후보와 성능 데이터를 수집하고 정리합니다.",
    tag: "데이터 조회",
  },
  {
    name: "Hypothesis Agent",
    desc: "수집된 데이터를 바탕으로 새로운 소재 가설을 생성합니다.",
    tag: "가설 생성",
  },
  {
    name: "Debate Agent",
    desc: "가설의 장단점을 토론하고 실험 제안합니다.",
    tag: "토론·평가",
  },
];

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.05 }}
    >
      <div className="rounded-xl p-6 flex flex-col gap-6 leading-relaxed text-center md:text-left">
        {/* 아이콘 + 로고 느낌 */}
        {/* <p className="flex flex-row justify-center md:justify-start gap-4 items-center">
          <BotIcon size={40} />
          <span className="text-2xl font-light">+</span>
          <MessageCircle size={40} />
        </p> */}

        {/* 프로젝트 메타 정보 */}
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Single Atom Catalyst(SAC) · Perovskite
        </p>

        {/* 메인 타이틀 */}
        <h1 className="text-2xl md:text-3xl font-semibold">
          AI 멀티에이전트 기반 연구개발 지원 시스템
        </h1>

        {/* 간단 설명 */}
        <p className="text-sm md:text-base text-muted-foreground">
          다양한 AI 에이전트들이 유기적으로 협력하여 
          <br className="hidden md:block" />
          사용자의 연구 질문에 대한 근거 기반 답변과 새로운 소재 아이디어를 제안합니다.
        </p>

        {/* 하위 에이전트 카드 */}
        <div className="grid gap-3 md:grid-cols-3 mt-2">
          {agents.map((agent) => (
            <div
              key={agent.name}
              className="border rounded-xl px-3 py-3 text-left bg-muted/40"
            >
              <p className="text-xs font-semibold text-muted-foreground mb-1">
                {agent.tag}
              </p>
              <p className="text-sm font-medium">{agent.name}</p>
              <p className="mt-1 text-xs text-muted-foreground leading-snug">
                {agent.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
