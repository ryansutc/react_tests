import { useState } from "react";

import { animated, useSpring } from "@react-spring/web";

const SwitchThing = (props) => {
  const [switchOn, setSwitchOn] = useState(true);

  // define the spring:
  const switchSpring = useSpring({
    to: { transform: `translate(120px)` },
    from: { transform: `translate(0px)` },
    delay: 100,
    reverse: switchOn,
  });

  return (
    <animated.div style={{ ...switchSpring, display: "inline-block" }}>
      <button onClick={() => setSwitchOn(!switchOn)}>
        {switchOn ? "on" : "off"}
      </button>
    </animated.div>
  );
};

export default SwitchThing;
