"use client"

import {challengeOptions, challenges} from "@/db/schema";
import Header from "@/app/lesson/header";
import {useState} from "react";
import QuestionBubble from "@/app/lesson/question-bubble";
import Challenge from "@/app/lesson/challenge";
import Footer from "@/app/lesson/footer";

type Props = {
    initialLessonId: number,
    initialHearts: number,
    initialPercentage: number,
    initialLessonChallenges: (typeof challenges.$inferSelect & {
        completed: boolean;
        challengeOptions: typeof challengeOptions.$inferSelect[];
    })[];
    userSubscription: any; // later add the relevant type
}

const Quiz = ({
                  initialLessonChallenges,
                  initialLessonId,
                  initialPercentage,
                  initialHearts,
                  userSubscription,
              }: Props) => {
    const [hearts, setHearts] = useState(initialHearts);
    const [percentage, setPercentage] = useState(initialPercentage);
    const [challenges] = useState(initialLessonChallenges);
    const [activeIndex, setActiveIndex] = useState(() => {
        const uncompletedIndex = challenges.findIndex((challenge) => !challenge.completed);
        return uncompletedIndex === -1 ? 0 : uncompletedIndex;
    })

    const [status, setStatus] = useState<"correct" | "wrong" | "none">("none");
    const [selectedOption, setSelectedOption] = useState<number>();

    const onSelect = (id: number) => {
        if (status !== "none") return;
        setSelectedOption(id);
    }

    const challenge = challenges[activeIndex];
    const options = challenge?.challengeOptions ?? []; // the ?? is just a special case for || operator

    const title = challenge.type === "ASSIST" ?
        "Select the correct meaning" : challenge.question;

    return (
        <>
            <Header hearts={hearts} percentage={percentage} hasActiveSubscription={!!userSubscription?.isActive}/>
            <div className="flex-1">
                <div className="flex items-center h-full justify-center">
                    <div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
                        <h1 className="text-center text-lg lg:text-3xl lg:text-start font-bold text-neutral-700">
                            {title}
                        </h1>
                        <div>
                            {challenge.type === "ASSIST" && (
                                <QuestionBubble question={challenge.question}/>
                            )}
                            <Challenge
                                options={options}
                                onSelect={onSelect}
                                status={status}
                                selectedOption={selectedOption}
                                disabled={false}
                                type={challenge.type}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Footer
            disabled={!selectedOption}
            status={status}
            onCheck={()=>{}}
            />
        </>
    )
}

export default Quiz;