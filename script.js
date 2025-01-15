function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];
    const boardUi = document.querySelector(".board");

    (function createBoard() {
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i][j] = "";
                const cell = document.createElement("div");
                cell.setAttribute("data-index-numbers", `${i}-${j}`)
                boardUi.appendChild(cell);
            }
        }
    })();

    function render() {
        board.flat().map((element, index) => {
            boardUi.children[index].textContent = element;
        });
    };

    function getBoard() {
        return board;
    }

    function getBoardUi() {
        return boardUi;
    }

    function getWinPatterns() {
        return [[board[0][0], board[0][1], board[0][2]], 
                [board[1][0], board[1][1], board[1][2]],
                [board[2][0], board[2][1], board[2][2]],
                [board[0][0], board[1][0], board[2][0]],
                [board[0][1], board[1][1], board[2][1]],
                [board[0][2], board[1][2], board[2][2]],
                [board[0][0], board[1][1], board[2][2]],
                [board[0][2], board[1][1], board[2][0]]];
    }

    function placeMarker(cell, activePlayer) {
        board[cell.row][cell.column] = activePlayer.marker;
    }

    return {getBoard, getBoardUi, getWinPatterns, placeMarker, render};
}

function GameController(playerOneName = "Player 1", playerTwoName = "Player 2") {
    const players = [
        {name: playerOneName, marker: "X"},
        {name: playerTwoName, marker: "O"}
    ]
    const gameBoard = Gameboard();
    let activePlayer = players[0];

    gameBoard.getBoardUi().addEventListener("click", (e) => {
        const cell = {
            row: e.target.getAttribute("data-index-numbers").at(0),
            column: e.target.getAttribute("data-index-numbers").at(-1)
        }
        playRound(cell);
    })

    function switchActivePlayer() {
        activePlayer = (activePlayer === players[0]) ? players[1] : players[0];
    }

    function checkWin(activePlayer) {
        for(let i = 0; gameBoard.getWinPatterns().length > i; i++) {
            if (gameBoard.getWinPatterns()[i].every((cell) => cell === activePlayer.marker)) {
                console.log(`${activePlayer.name} wins.`)
            } 
        }
        if (gameBoard.getBoard().flat().every((cell) => cell)) {
            console.log("Tie");
        }
    }
    
    function playRound(cell) {
        if (gameBoard.getBoard()[cell.row][cell.column] === "") {
            gameBoard.placeMarker(cell, activePlayer);
            checkWin(activePlayer);
            switchActivePlayer();
            gameBoard.render();
        }
        console.log(gameBoard.getBoard());
    }
}
const game = GameController("Hannes", "Darlyne");