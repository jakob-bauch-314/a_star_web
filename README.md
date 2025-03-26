# Pathfinding Visualization Tool

shows how A* finds the best path between two places.

## Features

- **Grid Visualization**: 33x33 grid with start (0,17) and end (32,17) points.
- **Obstacle Placement**: Click on grid cells to add/remove obstacles.
- **Visual Coding**:
  - 🔴 Red: Obstacles
  - 🟢 Green: Open nodes (to be explored)
  - 🔵 Blue: Closed nodes (already explored)
  - 💧 Light Blue: Start/End points and current path

## Dependencies

- jQuery (included in project)
- Modern web browser with canvas support

## Installation

1. Clone repository
2. Open `index.html` in web browser
3. No additional server required

## Controls

| Button     | Functionality                              |
|------------|--------------------------------------------|
| Run        | Starts pathfinding execution               |
| Pause      | Stops algorithm progression                |
| Restart    | Resets algorithm with current obstacles    |
| Reset      | Clears all obstacles and resets grid       |

## Technical Notes

- Uses Manhattan distance heuristic for pathfinding
- Grid cells size: 24px
- Automatic fullscreen canvas adaptation
- RequestAnimationFrame used for smooth rendering

License: [MIT]