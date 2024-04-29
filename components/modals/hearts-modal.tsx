"use client";

import Image from "next/image";
import {useRouter} from "next/navigation";
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
import {useHeartsModal} from "@/store/use-hearts-modal";

const HeartsModal = () => {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const {isOpen, close} = useHeartsModal();

    useEffect(() => setIsClient(true), []);

    if (!isClient) {
        return null;
    }

    const onClick = () => {
        close();
        router.push("/store");
    }

    return (
        <Dialog open={isOpen} onOpenChange={close}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center justify-center mb-5 w-full">
                        <Image src={"/hippo.png"} alt={"MascotSad"} height={80} width={80}/>
                    </div>
                    <DialogTitle className="text-center font-bold text-2xl">
                        You ran out of hearts !
                    </DialogTitle>
                    <DialogDescription className="text-center text-base">
                        Get pro for unlimited hearts, or buy some hearts from the shop
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mb-4">
                    <div className="flex flex-col w-full gap-y-4">
                        <Button variant="primary" className="w-full" size="lg" onClick={onClick}>
                            Get Unlimited Hearts
                        </Button>
                        <Button variant="primaryOutline" className="w-full" size="lg" onClick={close}>
                            No Thanks
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )

};

export default HeartsModal;
