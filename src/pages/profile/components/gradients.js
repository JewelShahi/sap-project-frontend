// Gradients
const GRADIENTS = [
  "from-[#00F5A0] to-[#00D9F5]",
  "from-[#00FFA3] to-[#2EC4B6]",
  "from-[#00C9FF] to-[#92FE9D]",
  "from-[#11998E] to-[#38EF7D]",
  "from-[#43E97B] to-[#38F9D7]",
  "from-[#3A86FF] to-[#00BBF9]",
  "from-[#4361EE] to-[#4CC9F0]",
  "from-[#007CF0] to-[#00DFD8]",
  "from-[#0575E6] to-[#00F260]",
  "from-[#00DBDE] to-[#0083B0]",
  "from-[#00C853] to-[#0091EA]",
  "from-[#1FA2FF] to-[#12D8FA]",
  "from-[#00B09B] to-[#96C93D]",
  "from-[#134E5E] to-[#71B280]",
  "from-[#F7971E] to-[#FFD200]",
  "from-[#FCE38A] to-[#F38181]",
  "from-[#F6D365] to-[#FDA085]",
  "from-[#FFB75E] to-[#ED8F03]",
  "from-[#F2994A] to-[#F2C94C]",
  "from-[#F83600] to-[#F9D423]",
  "from-[#FF4E50] to-[#F9D423]",
  "from-[#FF6A00] to-[#FFB347]",
  "from-[#E65100] to-[#FF8F00]",
  "from-[#56AB2F] to-[#F09819]",
  "from-[#A8E063] to-[#F76B1C]",
  "from-[#00C853] to-[#FF6D00]",
];

const pickGradient = () => {
  const picked = GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];
  const degree = Math.floor(Math.random() * 61);
  return {
    gradientClasses: picked,
    gradientStyle: {
      backgroundImage: `linear-gradient(${degree}deg, var(--tw-gradient-stops))`,
    },
  };
};

export default pickGradient;