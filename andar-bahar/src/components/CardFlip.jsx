import { motion } from "framer-motion";

const CardSlideIn = ({ index, frontImage, isRevealed, frontContent, list }) => {
  const cardBackImage = "/cardImages/redback.png";

  return (
    <motion.div
      className={`h-52 w-36 ${
        index == 0
          ? "-ml-28"
          : list?.length > 19 && index < 20
          ? "-ml-36"
          : list?.length > 9 && index < 10
          ? "-ml-36"
          : "-ml-28"
      } relative cursor-pointer transition-all duration-400`} // Set width and relative position
      initial={{ x: 300, opacity: 0 }} // Start off-screen to the left and transparent
      animate={{ x: 0, opacity: 1 }} // Slide to position and become fully visible
      transition={{ duration: 0.2, ease: "easeInOut" }} // Fast and smooth transition in 400ms
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
          alt={frontContent}
          className="w-full h-full object-cover rounded-lg"
        />
      </motion.div>

      {/* Card back
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
      </motion.div> */}
    </motion.div>
  );
};

export default CardSlideIn;
