"use client";

import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "../ui/button";
import { useExitModal } from "@/store/use-exit-modal";

const ExitModal = () => {
  const router = useRouter();
  const [isClient,setIsClient] = useState(false);
  const {isOpen, close} = useExitModal();

  useEffect(() => setIsClient(true),[]);


};

export default ExitModal;
