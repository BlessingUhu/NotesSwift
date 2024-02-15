"use client";
import {useEffect} from "react";

export default function AutoSizeTextArea(ref: HTMLTextAreaElement | null, description: string) {
  useEffect(() => {
    if (ref) {
      ref.style.height = "0px";
      const scrollHeight = ref.scrollHeight;
      ref.style.height = `${scrollHeight}px`;
    } 
  }, [ref, description]);
}
