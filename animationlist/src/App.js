import "./App.css";

import React, { useState } from "react";

import { animated, useTransition } from "@react-spring/web";

import { LISTS } from "./data.js";
import { usePrevious } from "./utils.js";

/**
 * The main react parent component
 *
 * @returns {Object} React.Component
 */
function App() {
  const [curList, setCurList] = useState(0);
  const prevList = usePrevious(curList);

  const listTransition = useTransition(LISTS[curList], {
    // enter: (item) => (next) =>
    //   next({ delay: 700, marginTop: 5, maxHeight: 50, opacity: 1 }),
    //expires: 400,
    enter: { delay: 800, marginTop: 5, maxHeight: 50, opacity: 1 },
    from: { marginTop: 5, opacity: 0 },
    keys: (item) => item.id,
    leave: { delay: 0, marginTop: 0, maxHeight: 0, opacity: 0 },
    onRest: {
      opacity: (props, spring, item) => {
        console.log("At Rest: Give newListProps. " + JSON.stringify(props));
      },
    },
    loop: () => {
      console.log("I have done a run");
      return false;
    },
    // onStart: () =>
    //   console.log("At Start: Give newListNames, deltaNewListProps"),
    //trail: 300,
    expires: 10,
    //onProps: (props, spring) =>
    //console.log("I've been updated " + JSON.stringify(spring)),
  });

  const animatedList = listTransition((style, item) => {
    return (
      item && (
        <animated.tr style={style} data={item.id}>
          <td style={{ width: "80px" }}>{item.name}</td>
          <td style={{ width: "140px" }}>{item.status}</td>
        </animated.tr>
      )
    );
  });

  const lastAnimatedItem = () => {
    let oldList = prevList ? LISTS[prevList] : null;
  };
  let height =
    Math.max(
      prevList ? LISTS[prevList].length : LISTS[0].length,
      LISTS[curList].length
    ) * 50;

  //  style={{ height: height }}
  console.log("rendering");
  return (
    <div className="App">
      <table className="App-header">
        <tbody>{animatedList}</tbody>
      </table>
      <p>
        <button onClick={() => setCurList(curList === 3 ? 0 : curList + 1)}>
          Click Me
        </button>
      </p>
      <p>{curList}</p>
      {/* <SwitchThing /> */}
    </div>
  );
}

export default App;
