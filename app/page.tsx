'use client'

import { Typography } from "antd";
import Image from "next/image";
import { useCallback, useState } from "react";

export default function Home() {
  const [count, setCount] = useState<number>(0);

  const onFrogClick = useCallback(() => {
    setCount(curCount => curCount + 1);
  }, []);

  return (
    <>
      <Image
        src="/images/frogs/main-guy.png"
        alt="Vercel logomark"
        width={500}
        height={250}
        onClick={onFrogClick}
      />
      <Typography.Text>Count: {count}</Typography.Text>
    </>
  );
}
