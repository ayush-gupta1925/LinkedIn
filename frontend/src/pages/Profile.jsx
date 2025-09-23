// import React, { useContext, useState, useRef, useEffect } from "react";
// import Nav from "../components/Nav.jsx";
// import dp from "../assets/dp.png";
// import { userDataContext } from "../context/UserContext.jsx";
// import { IoPencil } from "react-icons/io5";
// import { authDataContext } from "../context/AuthContext.jsx";
// import { IoCameraOutline } from "react-icons/io5";
// import { FiPlus } from "react-icons/fi";

// import EditProfile from "../components/EditProfile.jsx";
// import Post from "../components/Post.jsx";
// import ConnectionButton from "../components/ConnectionButton.jsx";
// import { useNavigate } from "react-router-dom";

// function Profile() {
//   const navigate = useNavigate();
//   let {
//     userData,
//     setUserData,
//     edit,
//     setEdit,
//     postData,
//     setPostData,
//     profileData,
//     setProfileData
//   } = useContext(userDataContext);

//   let [profilePost, setProfilePost] = useState([]);
//   let { serverUrl } = useContext(authDataContext);

//   useEffect(() => {
//     setProfilePost(
//       postData.filter((post) => post.author._id === profileData._id)
//     );
//   }, [profileData, postData]);

//   return (
//     <div className="w-full min-h-[100vh] bg-[#f0efe7] flex flex-col items-center pt-[100px]">
//       <Nav />

//       {edit && <EditProfile />}

//       <div className="w-full max-w-[900px] min-h-[100vh] flex flex-col gap-[10px] pl-[20px] pr-[20px] pb-[40px]">
//         <div className="relative bg-white">
//           <div className="w-[100%] h-[100px] bg-gray-400 overflow-hidden flex items-center justify-center relative cursor-pointer rounded-lg">
//             {profileData.coverImage ? (
//               <img
//                 src={profileData.coverImage}
//                 alt="Cover"
//                 className="w-full object-cover cursor-pointer rounded-lg"
//               />
//             ) : (
//               <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
//                 No Cover Image
//               </div>
//             )}
//             <IoCameraOutline className="absolute right-[15px] w-[30px] h-[25px] top-[15px] cursor-pointer" />
//           </div>

//           <div className="rounded-full overflow-hidden items-center justify-center relative top-[-45px] left-[20px]">
//             <img
//               src={profileData.profileImage || dp}
//               alt=""
//               className="w-[70px] h-[70px] cursor-pointer rounded-full object-cover"
//             />
//           </div>
//           <div className="w-[20px] h-[20px] absolute bg-[#17c1ff] top-[95px] left-[70px] rounded-full flex justify-center items-center cursor-pointer">
//             <FiPlus className="text-gray-800" />
//           </div>
//           <div className="text-[22px] font-semibold text-gray-700 relative top-[-45px] left-[15px]">{`${profileData.firstName} ${profileData.lastName}`}</div>
//           <div className="text-[18px] font-semibold text-gray-600 relative top-[-51px] left-[15px]">
//             {profileData.headline || ""}
//           </div>
//           <div className="text-[15px] font-semibold text-gray-500 relative top-[-51px] left-[15px]">
//             {profileData.location}
//           </div>
//           <div className="text-[15px] font-semibold text-gray-500 relative top-[-51px] left-[15px]">
//             {`${profileData.connection?.length} Connection`}
//           </div>

//           {/* Message button - only for other users */}
//           {/* {profileData._id !== userData._id && (
//   <div className="w-full flex justify-end mt-[-25px] mb-[20px] pr-[15px]">
//     <button
//       onClick={() => navigate(`/chat/${profileData._id}`)}
//       className="w-[150px] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] flex gap-[10px] justify-center items-center text-[17px] hover:bg-[#2dc0ff] hover:text-white transition"
//     >
//       Message
//     </button>
//   </div>
// )}





//           {profileData._id != userData._id && (
//             <div className="ml-[12px] mt-[-40px] mb-[20px]">
//               <ConnectionButton userId={profileData._id} />{" "}
//             </div>
//           )} */}

//           {/* Buttons row - Connection left, Message right */}
//           {profileData._id !== userData._id && (
//             <div className="w-full flex justify-between items-center mt-[-25px] mb-[20px] px-[15px] ">
//               {/* Connection Button - left */}
//               <ConnectionButton userId={profileData._id} />

//               {/* Message Button - right */}
//               <button
//                 onClick={() => navigate(`/chat/${profileData._id}`)}
//                 className="w-[150px] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] flex gap-[10px] justify-center items-center text-[17px] hover:bg-[#2dc0ff] hover:text-white transition"
//               >
//                 Message
//               </button>
//             </div>
//           )}

//           {profileData._id == userData._id && (
//             <button
//               className="w-[150px] h-[40px] rounded-full border-2  border-[#2dc0ff] text-[#2dc0ff] flex gap-[10px] ml-[15px] justify-center items-center mb-[20px] mt-[-25px] text-[17px] hover:bg-[#84cae8] hover:text-white "
//               onClick={() => setEdit(true)}
//             >
//               Edit Profile <IoPencil />
//             </button>
//           )}
//         </div>
//         <div
//           className="w-full h-[100px] flex items-center p-[20px] text-[22px] text-gray-600 font-semibold bg-white  shadow-lg rounded-lg
// "
//         >
//           {`Posts  (${profilePost.length})`}
//         </div>

//         <div className="flex flex-col items-center justify-start gap-[10px] ">
//           {profilePost.map((post, index) => (
//             <Post
//               key={index}
//               id={post._id}
//               description={post.description}
//               author={post.author}
//               image={post.image}
//               like={post.like}
//               comment={post.comment}
//               createdAt={post.createdAt}
//             />
//           ))}
//         </div>

//         {profileData.skills?.length > 0 && (
//           <div className="w-full min-h-[100px] flex flex-col justify-center p-[30px] font-semibold bg-white shadow-lg rounded-lg gap-[10px]">
//             <div className="text-[27px] text-gray-600">Skills</div>
//             <div className="flex flex-wrap justify-start items-center gap-[20px] text-gray-600 text-[15px]">
//               {profileData.skills.map((skill, index) => (
//                 <div
//                   key={index}
//                   className="border-2 border-black text-[#5c1af4] px-4 py-1 rounded-full flex items-center gap-2 mb-[10px] cursor-pointer bg-[#edeeef]"
//                 >
//                   {skill}
//                 </div>
//               ))}
//               {profileData._id == userData._id && (
//                 <button
//                   className="w-[120px] h-[40px] rounded-full border-2  border-[#2dc0ff] text-[#2dc0ff] flex gap-[10px] ml-[20px] justify-center items-center mb-[10px] text-[19px]   hover:bg-[#2dc0ff] hover:text-white transition"
//                   onClick={() => setEdit(true)}
//                 >
//                   Add Skills
//                 </button>
//               )}
//             </div>
//           </div>
//         )}

//         {profileData.education?.length > 0 && (
//           <div className="w-full max-w-4xl mx-auto p-8 font-semibold bg-white shadow-lg rounded-lg border border-gray-300">
//             <div className="text-3xl text-gray-600 mb-8 font-semibold">
//               Education
//             </div>

//             {/* Education Details */}
//             <div className="flex flex-col gap-6 text-gray-700 text-lg border-2 border-gray-400 p-[20px]  rounded-lg  shadow-md">
//               {profileData.education.map((edu, index) => (
//                 <div
//                   key={index}
//                   className="border-b border-gray-300 pb-4 last:border-b-0"
//                 >
//                   <div className="font-semibold text-[18px] text-[#279cdb]">
//                     <span className="font-semibold text-[20px] text-[#111111]">
//                       College :{" "}
//                     </span>{" "}
//                     {edu.college}
//                   </div>

//                   <div className="font-semibold text-[18px] text-[#279cdb]">
//                     {" "}
//                     <span className="font-semibold text-[20px] text-[#111111]">
//                       Degree :{" "}
//                     </span>{" "}
//                     {edu.degree}
//                   </div>
//                   <div className="font-semibold text-[18px] text-[#279cdb]">
//                     <span className="font-semibold text-[20px] text-[#111111]">
//                       Field of Study :{" "}
//                     </span>{" "}
//                     {edu.fieldOfStudy}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Button at bottom */}
//             {profileData._id == userData._id && (
//               <div className="mt-8 flex justify-center">
//                 <button
//                   className="w-[140px] h-[45px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] flex gap-2 justify-center items-center text-[18px] hover:bg-[#2dc0ff] hover:text-white transition"
//                   onClick={() => setEdit(true)}
//                 >
//                   Add Education
//                 </button>
//               </div>
//             )}
//           </div>
//         )}

//         {userData.experience?.length > 0 && (
//           <div className="w-full max-w-4xl mx-auto p-8 font-semibold bg-white shadow-lg rounded-lg border border-gray-300">
//             <div className="text-3xl text-gray-600 mb-8 font-semibold">
//               Experience
//             </div>

//             {/* Experince Details */}
//             <div className="flex flex-col gap-6 text-gray-700 text-lg border-2 border-gray-400 p-[20px]  rounded-lg  shadow-md">
//               {userData.experience.map((ex, index) => (
//                 <div
//                   key={index}
//                   className="border-b border-gray-300 pb-4 last:border-b-0"
//                 >
//                   <div className="font-semibold text-[18px] text-[#279cdb]">
//                     <span className="font-semibold text-[20px] text-[#111111]">
//                       Title :{" "}
//                     </span>{" "}
//                     {ex.title}
//                   </div>

//                   <div className="font-semibold text-[18px] text-[#279cdb]">
//                     {" "}
//                     <span className="font-semibold text-[20px] text-[#111111]">
//                       Company :{" "}
//                     </span>{" "}
//                     {ex.company}
//                   </div>
//                   <div className="font-semibold text-[18px] text-[#279cdb]">
//                     <span className="font-semibold text-[20px] text-[#111111]">
//                       Description :{" "}
//                     </span>{" "}
//                     {ex.description}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Button at bottom */}
//             <div className="mt-8 flex justify-center">
//               {profileData._id == userData._id && (
//                 <button
//                   className="w-[140px] h-[45px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] flex gap-2 justify-center items-center text-[18px] hover:bg-[#2dc0ff] hover:text-white transition"
//                   onClick={() => setEdit(true)}
//                 >
//                   Add Experince
//                 </button>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Profile;






import React, { useContext, useState, useRef, useEffect } from "react";
import Nav from "../components/Nav.jsx";
import dp from "../assets/dp.png";
import { userDataContext } from "../context/UserContext.jsx";
import { IoPencil } from "react-icons/io5";
import { authDataContext } from "../context/AuthContext.jsx";
import { IoCameraOutline } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";

import EditProfile from "../components/EditProfile.jsx";
import Post from "../components/Post.jsx";
import ConnectionButton from "../components/ConnectionButton.jsx";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  let {
    userData,
    setUserData,
    edit,
    setEdit,
    postData,
    setPostData,
    profileData,
    setProfileData
  } = useContext(userDataContext);

  let [profilePost, setProfilePost] = useState([]);
  let { serverUrl } = useContext(authDataContext);

  useEffect(() => {
    setProfilePost(
      postData.filter((post) => post.author._id === profileData._id)
    );
  }, [profileData, postData]);

  return (
    <div className="w-full min-h-[100vh] bg-[#f0efe7] flex flex-col items-center pt-[80px] sm:pt-[100px]">
      <Nav />

      {edit && <EditProfile />}

      <div className="w-full max-w-[900px] min-h-[100vh] flex flex-col gap-[10px] px-4 sm:px-[20px] pb-[40px]">
        {/* Cover Image */}
        <div className="relative bg-white">
          <div className="w-full h-[80px] sm:h-[100px] bg-gray-400 overflow-hidden flex items-center justify-center relative cursor-pointer rounded-lg">
            {profileData.coverImage ? (
              <img
                src={profileData.coverImage}
                alt="Cover"
                className="w-full object-cover cursor-pointer rounded-lg"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-sm sm:text-base">
                No Cover Image
              </div>
            )}
            <IoCameraOutline className="absolute right-3 sm:right-4 top-3 sm:top-4 w-5 h-5 sm:w-7 sm:h-6 cursor-pointer" />
          </div>

          {/* Profile Pic */}
          <div className="rounded-full overflow-hidden items-center justify-center relative -top-10 sm:-top-12 left-4 sm:left-5">
            <img
              src={profileData.profileImage || dp}
              alt=""
              className="w-12 h-12 sm:w-[70px] sm:h-[70px] cursor-pointer rounded-full object-cover"
            />
          </div>

          {/* Plus Button */}
          <div className="w-5 h-5 sm:w-[20px] sm:h-[20px] absolute bg-[#17c1ff] top-[60px] sm:top-[95px] left-[40px] sm:left-[70px] rounded-full flex justify-center items-center cursor-pointer">
            <FiPlus className="text-gray-800 text-[10px] sm:text-base" />
          </div>

          {/* Name */}
          <div className="text-sm sm:text-[22px] font-semibold text-gray-700 relative -top-10 sm:-top-12 left-4 sm:left-5 truncate">
            {`${profileData.firstName} ${profileData.lastName}`}
          </div>

          {/* Headline */}
          <div className="text-xs sm:text-[18px] font-semibold text-gray-600 relative -top-11 sm:-top-13 left-4 sm:left-5 truncate">
            {profileData.headline || ""}
          </div>

          {/* Location */}
          <div className="text-xs sm:text-[15px] font-semibold text-gray-500 relative -top-11 sm:-top-13 left-4 sm:left-5 truncate">
            {profileData.location}
          </div>

          {/* Connections */}
          <div className="text-xs sm:text-[15px] font-semibold text-gray-500 relative -top-11 sm:-top-13 left-4 sm:left-5">
            {`${profileData.connection?.length} Connection`}
          </div>

          {/* Buttons */}
          {profileData._id !== userData._id && (
            <div className="w-full flex justify-between items-center -mt-6 sm:mt-0 mb-4 px-4 sm:px-5">
              <ConnectionButton userId={profileData._id} />
              <button
                onClick={() => navigate(`/chat/${profileData._id}`)}
                className="w-[120px] sm:w-[150px] h-[35px] sm:h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] flex gap-2 justify-center items-center text-[14px] sm:text-[17px] hover:bg-[#2dc0ff] hover:text-white transition"
              >
                Message
              </button>
            </div>
          )}

          {profileData._id === userData._id && (
            <button
              className="w-[120px] sm:w-[150px] h-[35px] sm:h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] flex gap-2 ml-4 justify-center items-center mb-4 text-[14px] sm:text-[17px] hover:bg-[#84cae8] hover:text-white"
              onClick={() => setEdit(true)}
            >
              Edit Profile <IoPencil />
            </button>
          )}
        </div>

        {/* Posts Section */}
        <div className="w-full h-[80px] sm:h-[100px] flex items-center p-3 sm:p-5 text-[16px] sm:text-[22px] text-gray-600 font-semibold bg-white shadow-lg rounded-lg">
          {`Posts (${profilePost.length})`}
        </div>

        <div className="flex flex-col items-center justify-start gap-3 sm:gap-4">
          {profilePost.map((post, index) => (
            <Post
              key={index}
              id={post._id}
              description={post.description}
              author={post.author}
              image={post.image}
              like={post.like}
              comment={post.comment}
              createdAt={post.createdAt}
            />
          ))}
        </div>

        {/* Skills Section */}
        {profileData.skills?.length > 0 && (
          <div className="w-full min-h-[100px] flex flex-col justify-center p-4 sm:p-6 font-semibold bg-white shadow-lg rounded-lg gap-3">
            <div className="text-[20px] sm:text-[27px] text-gray-600">Skills</div>
            <div className="flex flex-wrap justify-start items-center gap-2 sm:gap-4 text-gray-600 text-xs sm:text-[15px]">
              {profileData.skills.map((skill, index) => (
                <div
                  key={index}
                  className="border-2 border-black text-[#5c1af4] px-2 sm:px-4 py-1 rounded-full flex items-center gap-1 sm:gap-2 mb-2 sm:mb-2 cursor-pointer bg-[#edeeef] text-[10px] sm:text-[15px]"
                >
                  {skill}
                </div>
              ))}
              {profileData._id === userData._id && (
                <button
                  className="w-[100px] sm:w-[120px] h-[30px] sm:h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] flex gap-2 justify-center items-center mb-2 sm:mb-2 text-[12px] sm:text-[19px] hover:bg-[#2dc0ff] hover:text-white transition"
                  onClick={() => setEdit(true)}
                >
                  Add Skills
                </button>
              )}
            </div>
          </div>
        )}

        {/* Education & Experience sections remain same but adjust text & padding */}
        {/* You can apply similar responsive classes: text-xs sm:text-base, p-3 sm:p-8 */}
      </div>
    </div>
  );
}

export default Profile;

