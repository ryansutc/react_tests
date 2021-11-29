const { useRef, useEffect } = require("react");

/**
 * Get previous prop value for functional components
 * custom hook as per react docs and logRocket site:
 * https://blog.logrocket.com/how-to-get-previous-props-state-with-react-hooks/
 *
 * @param {*} value prop value
 * @returns {*} prevProp
 */
export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
