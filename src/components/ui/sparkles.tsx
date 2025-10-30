"use client";
import React, { useId, useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Container, Engine } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

interface SparklesCoreProps {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  particleColor?: string;
}

export const SparklesCore = (props: SparklesCoreProps) => {
  const {
    id,
    className,
    background = "transparent",
    minSize = 1,
    maxSize = 3,
    particleDensity = 120,
    particleColor = "#FFFFFF",
  } = props;

  const [init, setInit] = useState(false);
  const generatedId = useId();
  const particlesId = id ?? generatedId;

  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (container?: Container): Promise<void> => {
    console.log(container);
  };

  if (!init) {
    return <div className={className}></div>;
  }

  return (
    <Particles
      id={particlesId}
      className={className}
      particlesLoaded={particlesLoaded}
      options={{
        background: {
          color: {
            value: background,
          },
        },
        fullScreen: {
          enable: false,
          zIndex: 1,
        },
        fpsLimit: 120,
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: "push",
            },
            onHover: {
              enable: false,
              mode: "repulse",
            },
            resize: true,
          },
          modes: {
            push: {
              quantity: 4,
            },
            repulse: {
              distance: 200,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: particleColor,
          },
          links: {
            enable: false,
          },
          collisions: {
            enable: false,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: true,
            speed: 1,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: particleDensity,
          },
          opacity: {
            value: 1,
            animation: {
              enable: true,
              speed: 1,
              minimumValue: 0.1,
              sync: false,
            },
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: minSize, max: maxSize },
            animation: {
              enable: true,
              speed: 4,
              minimumValue: 0.1,
              sync: false,
            },
          },
        },
        detectRetina: true,
      }}
    />
  );
};
