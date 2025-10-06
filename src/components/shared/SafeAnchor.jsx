import React from "react";

const SafeAnchor = React.forwardRef(
  (
    {
      href = "#",
      onClick,
      preventDefault = true,
      children,
      ...rest
    },
    ref
  ) => {
    const handleClick = React.useCallback(
      (event) => {
        if (preventDefault) {
          event.preventDefault();
        }
        if (onClick) {
          onClick(event);
        }
      },
      [preventDefault, onClick]
    );

    return (
      <a ref={ref} href={href} onClick={handleClick} {...rest}>
        {children}
      </a>
    );
  }
);

SafeAnchor.displayName = "SafeAnchor";

export default SafeAnchor;
