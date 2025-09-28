// import React, { useContext, useState, useEffect, useRef } from "react";
// import dp from "../assets/dp.png";
// import { IoMdSend } from "react-icons/io";
// import { FaRegCommentDots } from "react-icons/fa";
// import { AiOutlineLike, AiFillLike } from "react-icons/ai";
// import { BsImage } from "react-icons/bs";
// import { RxCross2 } from "react-icons/rx";
// import { MdEdit } from "react-icons/md";
// import axios from "axios";
// import moment from "moment";
// import { MdDelete } from "react-icons/md";
// import { authDataContext } from "../context/AuthContext.jsx";
// import { socket, userDataContext } from "../context/UserContext.jsx";

// import ConnectionButton from "./ConnectionButton.jsx";

// function Post({ id, author, like, comment, description, image, createdAt }) {
//   const imageInputRef = useRef(null);

//   const [more, setMore] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editDesc, setEditDesc] = useState(description || "");
//   const [editImage, setEditImage] = useState(null); // File object
//   const [imagePreview, setImagePreview] = useState(null); // ObjectURL for preview
//   const [likes, setLikes] = useState([]);
//   const [comments, setComments] = useState([]);
//   const [commentContent, setCommentContent] = useState("");
//   const [showComment, setShowComment] = useState(false);

//   const {
//     userData,
//     getPost,
//     handleGetProfile,
//     profileData,
//     setProfileData,
//     setPostData,
//     postData
//   } = useContext(userDataContext);
//   const { serverUrl } = useContext(authDataContext);

//   // Create/revoke preview URL when editImage changes
//   useEffect(() => {
//     if (editImage) {
//       const url = URL.createObjectURL(editImage);
//       setImagePreview(url);
//       return () => {
//         URL.revokeObjectURL(url);
//         setImagePreview(null);
//       };
//     } else {
//       setImagePreview(null);
//     }
//   }, [editImage]);

//   // Sync initial likes/comments and desc from props
//   useEffect(() => {
//     setLikes(like || []);
//     setComments(comment || []);
//     setEditDesc(description || "");
//   }, [like, comment, description]);

//   // Socket listeners for likes/comments (existing)
//   useEffect(() => {
//     const onLikedUpdated = ({ postId, likes }) => {
//       if (postId === id) setLikes(likes);
//     };
//     const onCommentAdded = ({ postId, comm }) => {
//       if (postId === id) setComments(comm);
//     };

//     socket.on("likedUpdated", onLikedUpdated);
//     socket.on("commentAdded", onCommentAdded);

//     return () => {
//       socket.off("likedUpdated", onLikedUpdated);
//       socket.off("commentAdded", onCommentAdded);
//     };
//   }, [id]);

//   const likee = async () => {
//     if (!userData) return;
//     if (likes.includes(userData._id)) {
//       setLikes((prev) => prev.filter((id) => id !== userData._id));
//     } else {
//       setLikes((prev) => [...prev, userData._id]);
//     }

//     try {
//       let result = await axios.get(`${serverUrl}/api/post/like/${id}`, {
//         withCredentials: true
//       });
//       setLikes(result.data.like);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const handleComment = async (e) => {
//     e.preventDefault();
//     if (!userData) return;

//     const newComment = {
//       content: commentContent,
//       createdAt: new Date(),
//       user: {
//         _id: userData._id,
//         firstName: userData.firstName,
//         lastName: userData.lastName,
//         profileImage: userData.profileImage,
//         headline: userData.headline
//       }
//     };
//     setComments((prev) => [...prev, newComment]);
//     setCommentContent("");

//     try {
//       let result = await axios.post(
//         `${serverUrl}/api/post/comment/${id}`,
//         { content: commentContent },
//         { withCredentials: true }
//       );
//       setComments(result.data.comment);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       await axios.delete(`${serverUrl}/api/post/delete/${id}`, {
//         withCredentials: true
//       });
//       setPostData((prev) => prev.filter((p) => p._id !== id));
//     } catch (error) {
//       alert("Error deleting post");
//       console.error(error);
//     }
//   };

//   const handleEditSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData();
//       formData.append("description", editDesc);
//       if (editImage) formData.append("image", editImage);

//       const res = await axios.put(
//         `${serverUrl}/api/post/edit/${id}`,
//         formData,
//         {
//           withCredentials: true,
//           headers: {
//             "Content-Type": "multipart/form-data"
//           }
//         }
//       );

//       setPostData((prev) => prev.map((p) => (p._id === id ? res.data : p)));
//       setIsEditing(false);
//       // clear edit image after successful save
//       setEditImage(null);
//       setImagePreview(null);
//     } catch (error) {
//       alert("Error editing post");
//       console.error(error);
//     }
//   };

//   // helper: when user selects file via hidden input
//   const onSelectImage = (e) => {
//     const file = e.target.files?.[0];
//     if (file) setEditImage(file);
//   };

//   return (
//     <div className="w-full min-h-[200px] bg-white rounded-lg p-4 gap-4 flex flex-col post-container mb-4">
//       {/* Edit Modal */}
//       {isEditing ? (
//         <>
//           <div className="fixed top-0 left-0 w-full min-h-screen bg-black opacity-70 z-[100]" />

//           <div className="w-[90%] max-w-[500px] bg-white fixed z-[150] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg rounded-lg p-6 ">
//             <RxCross2
//               className="absolute right-4 top-4 text-[30px] text-gray-800 cursor-pointer hover:text-red-500"
//               onClick={() => setIsEditing(false)}
//             />

//             {/* Author name + upload icon */}
//             <div className="flex items-center gap-4 mb-4">
//               <div className="flex items-center gap-3">
//                 <img
//                   src={userData?.profileImage || dp}
//                   alt="Author"
//                   className="w-[50px] h-[50px] rounded-full object-cover border"
//                 />
//                 <div className="text-[18px] font-semibold text-gray-700">
//                   {userData?.firstName} {userData?.lastName}
//                 </div>
//               </div>
//             </div>

//             <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
//               <textarea
//                 value={editDesc}
//                 onChange={(e) => setEditDesc(e.target.value)}
//                 className="w-full p-4 border border-gray-300 rounded-lg resize-none text-[16px] font-medium text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 transition"
//                 rows={6}
//                 placeholder="Edit your post..."
//               />

//               {/* preview */}
//               {imagePreview || image ? (
//                 <div className="w-full flex justify-center items-center overflow-hidden rounded-lg border border-gray-200">
//                   <img
//                     src={imagePreview || image?.url || image}
//                     alt="preview"
//                     className="object-cover h-[170px] rounded-lg"
//                   />
//                 </div>
//               ) : null}

//               {/* image icon trigger below textarea and preview */}
//               <div
//                 className="mt-2 flex items-center gap-2 cursor-pointer text-gray-600 hover:text-blue-500 select-none"
//                 onClick={() =>
//                   imageInputRef.current && imageInputRef.current.click()
//                 }
//               >
//                 <BsImage className="w-6 h-6" />
//                 <span className="text-sm font-medium">Upload image</span>
//               </div>

//               {/* hidden file input */}
//               <input
//                 type="file"
//                 accept="image/*"
//                 ref={imageInputRef}
//                 onChange={onSelectImage}
//                 className="hidden"
//               />

//               <div className="flex gap-3 justify-end mt-4">
//                 <button
//                   type="submit"
//                   className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
//                 >
//                   Save
//                 </button>
//                 <button
//                   type="button"
//                   className="bg-gray-300 px-5 py-2 rounded-lg hover:bg-gray-400 transition"
//                   onClick={() => {
//                     setIsEditing(false);
//                     setEditImage(null);
//                     setImagePreview(null);
//                   }}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </>
//       ) : (
//         <>
//           {/* Post Header */}
//           <div className="flex justify-between items-center w-full">
//             <div
//               className="flex items-start gap-3 cursor-pointer"
//               onClick={() => handleGetProfile(author.userName)}
//             >
//               <img
//                 src={author.profileImage || dp}
//                 alt=""
//                 className="w-[55px] h-[55px] rounded-full object-cover"
//               />

//               <div>
//                 <div className="text-[20px] font-semibold text-gray-700">{`${author.firstName} ${author.lastName}`}</div>
//                 <div className="text-[16px] text-gray-700">
//                   {author.headline}
//                 </div>
//                 <div className="text-[14px] text-gray-600">
//                   {moment(createdAt).fromNow()}
//                 </div>
//               </div>
//             </div>

//             {/* Edit/Delete or Connection */}
//             {author._id === userData?._id ? (
//               <div className="flex gap-9">
//                 <button
//                   className="text-blue-400 hover:underline"
//                   onClick={() => setIsEditing(true)}
//                 >
//                   <MdEdit className="text-[30px] hover:text-blue-600" />
//                 </button>
//                 <button
//                   className="text-red-400 hover:underline"
//                   onClick={handleDelete}
//                 >
//                   <MdDelete className="text-[30px] hover:text-red-600" />
//                 </button>
//               </div>
//             ) : (
//               <ConnectionButton userId={author._id} />
//             )}
//           </div>

//           {/* Post Description */}
//           <div className="w-[80%] md:ml-[70px] lg:mr-[70px] sm:ml-[60px] ml-[40px] md:mr-[70px]  sm:mr-[60px] mr-[40px] overflow-y-auto relative">
//             <div
//               className={`break-words pl-3  ${
//                 !more ? "max-h-[100px] overflow-hidden" : ""
//               }`}
//             >
//               {editDesc}
//             </div>

//             {editDesc.length > 150 && ( // ✅ Sirf tab show kare jab text lamba ho
//               <div
//                 className="pl-3 text-[15px] font-semibold cursor-pointer text-blue-500"
//                 onClick={() => setMore((p) => !p)}
//               >
//                 {more ? "read less.." : "read more.."}
//               </div>
//             )}
//           </div>

//           {/* Post Image */}
//           {(imagePreview || image?.url || image) && (
//             <div className="w-full flex justify-center items-center rounded-lg mt-4 overflow-hidden">
//               <img
//                 src={imagePreview || image?.url || image}
//                 alt="Post"
//                 className="h-[200px] rounded-lg object-cover"
//               />
//             </div>
//           )}

//           {/* Likes/Comments summary */}
//           <div className="w-full mt-4">
//             <div className="flex justify-between items-center px-5 py-3">
//               <div className="flex items-center gap-2 text-[18px]">
//                 <AiOutlineLike className="w-5 h-5 text-blue-500" />
//                 <span>{likes.length}</span>
//               </div>

//               <div className="flex items-center gap-2 text-[18px]">
//                 <span>{comments.length}</span>
//                 <span>comments</span>
//               </div>
//             </div>

//             <div className="border-b border-gray-200" />

//             <div className="mt-4 flex items-center justify-between">
//               <div
//                 className="flex items-center gap-3 cursor-pointer w-full ml-[10px]"
//                 onClick={likee}
//               >
//                 {!likes.includes(userData?._id) ? (
//                   <>
//                     <AiOutlineLike className="w-[30px] h-[30px] text-[#1ebbff]" />
//                     <span>like</span>
//                   </>
//                 ) : (
//                   <>
//                     <AiFillLike className="w-[30px] h-[30px] text-[#186dec]" />
//                     <span className="text-[#1452e1]">Liked</span>
//                   </>
//                 )}
//               </div>

//               <div
//                 className="flex items-center gap-2 cursor-pointer mr-4 hover:text-[#7474b7]"
//                 onClick={() => setShowComment((p) => !p)}
//               >
//                 <FaRegCommentDots />
//                 <span>comment</span>
//               </div>
//             </div>

//             {/* Comment section */}
//             {showComment && (
//               <div className="mt-6 ml-[10px] mr-[10px]">
//                 <form
//                   className="flex items-center gap-2 border-b-2 pb-2 "
//                   onSubmit={handleComment}
//                 >
//                   <input
//                     type="text"
//                     placeholder="leave a comment"
//                     value={commentContent}
//                     onChange={(e) => setCommentContent(e.target.value)}
//                     className="flex-1 outline-none"
//                   />
//                   <button type="submit">
//                     <IoMdSend className="text-2xl hover:text-[#0baff5]" />
//                   </button>
//                 </form>

//                 <div className="mt-4">
//                   {comments.map((com) => (
//                     <div
//                       key={com._id || com.createdAt}
//                       className="pb-4 border-b-2 last:border-b-0"
//                     >
//                       <div className="flex items-start gap-3">
//                         <img
//                           src={com.user.profileImage || dp}
//                           alt=""
//                           className="w-[55px] h-[55px] rounded-full object-cover"
//                         />
//                         <div>
//                           <div className="text-[18px] font-semibold">{`${com.user.firstName} ${com.user.lastName}`}</div>
//                           <div className="text-[14px] text-gray-600">
//                             {com.user.headline}
//                           </div>
//                           <div className="text-[12px] text-gray-500">
//                             {moment(com.createdAt).fromNow()}
//                           </div>
//                           <div className="mt-2">{com.content}</div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// export default Post;



import React, { useContext, useState, useEffect, useRef } from "react";
import dp from "../assets/dp.png";
import { IoMdSend } from "react-icons/io";
import { FaRegCommentDots } from "react-icons/fa";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { MdEdit, MdDelete } from "react-icons/md";
import axios from "axios";
import moment from "moment";
import { authDataContext } from "../context/AuthContext.jsx";
import { socket, userDataContext } from "../context/UserContext.jsx";
import ConnectionButton from "./ConnectionButton.jsx";

function Post({ id, author, like, comment, description, image, createdAt }) {
  // const imageInputRef = useRef(null);

  // const [more, setMore] = useState(false);
  // const [isEditing, setIsEditing] = useState(false);
  // const [editDesc, setEditDesc] = useState(description || "");
  // const [editImage, setEditImage] = useState(null);
  // const [imagePreview, setImagePreview] = useState(null);
  // const [likes, setLikes] = useState([]);
  // const [comments, setComments] = useState([]);
  // const [commentContent, setCommentContent] = useState("");
  // const [showComment, setShowComment] = useState(false);

  // const { userData, handleGetProfile, setPostData } =
  //   useContext(userDataContext);
  // const { serverUrl } = useContext(authDataContext);


   const imageInputRef = useRef(null);

  const [more, setMore] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editDesc, setEditDesc] = useState(description || "");
  const [editImage, setEditImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [showComment, setShowComment] = useState(false);

  const { userData, handleGetProfile, setPostData } = useContext(userDataContext);
  const { serverUrl } = useContext(authDataContext);

  useEffect(() => {
    if (editImage) {
      const url = URL.createObjectURL(editImage);
      setImagePreview(url);
      return () => {
        URL.revokeObjectURL(url);
        setImagePreview(null);
      };
    } else {
      setImagePreview(null);
    }
  }, [editImage]);

  useEffect(() => {
    setLikes(like || []);
    setComments(comment || []);
    setEditDesc(description || "");
  }, [like, comment, description]);

  useEffect(() => {
    const onLikedUpdated = ({ postId, likes }) => {
      if (postId === id) setLikes(likes);
    };
    const onCommentAdded = ({ postId, comm }) => {
      if (postId === id) setComments(comm);
    };

    socket.on("likedUpdated", onLikedUpdated);
    socket.on("commentAdded", onCommentAdded);

    return () => {
      socket.off("likedUpdated", onLikedUpdated);
      socket.off("commentAdded", onCommentAdded);
    };
  }, [id]);

  const likee = async () => {
    if (!userData) return;
    if (likes.includes(userData._id)) {
      setLikes((prev) => prev.filter((id) => id !== userData._id));
    } else {
      setLikes((prev) => [...prev, userData._id]);
    }

    try {
      let result = await axios.get(`${serverUrl}/api/post/like/${id}`, {
        withCredentials: true
      });
      setLikes(result.data.like);
    } catch (err) {
      console.log(err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!userData) return;

    const newComment = {
      content: commentContent,
      createdAt: new Date(),
      user: {
        _id: userData._id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profileImage: userData.profileImage,
        headline: userData.headline
      }
    };
    setComments((prev) => [...prev, newComment]);
    setCommentContent("");

    try {
      let result = await axios.post(
        `${serverUrl}/api/post/comment/${id}`,
        { content: commentContent },
        { withCredentials: true }
      );
      setComments(result.data.comment);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${serverUrl}/api/post/delete/${id}`, {
        withCredentials: true
      });
      setPostData((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      alert("Error deleting post");
      console.error(error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("description", editDesc);
      if (editImage) formData.append("image", editImage);

      const res = await axios.put(
        `${serverUrl}/api/post/edit/${id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setPostData((prev) => prev.map((p) => (p._id === id ? res.data : p)));
      setIsEditing(false);
      setEditImage(null);
      setImagePreview(null);
    } catch (error) {
      alert("Error editing post");
      console.error(error);
    }
  };

  const onSelectImage = (e) => {
    const file = e.target.files?.[0];
    if (file) setEditImage(file);
  };

  return (
    <div className="w-full max-w-full bg-white rounded-lg p-4 gap-4 flex flex-col post-container mb-4">
      {/* Post Header */}

 {/* Edit Modal */}
      {isEditing && (
        <>
          <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-[100]" />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[150] bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-[500px]">
            <RxCross2
              className="absolute right-4 top-4 text-2xl cursor-pointer hover:text-red-500"
              onClick={() => setIsEditing(false)}
            />
            <div className="flex items-center gap-3 mb-4">
              <img
                src={userData?.profileImage || dp}
                alt="author"
                className="w-12 h-12 rounded-full object-cover"
              />
              <span className="font-semibold text-gray-700">
                {userData?.firstName} {userData?.lastName}
              </span>
            </div>

            <form className="flex flex-col gap-4" onSubmit={handleEditSubmit}>
              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                rows={5}
                placeholder="Edit your post..."
                className="w-full border p-3 rounded-lg outline-none resize-none focus:ring-2 focus:ring-blue-500"
              />
              {(imagePreview || image) && (
                <div className="w-full flex justify-center items-center overflow-hidden rounded-lg border border-gray-200">
                  <img
                    src={imagePreview || image?.url || image}
                    alt="preview"
                    className="h-[170px] object-cover rounded-lg"
                  />
                </div>
              )}

              <div
                className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-blue-500"
                onClick={() => imageInputRef.current?.click()}
              >
                <BsImage className="w-6 h-6" />
                <span className="text-sm font-medium">Upload image</span>
              </div>
              <input
                type="file"
                accept="image/*"
                ref={imageInputRef}
                onChange={onSelectImage}
                className="hidden"
              />

              <div className="flex justify-end gap-3">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="bg-gray-300 px-5 py-2 rounded-lg hover:bg-gray-400 transition"
                  onClick={() => {
                    setIsEditing(false);
                    setEditImage(null);
                    setImagePreview(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </>
      )}


      
  {/* Post Header */}
<div className="flex justify-between items-start w-full gap-2 sm:gap-3 md:gap-4">
  <div
    className="flex items-start gap-2 sm:gap-3 md:gap-4 cursor-pointer flex-1 min-w-0"
    onClick={() => handleGetProfile(author.userName)}
  >
    <img
      src={author.profileImage || dp}
      alt=""
      className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] md:w-[55px] md:h-[55px] rounded-full object-cover flex-shrink-0"
    />

    <div className="flex flex-col max-w-full overflow-hidden">
      <div className="text-[14px] sm:text-[16px] md:text-[20px] font-semibold text-gray-700 truncate">
        {`${author.firstName} ${author.lastName}`}
      </div>
      <div className="text-[12px] sm:text-[14px] md:text-[16px] text-gray-700 truncate">
        {author.headline}
      </div>
      <div className="text-[10px] sm:text-[12px] md:text-[14px] text-gray-500">
        {moment(createdAt).fromNow()}
      </div>
    </div>
  </div>

  {/* Status / Edit-Delete Buttons */}
  <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0">
    {author._id === userData?._id ? (
      <>
        <button onClick={() => setIsEditing(true)}>
          <MdEdit className="text-[20px] sm:text-[25px] md:text-[30px] text-blue-400 hover:text-blue-600" />
        </button>
        <button onClick={handleDelete}>
          <MdDelete className="text-[20px] sm:text-[25px] md:text-[30px] text-red-400 hover:text-red-600" />
        </button>
      </>
    ) : (
      <ConnectionButton userId={author._id} />
    )}
  </div>
</div>


      {/* Description */}
      <div className="w-full pl-[10px] sm:pl-[15px] md:pl-[20px] relative max-w-full">
        <div
          className={`whitespace-pre-wrap break-words overflow-wrap-anywhere word-break-break-word ${
            !more ? "max-h-[80px] sm:max-h-[100px] overflow-hidden" : ""
          } text-[13px] sm:text-[15px] md:text-[16px]`}
        >
          {editDesc}
        </div>

        {editDesc.length > 150 && (
          <div
            className="text-[12px] sm:text-[14px] md:text-[15px] font-semibold cursor-pointer text-blue-500 mt-1"
            onClick={() => setMore((p) => !p)}
          >
            {more ? "read less.." : "read more.."}
          </div>
        )}
      </div>

      {/* Post Image */}
      {(imagePreview || image?.url || image) && (
        <div className="w-full flex justify-center items-center rounded-lg mt-3 sm:mt-4 overflow-hidden">
          <img
            src={imagePreview || image?.url || image}
            alt="Post"
            className="h-[150px] sm:h-[180px] md:h-[200px] rounded-lg object-cover"
          />
        </div>
      )}

      {/* Likes/Comments */}
      <div className="w-full mt-2 sm:mt-4">
        <div className="flex justify-between items-center px-3 sm:px-5 py-2 sm:py-3">
          <div className="flex items-center gap-1 sm:gap-2 text-[14px] sm:text-[16px] md:text-[18px]">
            <AiOutlineLike className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            <span>{likes.length}</span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 text-[14px] sm:text-[16px] md:text-[18px]">
            <span>{comments.length}</span>
            <span>comments</span>
          </div>
        </div>

        <div className="border-b border-gray-200" />

        {/* <div className="mt-3 sm:mt-4 flex items-center justify-between flex-wrap">
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer w-full sm:w-auto max-w-full" onClick={likee} > 
            {!likes.includes(userData?._id) ? ( <> 
              <AiOutlineLike className="w-[22px] h-[22px] sm:w-[26px] sm:h-[26px] md:w-[30px] md:h-[30px] text-[#1ebbff]" /> 
              <span className="text-[13px] sm:text-[15px] truncate"> like </span> </> ) : ( <> <AiFillLike className="w-[22px] h-[22px] sm:w-[26px] sm:h-[26px] md:w-[30px] md:h-[30px] text-[#186dec]" /> <span className="text-[#1452e1] text-[13px] sm:text-[15px] truncate"> Liked </span> </> )} </div> <div
  className="flex items-center gap-1 sm:gap-2 cursor-pointer ml-auto mr-2 sm:mr-4 hover:text-[#7474b7]"
  onClick={() => setShowComment((p) => !p)}
>
  <FaRegCommentDots className="text-[14px] sm:text-[16px] md:text-[18px]" />
  <span className="text-[13px] sm:text-[15px]">comment</span>
</div>
 </div> */}


        <div className="mt-3 sm:mt-4 flex justify-between items-center w-full">
  {/* Left side: Like */}
  <div 
    className="flex items-center gap-2 sm:gap-3 cursor-pointer"
    onClick={likee}
  >
    {!likes.includes(userData?._id) ? (
      <>
        <AiOutlineLike className="w-[22px] h-[22px] sm:w-[26px] sm:h-[26px] md:w-[30px] md:h-[30px] text-[#1ebbff]" />
        <span className="text-[13px] sm:text-[15px] truncate">Like</span>
      </>
    ) : (
      <>
        <AiFillLike className="w-[22px] h-[22px] sm:w-[26px] sm:h-[26px] md:w-[30px] md:h-[30px] text-[#186dec]" />
        <span className="text-[#1452e1] text-[13px] sm:text-[15px] truncate">Liked</span>
      </>
    )}
  </div>

  {/* Right side: Comment */}
  <div
    className="flex items-center gap-1 sm:gap-2 cursor-pointer hover:text-[#7474b7]"
    onClick={() => setShowComment((p) => !p)}
  >
    <FaRegCommentDots className="text-[14px] sm:text-[16px] md:text-[18px]" />
    <span className="text-[13px] sm:text-[15px]">Comment</span>
  </div>
</div>


        {/* Comment Section */}
        {showComment && (
          <div className="mt-4 ml-[5px] sm:ml-[10px] mr-[5px] sm:mr-[10px] max-w-full">
            <form
              className="flex items-center gap-1 sm:gap-2 border-b-2 pb-1 sm:pb-2 w-full"
              onSubmit={handleComment}
            >
              <input
                type="text"
                placeholder="leave a comment"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                className="flex-1 outline-none text-[13px] sm:text-[15px] max-w-full"
              />
              <button type="submit">
                <IoMdSend className="text-[18px] sm:text-[20px] md:text-[22px] hover:text-[#0baff5]" />
              </button>
            </form>

            <div className="mt-3 sm:mt-4">
              {comments.map((com) => (
                <div
                  key={com._id || com.createdAt}
                  className="pb-3 sm:pb-4 border-b-2 last:border-b-0 w-full"
                >
                  <div className="flex items-start gap-2 sm:gap-3 max-w-full">
                    <img
                      src={com.user.profileImage || dp}
                      alt=""
                      className="w-[35px] h-[35px] sm:w-[45px] sm:h-[45px] md:w-[55px] md:h-[55px] rounded-full object-cover"
                    />
                    <div className="max-w-full">
                      <div className="text-[14px] sm:text-[16px] md:text-[18px] font-semibold truncate">{`${com.user.firstName} ${com.user.lastName}`}</div>
                      <div className="text-[11px] sm:text-[13px] md:text-[14px] text-gray-600 truncate">
                        {com.user.headline}
                      </div>
                      <div className="text-[10px] sm:text-[11px] md:text-[12px] text-gray-500">
                        {moment(com.createdAt).fromNow()}
                      </div>
                      <div className="mt-1 sm:mt-2 text-[13px] sm:text-[15px] whitespace-pre-wrap break-words max-w-full">
                        {com.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Post;
