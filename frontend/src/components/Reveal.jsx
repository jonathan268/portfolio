import { useReveal } from "../hooks/useReveal";

const TRANSFORMS = {
  up:    "translateY(28px)",
  down:  "translateY(-28px)",
  left:  "translateX(-28px)",
  right: "translateX(28px)",
  scale: "scale(0.95)",
};

export default function Reveal({ children, delay = 0, dir = "up", className = "", style = {} }) {
  const [ref, vis] = useReveal();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : (TRANSFORMS[dir] ?? TRANSFORMS.up),
        transition: `opacity .55s ease ${delay}ms, transform .55s ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
