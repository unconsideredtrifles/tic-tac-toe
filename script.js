let gameBoard = (() => {
    let squares = [
        "", "", "",
        "", "", "",
        "", "", "",
    ];
    let emptySquares = squares.length;
    let allWinningPositions = [
        [3, 6, 4, 8, 1, 2], [0, 2, 4, 7], [1, 0, 4, 6, 5, 8],
        [0, 6, 4, 5], [3, 5, 1, 7, 0, 8, 2, 6], [3, 4, 2, 8],
        [0, 3, 4, 2, 7, 8], [6, 8, 4, 1], [6, 7, 0, 4, 2, 5],
    ];

    const getAllSquares = () => squares;

    const showGameResult = (message) => {
        let gameResultDialog = document.getElementById("game-result-popup");
        let gameResultDisplay = document.getElementById("game-result-text");

        gameResultDisplay.textContent = message;
        gameResultDialog.showModal();
    };

    const checkIfWinIdx = (idx) => (squares[idx] === allPlayers.getCurrentPlayer().getMark());

    const checkGameResult = (idx, value) => {
        let currentPlayer = allPlayers.getCurrentPlayer();
        let winningPositions = allWinningPositions[idx];
        let i = 0;

        currentPlayer.playGame();
        while(i < winningPositions.length) {
            if(checkIfWinIdx(winningPositions[i]) && checkIfWinIdx(winningPositions[i + 1])) {
                showGameResult(`${currentPlayer.getName()} wins!`);
                currentPlayer.winGame();
                break;
            } else if (emptySquares === 1) {
                showGameResult("It's a draw!");
            }
            i += 2;
        }
    };

    const tickASquare = (idx, value) => {
        squares[idx] = value;
        checkGameResult(idx, value);
        emptySquares--;
    }

    const resetGameBoard = () => {
        squares = [
            "", "", "",
            "", "", "",
            "", "", "",
        ];
        emptySquares = squares.length;
    }

    return {
        getAllSquares,
        tickASquare,
        resetGameBoard,
    };
})();


let gameBoardUI = ((gameBoard) => {
    let ticTacToeBoard = document.getElementById("game-board");
    let squaresUI = ticTacToeBoard.children;

    const renderEachSquare = (squareIndex, ticTacToeMark) => {
        squaresUI[squareIndex].textContent = ticTacToeMark;
        gameBoard.tickASquare(squareIndex, ticTacToeMark);
    };

    const render = () => {
        let gameBoardSquares = gameBoard.getAllSquares();
        let currentSquareIndex = 0;
        for(let eachSquare of squaresUI) {
            eachSquare.textContent = gameBoardSquares[currentSquareIndex++];
        }
    };

    return {
        renderEachSquare,
        render,
    };
})(gameBoard);


let Player = (name, mark) => {
    let playerName = name;
    let playerMark = mark;
    let totalGamesPlayed = 0;
    let gamesWon = 0;

    const getName = () => playerName;
    const changeName = (name) => {
        playerName = name;
    };
    const getMark = () => playerMark;
    const playGame = () => ++totalGamesPlayed;
    const winGame = () => {
        gamesWon++;
        scoreBoard.updateCurrentPlayerScore();
        return gamesWon;
    };

    const getTotalGamesPlayed = () => totalGamesPlayed;
    const getGamesWon = () => gamesWon;

    return {
        getName,
        changeName,
        getMark,
        getGamesWon,
        getTotalGamesPlayed,
        playGame,
        winGame,
    };
};


let allPlayers = (() => {
    const players = [Player("Player 1", "O"), Player("Player 2", "X")];
    let currentPlayerIndex = 0;
    let player = players[currentPlayerIndex];


    const getCurrentPlayer = () => player;
    const get = () => players.slice(0);
    const changePlayer = () => {
        if(currentPlayerIndex >= players.length - 1) {
            currentPlayerIndex = 0;
        } else {
            currentPlayerIndex++;
        }
        player = players[currentPlayerIndex];
    };

    return {
        getCurrentPlayer,
        get,
        changePlayer,
    }

})();

let scoreBoard = (() => {
    const updateCurrentPlayerScore = () => {
        let currentPlayer = allPlayers.getCurrentPlayer();
        let players = allPlayers.get();

        let playerIndex = players.findIndex(eachPlayer => {
            return eachPlayer === currentPlayer;
        });
        let selector = `.player-info[data-player-index='${playerIndex}']`

        let playerInfo = document.querySelector(selector);
        let win = playerInfo.getElementsByClassName("win-count")[0];

        win.textContent = `${currentPlayer.getGamesWon()} Win(s)`;
    };

    return {
        updateCurrentPlayerScore,
    };
})();


(() => {
    let gameBoardSquares = document.getElementsByClassName("game-board-square");
    Array.from(gameBoardSquares).forEach((eachSquare) => {
        eachSquare.addEventListener("click", function () {
            if(this.textContent != "") {
                return;
            }
            let currentSquareIndex = Number(this.getAttribute("data-index"));
            gameBoardUI.renderEachSquare(
                currentSquareIndex,
                allPlayers.getCurrentPlayer().getMark(),
            );
            allPlayers.changePlayer();
        });
    });
})();


(() => {
    let gameRestartBtn = document.getElementById("restart-game");
    gameRestartBtn.addEventListener("click", () => {
        gameBoard.resetGameBoard();
        gameBoardUI.render();
    });
})();


(() => {
    let nameEditBtns = document.getElementsByClassName("name-edit-btn");
    Array.from(nameEditBtns).forEach((eachBtn) => {
        eachBtn.addEventListener("click", function() {
            let playerName = this.parentElement.getElementsByClassName("player-name-text")[0];
            playerName.setAttribute("contenteditable", "true");
            playerName.focus();
        });
    });
})();


(() => {
    let playerNames = document.getElementsByClassName("player-name-text");
    Array.from(playerNames).forEach((eachPlayer) => {
        eachPlayer.addEventListener("keydown", function(e) {
            console.log(e.target.textContent.length);
            if(e.key != "Backspace" && e.target.textContent.length > 13) {
                e.preventDefault();
            }
            if(e.key === "Enter") {
                e.target.removeAttribute("contenteditable");
            }
        });
    });
})();


(() => {
    allPlayers.get().forEach((eachPlayer, playerIndex) => {
        let playerName = eachPlayer.getName();
        let playerMark = eachPlayer.getMark();
        let selector = `.player-info[data-player-index='${playerIndex}']`;

        let playerInfo = document.querySelector(selector);
        let name = playerInfo.getElementsByClassName("player-name-text")[0];
        let mark = playerInfo.getElementsByClassName("player-mark")[0];

        name.textContent = playerName;
        mark.textContent = playerMark;
    });
})();

(() => {
    let gameResultDialog = document.getElementById("game-result-popup");
    gameResultDialog.addEventListener("close", () => {
        gameBoard.resetGameBoard();
        gameBoardUI.render();
    });
})();
