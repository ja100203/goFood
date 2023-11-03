const mongoose = require('mongoose');
const mongoUrl = 'mongodb+srv://goFood:goFood@cluster0.azjpnet.mongodb.net/goFood';

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("Connected to the MongoDB database successfully");
    
    const fetchData = mongoose.connection.db.collection("food_items");
    const data = await fetchData.find({}).toArray();
    global.food_items=data;
    //console.log(global.food_items);


    const fetchCategory = mongoose.connection.db.collection("food_category");
    const catdata = await fetchCategory.find({}).toArray();
    global.foodCategory=catdata;
    //console.log(global.foodCategory);

  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

module.exports = connectToMongo;

 
 
   
 




