//Create variables here
var dog, happyDog, database, foodS, foodStock;
var canvas;
var dogImg, happyDogImg;
var feedDog, addFood;
var lastFed, fedTime;
var foodObj;
var changeState, readState;
var bedroomImg, gardenImg, washroomImg;

function preload()
{
  //load images here
  dogImg = loadImage("images/dogImg.png");
  happyDogImg = loadImage("images/dogImg1.png");

  bedroomImg = loadImage("images/virtualPetImages/BedRoom.png");
  gardenImg = loadImage("images/virtualPetImages/Garden.png");
  washroomImg = loadImage("images/virtualPetImages/WashRoom.png");
}

function setup() {
  canvas = createCanvas(700, 500);
  database = firebase.database();
  dog = createSprite(320,300,50,50);
  dog.addImage(dogImg);
  dog.scale = 0.3;

  addFood = createButton("Add Food");
  addFood.position(600,50);
  addFood.mousePressed(addfoodObj);

  feedDog = createButton("Feed Food");
  feedDog.position(640,50);
  feedDog.mousePressed(feedFood);

  foodObj = new Food();
  
  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

  readState = database.ref('gameState');
  readState.on("value", function(data){
    gameState = data.val();
  })
}


function draw() {  
  
  background(46,139,87)
  
  currentTime = hour();

  fedTime = database.ref('feedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  })

  if(currentTime===(lastFed+1)){
    update("Playing");
    foodObj.garden();
}

else if(currentTime===(lastFed+2)){
 update("Sleeping");
 foodObj.bedroom();
}

else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
    foodObj.washroom();
}

else{
    update("Hungry")
    foodObj.display();
}

  if(gameState!== "Hungry"){
    feedDog.hide();
    addFood.show();
    dog.remove();
  }

  else{
    feedDog.show();
    addFood.show();
    dog.addImage(dogImg);
  }

  
   



  drawSprites();
  //add styles here
  textSize(20)
  fill("red")
  stroke("white")

  if(lastFed>=12){
    text("Last Feed:"+lastFed%12+ "PM",350,30);

  }

  else if(lastFed==0){
    text("Last Feed : 12 AM",350,30);
  }

  else{
    text("Last Feed:"+ lastFed + "AM", 350,30);
  }
  
 // text("Press the UP ARROW key to feed LUCY milk!!",150,50);
  text("Food Remaining:" +foodS,190,100);



}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function writeStock(x)
{

  if(x<=0){
    x=0;
  
  }

  else{
    x = x-1
  }
  database.ref('/').update({
    Food:x
  })
}

function addfoodObj(){

  foodS = foodS+1;
  database.ref('/').update({
    Food:foodS
  })
  }


function feedFood(){

  dog.addImage(happyDogImg);
  if(foodObj.getFoodStock()<=0){
    foodObj.updateFoodStock(foodObj.getFoodStock()*0);
  }

  else{
    foodObj.updateFoodStock(foodObj.getFoodStock()-1)

  }
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    feedTime: hour()
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}
