import  { useState } from 'react';
import React from 'react';


type GridType = (number | null)[][];

interface SudokuProps {
  initialGrid?: GridType;
}

const GRID_SIZE = 9;

function SudokuInput({ initialGrid }: SudokuProps) {
  const [grid, setGrid] = useState<GridType>(() => {
    if (initialGrid) {
      return initialGrid;
    }

    return Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () => null)
    );
  });


  function handleInputChange  (
    event: React.ChangeEvent<HTMLInputElement>,
    row: number,
    col: number
  ) {
    const value = event.target.value;
  
    if (/^[1-9]?$/.test(value)) {
      const newGrid = [...grid];
      newGrid[row][col] = value ? parseInt(value, 10) : null;
      setGrid(newGrid);
    }
  };
  

  function  renderCell (row: number, col: number)  {
    const value = grid[row][col];

    return (
      <input
        key={`${row}-${col}`}
        type="number"
        min="1"
        max="9"
        value={value || ''}
        onChange={(event) => handleInputChange(event, row, col)}
      />);
  };

  function renderRow  (rowIndex: number) {
    return (
      <div key={rowIndex}>
        {Array.from({ length: GRID_SIZE }, (_, colIndex) =>
          renderCell(rowIndex, colIndex)
        )}
      </div>
    );
  };

  function renderGrid () {
    return Array.from({ length: GRID_SIZE }, (_, rowIndex) =>
      renderRow(rowIndex)
    );
  };


  /*
  Maak drie arrays (rows, cols, blocks) aan van lege arrays met lengte 9. 
  Dit worden de arrays waarin we bijhouden welke getallen er al voorkomen in elke rij, kolom en blok.
  Loop over alle cellen in de sudoku. Voor elke cel, controleer of het getal al voorkomt in de corresponderende rij, kolom en blok. 
  Als het getal al voorkomt in een van deze drie, dan bevat de sudoku dubbele getallen en moet je false teruggeven. 
  Als het getal nog niet voorkomt in een van deze drie, voeg het dan toe aan de corresponderende array.
  Als je alle cellen hebt gecontroleerd en er zijn geen dubbele getallen gevonden, dan bevat de sudoku geen fouten en moet je true teruggeven.
*/
  function checkSudoku(): boolean {
    const rows: number[][] = Array.from({ length: 9 }, () => []);
    const cols: number[][] = Array.from({ length: 9 }, () => []);
    const blocks: number[][] = Array.from({ length: 9 }, () => []);
  
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        
        const value: number = grid[i][j]?? 0;  
        if (value === 0) continue; // Skip empty cells
        const blockIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3);
        if (
          rows[i].includes(value) ||
          cols[j].includes(value) ||
          blocks[blockIndex].includes(value)
        ) {
          return false; // Found duplicate value
        }
        rows[i].push(value);
        cols[j].push(value);
        blocks[blockIndex].push(value);
      }
    }
  
    return true;
  }
  

  function renderValidation () {
    return <div>{checkSudoku() ? 'Valid' : 'Invalid'}</div>;
  };


  return (
  <div>
    {renderGrid()}
    {renderValidation()}
  </div>);
}

export default SudokuInput;
