"use client";

import { AppProgressBar as Progress } from "next-nprogress-bar";
import React from "react";

const ProgressBar = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      {children}
      <Progress
        height="5px"
        color="#ffaa3b"
        options={{ showSpinner: true }}
        shallowRouting
      />
    </>
  );
};

export default ProgressBar;
