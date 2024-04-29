"use client";

import Image from "next/image";
import {useState, useEffect} from "react";

import {
    Dialog,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogContent
} from "@/components/ui/dialog";

import {Button} from "../ui/button";
import {usePracticeModal} from "@/store/use-practice-modal";

const PracticeModal = () => {
    const [isClient, setIsClient] = useState(false);
    const {isOpen, close} = usePracticeModal();

    useEffect(() => setIsClient(true), []);

    if (!isClient) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={close}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center justify-center mb-5 w-full">
                        <Image src={"/heart.svg"} alt={"Heart"} height={100} width={100}/>
                    </div>
                    <DialogTitle className="text-center font-bold text-2xl">
                        Practice Lesson
                    </DialogTitle>
                    <DialogDescription className="text-center text-base">
                        Use Practice Lessons to regain hearts and points. You cannot lose hearts and points in practice mode.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mb-4">
                    <div className="flex flex-col w-full gap-y-4">
                        <Button variant="primary" className="w-full" size="lg" onClick={close}>
                           I understand
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )

};

export default PracticeModal;
