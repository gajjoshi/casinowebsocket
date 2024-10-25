import { motion } from "framer-motion";

const CardFlip = ({ frontImage, isRevealed }) => {
  const cardBackImage = "/cardImages/redback.png";

  return (
    <motion.div
      className="h-52 w-36 -ml-28 relative cursor-pointer transition-transform duration-500" // Set width and relative position
      initial={{ rotateY: 0 }}
      animate={{ rotateY: isRevealed ? 180 : 0 }}
      style={{
        transformStyle: "preserve-3d",
        transformOrigin: "center", // Ensure it rotates around the center
      }}
    >
      {/* Card front */}
      <motion.div
        className="absolute inset-0 w-full h-full rounded-lg"
        style={{
          backfaceVisibility: "hidden",
        }}
      >
        <img
          src={frontImage}
          alt="Card Front"
          className="w-full h-full object-cover rounded-lg"
        />
      </motion.div>

      {/* Card back */}
      <motion.div
        className="absolute inset-0 w-full h-full rounded-lg"
        style={{
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)", // Rotate for back face
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

export default CardFlip;
