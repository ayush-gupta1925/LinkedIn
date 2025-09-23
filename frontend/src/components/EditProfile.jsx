import React, { useContext, useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { userDataContext } from "../context/UserContext.jsx";
import { FiPlus } from "react-icons/fi";
import dp from "../assets/dp.png";
import { IoCameraOutline } from "react-icons/io5";
import { authDataContext } from "../context/AuthContext.jsx";
import axios from "axios";

function EditProfile() {
  let { userData, setUserData, setEdit } = useContext(userDataContext);
  let [firstName, setFirstName] = useState(userData.firstName || "");
  let [lastName, setLastName] = useState(userData.lastName || "");
  let [userName, setUserName] = useState(userData.userName || "");
  let [headline, setHeadline] = useState(userData.headline || "");
  let [location, setLocation] = useState(userData.location || "");
  let [gender, setGender] = useState(userData.gender || "");
  let [skills, setSkills] = useState(userData.skills || "");
  let [newSkills, setNewSkills] = useState("");
  let [education, setEducation] = useState(userData.education || "");
  let [newEducation, setNewEducation] = useState({
    college: "",
    degree: "",
    fieldOfStudy: ""
  });

  let [experience, setExperience] = useState(userData.experience || "");
  let [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    description: ""
  });
  let [saving, setSaving] = useState(false);
  let { serverUrl } = useContext(authDataContext);

  let [frontendProfileImage, setFrontendProfileImage] = useState(
    userData.profileImage || dp
  );
  let [backendProfileImage, setBackendProfileImage] = useState(null);

  let [frontendCoverImage, setFrontendCoverImage] = useState(
    userData.coverImage || null
  );
  let [backendCoverImage, setBackendCoverImage] = useState(null);

  const profileImage = useRef();
  const coverImage = useRef();

  function handleProfileImage(e) {
    let file = e.target.files[0];
    setBackendProfileImage(file);
    setFrontendProfileImage(URL.createObjectURL(file));
  }

  function handleCoverImage(e) {
    let file = e.target.files[0];
    setBackendCoverImage(file);
    setFrontendCoverImage(URL.createObjectURL(file));
  }

  function addSkill(e) {
  e.preventDefault(); // ✅
    if (newSkills && !skills.includes(newSkills)) {
      setSkills([...skills, newSkills]);
    }
    setNewSkills("");
  }

  function removeSkill(skill) {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill));
    }
  }

  function addEducation(e) {
   e.preventDefault(); // ✅
    if (
      newEducation.college &&
      newEducation.degree &&
      newEducation.fieldOfStudy
    ) {
      setEducation([...education, newEducation]);
    }
    setNewEducation({
      college: "",
      degree: "",
      fieldOfStudy: ""
    });
  }
  function removeEducation(edu) {
    if (education.includes(edu)) {
      setEducation(education.filter((e) => e !== edu));
    }
  }

  function addExperince(e) {
   e.preventDefault(); // ✅
    if (
      newExperience.title &&
      newExperience.company &&
      newExperience.description
    ) {
      setExperience([...experience, newExperience]);
    }
    setNewExperience({
      title: "",
      company: "",
      description: ""
    });
  }
  function removeExperince(exp) {
    if (experience.includes(exp)) {
      setExperience(experience.filter((e) => e !== exp));
    }
  }

  const hadleSaveProfile = async () => {
    setSaving(true);
    try {
      let formdata = new FormData();
      formdata.append("firstName", firstName);
      formdata.append("lastName", lastName);
      formdata.append("userName", userName);
      formdata.append("headline", headline);
      formdata.append("location", location);
      formdata.append("gender", gender); // ✅ MISSING: Add this line
      formdata.append("education", JSON.stringify(education));
      formdata.append("skills", JSON.stringify(skills));
      formdata.append("experience", JSON.stringify(experience));

      if (backendProfileImage) {
        formdata.append("profileImage", backendProfileImage);
      }
      if (backendCoverImage) {
        formdata.append("coverImage", backendCoverImage);
      }

      let result = await axios.put(
        serverUrl + "/api/user/updateprofile",
        formdata,
        { withCredentials: true }
      );
      setUserData(result.data);
      setSaving(false);
      setEdit(false);
    } catch (err) {
      console.log(err);
      setSaving(false);
    }
  };
  return (
    <div className="w-full h-[100vh] fixed top-0 left-0 z-[100] flex justify-center items-center">
      <input
        type="file"
        accept="image/*"
        hidden
        ref={profileImage}
        onChange={handleProfileImage}
      />

      <input
        type="file"
        accept="image/*"
        hidden
        ref={coverImage}
        onChange={handleCoverImage}
      />

      {/* Background overlay */}
      <div className="absolute w-full h-full  bg-black opacity-50 z-[100] top-0 left-0"></div>

      {/* Modal box */}
      <div className="w-[90%] max-w-[500px] h-[600px] bg-white relative z-[200] shadow-lg rounded-lg p-[20px] overflow-auto">
        {/* Close button */}
        <div onClick={() => setEdit(false)}>
          <RxCross2 className="absolute right-3 top-3 text-[30px] text-gray-800 font-bold cursor-pointer hover:text-red-500" />
        </div>

        {/* Modal content here */}
        <div
          className="w-full h-[150px] bg-gray-500 rounded-lg mt-[30px] relative cursor-pointer overflow-hidden"
          onClick={() => coverImage.current.click()}
        >
          <img
            src={frontendCoverImage}
            className="w-full h-full object-cover rounded-lg"
          />

          {/* Camera icon in top-right */}
          <IoCameraOutline className="absolute top-4 right-4 w-[30px] h-[25px] text-gray-800 " />
        </div>

        <div
          className="rounded-full overflow-hidden items-center justify-center relative top-[-65px] left-[40px] cursor-pointer "
          onClick={() => profileImage.current.click()}
        >
          <img
            src={frontendProfileImage}
            alt=""
            className="w-[100px] h-[100px] cursor-pointer rounded-full object-cover"
          />
        </div>
        <div className="w-[20px] h-[20px] relative bg-[#17c1ff] top-[-100px] left-[110px] rounded-full flex justify-center items-center cursor-pointer">
          <FiPlus
            className="text-gray-800"
            onClick={() => profileImage.current.click()}
          />
        </div>

        <div className="  mt-[-60px] w-full flex flex-col justify-center items-center gap-[15px]">
          <input
            type="text"
            placeholder="First Name"
            required
            className="w-full h-[50px] border-2 border-gray-600 p-[10px] rounded-md text-[#5c1af4]"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          ></input>

          <input
            type="text"
            placeholder="Last Name"
            required
            className="w-full h-[50px] border-2 border-gray-600 p-[10px] rounded-md    text-[#5c1af4]"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          ></input>

          <input
            type="text"
            placeholder="UserName"
            required
            className="w-full h-[50px] border-2 border-gray-600 p-[10px] rounded-md   text-[#5c1af4]"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          ></input>
          <input
            type="text"
            placeholder="Headline"
            required
            className="w-full h-[50px] border-2 border-gray-600 p-[10px] rounded-md  text-[#5c1af4]"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
          ></input>
          <input
            type="text"
            placeholder="Location"
            required
            className="w-full h-[50px] border-2 border-gray-600 p-[10px] rounded-md text-[#5c1af4]"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          ></input>
          <input
            type="text"
            placeholder="Gender "
            required
            className="w-full h-[50px] border-2 border-gray-600 p-[10px] rounded-md text-[#5c1af4]"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          ></input>

          <div className="w-full border-2 border-gray-600 p-[10px] rounded-md text-[#5c1af4]">
            <h1 className="text-[black] font-bold text-center mb-[10px]">
              Skills
            </h1>
            {skills && (
              <div className="flex flex-wrap gap-2 mt-4">
                {skills && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {skills.map((skill, index) => (
                      <div
                        key={index}
                        className="group border-2 border-black text-[#5c1af4] px-4 py-1 rounded-full flex items-center gap-2 mb-[10px] cursor-pointer  bg-[#edeeef]"
                      >
                        <span>{skill}</span>
                        <RxCross2
                          className="text-md text-gray-600 hover:text-red-500 cursor-pointer transition hidden group-hover:block"
                          onClick={() => removeSkill(skill)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="w-full flex flex-col justify-center items-center gap-[15px]">
              <input
                type="text"
                placeholder="Add New Skills"
                className="w-full h-[50px] border-2 border-gray-600 p-[10px] rounded-md text-[#5c1af4]"
                value={newSkills}
                onChange={(e) => setNewSkills(e.target.value)}
              />
              <button
                className="w-[50%] h-[40px] rounded-full border-2 border-[#a8abdf] text-[#2dc0ff] flex justify-center items-center mb-[10px] mt-[10px] 
             hover:bg-[#ade6e4] hover:text-[#7a0cf7] transition-all duration-200 shadow-sm hover:shadow-md"
                onClick={addSkill}
              >
                Add
              </button>
            </div>
          </div>

          <div className="w-full border-2 border-gray-600 p-[10px] rounded-md text-[#5c1af4]">
            <h1 className="text-[black] font-bold text-center mb-[10px]">
              Education
            </h1>
            {education && (
              <div>
                {education && (
                  <div className="w-full max-w-[800px] mx-auto mt-6 space-y-4 mb-[15px]">
                    {education.map((edu, index) => (
                      <div
                        key={index}
                        className="group relative border border-gray-400 rounded-lg p-4 bg-[#edeeef] shadow hover:shadow-lg transition-all "
                      >
                        <RxCross2
                          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 cursor-pointer hidden group-hover:block text-2xl"
                          onClick={() => removeEducation(edu)}
                        />
                        <div className="text-gray-800">
                          <strong>College:</strong> {edu.college}
                        </div>
                        <div className="text-gray-800">
                          <strong>Degree:</strong> {edu.degree}
                        </div>
                        <div className="text-gray-800">
                          <strong>Field Of Study:</strong> {edu.fieldOfStudy}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="w-full flex flex-col justify-center items-center gap-[15px]">
              <input
                type="text"
                placeholder="Add College"
                className="w-full h-[50px] border-2 border-gray-600 p-[10px] rounded-md text-[#5c1af4]"
                value={newEducation.college}
                onChange={(e) =>
                  setNewEducation({ ...newEducation, college: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Add Degree"
                className="w-full h-[50px] border-2 border-gray-600 p-[10px] rounded-md text-[#5c1af4]"
                value={newEducation.degree}
                onChange={(e) =>
                  setNewEducation({ ...newEducation, degree: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Add Field of Study"
                className="w-full h-[50px] border-2 border-gray-600 p-[10px] rounded-md text-[#5c1af4]"
                value={newEducation.fieldOfStudy}
                onChange={(e) =>
                  setNewEducation({
                    ...newEducation,
                    fieldOfStudy: e.target.value
                  })
                }
              />

              <button
                className="w-[50%] h-[40px] rounded-full border-2 border-[#a8abdf] text-[#2dc0ff] flex justify-center items-center mb-[10px] mt-[10px] 
             hover:bg-[#ade6e4] hover:text-[#7a0cf7] transition-all duration-200 shadow-sm hover:shadow-md"
                onClick={addEducation}
              >
                Add
              </button>
            </div>
          </div>

          <div className="w-full border-2 border-gray-600 p-[10px] rounded-md text-[#5c1af4]">
            <h1 className="text-[black] font-bold text-center mb-[10px]">
              Experience
            </h1>
            {experience && (
              <div>
                {experience && (
                  <div className="w-full max-w-[800px] mx-auto mt-6 space-y-4 mb-[15px]">
                    {experience.map((exp, index) => (
                      <div
                        key={index}
                        className="group relative border border-gray-400 rounded-lg p-4 bg-[#edeeef] shadow hover:shadow-lg transition-all "
                      >
                        <RxCross2
                          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 cursor-pointer hidden group-hover:block text-2xl"
                          onClick={() => removeExperince(exp)}
                        />
                        <div className="text-gray-800">
                          <strong>Title:</strong> {exp.title}
                        </div>
                        <div className="text-gray-800">
                          <strong>Company:</strong> {exp.company}
                        </div>
                        <div className="text-gray-800">
                          <strong>Description:</strong> {exp.description}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="w-full flex flex-col justify-center items-center gap-[15px]">
              <input
                type="text"
                placeholder="Add Title"
                className="w-full h-[50px] border-2 border-gray-600 p-[10px] rounded-md text-[#5c1af4]"
                value={newExperience.title}
                onChange={(e) =>
                  setNewExperience({ ...newExperience, title: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Add Company"
                className="w-full h-[50px] border-2 border-gray-600 p-[10px] rounded-md text-[#5c1af4]"
                value={newExperience.company}
                onChange={(e) =>
                  setNewExperience({
                    ...newExperience,
                    company: e.target.value
                  })
                }
              />

              <input
                type="text"
                placeholder="Add Description"
                className="w-full h-[50px] border-2 border-gray-600 p-[10px] rounded-md text-[#5c1af4]"
                value={newExperience.description}
                onChange={(e) =>
                  setNewExperience({
                    ...newExperience,
                    description: e.target.value
                  })
                }
              />

              <button
                className="w-[50%] h-[40px] rounded-full border-2 border-[#a8abdf] text-[#2dc0ff] flex justify-center items-center mb-[10px] mt-[10px] 
             hover:bg-[#ade6e4] hover:text-[#7a0cf7] transition-all duration-200 shadow-sm hover:shadow-md"
                onClick={addExperince}
              >
                Add
              </button>
            </div>
          </div>
        </div>
        <button
          className=" w-[100%] h-[40px] rounded-full border-2  border-[#2dc0ff] text-white flex justify-center items-center  mt-[25px] bg-[#2dc0ff]"
          disabled={saving}
          onClick={() => {
            hadleSaveProfile();
          }}
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
}

export default EditProfile;
