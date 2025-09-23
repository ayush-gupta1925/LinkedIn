// import React, { useState } from "react";
// import ai from "../assets/ai.png";
// import { useNavigate } from "react-router-dom";
// import open from "../assets/start.mp3";
// function Ai() {
//   const navigate = useNavigate();
//   let openingSound = new Audio(open);

//   let [activeAi, setActiveAi] = useState(false);

//   function speak(message) {
//     let utterence = new SpeechSynthesisUtterance(message);
//     window.speechSynthesis.speak(utterence);
//   }

//   const speechRecongnition =
//     window.SpeechRecognition || window.webkitSpeechRecognition;
//   const recognition = new speechRecongnition();
//   if (!recognition) {
//     console.log("Not Supported");
//   }
//   recognition.onresult = (e) => {
//     const transcript = e.results[0][0].transcript.trim();
//     if (
//       transcript.toLowerCase().includes("home") ||
//       transcript.toLowerCase().includes("home page") ||
//       transcript.toLowerCase().includes("open home page")
//     ) {
//       speak("opening home page");

//       navigate("/");
//     } else if (
//       transcript.toLowerCase().includes("network") ||
//       transcript.toLowerCase().includes("open network page") ||
//       transcript.toLowerCase().includes("network page")
//     ) {
//       speak("open network page");
//       navigate("/network");
//     } else if (
//       transcript.toLowerCase().includes("conversation") ||
//       transcript.toLowerCase().includes("open conversation page") ||
//       transcript.toLowerCase().includes("conversation page")
//     ) {
//       speak("opening conversations page");

//       navigate("/conversations");
//     } else if (
//       transcript.toLowerCase().includes("profile") ||
//       transcript.toLowerCase().includes("open profile page") ||
//       transcript.toLowerCase().includes("profile page")
//     ) {
//       speak("opening profile page");

//       navigate("/profile");
//     } else if (
//       transcript.toLowerCase().includes("notification") ||
//       transcript.toLowerCase().includes("notification page") ||
//       transcript.toLowerCase().includes("open notification page")
//     ) {
//       speak("opening notificationpage ");

//       navigate("/notification");
//     } else {
//       console.log("try again");
//     }
//   };

//   recognition.onend = () => {
//     setActiveAi(false);
//   };

//   return (
//     <div
//       className="fixed lg:bottom-[20px] md:bottom-[40px] bottom-[80px] left-[2%] z-50"
//       onClick={() => {
//         recognition.start();
//         openingSound.play();
//         setActiveAi(true);
//       }}
//     >
//       <img
//         src={ai}
//         className={`cursor-pointer w-[100px] rounded-full transform transition-all duration-300
//       ${
//         activeAi
//           ? "translate-x-[10%] translate-y-[-10%] scale-125 shadow-[0_0_30px_#00d2fc]"
//           : "translate-x-0 translate-y-0 scale-100 shadow-[0_0_15px_rgba(0,0,0,0.4)]"
//       }`}
//         style={{
//           filter: activeAi
//             ? "grayscale(0%) drop-shadow(0 0 20px #00d2fc)"
//             : "grayscale(50%) drop-shadow(0 0 10px rgba(0,0,0,0.4))"
//         }}
//       />
//     </div>
//   );
// }

// export default Ai;

import React, { useState, useEffect, useContext, useRef } from "react";
import ai from "../assets/ai.png";
import { useNavigate } from "react-router-dom";
import open from "../assets/start.mp3";
import { socket, userDataContext } from "../context/UserContext.jsx";

function Ai() {
  const navigate = useNavigate();
  const openingSound = useRef(new Audio(open));
  const { userConnections, userData } = useContext(userDataContext);

  const [activeAi, setActiveAi] = useState(false); // continuous mode flag
  const [tempListening, setTempListening] = useState(false); // single click listen flag
  const [listeningActive, setListeningActive] = useState(false); // shadow when listening
  const recognitionRef = useRef(null);
  const isSpeakingRef = useRef(false);

  // 🎤 Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("Browser does not support SpeechRecognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-IN";

    recognition.onstart = () => {
      if (activeAi) setListeningActive(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript
        .trim()
        .toLowerCase();

      recognition.stop();

      const waitAndExecute = () => {
        if (isSpeakingRef.current) {
          setTimeout(waitAndExecute, 200);
        } else {
          handleCommand(transcript);
        }
      };
      waitAndExecute();
    };

    recognition.onerror = (err) => {
      console.error("SpeechRecognition Error:", err);
    };

    recognition.onend = () => {
      setTempListening(false);
      setListeningActive(false);
    };

    recognitionRef.current = recognition;
  }, [activeAi, userConnections]);

  // 👉 Commands
  const handleCommand = (transcript) => {
    transcript = transcript.toLowerCase();

    if (transcript.includes("home")) {
      navigateWithSpeak("/", "Opening home page");
    } else if (transcript.includes("network")) {
      navigateWithSpeak("/network", "Opening network page");
    } else if (transcript.includes("conversation")) {
      navigateWithSpeak("/conversations", "Opening conversation page");
    } else if (transcript.includes("profile")) {
      navigateWithSpeak("/profile", "Opening profile page");
    } else if (transcript.includes("notification")) {
      navigateWithSpeak("/notification", "Opening notification page");
    } else if (
      transcript.includes("connection") ||
      transcript.includes("connections") ||
      transcript.includes("my connections") ||
      transcript.includes("how many connections")
    ) {
      speak(`You have ${userConnections?.length || 0} connections`);
    } else {
      speak("I didn't understand, please say that again");
    }
  };

  // 👉 Text-to-Speech
  const speak = (message) => {
    isSpeakingRef.current = true;
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "hi-IN";

    const voices = window.speechSynthesis.getVoices
      ? window.speechSynthesis.getVoices()
      : [];
    const hindiVoice = voices.find((v) => v.lang === "hi-IN");
    if (hindiVoice) utterance.voice = hindiVoice;

    utterance.onend = () => {
      isSpeakingRef.current = false;
      setListeningActive(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  // 👉 Navigate with TTS
  const navigateWithSpeak = (path, message) => {
    speak(message);
    setTimeout(() => {
      navigate(path);
    }, 600);
  };

  // 👉 Single Click (one-time listening)
  const handleSingleClick = () => {
    openingSound.current.play();
    recognitionRef.current?.start();
    setTempListening(true);
  };

  // 👉 Double Click (toggle continuous active mode)
  const handleDoubleClick = () => {
    if (!activeAi) {
      setActiveAi(true);
      openingSound.current.play();
    } else {
      setActiveAi(false);
      recognitionRef.current?.stop();
      window.speechSynthesis.cancel();
      setListeningActive(false);
    }
  };

  // 👉 Socket events (Only for logged-in user + when activeAi is true)
  useEffect(() => {
    if (!userData?._id) return;

    const handleStatusUpdate = (data) => {
      if (
        activeAi &&
        data.receiverId === userData._id &&
        data.newStatus === "Received"
      ) {
        speak(`${data.senderName} sent you a connection request`);
      }
    };

    const handleLikedUpdated = (data) => {
      if (
        activeAi &&
        data.action === "liked" &&
        data.postAuthor === userData._id
      ) {
        speak(`${data.userName} liked your post`);
      }
    };

    const handleCommentAdded = (data) => {
      if (activeAi && data.postAuthor === userData._id) {
        speak(`${data.userName} commented on your post`);
      }
    };

    socket.on("statusUpdate", handleStatusUpdate);
    socket.on("likedUpdated", handleLikedUpdated);
    socket.on("commentAdded", handleCommentAdded);

    return () => {
      socket.off("statusUpdate", handleStatusUpdate);
      socket.off("likedUpdated", handleLikedUpdated);
      socket.off("commentAdded", handleCommentAdded);
    };
  }, [activeAi, userData]);

  return (
    <div
      className="fixed bottom-[30px] sm:left-[2%] left-[5%] z-50 select-none"
      onClick={handleSingleClick}
      onDoubleClick={handleDoubleClick}
    >
      <img
        src={ai}
        className={`cursor-pointer rounded-full transition-all duration-300
          w-[70px] sm:w-[90px]
          ${
            activeAi
              ? listeningActive
                ? "scale-115 shadow-[0_0_60px_#00d2fc]" // active + listening
                : "scale-110 shadow-[0_0_40px_#00d2fc]" // active normal
              : tempListening
              ? "scale-100 shadow-[0_0_25px_#00d2fc]" // single click
              : "scale-90 shadow-[0_0_15px_rgba(0,0,0,0.4)]" // idle
          }`}
        style={{
          filter:
            activeAi || tempListening
              ? "grayscale(0%) drop-shadow(0 0 20px #00d2fc)"
              : "grayscale(50%) drop-shadow(0 0 10px rgba(0,0,0,0.4))"
        }}
      />
    </div>
  );
}

export default Ai;
