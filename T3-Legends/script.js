// script.js
const board = document.getElementById('board');
const status = document.getElementById('status');
const restartButton = document.getElementById('restart');
const placeSound = document.getElementById('placeSound');
const winSound = document.getElementById('winSound');

let xMoves = [];
let oMoves = [];
let currentPlayer = 'X';
let gameActive = true;
let scores = { X: 0, O: 0 };

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
];

// Initialize board
function createBoard() {
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        board.appendChild(cell);
    }
}

function startGame() {
    board.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('expiring', 'x-mark', 'o-mark');
        cell.textContent = '';
        cell.addEventListener('click', handleClick, { once: true });
    });
    
    status.textContent = `Player ${currentPlayer}'s turn`;
    gameActive = true;
    updateExpiringCells();
    updateScores();
}

function handleClick(e) {
    if (!gameActive) return;
    
    const cell = e.target;
    const cellIndex = parseInt(cell.dataset.index);
    
    // Play place sound
    placeSound.currentTime = 0;
    placeSound.play();

    // Add move to current player's queue
    if (currentPlayer === 'X') {
        xMoves.push(cellIndex);
        if (xMoves.length > 3) {
            const removed = xMoves.shift();
            const removedCell = board.querySelector(`[data-index="${removed}"]`);
            removedCell.classList.remove('x-mark');
            removedCell.textContent = '';
        }
        cell.classList.add('x-mark');
    } else {
        oMoves.push(cellIndex);
        if (oMoves.length > 3) {
            const removed = oMoves.shift();
            const removedCell = board.querySelector(`[data-index="${removed}"]`);
            removedCell.classList.remove('o-mark');
            removedCell.textContent = '';
        }
        cell.classList.add('o-mark');
    }

    cell.textContent = currentPlayer;
    
    // Check for win after removal
    setTimeout(() => { // Allow DOM to update
        if (checkWin(currentPlayer)) {
            winSound.play();
            status.textContent = `Player ${currentPlayer} wins!`;
            scores[currentPlayer]++;
            gameActive = false;
            updateScores();
            return;
        }

        // Switch turns
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        status.textContent = `Player ${currentPlayer}'s turn`;
        updateExpiringCells();
        
        // Re-enable click on new expiring cells
        board.querySelectorAll('.cell').forEach(c => {
            if (!c.textContent && !c.classList.contains('expiring')) {
                c.addEventListener('click', handleClick, { once: true });
            }
        });
    }, 10);
}

function updateExpiringCells() {
    board.querySelectorAll('.cell').forEach(c => c.classList.remove('expiring'));
    
    if (currentPlayer === 'X' && xMoves.length === 3) {
        const expiringCell = board.querySelector(`[data-index="${xMoves[0]}"]`);
        expiringCell.classList.add('expiring');
    }
    if (currentPlayer === 'O' && oMoves.length === 3) {
        const expiringCell = board.querySelector(`[data-index="${oMoves[0]}"]`);
        expiringCell.classList.add('expiring');
    }
}

function checkWin(player) {
    const moves = player === 'X' ? xMoves : oMoves;
    return winningCombinations.some(combination => {
        return combination.every(index => moves.includes(index));
    });
}

function updateScores() {
    document.querySelector('.x-player').textContent = `Player X: ${scores.X}`;
    document.querySelector('.o-player').textContent = `Player O: ${scores.O}`;
}

function restartGame() {
    xMoves = [];
    oMoves = [];
    currentPlayer = 'X';
    board.innerHTML = '';
    createBoard();
    startGame();
}

// Event Listeners
restartButton.addEventListener('click', restartGame);

// Initialize game
createBoard();
startGame();