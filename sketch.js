var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;

var bgImg;

var collidedSound,jumpSound;



function preload(){
  trex_running =   loadAnimation("trex100.png","trex300.png","trex400.png");
  trex_collided = loadAnimation("trex_collided 100.png");
  
 
  
  cloudImage = loadImage("cloud100.png");
  
  obstacle1 = loadImage("ob 100.png");
  obstacle2 = loadImage("obstacle200.png");
  obstacle3 = loadImage("obstacle300.png");
  obstacle4 = loadImage("obstacle400.png");
  obstacle5 = loadImage("obstacle500.png");
  obstacle6 = loadImage("obstacle600.png");
  
  gameOverImg = loadImage("game-over-3.png");
  restartImg = loadImage("restart2.png");
  
  bgImg=loadImage("background.jpg");
  
  sunImg=loadImage("sun.png");
  
  collidedSound=loadSound("salamisound-3019782-slight-impact-with-sheet.mp3");
  
  jumpSound=loadSound("salamisound-8739576-sfx-jump-1-game-computer.mp3");
  
  
}
  
  

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(50,330,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  var sun=createSprite(400,100);
  sun.addImage("suns",sunImg);
  sun.scale=0.1;
  

  
  
  gameOver = createSprite(width/2,height/2-100);
  gameOver.addImage(gameOverImg);

  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.2;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(width/2,height-0,width,100);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
  
}

function draw() {
  //trex.debug = true;
  background(bgImg);
  text("Score: "+ score, 500,50);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    
  
    if(keyDown("space")&& trex.y >= height-80) {
      trex.velocityY = -12;  
    jumpSound.play();
    }
  
    trex.velocityY = trex.velocityY + 0.8;
   
  
   
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
      collidedSound.play();
     
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(touches.length>0||keyDown("SPACE")){
      reset();
      touches=[]
    }
    
  
  }
  
  
  drawSprites();
  
  
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,200);
    cloud.y = Math.round(random(100,150));
    cloud.addImage(cloudImage);
    cloud.scale = 0.7;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 133;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,height-69,20,30);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
 
  
  score = 0;
  
}