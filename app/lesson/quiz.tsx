"use client";

import {challengeOptions, challenges, userSubscription} from "@/db/schema";
import Header from "@/app/lesson/header";
import {useState, useTransition} from "react";
import QuestionBubble from "@/app/lesson/question-bubble";
import Challenge from "@/app/lesson/challenge";
import Footer from "@/app/lesson/footer";
import {upsertChallengeProgress} from "@/actions/challenge-progress";
import {toast} from "sonner";
import {reduceHearts} from "@/actions/user-progress";
import {useAudio, useWindowSize, useMount} from "react-use";
import {useRouter} from "next/navigation";
import ResultCard from "@/app/lesson/result-card";
import Confetti from "react-confetti";
import {useHeartsModal} from "@/store/use-hearts-modal";
import {usePracticeModal} from "@/store/use-practice-modal";

type Props = {
    initialLessonId: number;
    initialHearts: number;
    initialPercentage: number;
    initialLessonChallenges: (typeof challenges.$inferSelect & {
        completed: boolean;
        challengeOptions: (typeof challengeOptions.$inferSelect)[];
    })[];
    userSubscription: typeof userSubscription.$inferSelect & {
        isActive: boolean;
    } | null;
};

const Quiz = ({
                  initialLessonChallenges,
                  initialLessonId,
                  initialPercentage,
                  initialHearts,
                  userSubscription,
              }: Props) => {

    const {open: openHeartsModal} = useHeartsModal();
    const {open: openPracticeModal} = usePracticeModal();

    useMount(() => {
        if (initialPercentage === 100) {
            // lesson already completed, toggle practice modal
            openPracticeModal();
        }
    });

    const [finishAudio] = useAudio({src: "/finish.wav", autoPlay: true});
    const {width, height} = useWindowSize();

    const [
        correctSound,
        _c,
        correctSoundControls
    ] = useAudio({src: "/correct.wav"});
    const [
        incorrectSound,
        _i,
        incorrectSoundControls
    ] = useAudio({src: "/incorrect.wav"});

    const router = useRouter();

    const [pending, startTransition] = useTransition();
    const [lessonId, setLessonId] = useState(initialLessonId);
    const [hearts, setHearts] = useState(initialHearts);
    const [percentage, setPercentage] = useState(() => {
        return initialPercentage === 100 ? 0 : initialPercentage;
    });
    const [challenges] = useState(initialLessonChallenges);
    const [activeIndex, setActiveIndex] = useState(() => {
        const uncompletedIndex = challenges.findIndex(
            (challenge) => !challenge.completed
        );
        return uncompletedIndex === -1 ? 0 : uncompletedIndex;
    });

    const onNext = () => {
        // if (activeIndex == challenges.length - 1) {
        //     window.location.href = "/learn"; // because router.push does not trigger a rerender
        //     setActiveIndex((curr) => curr = 0);
        //     setStatus("none");
        //     setSelectedOption(undefined);
        //     return;
        // }
        setActiveIndex((current) => current + 1);
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
                            openHeartsModal();
                            return;
                        }

                        correctSoundControls.play();
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
            startTransition(() => {
                reduceHearts(challenge.id).then((respone) => {
                    if (respone?.error === "hearts") {
                        openHeartsModal();
                        return;
                    }

                    incorrectSoundControls.play();
                    setStatus("wrong");
                    if (!respone?.error) {
                        setHearts((prev) => Math.max(prev - 1, 0)); // should not be negative
                    }
                }).catch(() => toast.error("Something went wrong"));
            })
        }
    };

    const challenge = challenges[activeIndex]; // this is a problematic case, need to handle it
    const options = challenge?.challengeOptions ?? []; // the ?? is just a special case for || operator

    if (!challenge) {
        return (
            <>
                {finishAudio}
                <Confetti
                    width={width}
                    height={height}
                    recycle={false}
                    numberOfPieces={500}
                    tweenDuration={10000}
                />
                <div
                    className="flex flex-col gap-y-4 lg:gap-y-8 max-w-lg mx-auto text-center items-center justify-center h-full">
                    {/*TODO: render an image component here later */}
                    <h1 className="text-xl lg:text-3xl font-bold text-neutral-700">
                        Great Job! <br/> you&apos;ve completed the lesson
                    </h1>
                    <div className="flex items-center gap-x-4 w-full">
                        <ResultCard
                            variant={"points"}
                            value={challenges.length * 10}
                        />
                        <ResultCard
                            variant={"hearts"}
                            value={hearts}
                        />
                    </div>
                </div>
                <Footer lessonId={lessonId} status="completed" onCheck={() => window.location.href = "/learn"}/>
            </>
        )
    }

    const title =
        challenge.type === "ASSIST"
            ? "Select the correct meaning"
            : challenge.question;

    return (
        <>
            {correctSound}
            {incorrectSound}
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
                                disabled={pending}
                                type={challenge.type}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Footer disabled={pending || !selectedOption} status={status} onCheck={onContinue}/>
        </>
    );
};

export default Quiz;
