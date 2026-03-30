import { BookUserIcon } from "lucide-react";
import React from "react";
import Title from "./Title";

const Testimonial = () => {
  const cardsData = [
    {
      image:
        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
      name: "Briar Martin",
      handle: "@neilstellar",
    },
    {
      image:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
      name: "Tom Willy",
      handle: "@tomyrocks",
    },
    {
      image:
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60",
      name: "Jordan Lee",
      handle: "@jordantalks",
    },
    {
      image:
        "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60",
      name: "Avery Johnson",
      handle: "@averywrites",
    },
  ];

  const CreateCard = ({ card }) => (
    <div
      className="
        p-4 rounded-lg mx-4 shadow hover:shadow-lg transition-all duration-200 w-72 shrink-0

        bg-white dark:bg-gray-800
        border border-transparent dark:border-gray-700
      "
    >
      <div className="flex gap-2">
        <img
          className="size-11 rounded-full"
          src={card.image}
          alt="User Image"
        />
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <p className="text-gray-900 dark:text-gray-100">{card.name}</p>
            <svg
              className="mt-0.5 fill-indigo-500"
              width="12"
              height="12"
              viewBox="0 0 12 12"
            >
              {/* unchanged */}
            </svg>
          </div>
          <span className="text-xs text-slate-500 dark:text-gray-400">
            {card.handle}
          </span>
        </div>
      </div>

      <p className="text-sm py-4 text-gray-800 dark:text-gray-300">
        Jobify-AI made finding relevant jobs effortless — no more endless
        scrolling.
      </p>
    </div>
  );

  return (
    <>
      <div
        id="testimonials"
        className="
          flex flex-col items-center my-10 scroll-mt-12
        "
      >
        <div
          className="
            flex items-center gap-2 text-sm
            text-blue-800 dark:text-indigo-300

            bg-blue-400/10 dark:bg-indigo-500/10
            border border-indigo-200 dark:border-indigo-500/30

            rounded-full px-6 py-1.5
          "
        >
          <BookUserIcon className="size-4.5 stroke-indigo-600 dark:stroke-indigo-400" />
          <span>Testimonials</span>
        </div>

        <Title
          title="Don't just take our words"
          description="See how Jobify-AI is helping users land better opportunities faster with AI-powered matching."
        />
      </div>

      {/* 🔥 ROW 1 */}
      <div className="marquee-row w-full mx-auto max-w-5xl overflow-hidden relative">
        <div
          className="
            absolute left-0 top-0 h-full w-20 z-10 pointer-events-none

            bg-linear-to-r from-white to-transparent
            dark:from-gray-900
          "
        ></div>

        <div className="marquee-inner flex transform-gpu min-w-[200%] pt-10 pb-5">
          {[...cardsData, ...cardsData].map((card, index) => (
            <CreateCard key={index} card={card} />
          ))}
        </div>

        <div
          className="
            absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none

            bg-linear-to-l from-white to-transparent
            dark:from-gray-900
          "
        ></div>
      </div>

      {/* 🔥 ROW 2 */}
      <div className="marquee-row w-full mx-auto max-w-5xl overflow-hidden relative">
        <div
          className="
            absolute left-0 top-0 h-full w-20 z-10 pointer-events-none

            bg-linear-to-r from-white to-transparent
            dark:from-gray-900
          "
        ></div>

        <div className="marquee-inner marquee-reverse flex transform-gpu min-w-[200%] pt-10 pb-5">
          {[...cardsData, ...cardsData].map((card, index) => (
            <CreateCard key={index} card={card} />
          ))}
        </div>

        <div
          className="
            absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none

            bg-linear-to-l from-white to-transparent
            dark:from-gray-900
          "
        ></div>
      </div>

      {/* 🔹 Animation (unchanged) */}
      <style>
        {`
          @keyframes marqueeScroll {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }

          .marquee-inner {
            animation: marqueeScroll 25s linear infinite;
          }

          .marquee-reverse {
            animation-direction: reverse;
          }
        `}
      </style>
    </>
  );
};

export default Testimonial;
