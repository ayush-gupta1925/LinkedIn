import mongoose from 'mongoose';

const connectDb= async () =>{
  try{
    mongoose.connect(process.env.MONGODB_URL)
    console.log(" db connected")
  }catch(err){
   console.log(`db error : %{err}`);
  }
}
export default connectDb;