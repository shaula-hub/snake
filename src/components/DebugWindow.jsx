import React from "react";
import PropTypes from "prop-types";

const DebugWindow = ({ snake, food, nonEatenFood, foodItems, collisionEffect, gameOver, showGameOverDialog, gameStarted, lastResetTime }) => {
  // const DebugWindow = ({ snake, food, nonEatenFood, foodItems, collision, collisionEffect, gameOver, showGameOverDialog, gameStarted, lastResetTime }) => {
  return (
    <div style={{
      position: "fixed",
      top: "10px",
      right: "10px",
      width: "300px",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      color: "#fff",
      padding: "10px",
      borderRadius: "5px",
      fontFamily: "monospace",
      fontSize: "12px",
      zIndex: 1000,
      maxHeight: "80vh",
      overflowY: "auto"
    }}>
      <h3 style={{ margin: "0 0 10px 0", borderBottom: "1px solid #666" }}>Debug Info</h3>
      
      <div style={{ marginBottom: "10px" }}>
        <h4 style={{ margin: "5px 0", color: "#00ff00" }}>Snake Head</h4>
        <p>X: {snake[0]?.x}, Y: {snake[0]?.y}</p>
      </div>
      
      <div style={{ marginBottom: "10px" }}>
        <h4 style={{ margin: "5px 0", color: "#ff9900" }}>Current Target Food</h4>
        <p>X: {food?.x}, Y: {food?.y}</p>
        <p>Emoji: {food?.emoji}</p>
      </div>
      
      <div style={{ marginBottom: "10px" }}>
        <h4 style={{ margin: "5px 0", color: "#ff00ff" }}>Uneaten Food Count</h4>
        <p>{nonEatenFood}</p>
      </div>
      
      <div style={{ marginBottom: "10px" }}>
        <h4 style={{ margin: "5px 0", color: "#00ffff" }}>Food Items ({foodItems.length})</h4>
        <div style={{ maxHeight: "100px", overflowY: "auto", border: "1px solid #333", padding: "5px" }}>
          {foodItems.map((item, index) => (
            <p key={index}>ID: {item.id?.substring(0, 8)}... | X: {item.x}, Y: {item.y}</p>
          ))}
        </div>
      </div>
      
      <div style={{ marginBottom: "10px" }}>
        <h4 style={{ margin: "5px 0", color: "#ff00ff" }}>Game State</h4>
        <p>Started: {gameStarted ? "Yes" : "No"}</p>
        <p>Game Over: {gameOver ? "Yes" : "No"}</p>
        <p>Dialog Showing: {showGameOverDialog ? "Yes" : "No"}</p>
        <p>Last Reset: {new Date(lastResetTime).toLocaleTimeString()}</p>
      </div>
      
      {collisionEffect && (
        <div style={{ marginBottom: "10px" }}>
          <h4 style={{ margin: "5px 0", color: "#ff0000" }}>Active Collision Effect</h4>
          <p>X: {collisionEffect.x}, Y: {collisionEffect.y}</p>
        </div>
      )}
    </div>
  );
};

DebugWindow.propTypes = {
  snake: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number
    })
  ).isRequired,
  food: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    emoji: PropTypes.string,
    id: PropTypes.string
  }),
  nonEatenFood: PropTypes.number.isRequired,
  foodItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      x: PropTypes.number,
      y: PropTypes.number,
      emoji: PropTypes.string
    })
  ).isRequired,
  collision: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    type: PropTypes.string
  }),
  // Add new PropTypes
  collisionEffect: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
  }),
  gameOver: PropTypes.bool,
  showGameOverDialog: PropTypes.bool,
  gameStarted: PropTypes.bool,
  lastResetTime: PropTypes.number
};

export default DebugWindow;