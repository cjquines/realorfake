import React from "react";
import { percent } from "./utils";

const ClassBtnActive = ({ color, data, first, guess, real, status }) => {
  return (
    <div
      className={`
        relative flex flex-col justify-center flex-1 py-6 px-4 pl-6
        border-b-2 text-left md:border-b-0 select-none
        ${!first ? "md:pl-4 md:pr-6" : ""}
        ${color === "green" ? "bg-green-100" : ""}
        ${color === "red" ? "bg-red-100" : ""}
        ${!status ? "cursor-pointer hover:bg-gray-100" : ""}
      `}
      onClick={guess && ((e) => guess(real))}
    >
      <p className="text-display">{data.name}</p>
    </div>
  );
};

const ClassBtnHistory = ({ color, data, first, guess, real, status }) => {
  const correct = data.correct + Number(status === "correct");
  const guesses = data.guesses + 1;

  const source = real && (
    <p className="mb-1 text-sm tracking-widest uppercase">{data.program}</p>
  );
  const name = real ? (
    <a className="text-display hover:underline" href={data.url}>
      {data.name}
    </a>
  ) : (
    <p className="text-display">{data.name}</p>
  );
  const stats = (
    <p className="mt-5 text-gray-500 text-sm">
      {correct} out of {guesses} people ({percent(correct, guesses)}) guessed
      this correctly
    </p>
  );
  const marker = (
    <div
      className={`
      h-full absolute w-2 left-0
      ${!first ? "md:left-auto md:right-0" : ""}
      ${color === "green" ? "bg-green-300" : ""}
      ${color === "red" ? "bg-red-300" : ""}
      `}
    ></div>
  );

  return (
    <div
      className={`
        relative flex flex-col justify-center flex-1 py-6 px-4 pl-6
        border-b-2 text-left
        ${!first ? "md:pl-4 md:pr-6" : ""}
      `}
    >
      {source}
      {name}
      {stats}
      {marker}
    </div>
  );
};

const ClassBtn = (props) => {
  const inHistory = !props.guess;
  const color = props.real
    ? props.status === "correct" && "green"
    : props.status === "wrong" && "red";
  const props_ = { ...props, color };
  return inHistory ? (
    <ClassBtnHistory {...props_} />
  ) : (
    <ClassBtnActive {...props_} />
  );
};

const Pair = ({ classes, guessed, guess }) => {
  const btn = (real, first) => {
    const key = real ? "real" : "fake";
    const props = {
      key,
      data: classes[key],
      first,
      guess,
      real,
      status: classes.status,
    };
    return <ClassBtn {...props} />;
  };

  const classElt = [
    btn(classes.real_first, true),
    btn(!classes.real_first, false),
  ];

  return (
    <div
      className={`
        flex flex-col md:flex-row min-h-60 md:min-h-48
        even:bg-white md:even:bg-transparent
      `}
    >
      {classElt}
    </div>
  );
};

export default Pair;
