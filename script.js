function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    (function createBoard() {
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i][j] = "";
            }
        }
    })();

    function getBoard() {
        return board;
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

    return {getBoard, getWinPatterns, placeMarker};
}

function gameUserInterface(gameBoard) {
    const gameUi = document.querySelector(".game-interface");
    const formUi = document.querySelector(".form-ui");
    const boardUi = document.querySelector(".board-ui");
    const messagePanel = boardUi.querySelector(".message-panel");
    const board = boardUi.querySelector(".board");

    function getGameUi() {
        return gameUi;
    }

    function render(target, activePlayer) {
        switch (target) {
            case "form":
                gameUi.removeChild(boardUi);
                gameUi.appendChild(formUi);
                break;
            case "board":
                gameUi.removeChild(formUi);
                gameUi.appendChild(boardUi);
                break;
            case "player":
                updateBoard();
                updateMessagePanel(activePlayer)
                break;
            case "win":
                updateBoard();
                showWinMessage(activePlayer);
                break;
            case "tie":
                updateBoard();
                showTieMessage();
                break;
        }
    }

    function updateMessagePanel(activePlayer) {
        messagePanel.textContent = `${activePlayer.name}'s Turn. (${activePlayer.marker})`;
    }

    function showWinMessage(activePlayer) {
        messagePanel.textContent = `Congratulations! ${activePlayer.name} wins!`;
    }

    function showTieMessage() {
        messagePanel.textContent = "The game is over! It's a tie!"
    }

    function updateBoard() {
        gameBoard.getBoard().flat().map((element, index) => {
            board.children[index].textContent = element;
        });
    }

    return {getGameUi, render};
}

function GameController(playerOneName = "Player 1", playerTwoName = "Player 2") {
    const players = [
        {name: playerOneName, marker: "X"},
        {name: playerTwoName, marker: "O"}
    ]
    const gameBoard = Gameboard();
    const gameUi = gameUserInterface(gameBoard);
    let activePlayer = players[0];

    gameUi.getGameUi().querySelector(".board").addEventListener("click", (e) => {
        playRound({
            row: e.target.getAttribute("data-index-numbers").at(0),
            column: e.target.getAttribute("data-index-numbers").at(-1)
            }
        );
    })

    gameUi.getGameUi().querySelector(".form-ui").addEventListener("submit", (e) => {
        e.preventDefault();
        setPlayerNames(
            gameUi.getGameUi().querySelector("#player-one-name").value, 
            gameUi.getGameUi().querySelector("#player-two-name").value
        )
        gameUi.render("player", activePlayer);
        gameUi.render("board");
    })

    function setPlayerNames(nameOne, nameTwo) {
        if(nameOne != "") players[0].name = nameOne;
        if(nameTwo != "") players[1].name = nameTwo;
    }

    function switchActivePlayer() {
        activePlayer = (activePlayer === players[0]) ? players[1] : players[0];
    }

    function checkWin() {
        let result = false;
        gameBoard.getWinPatterns().map((singlePattern) => {
            if (singlePattern.every((cell) => cell === activePlayer.marker)) {
                result = true;
            }
        })
        return result;
    }

    function checkTie() {
        if (gameBoard.getBoard().flat().every((cell) => cell)) {
            return true;
        }
    }
    
    function playRound(cell) {
        if (gameBoard.getBoard()[cell.row][cell.column] === "") {
            gameBoard.placeMarker(cell, activePlayer);
            if (checkWin()) {
                gameUi.render("win", activePlayer);
            } else if (checkTie()) {
                gameUi.render("tie", activePlayer);
            } else {
                switchActivePlayer();
                gameUi.render("player", activePlayer);
            }
        }
    }

    gameUi.render("form");

}
const game = GameController();