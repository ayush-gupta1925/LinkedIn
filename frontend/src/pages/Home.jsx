import Nav from "../components/Nav.jsx";
import React, { useContext, useState, useRef } from "react";
import dp from "../assets/dp.png";
import { FiPlus } from "react-icons/fi";
import { userDataContext } from "../context/UserContext.jsx";
import { authDataContext } from "../context/AuthContext.jsx";
import { IoPencil } from "react-icons/io5";
import { IoCameraOutline } from "react-icons/io5";
import EditProfile from "../components/EditProfile.jsx";
import { RxCross2 } from "react-icons/rx";
import { BsImage } from "react-icons/bs";
import axios from "axios";
import Post from "../components/Post.jsx";
import { useEffect } from "react";
import ConnectionButton from "../components/ConnectionButton.jsx";
function Home() {
  let {
    userData,
    setUserData,
    edit,
    setEdit,
    postData,
    setPostData,
    handleGetProfile
  } = useContext(userDataContext);
  let { serverUrl } = useContext(authDataContext);

  let [frontendImage, setFrontendImage] = useState("");
  let [backendImage, setBackendImage] = useState("");
  let [description, setDescription] = useState("");
  let [uploadPost, setUploadPost] = useState(false);
  let [suggestedUser, setSuggestedUser] = useState([]);
  let image = useRef();

  let [posting, setPosting] = useState("");
  function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return; // agar file select nahi hui

    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  }

  async function handleUplaodPost() {
    // Validation: Dono empty na ho
    if (!description.trim() && !backendImage) {
      return; // function yahin stop ho jayega
    }

    setPosting(true);
    try {
      let formdata = new FormData();
      formdata.append("description", description);

      if (backendImage) {
        formdata.append("image", backendImage);
      }

      let result = await axios.post(serverUrl + "/api/post/create", formdata, {
        withCredentials: true
      });

      setPosting(false);
      setUploadPost(false);


    setFrontendImage("")
    setBackendImage(null)
    setDescription("")
 
      
    } catch (err) {
      console.log(err);
      setPosting(false);
    }
  }
  const handleSuggestedUsers = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/user/suggestedusers", {
        withCredentials: true
      });
      setSuggestedUser(result.data);
      // yahi pe data log karo
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    handleSuggestedUsers();
  }, []);

  return (
    <div className="w-full lg:min-h-[100vh] bg-[#f0efe7] pt-[100px] flex items-start justify-center gap-[20px]  px-[20px] flex-col lg:flex-row  pb-[20px]">
      {edit && <EditProfile />}

      <Nav />

      <div className="w-full  lg:w-[25%] min-h-[200px] bg-[white] shadow-lg rounded-lg relative">
        <div
          className="w-[100%] h-[100px]  bg-gray-400  overflow-hidden flex items-center justify-center relative cursor-pointer rounded-lg"
          onClick={() => setEdit(true)}
        >
          <img
            src={userData.coverImage || ""}
            alt=""
            className=" w-full object-cover cursor-pointer rounded-lg"
          />
          <IoCameraOutline className="absolute right-[15px]  w-[30px] h-[25px] top-[15px] cursor-pointer " />
        </div>
        <div className="rounded-full overflow-hidden items-center justify-center relative top-[-45px] left-[20px]">
          <img
            src={userData.profileImage || dp}
            alt=""
            className="w-[70px] h-[70px] cursor-pointer rounded-full object-cover"
            onClick={() => setEdit(true)}
          />
        </div>
        <div
          className="w-[20px] h-[20px] absolute bg-[#17c1ff] top-[95px] left-[70px] rounded-full flex justify-center items-center cursor-pointer"
          onClick={() => setEdit(true)}
        >
          <FiPlus className="text-gray-800" />
        </div>
        <div className="text-[22px] font-semibold text-gray-700 relative top-[-45px] left-[15px]">{`${userData.firstName} ${userData.lastName}`}</div>
        <div className="text-[18px] font-semibold text-gray-600 relative top-[-51px] left-[15px]">
          {userData.headline || ""}
        </div>
        <div className="text-[15px] font-semibold text-gray-500 relative top-[-51px] left-[15px]">
          {userData.location}
        </div>
        <button
          className="w-[95%] h-[40px] rounded-full border-2  border-[#2dc0ff] text-[#2dc0ff] flex gap-[10px] ml-[10px] justify-center items-center mb-[10px] mt-[-23px] hover:bg-[#ecebf1]"
          onClick={() => setEdit(true)}
        >
          Edit Profile <IoPencil />
        </button>
      </div>

      {uploadPost && (
        <div>
          <div className="fixed top-0 left-0 w-full min-h-screen bg-black opacity-70 z-[100]"></div>

          {/* Container background blocker */}
          <div className="w-[90%] max-w-[500px] h-[600px] bg-white fixed z-[150] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg rounded-lg">
            <div>
              <RxCross2
                className="fixed right-3 top-3 text-[30px] text-gray-800 font-bold cursor-pointer hover:text-red-500"
                onClick={() => setUploadPost(false)}
              />
            </div>

            <div className="flex justify-start  flex-col gap-[20px] p-[30px]">
              <div className="rounded-full overflow-hidden items-center flex justify-start relative  gap-[15px]">
                <img
                  src={userData.profileImage || dp}
                  alt=""
                  className="w-[60px] h-[60px] cursor-pointer rounded-full object-cover"
                  onClick={() => setEdit(true)}
                />

                <div className="text-[18px] font-semibold text-gray-700 relative  ">{`${userData.firstName} ${userData.lastName}`}</div>
              </div>
              <textarea
                className={`w-full border-2 border-gray-600  ${
                  frontendImage ? "h-[150px]" : "h-[320px]"
                } outline-none border-none   resize-none text-[18px]`}
                placeholder="What do you want to taks about.."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>

              <div className="w-full overflow-hidden flex justify-center items-center relative">
                {frontendImage && (
                  <>
                    <img
                      src={frontendImage}
                      alt=""
                      className="h-[170px] object-cover rounded-lg"
                    />
                    <RxCross2
                      className="absolute -top-1 right-16 w-[25px] h-[25px] text-red-500 cursor-pointer bg-white rounded-full p-[2px] hover:bg-gray-200"
                      onClick={() => {
                        setFrontendImage("");
                        setBackendImage(null);
                      }}
                    />
                  </>
                )}
              </div>

              <div className="w-full  flex flex-col">
                <div className="p-[15px] flex items-center justify-start border-b-2 border-gray-500">
                  <BsImage
                    className="w-[24px] h-[24px] text-gray-500 cursor-pointer"
                    onClick={() => image.current.click()}
                  />
                </div>

                <input type="file" hidden ref={image} onChange={handleImage} />

                <div className="p-[15px]">
                  <button
                    className=" w-[19%] h-[40px] rounded-full border-2  border-[#2dc0ff] text-white justify-center items-center   bg-[#2dc0ff] absolute right-[5%] "
                    onClick={handleUplaodPost}
                    disabled={posting}
                  >
                    {posting ? "Posting" : "Post"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full  lg:w-[50%] min-h-[200px] bg-[#f0efe7]  flex flex-col gap-[20px] ">
        <div className="w-full h-[120px] bg-white shadow-lg rounded-lg items-center  flex gap-[55px]">
          <div className="rounded-full overflow-hidden flex items-center justify-center relative left-[25px] ">
            <img
              src={userData.profileImage || dp}
              alt=""
              className="w-[55px] h-[55px] cursor-pointer rounded-full object-cover"
              onClick={() => setEdit(true)}
            />
          </div>

          <button
            className="  w-[75%] sm:w-[80%]    md:w-[85%] lg:w-[76%] h-[60px] border-2 relative  border-gray-500 rounded-full  mr-[5%] flex items-center justify-start pl-[20px] font-bold hover:bg-[#ddeaf4]"
            onClick={() => setUploadPost(true)}
          >
            Start a Post{" "}
          </button>
        </div>

        {postData.map((post, index) => (
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

      <div className="w-full  lg:w-[25%] min-h-[200px] bg-[white] shadow-lg hidden lg:flex flex-col p-[20px]  items-center rounded-lg">
        <h1 className="text-[25px] text-gray-600 font-semibold">
          Suggested Users
        </h1>

        {suggestedUser.length > 0 ? (
          suggestedUser.map((sup) => (
            <div
              key={sup._id}
              className="flex w-[95%] justify-center items-center flex-col gap-[10px]  pb-[10px] hover:bg-[#b6c0c9] rounded-lg pt-[10px] cursor-pointer mt-[13px] "
              onClick={() => {
                handleGetProfile(sup.userName);
              }}
            >
              <div className="flex justify-between items-center w-full">
                <div className="flex justify-center items-start gap-[10px]">
                  <div className="rounded-full overflow-hidden flex items-center justify-start relative left-[10px]">
                    <img
                      src={sup.profileImage || dp}
                      alt=""
                      className="w-[40px] h-[40px] cursor-pointer rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-[15px] font-semibold text-gray-700 relative left-[15px]">
                      {`${sup.firstName} ${sup.lastName}`}
                    </div>
                    <div className="text-[13px] font-semibold text-gray-700 relative left-[15px]">
                      {sup.headline || ""}
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="w-[]20px"> <ConnectionButton /></div> */}
            </div>
          ))
        ) : (
          <div>No Suggested Users</div>
        )}
      </div>
    </div>
  );
}

export default Home;
