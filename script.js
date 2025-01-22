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
    
    function resetBoard() {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board.length; j++) {
                board[i][j] = "";
            }
        }
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

    return {getBoard, resetBoard, getWinPatterns, placeMarker};
}

function gameUserInterface(gameBoard) {
    const gameUi = document.querySelector(".game-interface");
    const formUi = document.querySelector(".form-ui");
    const boardUi = document.querySelector(".board-ui");
    const gameInfo = document.querySelector(".game-info");
    const messagePanel = gameInfo.querySelector("p");
    const markerPanel = gameInfo.querySelector("span");
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
                if (gameUi.querySelector(".board-ui")) {
                    updateBoard();
                } else {
                    gameUi.removeChild(formUi);
                    gameUi.appendChild(boardUi);
                }
                break;
            case "messagePanel":
                updateMessagePanel(object.activePlayer, object.message);
                break;
        }
    }

    function updateBoard() {
        gameBoard.getBoard().flat().map((element, index) => {
            if (element === "") {
                board.children[index].classList.remove("x-marker", "o-marker");
            } else {
                board.children[index].classList.add(`${element}-marker`);
            }
        });
    }

    function updateMessagePanel(activePlayer, message) {
        markerPanel.classList.remove("x-marker", "o-marker");
        gameInfo.classList.remove("win", "tie");
        switch (message) {
            case "playerTurn":
                messagePanel.textContent = `${activePlayer.name}'s turn:`;
                markerPanel.classList.add("panel-marker");
                markerPanel.classList.add(`${activePlayer.marker}-marker`);
                break;
            case "win":
                markerPanel.classList.remove("panel-marker");
                messagePanel.textContent = `Congratulations! ${activePlayer.name} wins!`;
                gameInfo.classList.add("win");
                break;
            case "tie":
                markerPanel.classList.remove("panel-marker");
                messagePanel.textContent = "The game is over! It's a tie!"
                gameInfo.classList.add("tie");
                break;
        }
    }

    return {getGameUi, render};
}

function GameController(playerOneName = "Player 1", playerTwoName = "Player 2") {
    const gameBoard = Gameboard();
    const gameUi = gameUserInterface(gameBoard);
    const players = [
        {name: playerOneName, marker: "x"},
        {name: playerTwoName, marker: "o"}
    ]

    let activePlayer = players[0];
    
    gameUi.getGameUi().querySelector(".form-ui").addEventListener("submit", (e) => submitForm(e));
    gameUi.getGameUi().querySelector(".board").addEventListener("click", (e) => startGameCycle(e));
    gameUi.getGameUi().querySelector(".restart-game").addEventListener("click", () => restartGame());
    gameUi.getGameUi().querySelector(".new-game").addEventListener("click", () => startNewGame());

    function submitForm(e) {
        e.preventDefault();
        setPlayerNames(
            gameUi.getGameUi().querySelector("#player-one-name").value, 
            gameUi.getGameUi().querySelector("#player-two-name").value
        )
        gameUi.render({target: "board"});
        gameUi.render({target: "messagePanel", activePlayer: activePlayer, message: "playerTurn"});
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
            gameUi.render({target: "board"})
            gameUi.render({
                target: "messagePanel", 
                activePlayer: activePlayer, 
                message: message});
        }
    }

    function restartGame() {
        gameBoard.resetBoard();
        activePlayer = players[0];
        gameUi.render({target: "board"});
        gameUi.render({
            target: "messagePanel", 
            activePlayer: activePlayer, 
            message: "playerTurn"})
    }

    function startNewGame() {
        restartGame();
        gameUi.render({target: "form"});
    }

    gameUi.render({target: "form"});
}

const game = GameController();