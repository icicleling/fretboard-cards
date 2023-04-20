import React, { useMemo, useRef, useState } from "react";
import { useSprings, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import styled from "styled-components";
import { getRandomFret, getRandomString } from "./utils";
import { FINGERBOARD_NOTES } from "./constants/fingerboard";

const cards = Array(10).fill("https://picsum.photos/300/570");

function Deck({
  resetNum,
  onReset,
}: {
  resetNum: number;
  onReset: () => void;
}) {
  const { current: gone } = useRef(new Set());
  const [size, setSize] = useState(0);
  const [props, api] = useSprings(cards.length, (i) => ({
    x: 0,
    y: i * -2,
    scale: 1,
    rotate: -3 + Math.random() * 6,
    delay: i * 100,
    from: { x: 0, rotate: 0, scale: 1.5, y: -1000 },
  }));

  const bind = useDrag(
    ({
      args: [index],
      active,
      movement: [mx],
      direction: [xDir],
      velocity: [vx],
    }) => {
      const trigger = vx > 0.1;
      if (!active && trigger) {
        gone.add(index);
        setSize(gone.size);
      }

      api.start((i) => {
        if (index !== i) return;
        const isGone = gone.has(index);
        const x = isGone ? (200 + window.innerWidth) * xDir : active ? mx : 0;
        const rotate = mx / 100 + (isGone ? xDir * 10 * vx : 0);
        const scale = active ? 1.1 : 1;
        return {
          x,
          rotate,
          scale,
          delay: undefined,
          config: { friction: 80, tension: active ? 800 : isGone ? 200 : 500 },
        };
      });
      if (!active && gone.size === cards.length) {
        setTimeout(() => {
          gone.clear();
          onReset();
        }, 600);
      }
    }
  );

  const randomNotes = useMemo(
    () =>
      [...Array(cards.length)].map(() => {
        const fret = getRandomFret();
        const str = getRandomString();
        return {
          str,
          note: FINGERBOARD_NOTES[str][fret],
          fret,
        };
      }),
    []
  );

  return (
    <>
      {props.map(({ x, y, rotate, scale }, i) => (
        <Card
          {...bind(i)}
          key={i}
          style={{
            x,
            y,
            scale,
            rotate,
            perspective: "1500px",
            rotateX: "20deg",
            rotateY: rotate.to((r) => `${r / 10}deg`),
            backdropFilter:
              Math.abs(cards.length - size - (i + 1)) <= 1
                ? "blur(4px)"
                : "none",
          }}
        >
          <Content
            style={{
              backgroundImage: `url(${cards[i]}?sig=${
                i + resetNum * cards.length
              })`,
            }}
          >
            <div>Str: {randomNotes[i].str + 1}</div>
            <div>{randomNotes[i].note}</div>
            <div>Fret: {randomNotes[i].fret}</div>
          </Content>
        </Card>
      ))}
    </>
  );
}

export default function App() {
  const [reset, setReset] = useState(0);

  return (
    <Container>
      <Deck key={reset} resetNum={reset} onReset={() => setReset(reset + 1)} />
    </Container>
  );
}

const Container = styled(animated.div)`
  background: aliceblue;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const Card = styled(animated.div)`
  will-change: transform;
  position: absolute;
  touch-action: none;
  padding: 16px;
  width: 45vh;
  max-width: 300px;
  height: 85vh;
  max-height: 570px;
  border-radius: 10px;
  box-shadow: 0 8px 80px -10px rgba(50, 50, 73, 0.3),
    0 10px 10px -10px rgba(50, 50, 73, 0.3);
  background-color: rgba(255, 255, 255, 0.2);
`;

const Content = styled.div`
  border-radius: 10px;
  background-color: white;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  height: 100%;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: space-between;

  & > div {
    color: white;
    font-size: 20px;
    font-weight: bold;
    padding: 12px;
    user-select: none;
  }

  & > div:nth-child(1) {
    align-self: flex-start;
  }

  & > div:nth-child(2) {
    font-size: 58px;
    display: flex;
    align-items: center;
  }

  & > div:nth-child(3) {
    align-self: flex-end;
    display: flex;
    align-items: flex-end;
  }
`;
