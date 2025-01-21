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

    function render(object) {
        switch (object.target) {
            case "form":
                gameUi.removeChild(boardUi);
                gameUi.appendChild(formUi);
                break;
            case "board":
                gameUi.removeChild(formUi);
                gameUi.appendChild(boardUi);
                break;
            case "messagePanel":
                updateBoard();
                updateMessagePanel(object.activePlayer, object.message);
                break;
        }
    }

    function updateMessagePanel(activePlayer, message) {
        switch (message) {
            case "playerTurn":
                messagePanel.textContent = `${activePlayer.name}'s Turn. (${activePlayer.marker})`;
                break;
            case "win":
                messagePanel.textContent = `Congratulations! ${activePlayer.name} wins!`;
                break;
            case "tie":
                messagePanel.textContent = "The game is over! It's a tie!"
                break;
        }
    }

    function updateBoard() {
        gameBoard.getBoard().flat().map((element, index) => {
            board.children[index].textContent = element;
        });
    }

    return {getGameUi, render};
}

function GameController(playerOneName = "Player 1", playerTwoName = "Player 2") {
    const gameBoard = Gameboard();
    const gameUi = gameUserInterface(gameBoard);
    const players = [
        {name: playerOneName, marker: "X"},
        {name: playerTwoName, marker: "O"}
    ]

    let activePlayer = players[0];

    gameUi.getGameUi().querySelector(".board").addEventListener("click", (e) => startGameCycle(e));

    gameUi.getGameUi().querySelector(".form-ui").addEventListener("submit", (e) => submitForm(e));

    function submitForm(e) {
        e.preventDefault();
        setPlayerNames(
            gameUi.getGameUi().querySelector("#player-one-name").value, 
            gameUi.getGameUi().querySelector("#player-two-name").value
        )
        gameUi.render({target: "messagePanel",activePlayer: activePlayer, message: "playerTurn"});
        gameUi.render({target: "board"});
    }

    function setPlayerNames(nameOne, nameTwo) {
        if(nameOne != "") players[0].name = nameOne;
        if(nameTwo != "") players[1].name = nameTwo;
    }

    function switchActivePlayer() {
        activePlayer = (activePlayer === players[0]) ? players[1] : players[0];
    }

    function isWin() {
        let result = false;
        gameBoard.getWinPatterns().map((singlePattern) => {
            if (singlePattern.every((cell) => cell === activePlayer.marker)) {
                result = true;
            }
        })
        return result;
    }

    function isTie() {
        if (gameBoard.getBoard().flat().every((cell) => cell)) {
            return true;
        }
    }
    
    function startGameCycle(e) {
        const cell = {
            row: e.target.getAttribute("data-index-numbers").at(0),
            column: e.target.getAttribute("data-index-numbers").at(-1)
            };
        if (gameBoard.getBoard()[cell.row][cell.column] === "" && !isWin()) {
            gameBoard.placeMarker(cell, activePlayer);
            let message;
            if (isWin()) {
                message = "win";
            } else if (isTie()) {
                message = "tie";
            } else {
                switchActivePlayer();
                message = "playerTurn";
            }
            gameUi.render({
                target: "messagePanel", 
                activePlayer: activePlayer, 
                message: message});
        }
    }

    gameUi.render({target: "form"});
}
const game = GameController();