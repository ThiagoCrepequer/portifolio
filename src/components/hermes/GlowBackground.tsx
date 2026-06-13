export const GlowBackground = () => {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.15]"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 10% 10%, rgba(255,172,2,0.45), transparent 60%)",
        }}
      />
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.08]"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 90% 80%, rgba(237,255,69,0.35), transparent 55%)",
        }}
      />
    </>
  );
};
