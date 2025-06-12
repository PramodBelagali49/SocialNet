import { clsx } from "clsx";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const fileAsDataURL = async (file) => {
  return new Promise((resolve, reject) => {
    if (!file){
        reject(new Error("File does NOT exist"));
        return;
    }
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = (err) => {
      reject(err);
    };

    reader.readAsDataURL(file);
  });
}