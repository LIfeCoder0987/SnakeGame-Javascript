/* ** Variable Declaration ** */
const _screen = document.querySelector('.screen');
const sContext = _screen.getContext('2d');

let sWidth;
let sHeight;

const gameSpeed = 100;
let Dead = false;

let Keys = {
	ArrowUp:false,
	ArrowDown:false,
	ArrowRight:false,
	ArrowLeft:false
};

const UP = 0;
const RIGHT = 1;
const DOWN = 2;
const LEFT = 3;

const segmentSize = 16;		// the snake segment size in pixels
const mWidth = 40;			// map's width
const mHeight = 40;			// and height

let FoodX,FoodY;	// hold food position
let SnakeDirection; // snake directions is just numbers
let Score = 0;
let ListSnakeSegment; // list of the snake segment object that we construct

/* == Main Functions and Logic == */
requestAnimationFrame(start);

function start()
{
	// Some Initialization
	_screen.width = mWidth * segmentSize;
	_screen.height = mHeight * segmentSize;

	sWidth = _screen.width;
	sHeight = _screen.height;

	AddEventListeners();		// just a function that i make to initiate all the event
								// for me
	FoodX = 10;   // food position
	FoodY = 20;   // for starting

	SnakeDirection = LEFT;   // the snake moves to the left for starting

	ListSnakeSegment = [];
	ListSnakeSegment.push(
		new SnakeSegment(30,20),  // pushing three
		new SnakeSegment(31,20),  // snake segments
		new SnakeSegment(32,20)   // for starting
	);

	mainLoop();
}

function mainLoop()
{
	let Interval = setInterval(function()
	{
		ClearFunc();
		UpdateFunc();
		DrawFunc();
	},
	gameSpeed);
}

function ClearFunc()
{
	sContext.clearRect( 0,0, sWidth,sHeight );
}

function UpdateFunc()
{
	if (!Dead)		// we want do any logic if the snake is Dead!
	{
		// get hold of user input
		if (Keys.ArrowUp)	// we can move up if the snake is not moving down
			if (SnakeDirection !== DOWN)
				SnakeDirection = UP;

		if (Keys.ArrowDown)  // we can move down if the snake is not moving up
			if (SnakeDirection !== UP)
				SnakeDirection = DOWN;

		if (Keys.ArrowRight)
			if (SnakeDirection !== LEFT)
				SnakeDirection = RIGHT;

		if (Keys.ArrowLeft)
			if (SnakeDirection !== RIGHT)
				SnakeDirection = LEFT;

		// The Moving Logic with a simple switch statement
		switch (SnakeDirection)
		{
			case UP:
			ListSnakeSegment.unshift( // unshift will push element to the list
									  // but in the front, at index [0]
				new SnakeSegment(ListSnakeSegment[0].x,ListSnakeSegment[0].y - 1)
				// we keep the "x pos" but we move "y" by 1 up so (-1)
			);
			break;

			case RIGHT:
			ListSnakeSegment.unshift(
				new SnakeSegment(ListSnakeSegment[0].x + 1,ListSnakeSegment[0].y)
			);
			break;

			case DOWN:
			ListSnakeSegment.unshift(
				new SnakeSegment(ListSnakeSegment[0].x,ListSnakeSegment[0].y + 1)
			);
			break;

			case LEFT:
			ListSnakeSegment.unshift(
				new SnakeSegment(ListSnakeSegment[0].x - 1,ListSnakeSegment[0].y)
			);
			break;
		}

		// Chop the snake tail - remove the last element
		ListSnakeSegment.pop();

		// Collisioin Detection - Snake vs Food
		CollisionSnakeFood();

		// Collision Detection - Snake vs World
		CollisionSnakeWorld();

		// Collision Detection - Snake vs Snake
		CollisionSnakeSnake();
	}
}

function DrawFunc()
{
	// Draw The Snake
	for (let s of ListSnakeSegment)
		DrawSegment( s.x,s.y, "blue" );

	// Draw The Food
	DrawSegment( FoodX,FoodY, "red" );

	// Draw Score
	DrawString(20,40, "SCORE: "+Score, "white", "40px Arial");
}

/* -- Helper Functions -- */
function SnakeSegment(x,y)
{
	this.x = x;
	this.y = y;
}

function DrawSegment( x,y, color )
{
	sContext.fillStyle = color;
	sContext.fillRect( x * segmentSize, y * segmentSize, segmentSize, segmentSize );
}

function DrawString( x,y, string,color,font )
{
	sContext.font = font;
	sContext.fillStyle = color;
	sContext.textAlign = "left";
	let text = string;
	sContext.fillText(text, x,y);
}

function CollisionSnakeFood()
{
	if (ListSnakeSegment[0].x === FoodX && ListSnakeSegment[0].y === FoodY)
	{
		Score++; // augmenting the score

		// make a new position for the food
		GenerateRandFood();

		// make the snake bigger and taller
		ListSnakeSegment.push( // we are just going to push again the last element
							   // of the list
			ListSnakeSegment[ListSnakeSegment.length - 1].x,
			ListSnakeSegment[ListSnakeSegment.length - 1].y
		);
	}
}

function CollisionSnakeWorld()
{
	if (ListSnakeSegment[0].x < 0 || ListSnakeSegment[0].x >= mWidth)
		Dead = true;
	if (ListSnakeSegment[0].y < 0 || ListSnakeSegment[0].y >= mHeight)
		Dead = true;
}

function CollisionSnakeSnake()
{
	for (let s of ListSnakeSegment) // but this condition is true for the first element
									// which is the head
									// and we make collision detection
									// agaist it so we need to exclude it
		if (s !== ListSnakeSegment[0] && s.x === ListSnakeSegment[0].x && s.y === ListSnakeSegment[0].y)
			Dead = true;
}

function GenerateRandFood()
{
	// we have to make the food in a position that don't overlap the snake body
	// in othe word the food in not in the snake list segment
	let exist = true; // we first assume that the food exist in the snake segment list

	while (exist)
	{
		// so we randomise food position
		FoodX = Math.floor(Math.random() * mWidth);
		FoodY = Math.floor(Math.random() * mHeight);

		// we make sure the food is not in the snake body list
		exist = Boolean(ListSnakeSegment.find(function(segment)
		{// the find method will return the object that make the condition
		 // below true
			return (FoodX === segment.x &&
					FoodY === segment.y)
		})// we cast/wrapp the retured value to a boolean value
		);// so if the object is found we get true and the loop with not exit
		  // otherwise the loop will exit and will have a random food pos
		  // that don't overlap the snake position
	}
}

function AddEventListeners()
{
	document.addEventListener("keydown",function(e)
	{
		Keys[e.key] = true;
	});
	document.addEventListener("keyup",function(e)
	{
		Keys[e.key] = false;
	});
}