// CardSlideIn.js
import { motion } from "framer-motion";
import { useFlip } from "../context/FlipContext";

const CardSlideIn = ({ index, frontImage, frontContent, list }) => {
  const { isRevealed } = useFlip(); // Get reveal state from context
  const cardBackImage = "/cardImages/redback.png";
  console.log("CardSlideIn.js", isRevealed);
  return (
    <motion.div
      className={`h-52 w-36 ${
        index === 0
          ? "-ml-28"
          : list?.length > 19 && index < 20
          ? "-ml-36"
          : list?.length > 9 && index < 10
          ? "-ml-36"
          : "-ml-28"
      } relative cursor-pointer transition-all duration-400`}
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      style={{
        transformStyle: "preserve-3d",
        transformOrigin: "center",
      }}
    >
      {/* Front of the card */}
      <motion.div
        className="absolute inset-0 w-full h-full rounded-lg"
        style={{
          backfaceVisibility: "hidden",
          transform: !isRevealed ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <img
          src={frontImage}
          alt={frontContent}
          className="w-full h-full object-cover rounded-lg"
        />
      </motion.div>

      {/* Back of the card */}
      <motion.div
        className="absolute inset-0 w-full h-full rounded-lg"
        style={{
          backfaceVisibility: "hidden",
          transform: !isRevealed ? "rotateY(0deg)" : "rotateY(180deg)",
        }}
      >
        <img
          src={cardBackImage}
          alt="Card Back"
          className="w-full h-full object-cover rounded-lg"
        />
      </motion.div>
    </motion.div>
  );
};

export default CardSlideIn;
