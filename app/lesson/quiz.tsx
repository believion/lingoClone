"use client"

import {challengeOptions, challenges} from "@/db/schema";
import Header from "@/app/lesson/header";
import {useState} from "react";

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

    return (
        <Header hearts={hearts} percentage={percentage} hasActiveSubscription={!!userSubscription?.isActive}/>
    )
}

export default Quiz;