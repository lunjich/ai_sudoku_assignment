let initialBoard = [];
let isSolving = false;
let lastExampleIndex = -1;

window.onload = () => {
    initializeBoard();
    setupInputHandlers();
};

function initializeBoard() {
    let b = document.getElementById("board");
    b.innerHTML = "";
    
    for (let i = 0; i < 9; i++) {
        let row = document.createElement("tr");
        for (let j = 0; j < 9; j++) {
            let cell = document.createElement("td");
            let input = document.createElement("input");
            input.type = "text";
            input.id = `c${i}${j}`;
            input.maxLength = 1;
            input.className = "cell-input";
            
            // Add visual grouping for 3x3 boxes
            if (i % 3 === 2 && i !== 8) input.classList.add("border-bottom");
            if (j % 3 === 2 && j !== 8) input.classList.add("border-right");
            
            input.addEventListener("input", handleInput);
            input.addEventListener("keydown", handleKeyDown);
            input.addEventListener("focus", () => input.classList.add("focused"));
            input.addEventListener("blur", () => input.classList.remove("focused"));
            
            cell.appendChild(input);
            row.appendChild(cell);
        }
        b.appendChild(row);
    }
    
    // Store initial empty state
    saveInitialState();
}

function setupInputHandlers() {
    // Allow only numbers 1-9
    document.querySelectorAll('.cell-input').forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value;
            if (value && (!/^[1-9]$/.test(value))) {
                e.target.value = '';
            }
        });
    });
}

function handleInput(e) {
    let value = e.target.value;
    if (value && /^[1-9]$/.test(value)) {
        e.target.classList.add("user-input");
        highlightRelatedCells(e.target.id);
    } else {
        e.target.classList.remove("user-input");
    }
}

function handleKeyDown(e) {
    let id = e.target.id;
    let row = parseInt(id[1]);
    let col = parseInt(id[2]);
    
    // Arrow key navigation
    if (e.key.startsWith('Arrow')) {
        e.preventDefault();
        let newRow = row, newCol = col;
        
        if (e.key === 'ArrowUp' && row > 0) newRow = row - 1;
        if (e.key === 'ArrowDown' && row < 8) newRow = row + 1;
        if (e.key === 'ArrowLeft' && col > 0) newCol = col - 1;
        if (e.key === 'ArrowRight' && col < 8) newCol = col + 1;
        
        document.getElementById(`c${newRow}${newCol}`).focus();
    }
}

function highlightRelatedCells(cellId) {
    // Remove previous highlights
    document.querySelectorAll('.cell-input').forEach(cell => {
        cell.classList.remove('highlighted');
    });
    
    let row = parseInt(cellId[1]);
    let col = parseInt(cellId[2]);
    
    // Highlight same row, column, and box
    for (let i = 0; i < 9; i++) {
        document.getElementById(`c${row}${i}`).classList.add('highlighted');
        document.getElementById(`c${i}${col}`).classList.add('highlighted');
    }
    
    // Highlight 3x3 box
    let boxRow = Math.floor(row / 3) * 3;
    let boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            document.getElementById(`c${boxRow + i}${boxCol + j}`).classList.add('highlighted');
        }
    }
}

function saveInitialState() {
    initialBoard = [];
    for (let i = 0; i < 9; i++) {
        initialBoard[i] = [];
        for (let j = 0; j < 9; j++) {
            let value = document.getElementById(`c${i}${j}`).value;
            initialBoard[i][j] = value || 0;
        }
    }
}

let duplicateCells = [];

function clearDuplicateHighlights() {
    document.querySelectorAll('.cell-input').forEach(cell => {
        cell.classList.remove('cell-duplicate');
    });
}

function highlightDuplicateCells() {
    duplicateCells.forEach(([r, c]) => {
        const cell = document.getElementById(`c${r}${c}`);
        if (cell) cell.classList.add('cell-duplicate');
    });
}

function isValidSudoku(board) {
    // Track duplicate coordinates
    duplicateCells = [];

    // Check rows
    for (let i = 0; i < 9; i++) {
        let row = [];
        let seenPositions = {};
        for (let j = 0; j < 9; j++) {
            if (board[i][j] !== 0) {
                if (row.includes(board[i][j])) {
                    duplicateCells.push(...seenPositions[board[i][j]].map(col => [i, col]));
                    duplicateCells.push([i, j]);
                    return false;
                }
                row.push(board[i][j]);
                if (!seenPositions[board[i][j]]) seenPositions[board[i][j]] = [];
                seenPositions[board[i][j]].push(j);
            }
        }
    }
    
    // Check columns
    for (let j = 0; j < 9; j++) {
        let col = [];
        let seenPositions = {};
        for (let i = 0; i < 9; i++) {
            if (board[i][j] !== 0) {
                if (col.includes(board[i][j])) {
                    duplicateCells.push(...seenPositions[board[i][j]].map(row => [row, j]));
                    duplicateCells.push([i, j]);
                    return false;
                }
                col.push(board[i][j]);
                if (!seenPositions[board[i][j]]) seenPositions[board[i][j]] = [];
                seenPositions[board[i][j]].push(i);
            }
        }
    }
    
    // Check 3x3 boxes
    for (let box = 0; box < 9; box++) {
        let boxNums = [];
        let seenPositions = {};
        let startRow = Math.floor(box / 3) * 3;
        let startCol = (box % 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let val = board[startRow + i][startCol + j];
                if (val !== 0) {
                    if (boxNums.includes(val)) {
                        duplicateCells.push(...seenPositions[val].map(([r, c]) => [r, c]));
                        duplicateCells.push([startRow + i, startCol + j]);
                        return false;
                    }
                    boxNums.push(val);
                    if (!seenPositions[val]) seenPositions[val] = [];
                    seenPositions[val].push([startRow + i, startCol + j]);
                }
            }
        }
    }
    
    return true;
}

function solveSudoku() {
    if (isSolving) return;
    
    const solveBtn = document.getElementById("solveBtn");
    const status = document.getElementById("status");
    clearDuplicateHighlights();
    
    // Collect board data
    let board = [];
    for (let i = 0; i < 9; i++) {
        board[i] = [];
        for (let j = 0; j < 9; j++) {
            let v = document.getElementById(`c${i}${j}`).value;
            board[i][j] = v ? parseInt(v) : 0;
        }
    }
    
    // Validate the puzzle before solving
    if (!isValidSudoku(board)) {
        highlightDuplicateCells();
        status.textContent = "❌ Invalid Sudoku! Duplicate numbers found.";
        status.className = "status error";
        return;
    }
    
    isSolving = true;
    
    // Update UI
    solveBtn.disabled = true;
    solveBtn.innerHTML = '<span class="btn-icon">⏳</span><span class="btn-text">Solving...</span>';
    status.textContent = "🤖 AI is solving your puzzle...";
    status.className = "status solving";
    
    // Convert board to data array
    let data = [];
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            data.push(board[i][j]);
        }
    }
    
    // Save initial state for animation
    saveInitialState();
    
    fetch("/solve", {
        method: "POST",
        body: data.toString()
    })
    .then(r => {
        if (!r.ok) throw new Error("Failed to solve puzzle");
        return r.json();
    })
    .then(sol => {
        // Animate solution
        animateSolution(sol);
        
        status.textContent = "✅ Puzzle solved successfully!";
        status.className = "status success";
        
        solveBtn.innerHTML = '<span class="btn-icon">🔍</span><span class="btn-text">Solve Puzzle</span>';
        solveBtn.disabled = false;
        isSolving = false;
    })
    .catch(err => {
        status.textContent = "❌ Error: " + err.message;
        status.className = "status error";
        
        solveBtn.innerHTML = '<span class="btn-icon">🔍</span><span class="btn-text">Solve Puzzle</span>';
        solveBtn.disabled = false;
        isSolving = false;
    });
}

function animateSolution(sol) {
    let delay = 0;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let cell = document.getElementById(`c${i}${j}`);
            let wasEmpty = !initialBoard[i][j] || initialBoard[i][j] === 0;
            
            setTimeout(() => {
                if (wasEmpty) {
                    cell.value = sol[i][j];
                    cell.classList.add("solved");
                    cell.classList.remove("user-input");
                    
                    // Add animation
                    cell.style.animation = "popIn 0.3s ease-out";
                    setTimeout(() => {
                        cell.style.animation = "";
                    }, 300);
                }
            }, delay);
            
            delay += 5; // Stagger animation
        }
    }
}

function clearBoard() {
    if (isSolving) return;
    
    document.querySelectorAll('.cell-input').forEach(cell => {
        cell.value = '';
        cell.classList.remove('user-input', 'solved', 'highlighted', 'focused');
    });
    
    document.getElementById("status").textContent = "";
    document.getElementById("status").className = "status";
    saveInitialState();
}

function loadExample() {
    if (isSolving) return;
    
    clearBoard();
    
    // Three example puzzles (easy/medium/harder)
    const examples = [
        [
            [5, 3, 0, 0, 7, 0, 0, 0, 0],
            [6, 0, 0, 1, 9, 5, 0, 0, 0],
            [0, 9, 8, 0, 0, 0, 0, 6, 0],
            [8, 0, 0, 0, 6, 0, 0, 0, 3],
            [4, 0, 0, 8, 0, 3, 0, 0, 1],
            [7, 0, 0, 0, 2, 0, 0, 0, 6],
            [0, 6, 0, 0, 0, 0, 2, 8, 0],
            [0, 0, 0, 4, 1, 9, 0, 0, 5],
            [0, 0, 0, 0, 8, 0, 0, 7, 9]
        ],
        [
            [0, 0, 0, 2, 6, 0, 7, 0, 1],
            [6, 8, 0, 0, 7, 0, 0, 9, 0],
            [1, 9, 0, 0, 0, 4, 5, 0, 0],
            [8, 2, 0, 1, 0, 0, 0, 4, 0],
            [0, 0, 4, 6, 0, 2, 9, 0, 0],
            [0, 5, 0, 0, 0, 3, 0, 2, 8],
            [0, 0, 9, 3, 0, 0, 0, 7, 4],
            [0, 4, 0, 0, 5, 0, 0, 3, 6],
            [7, 0, 3, 0, 1, 8, 0, 0, 0]
        ],
        [
            [0, 0, 5, 3, 0, 0, 0, 0, 0],
            [8, 0, 0, 0, 0, 0, 0, 2, 0],
            [0, 7, 0, 0, 1, 0, 5, 0, 0],
            [4, 0, 0, 0, 0, 5, 3, 0, 0],
            [0, 1, 0, 0, 7, 0, 0, 0, 6],
            [0, 0, 3, 2, 0, 0, 0, 8, 0],
            [0, 6, 0, 5, 0, 0, 0, 0, 9],
            [0, 0, 4, 0, 0, 0, 0, 3, 0],
            [0, 0, 0, 0, 0, 9, 7, 0, 0]
        ]
    ];
    const choices = examples.map((_, i) => i).filter(i => i !== lastExampleIndex);
    const nextIndex = choices[Math.floor(Math.random() * choices.length)];
    lastExampleIndex = nextIndex;
    const example = examples[nextIndex];
    
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let cell = document.getElementById(`c${i}${j}`);
            if (example[i][j] !== 0) {
                cell.value = example[i][j];
            }
        }
    }
    
    saveInitialState();
    document.getElementById("status").textContent = "📄 Example puzzle loaded!";
    document.getElementById("status").className = "status info";
}
