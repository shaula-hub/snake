import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
// import DebugWindow from "./DebugWindow";
import TouchControls from './TouchControls';
import './snake.css';

const SNAKE_FOOD = ["🐁", "🐀", "🐇", "🦎", "🐸", "🐹", "🦗", "🐜", "🐛", "🐢"];
const SNAKE_HEADS = {
  UP: "🔼",
  DOWN: "🔽",
  LEFT: "◀️",
  RIGHT: "▶️",
};
const DIRECTIONS = ["UP", "DOWN", "LEFT", "RIGHT"];

const GRID_SIZE = 25;
const CELL_SIZE = 20; // Explicit cell size for clarity
const BOARD_SIZE = GRID_SIZE * CELL_SIZE;
const MOBILE_GRID_SIZE = 18; // Smaller grid for mobile
const MOBILE_CELL_SIZE = 16; // Smaller cells for mobile
const MOBILE_BOARD_SIZE = MOBILE_GRID_SIZE * MOBILE_CELL_SIZE;

const INITIAL_POSITION = { x: 5, y: 5 };

  // Add Tetromino shapes from Tetris game
  const TETROMINO_SHAPES = {
    I: [[1, 1, 1, 1]],
    J: [
      [1, 0, 0],
      [1, 1, 1],
    ],
    L: [
      [0, 0, 1],
      [1, 1, 1],
    ],
    O: [
      [1, 1],
      [1, 1],
    ],
    S: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    T: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    Z: [
      [1, 1, 0],
      [0, 1, 1],
    ],
  };

  const SettingsDialog = ({
    onStart,
    gameType,
    setGameType,
    isMobile,    
  }) => {
    return (
      <div style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}>
        <div style={{
          backgroundColor: "white",
          padding: "1.5rem",
          borderRadius: "0.5rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          width: "300px",
          textAlign: "center",
        }}>
          <h2 style={{ 
            fontSize: "2rem", 
            fontWeight: "normal", 
            marginBottom: "1.5rem",
          }}>
            Settings
          </h2>
          
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: "1rem",
            marginBottom: "2rem",
            alignItems: "flex-start",
            paddingLeft: "2rem",
          }}>
            <label style={{ 
              display: "flex", 
              alignItems: "center", 
              fontSize: "1.2rem",
              cursor: "pointer", 
            }}>
              <input
                type="radio"
                name="gameType"
                value="classic"
                checked={gameType === "classic"}
                onChange={() => setGameType("classic")}
                style={{ 
                  marginRight: "0.8rem",
                  width: "1.2rem",
                  height: "1.2rem",
                }}
              />
              Classic
            </label>
            
            <label style={{ 
              display: "flex", 
              alignItems: "center",
              fontSize: "1.2rem",
              cursor: "pointer", 
            }}>
              <input
                type="radio"
                name="gameType"
                value="tetra"
                checked={gameType === "tetra"}
                onChange={() => setGameType("tetra")}
                style={{ 
                  marginRight: "0.8rem",
                  width: "1.2rem",
                  height: "1.2rem",
                }}
              />
              Tetra
            </label>
            
            <label style={{ 
              display: "flex", 
              alignItems: "center",
              fontSize: "1.2rem",
              cursor: "pointer", 
            }}>
              <input
                type="radio"
                name="gameType"
                value="bounce"
                checked={gameType === "bounce"}
                onChange={() => setGameType("bounce")}
                style={{ 
                  marginRight: "0.8rem",
                  width: "1.2rem",
                  height: "1.2rem",
                }}
              />
              Bounce
            </label>
          </div>

          <div style={{
            border: "2px solid #f0f0f0",
            padding: "1rem",
            marginBottom: "1.5rem",
            borderRadius: "0.5rem",
            textAlign: "left"
          }}>
            <p style={{ fontSize: "1.5rem", textAlign: "center", fontWeight: "bold", marginBottom: "0.8rem" }}>Controls</p>
            {isMobile ? (
              // Mobile-specific controls
              <div>
                <p><span style={{ fontWeight: "bold" }}>Movement:</span> Swipe ← →</p>
                <p><span style={{ fontWeight: "bold" }}>Change direction:</span> Swipe ↑ ↓</p>
                <p><span style={{ fontWeight: "bold" }}>Speed boost:</span> Tap screen</p>
              </div>
            ) : (
              // Desktop controls
              <div>
                <p>←↑↓→ : Change direction</p>
                <p>+/- : Adjust speed</p>
                <p>ESC : Pause game</p>
              </div>
            )}
          </div>

          <button
            onClick={onStart}
            style={{
              width: "80%",
              padding: "0.75rem",
              backgroundColor: "#22c55e",
              color: "white",
              border: "none",
              borderRadius: "2rem",
              cursor: "pointer",
              fontSize: "1.1rem",
              fontWeight: "normal",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#6b238d"; // Darker purple on hover
              e.target.style.transform = "scale(1.05)";   // Slight grow effect
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#22c55e"; // Back to original color
              e.target.style.transform = "scale(1)";      // Back to original size
            }}            
            autoFocus
          >
            Play Game
          </button>
        </div>
      </div>
    );
  };

const GameOverDialog = ({
  score,
  show,
  setShowGameOverDialog,
  setGameStarted,
  resetGame,
  setGameOver,
  setCollisionEffect
}) => {
  if (!show) return null;

  const handleRestart = () => {
    console.log(`handleRestart`);
    console.log(`%c[DIALOG] Play Again clicked`, 'color: purple; font-weight: bold');

    resetGame();
    setShowGameOverDialog(false);
  };
  
  const handleSettings = () => {
    console.log(`handleSettings`);
    console.log(`%c[DIALOG] Settings clicked`, 'color: purple; font-weight: bold');

    setGameOver(false);
    setShowGameOverDialog(false);
    setGameStarted(false);

    setCollisionEffect(null); // Add this
    // Reset any other relevant states    
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 100,
    }}>
      <div style={{
        backgroundColor: "white",
        padding: "1.5rem",
        borderRadius: "0.5rem",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        width: "300px", 
        textAlign: "center",
      }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Game Over!</h2>
        <p style={{ marginBottom: "1.5rem" }}>Your final score: {score} points</p>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          <button
            onClick={handleRestart}
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: "#6b238d",
              color: "white",
              border: "none",
              borderRadius: "2rem",
              cursor: "pointer",
              fontSize: "1.1rem",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#6b238d"; // Darker purple on hover
              e.target.style.transform = "scale(1.05)";   // Slight grow effect
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#22c55e"; // Back to original color
              e.target.style.transform = "scale(1)";      // Back to original size
            }}            
            autoFocus
          >
            Play Again
          </button>
          
          <button
            onClick={handleSettings}
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: "#22c55e",
              color: "white",
              border: "none",
              borderRadius: "2rem",
              cursor: "pointer",
              fontSize: "1.1rem",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#6b238d"; // Darker purple on hover
              e.target.style.transform = "scale(1.05)";   // Slight grow effect
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#22c55e"; // Back to original color
              e.target.style.transform = "scale(1)";      // Back to original size
            }}             
          >
            Settings
          </button>
        </div>
      </div>
    </div>
  );
};  

GameOverDialog.propTypes = {
  score: PropTypes.number.isRequired,
  show: PropTypes.bool.isRequired,
  setShowGameOverDialog: PropTypes.func.isRequired,
  setGameStarted: PropTypes.func.isRequired,
  setGameOver: PropTypes.func.isRequired,
  setCollisionEffect: PropTypes.func.isRequired
};

const Snake = () => {
  const MIN_SPEED = 80;
  const MAX_SPEED = 300;
  const DEFAULT_SPEED = 180;

  const getRandomDirection = () => DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];

  const [snake, setSnake] = useState([INITIAL_POSITION]);
  const [food, setFood] = useState({ x: 15, y: 15, emoji: SNAKE_FOOD[0] });
  const [direction, setDirection] = useState(getRandomDirection());
  const [gameOver, setGameOver] = useState(false);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showGameOverDialog, setShowGameOverDialog] = useState(false);
  const [gameType, setGameType] = useState("classic");
  const [nonEatenFood, setNonEatenFood] = useState(0);
  const [foodItems, setFoodItems] = useState([]);
  const [BounceEatenFood, setBounceEatenFood] = useState(0);  
  const [collisionEffect, setCollisionEffect] = useState(null);
  const [collision, setCollision] = useState(null);
  // const [scoringLock, setScoringLock] = useState(false);

  // Add this state to track key presses for debugging
  const [lastKey, setLastKey] = useState("None");
  const [isPaused, setIsPaused] = useState(false);

  // Debug mode
  const [debugStepMode, setDebugStepMode] = useState(false);
  const [waitingForStep, setWaitingForStep] = useState(false);
  const [stepCount, setStepCount] = useState(0);

  // Adaptation
  const [isMobile, setIsMobile] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [containerScale, setContainerScale] = useState(1);  
  const [actualGridSize, setActualGridSize] = useState(GRID_SIZE);
  const [actualCellSize, setActualCellSize] = useState(CELL_SIZE);
  const [actualBoardSize, setActualBoardSize] = useState(BOARD_SIZE);

  // Function to rotate a shape (from Tetris)
  const rotateShape = (shape, times = 1) => {
    let rotated = [...shape];
    for (let i = 0; i < times; i++) {
      rotated = rotated[0].map((_, colIndex) => 
        rotated.map(row => row[colIndex]).reverse()
      );
    }
    return rotated;
  };

  const generateFood = useCallback(() => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * (GRID_SIZE - 2)) + 1,
        y: Math.floor(Math.random() * (GRID_SIZE - 2)) + 1,
        emoji: SNAKE_FOOD[Math.floor(Math.random() * SNAKE_FOOD.length)],
      };
    } while (
      snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)
    );
    setFood(newFood);
  }, [snake]);

  const generateFoodTetra = useCallback(() => {
    const shapeKeys = Object.keys(TETROMINO_SHAPES);
    const randomShapeKey = shapeKeys[Math.floor(Math.random() * shapeKeys.length)];
    const originalShape = TETROMINO_SHAPES[randomShapeKey];

    // Rotate the shape randomly 0-3 times
    const rotationCount = Math.floor(Math.random() * 4);
    const rotatedShape = rotateShape(originalShape, rotationCount);
    const foodEmoji = SNAKE_FOOD[Math.floor(Math.random() * SNAKE_FOOD.length)];
    
    // Initial position (need to ensure it's not too close to borders)
    let posX = Math.floor(Math.random() * (GRID_SIZE - rotatedShape[0].length - 4)) + 2;
    let posY = Math.floor(Math.random() * (GRID_SIZE - rotatedShape.length - 4)) + 2;
    // console.log("Initial position:", posX, posY);    
    
    // Adjust position if needed to avoid snake
    let isOverlapping = true;
    let attempts = 0;
    const maxAttempts = 10;
    
    while (isOverlapping && attempts < maxAttempts) {
      isOverlapping = false;
      
      // Check each cell of the shape
      for (let y = 0; y < rotatedShape.length; y++) {
        for (let x = 0; x < rotatedShape[y].length; x++) {
          if (rotatedShape[y][x]) {
            const foodX = posX + x;
            const foodY = posY + y;
            
            // Check if position is valid
            if (
              foodX < 0 || foodX >= GRID_SIZE || foodY < 0 || foodY >= GRID_SIZE ||
              snake.some(segment => segment.x === foodX && segment.y === foodY)
            ) {
              isOverlapping = true;
              posX = Math.floor(Math.random() * (GRID_SIZE - rotatedShape[0].length - 4)) + 2;
              posY = Math.floor(Math.random() * (GRID_SIZE - rotatedShape.length - 4)) + 2;
              break;
            }
          }
        }
        if (isOverlapping) break;
      }
      
      attempts++;
    }

    // Create food items for each filled cell in the shape
    const newFoodItems = [];
    
    for (let y = 0; y < rotatedShape.length; y++) {
      for (let x = 0; x < rotatedShape[y].length; x++) {
        if (rotatedShape[y][x]) {
          newFoodItems.push({
            id: `food-${posX + x}-${posY + y}-${Date.now()}`, // Add unique ID
            x: posX + x,
            y: posY + y,
            emoji: foodEmoji
          });
        }
      }
    }
    
    // Set the foods and update counter
    setFood(newFoodItems[0]); // Set the first food
    setNonEatenFood(newFoodItems.length);
    
    // Store all food items for when the first one is eaten
    setFoodItems(newFoodItems);
    
  }, [snake]);
  
  const showGameOver = () => {
    setGameOver(true);
    setShowGameOverDialog(true);
  };

  const resetGame = () => {
    console.log(`resetGame`);        
    console.log(`%c[RESET] Game reset initiated`, 'color: blue; font-weight: bold');
    console.log(`resetGame:  Initial states: gameOver=${gameOver}, dialog=${showGameOverDialog}, started=${gameStarted}`);
  
    // First clear the game-ending states
    setGameStarted(false);
    setGameOver(true);
    // setShowGameOverDialog(false);
    // setCollisionEffect(null);
    console.log(`resetGame:  First phase complete, scheduling full reset`);

    setTimeout(() => {
      setSnake([INITIAL_POSITION]);
      setDirection(getRandomDirection());
      setGameOver(false);
      setShowGameOverDialog(false);
      setCollisionEffect(null);
      setSpeed(DEFAULT_SPEED);
      setScore(0);
      setBounceEatenFood(0);
      setFoodItems([]);  // Make sure this gets reset too

      console.log(`resetGame:  States reset, generating food for ${gameType} mode`);
      
      if (gameType === "classic") {
        generateFood();
      } else {
        generateFoodTetra(); 
      }
      setGameStarted(true);
    }, 50);
    console.log(`resetGame:  Starting game`);
  };

  const startGame = useCallback(() => {
    // console.log(`startGame`);        
    // console.log(`%c[START] Game starting from settings`, 'color: green; font-weight: bold');
    // console.log(`startGame:  Initial states: gameOver=${gameOver}, dialog=${showGameOverDialog}, started=${gameStarted}`);
  
    setGameStarted(true);
    setGameOver(false);
    setShowGameOverDialog(false);
    setCollisionEffect(null);
    setSnake([INITIAL_POSITION]);
    setDirection(getRandomDirection());
    setSpeed(DEFAULT_SPEED);
    setScore(0);
    
    // console.log(`startGame:  States set, generating food for ${gameType} mode`);
  
    if (gameType === "classic") {
      generateFood();
    } else {
      generateFoodTetra();
    }
    console.log(`startGame:  Game started: gameOver=${gameOver}, dialog=${showGameOverDialog}, started=${gameStarted}`);

  }, [generateFood, gameOver, gameStarted, showGameOverDialog, generateFoodTetra, gameType]);

  // Handle touch controls input
  
  const handleTouchControl = (keyCode) => {
    if (gameOver || isPaused) return;
    
    setLastKey(keyCode);
    
    switch (keyCode) {
      case "ArrowUp":
        if (direction !== "DOWN") setDirection("UP");
        break;
      case "ArrowDown":
        if (direction !== "UP") setDirection("DOWN");
        break;
      case "ArrowLeft":
        if (direction !== "RIGHT") setDirection("LEFT");
        break;
      case "ArrowRight":
        if (direction !== "LEFT") setDirection("RIGHT");
        break;
      case " ": // Space bar
        // For instant speed boost
        setSpeed((prev) => Math.max(MIN_SPEED, prev - 40));
        setTimeout(() => {
          setSpeed(DEFAULT_SPEED);
        }, 1000);
        break;
      default:
        break;
    }
  };  

  const handleGameOver = useCallback((head, reason) => {
    console.log(`handleGameOver`);    
    console.log(`%c[COLLISION] ${reason} at x:${head.x}, y:${head.y}`, 'color: red; font-weight: bold');
    
    // Set collision data for debugging
    setCollision({ x: head.x, y: head.y, type: reason });
    
    const explosionDuration = 1500; // Animation duration in milliseconds
    console.log(`handleGameOver:  Setting explosion effect, duration: ${explosionDuration}ms`);

    setCollisionEffect({ x: head.x, y: head.y });
    setTimeout(showGameOver, explosionDuration);
    // console.log(`handleGameOver:  Game started: gameOver=${gameOver}, dialog=${showGameOverDialog}, started=${gameStarted}`);

    return "processing_collision";
  }, []);

  const incrementScore = useCallback(() => {
    setScore(prevScore => prevScore + 1);
  }, []);

  const checkCollision = useCallback((head) => {
    // Check boundary collision
    if (head.x >= GRID_SIZE || head.x < 0 || head.y >= GRID_SIZE || head.y < 0) {
      return handleGameOver(head, 'boundary');
    }
    
    // Check self-collision
    for (let i = 1; i < snake.length; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        return handleGameOver(head, 'self');
      }
    }
    
    setCollision(null);
    return false;
  }, [handleGameOver, snake]);


const updateFoodItemsWithDistance = useCallback((head) => {
  // Handle classic mode
  if (gameType === "classic") {
    // Create a single-item array with the classic food
    return [{
      ...food,
      distance: Math.abs(food.y - head.y) + Math.abs(food.x - head.x)
    }];
  } else if (gameType === "tetra" || gameType === "bounce") {
    // Calculate distance for each item
    const itemsWithDistance = [...foodItems].map(foodItem => ({
      ...foodItem,
      distance: Math.abs(foodItem.y - head.y) + Math.abs(foodItem.x - head.x)
    }));
    return itemsWithDistance.sort((a, b) => a.distance - b.distance);
  }
  
  // Fallback (shouldn't happen)
  return [];
}, [food, foodItems, gameType]);  

  useEffect(() => {
    // Focus the window to make sure key events are captured
    window.focus();
  
    const handleKeyPress = (e) => {
      // Debug logging
      setLastKey(e.key);
      
      // Toggle debug step mode with 'D' key
      if (e.key === 'd' || e.key === 'D') {
        setDebugStepMode(prev => !prev);
        // console.log("Debug step mode:", !debugStepMode);
        return;
      }
      
      // In debug step mode, space advances one step
      if (debugStepMode && (e.key === ' ' || e.key === 'Spacebar')) {
        // console.log("Advancing one step");
        setWaitingForStep(false);
        setStepCount(prev => prev + 1);
        return;
      }
              
      if (gameOver) return;
  
      if (e.key === "Escape") {
        setIsPaused(prevPaused => !prevPaused);
        return;
      }
  
      // Skip other keys if paused or in debug mode waiting for step
      if (isPaused || (debugStepMode && waitingForStep)) {
        return;
      }
  
      switch (e.key) {
        case "ArrowUp":
          if (direction !== "DOWN") setDirection("UP");
          break;
        case "ArrowDown":
          if (direction !== "UP") setDirection("DOWN");
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT") setDirection("LEFT");
          break;
        case "ArrowRight":
          if (direction !== "LEFT") setDirection("RIGHT");
          break;
        case "=":
        case "+":
          setSpeed((prev) => Math.max(MIN_SPEED, prev - 20));
          break;
        case "-":
          setSpeed((prev) => Math.min(MAX_SPEED, prev + 20));
          break;
        default:
          break;
      }
    };
  
    window.addEventListener("keydown", handleKeyPress);
  
    // Define game tick function
    const gameTick = () => {
      if (!gameStarted || gameOver || isPaused) return;
      
      // Debug mode handling
      if (debugStepMode && waitingForStep) {
        return;
      }
      if (debugStepMode) {
        setWaitingForStep(true);
      }
      
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };
        
        // Update head position based on direction
        switch (direction) {
          case "UP": head.y -= 1; break;
          case "DOWN": head.y += 1; break;
          case "LEFT": head.x -= 1; break;
          case "RIGHT": head.x += 1; break;
          default: break;
        }
        
        // Check for collision
        if (checkCollision(head)) {
          // setGameOver(true);
          // setShowGameOverDialog(true);
          return prevSnake;
        }

       
        const newSnake = [head, ...prevSnake];
        
        // Calculate distances and sort food items
        let updatedFoodItems = updateFoodItemsWithDistance(head);

        if (updatedFoodItems.length > 0 && updatedFoodItems[0].distance === 0) {   
            // Food eaten     
            if (gameType === "classic") {
                generateFood();
            } else {
              if (gameType === "bounce" && BounceEatenFood >= 1) {
                handleGameOver(head, 'consecutive-food');
                return prevSnake;
              } else {
                setBounceEatenFood(gameType === "bounce" ? 1 : 0);
              }
              
              // Remove the eaten food
              const remainingFood = updatedFoodItems.slice(1);
              
              // If no food left, generate new tetra shape
              if (remainingFood.length === 0) {
                generateFoodTetra();
              } else {
                setFoodItems(remainingFood);
              }
            }
            incrementScore();
            console.log("incrementScore from :", gameType, " until ", score);

        } else {
            // No food eaten, remove tail
            newSnake.pop();
          
          // Update remaining food items if in tetra/bounce mode
          if (gameType !== "classic") {
            setFoodItems(updatedFoodItems);
            setBounceEatenFood(0);
          }
        }
        return newSnake;
      });
    };

    // Game loop setup
    let moveInterval = null;
    if (gameStarted && !debugStepMode) {
      moveInterval = setInterval(gameTick, speed);
    } else if (gameStarted && !waitingForStep) {
      // In debug mode, run once if not waiting for step
      gameTick();
    }    
    
    // Cleanup function
    return () => {
      if (moveInterval) clearInterval(moveInterval);
      window.removeEventListener("keydown", handleKeyPress);
    };
//  }, [isPaused, direction, food, gameOver, speed, checkCollision, generateFood, gameType, nonEatenFood, foodItems, generateFoodTetra, score, gameStarted]);
  }, [incrementScore, updateFoodItemsWithDistance, handleGameOver, BounceEatenFood, isPaused, direction, food, gameOver, speed, checkCollision, generateFood, gameType, nonEatenFood, foodItems, generateFoodTetra, score, gameStarted, debugStepMode, waitingForStep, stepCount]);

  // Detect mobile device and handle scaling
  useEffect(() => {
    const detectMobileDevice = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isMobileWidth = window.innerWidth <= 768;
      return isMobileDevice || isMobileWidth;
    };
    
    const isMobileDetected = detectMobileDevice();
    setIsMobile(isMobileDetected);
    
    // Set grid and cell size based on device type
    if (isMobileDetected) {
      setActualGridSize(MOBILE_GRID_SIZE);
      setActualCellSize(MOBILE_CELL_SIZE);
      setActualBoardSize(MOBILE_BOARD_SIZE);
    } else {
      setActualGridSize(GRID_SIZE);
      setActualCellSize(CELL_SIZE);
      setActualBoardSize(BOARD_SIZE);
    }
    
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      
      setWindowSize({
        width: newWidth,
        height: newHeight
      });
      
      // Calculate appropriate scale for both width and height
      const currentBoardSize = isMobileDetected ? MOBILE_BOARD_SIZE : BOARD_SIZE;
      const containerWidth = currentBoardSize + 60;  // Width with padding
      const containerHeight = currentBoardSize + 180; // Height with headers, score, etc.
      
      const availableWidth = newWidth * 0.95; // Use 95% of viewport width
      const availableHeight = newHeight * 0.90; // Use 90% of viewport height
      
      // Calculate scale based on both dimensions
      const horizontalScale = availableWidth / containerWidth;
      const verticalScale = availableHeight / containerHeight;
      
      // Use the smaller scale to ensure everything fits
      const newScale = Math.min(horizontalScale, verticalScale, 1); // Never scale up
      
      setContainerScale(newScale);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Prevent scrolling on mobile
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Update your render method to use the dynamic sizes
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "white",
    }}>

      <div style={{
        transform: `scale(${containerScale})`,
        transformOrigin: 'center center',
        padding: isMobile ? "0.5rem" : "1rem",
      }}>
      
        <div style={{
          width: `${actualBoardSize + (isMobile ? 40 : 60)}px`,
          height: `${actualBoardSize + (isMobile ? 160 : 210)}px`,
          backgroundColor: "#ffc0cb",
          borderRadius: "0.5rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          padding: isMobile ? "1rem" : "1.5rem",
        }}>
        
          {/* Update header sizes */}
          <div style={{
            backgroundColor: "#000080",
            padding: isMobile ? "0.5rem" : "1rem",
            borderRadius: "0.5rem",
            marginBottom: isMobile ? "0.5rem" : "1rem",
            textAlign: "center",
            color: "white",
            fontSize: isMobile ? "18px" : "24px",
            fontWeight: "bold",
            width: `${actualBoardSize + (isMobile ? 20 : 30)}px`,
            boxSizing: "border-box",
            margin: "0 auto",
          }}>
            SNAKE {gameType.charAt(0).toUpperCase() + gameType.slice(1)}
          </div>
          
          {/* Update score board */}
          <div style={{
            backgroundColor: "#0000FF",
            padding: isMobile ? "0.5rem" : "1rem",
            borderRadius: "0.5rem",
            marginBottom: isMobile ? "0.5rem" : "1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <div style={{ color: "white", fontSize: isMobile ? "0.9rem" : "1.25rem" }}>
              Speed: {speed}ms
            </div>
            <div style={{ color: "white", fontSize: isMobile ? "0.9rem" : "1.25rem" }}>
              Score: {score}
            </div>
          </div>
          
          {/* Update game field */}
          <div style={{
            position: "relative",
            width: `${actualBoardSize + (isMobile ? 5 : 10)}px`,
            height: `${actualBoardSize}px`,
            border: "4px solid #1f2937",
            backgroundColor: "#fff8dc",
            boxSizing: "border-box",
            margin: "0 auto",
          }}>
          {snake.map((segment, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: `${CELL_SIZE}px`, 
                height: `${CELL_SIZE}px`, 
                left: `${segment.x * CELL_SIZE}px`,
                top: `${segment.y * CELL_SIZE}px`,
                backgroundColor: i === 0 ? "transparent" : "#22c55e",
                border: i === 0 ? "none" : "1px solid #166534",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: i === 0 ? "20px" : "inherit",
              }}
            >
              {i === 0 && SNAKE_HEADS[direction]}
            </div>
          ))}

          {/* Food display */}
          {/* Update food rendering to use actualCellSize */}
          {gameType === "classic" ? (
            <div style={{
              position: "absolute",
              width: `${actualCellSize}px`,
              height: `${actualCellSize}px`,
              left: `${food.x * actualCellSize}px`,
              top: `${food.y * actualCellSize}px`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              {food.emoji}
            </div>
          ) : (
            foodItems.map((foodItem, index) => (
              <div
                key={`food-${index}`}
                style={{
                  position: "absolute",
                  width: `${actualCellSize}px`,
                  height: `${actualCellSize}px`,
                  left: `${foodItem.x * actualCellSize}px`,
                  top: `${foodItem.y * actualCellSize}px`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {foodItem.emoji}
              </div>
            ))
          )}

          {/* THE EXPLOSION EFFECT */}
          {collisionEffect && (
            <div
              style={{
                position: "absolute",
                left: `${collisionEffect.x * actualCellSize - actualCellSize}px`,
                top: `${collisionEffect.y * actualCellSize - actualCellSize}px`,
                width: `${actualCellSize * 3}px`,
                height: `${actualCellSize * 3}px`,
                zIndex: 50,
              }}
            >

              {/* Star rays */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={`ray-${i}`}
                  style={{
                    position: "absolute",
                    width: "4px",
                    height: "0px",
                    backgroundColor: "#ff4500",
                    left: "calc(50% - 2px)",
                    top: "calc(50% - 0px)",
                    transformOrigin: "center bottom",
                    transform: `rotate(${i * 45}deg)`,
                    animation: "ray-animation 1.5s forwards",
                  }}
                />
              ))}
              {/* Center circle */}
              <div
                style={{
                  position: "absolute",
                  width: `${CELL_SIZE}px`,
                  height: `${CELL_SIZE}px`,
                  backgroundColor: "#ff4500",
                  borderRadius: "50%",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  animation: "pulse 1.5s forwards",
                }}
              />
            </div>
          )}

        </div>

        <div style={{
          marginTop: "1rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
        }}>

        </div>
      </div>

      {!gameStarted && (
        <SettingsDialog
          onStart={startGame}
          gameType={gameType}
          setGameType={setGameType}
          isMobile={isMobile}
        />
      )}

      {/* Add this right before your GameOverDialog component */}
      {isPaused && gameStarted && !gameOver && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 90,
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "1.5rem",
            borderRadius: "0.5rem",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
            width: "300px",
          }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Game Paused</h2>
            <p style={{ marginBottom: "1rem" }}>Press ESC to resume</p>
            <button
              onClick={() => setIsPaused(false)}
              style={{
                width: "100%",
                padding: "0.5rem",
                backgroundColor: "#22c55e",
                color: "white",
                border: "none",
                borderRadius: "0.25rem",
                cursor: "pointer",
                fontSize: "1rem",
              }}
              autoFocus
            >
              Resume Game
            </button>
          </div>
        </div>
      )}

      <GameOverDialog
        score={score}
        show={showGameOverDialog}
        setShowGameOverDialog={setShowGameOverDialog}
        setGameOver={setGameOver}
        setGameStarted={setGameStarted}
        resetGame={resetGame}
        setCollisionEffect={setCollisionEffect}        
      />

    </div>
    {gameStarted && !gameOver && isMobile && (
      <TouchControls onControl={handleTouchControl} />
    )}    
  </div>
  );
};

export default Snake;