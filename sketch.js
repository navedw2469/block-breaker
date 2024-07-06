// Position (center point), speed and diameter of ball
let ball_x, ball_y, ball_dx, ball_dy, ball_diameter;


let score = 0; // Score of the Game
let lives = 2; // Lives of the Player
const speed = 3; //Speed of the Ball
let isGameStarted=false; //To check wether Player started the game of not (By pressing any key)

// Position, width and height of the Paddle 
let paddle_x, paddle_y, paddle_height,paddle_width, paddle_dx;

// Gap between Boxes 
let gap_x, gap_y;

// Array of Boxes
let box_arr = [];

//To check boxes are plotted on the screen
//And after losing life, box will not be recreated 
let alreadyCreated = false;


function setup() {
  createCanvas(windowWidth, windowHeight);

  
  // Speed of the ball
  ball_dx = speed;
  ball_dy = speed;
  
  //Initializing position, height, width and speed of the paddle
  paddle_width = 100;
  paddle_height = 15;
  paddle_dx = 5;
  paddle_x = (width/2) - (paddle_width/2);
  paddle_y = height - paddle_height - 10;
  
  // Initializing position(center point) and diameter of the ball
  ball_diameter=20;
  ball_x = width/2;
  ball_y = paddle_y-ball_diameter/2;
  
  // Width and Height of the Boxes
  box_width = 70;
  box_height= 25;

  // Initializing Gap
  gap_x=20;
  gap_y=20;
  
  var temp = 50;
  if(!alreadyCreated){
    for(var i=gap_y+10;i + box_height < height/2 ;i+=(box_height + gap_y)){
      for(var j=gap_x; j + box_width < width ; j+=(temp)){
        temp=box_width + gap_x;
        let temp_box={
        width : box_width,
        height : box_height,
        x : j,
        y : i,
        vis:true,
        colorR:getRndInteger(0,255),
        colorG:getRndInteger(0,255),
        colorB:getRndInteger(0,255)
        };
        box_arr.push(temp_box);
        gap_x=getRndInteger(20 ,60);
        box_width= getRndInteger(50 ,120);
      }
    }
    alreadyCreated=true;
  }

}

function draw() {
  background("#231F20");
    textFont('Georgia');
    textSize(16);
  if(!isGameStarted){
    fill("orange");
    text("PRESS ANY KEY TO START",width/2-100,height/2);
    if(keyIsPressed){
      isGameStarted=true;
    }else{
      return;
    }
  }
  
  
  //movement of ball
  ball_x += ball_dx;
  ball_y += ball_dy;
  
  //Drawing the ball and filling the color
  fill("red");
  circle(ball_x, ball_y, ball_diameter);
  
  
  //Drawing the paddle and filling the color
  fill("#C0C0C0");
  rect(paddle_x, paddle_y, paddle_width, paddle_height,10);
  
  for(let i=0; i<box_arr.length;i++){
    //Checking boxes are visible or not and checking ball touches
    // the box, if touches then turn off then visiblity 
    if(box_arr[i].vis && isBallTouched(box_arr[i],ball_x,ball_y,ball_diameter/2)){
      score++;
      box_arr[i].vis=false;
    }
    if(box_arr[i].vis){
      
      //Drawing the boxes and filling the random colors 
      fill(box_arr[i].colorR,box_arr[i].colorG,box_arr[i].colorB)
      rect(box_arr[i].x, box_arr[i].y, box_arr[i].width, box_arr[i].height,8);
    }
  }
  
  
  //movement of paddle using arrow key
  if(keyIsDown(RIGHT_ARROW)){
    if(paddle_x + paddle_width < width){
      paddle_x += paddle_dx;
    }
  }
  
  if(keyIsDown(LEFT_ARROW)){
    if(paddle_x > 0){
      paddle_x -= paddle_dx;
    } 
  }
  
  // Checking ball touches the paddle and doing action according to it
  isBallTouched({x:paddle_x,y:paddle_y,width:paddle_width,height:paddle_height},ball_x,ball_y,ball_diameter/2);

  
  //ball touching left or right side of the area
  if(ball_x + ball_diameter/2 > width || ball_x - ball_diameter/2 < 0) {
    ball_dx = -(ball_dx);
  }
  
  //ball touching up side of the area
  if(ball_y - ball_diameter/2 < 0){
    ball_dy = -(ball_dy);
  }
  
  //ball touching bottom side of the area
  if(ball_y + ball_diameter/2 > height) {
    //Stopping everything 
    ball_dy = 0;
    ball_dx = 0;
    paddle_dx = 0;
    
    //Decreasing the life
    if(lives>0){
      lives--;
      setup();
    }else{
      fill("orange");
      text("GAME OVER", width/2-40, height/2)
    }
  }
  
  //Checking wether all boxes are popped, if popped then stop the game
  var checkComplete = true;
  for(let i=0; i<box_arr.length;i++){
    if(box_arr[i].vis != false){
      checkComplete=false;
      break;
    }
  }
  
  //printing the text after Completing the game
  if(checkComplete){
    fill("orange");
    text("LEVEL COMPLETED", width/2-60, height/2);
    ball_dy = 0;
    ball_dx = 0;
  }

  //printing the live score and lives
  fill("#C0C0C0");
  let textScore = "Score: " + score;
  let textlives = "Lives: " + lives;
  text(textScore, width - 100 , 20);
  text(textlives, 50, 20);
}

//It function for checking ball touching boxes
function isBallTouched(box ,x , y , rad){
  if(isCornerTouched(box, x , y, rad)){ //Checking ball touching the corner of the box
    return true;
  }else if(isSideTouched(box, x, y, rad)){ //Checking ball touching the side of the box
    return true;    
  }
  return false;
}

function isCornerTouched(box,x,y,rad){
  if(checkInCircle(box.x,box.y,x,y,rad*rad)){ //Checking ball touching the left upper corner of the box
    ball_dx=-(speed);
    ball_dy=-(speed);
    return true;
  }else if(checkInCircle(box.x+box.width,box.y,x,y,rad*rad)){ //Checking ball touching the right upper corner of the box
    ball_dx=speed;
    ball_dy=-(speed);
    return true;
  }else if(checkInCircle(box.x, box.y+box.height ,x,y,rad*rad)){ //Checking ball touching the left bottom corner of the box
    ball_dx=-(speed);
    ball_dy=speed;
    return true;
  }else if(checkInCircle(box.x + box.width , box.y+box.height ,x,y,rad*rad)){ //Checking ball touching the right bottom corner of the box
    ball_dx=speed;
    ball_dy=speed;
    return true;
  }
  return false;
}

function checkInCircle(bx, by, cx, cy, radSqr){ //this function is for checking ball touching the corner by comparing radius of the ball and distance between ball's center and the corner of the box
  if(radSqr >= ((bx-cx)*(bx-cx) + (by-cy)*(by-cy)) ){
    return true;
  }
  return false;
}

function isSideTouched(box, x, y, rad){ 
  if(checkTouch(box,x+rad,y)){ //Checking ball touching the left side of the box
    ball_dx=-(speed);
    return true;
  }else if(checkTouch(box,x-rad,y)){ //Checking ball touching the right side of the box
    ball_dx=speed;
    return true;     
  }else if(checkTouch(box,x,y+rad)){ //Checking ball touching the upper side of the box
    ball_dy=-(speed)
    return true;       
  }else if(checkTouch(box,x,y-rad)){ //Checking ball touching the bottom side of the box
    ball_dy=speed;
    return true;
  }
  return false;
}

function checkTouch(box,x,y){
  if((x >=box.x) && (x <= box.x+box.width) && ( y >= box.y) && (y <= box.y+box.height) ){ //This function checks the any point is inside of the box
    return true;
  }
  return false;
} 

function getRndInteger(min, max) { //To get random number between min and max
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}
