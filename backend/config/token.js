import jwt from "jsonwebtoken";
const getToken = async(userId)=>{

  try{
 const token = await jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return token; // ✅ Yeh add karo

}catch(err){
  console.log(err);
}
}

export default getToken;