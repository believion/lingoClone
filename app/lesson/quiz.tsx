"use client";

import {challengeOptions, challenges} from "@/db/schema";
import Header from "@/app/lesson/header";
import {useState, useTransition} from "react";
import QuestionBubble from "@/app/lesson/question-bubble";
import Challenge from "@/app/lesson/challenge";
import Footer from "@/app/lesson/footer";
import {upsertChallengeProgress} from "@/actions/challenge-progress";
import {toast} from "sonner";

type Props = {
    initialLessonId: number;
    initialHearts: number;
    initialPercentage: number;
    initialLessonChallenges: (typeof challenges.$inferSelect & {
        completed: boolean;
        challengeOptions: (typeof challengeOptions.$inferSelect)[];
    })[];
    userSubscription: any; // later add the relevant type
};

const Quiz = ({
                  initialLessonChallenges,
                  initialLessonId,
                  initialPercentage,
                  initialHearts,
                  userSubscription,
              }: Props) => {
    const [pending, startTransition] = useTransition();
    const [hearts, setHearts] = useState(initialHearts);
    const [percentage, setPercentage] = useState(initialPercentage);
    const [challenges] = useState(initialLessonChallenges);
    const [activeIndex, setActiveIndex] = useState(() => {
        const uncompletedIndex = challenges.findIndex(
            (challenge) => !challenge.completed
        );
        return uncompletedIndex === -1 ? 0 : uncompletedIndex;
    });

    const onNext = () => {
        if (activeIndex === challenges.length - 1) {
            setActiveIndex((current) => 0);
        } else {
            setActiveIndex((current) => current + 1);
        }
    };

    const [status, setStatus] = useState<"correct" | "wrong" | "none">("none");
    const [selectedOption, setSelectedOption] = useState<number>();

    const onSelect = (id: number) => {
        if (status !== "none") return;
        setSelectedOption(id);
    };

    const onContinue = () => {
        if (!selectedOption) return;

        if (status === "wrong") {
            setStatus("none");
            setSelectedOption(undefined);
            return;
        }
        if (status === "correct") {
            onNext(); // change the challenge to the next challenge and reset the state variables
            setStatus("none");
            setSelectedOption(undefined);
            return;
        }

        const correctOption = options.find((option) => option.correct);

        if (!correctOption) return; // just to handle edge cases

        if (correctOption && correctOption.id === selectedOption) {
            startTransition(() => {
                upsertChallengeProgress(challenge.id)
                    .then((response) => {
                        if (response?.error === "hearts") {
                            console.error("Missing Hearts");
                            return;
                        }

                        setStatus("correct");
                        setPercentage((prev) => prev + 100 / challenges.length);

                        // This is a practice session, all challenges have been completed
                        if (initialPercentage === 100) {
                            setHearts((prev) => Math.min(prev + 1, 5));
                        }
                    })
                    .catch(() => toast.error("Something went wrong, please try again"));
            });
        } else {
            console.error("Incorrect option");
        }
    };

    const challenge = challenges[activeIndex];
    const options = challenge?.challengeOptions ?? []; // the ?? is just a special case for || operator

    const title =
        challenge.type === "ASSIST"
            ? "Select the correct meaning"
            : challenge.question;

    return (
        <>
            <Header
                hearts={hearts}
                percentage={percentage}
                hasActiveSubscription={!!userSubscription?.isActive}
            />
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
            <Footer disabled={!selectedOption} status={status} onCheck={onContinue}/>
        </>
    );
};

export default Quiz;
