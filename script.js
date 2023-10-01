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

    const checkIfWinIdx = (idx) => (squares[idx] === currentPlayer.getMark());

    const checkGameResult = (idx, value) => {
       let winningPositions = allWinningPositions[idx];
       let i = 0;
       while(i < winningPositions.length) {
        if(checkIfWinIdx(winningPositions[i]) && checkIfWinIdx(winningPositions[i + 1])) {
            showGameResult(`${currentPlayer.getName()} wins!`);
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
    const getMark = () => playerMark;
    const playGame = () => ++totalGamesPlayed;
    const winGame = () => ++gamesWin;  
    const getTotalGamesPlayed = () => totalGamesPlayed;
    const getGamesWon = () => gamesWon;

    return {
        getName,
        getMark,
        getGamesWon,
        getTotalGamesPlayed,
        playGame,
        winGame,
    };
};


const players = [Player("Player 1", "O"), Player("Player 2", "X")];

let currentPlayer = ((allPlayers) => {
    let currentPlayerIndex = 0;
    let player = allPlayers[currentPlayerIndex];

    const getName = () => player.getName();
    const getMark = () => player.getMark();
    const changePlayer = () => {
        if(currentPlayerIndex >= allPlayers.length - 1) {
            currentPlayerIndex = 0;
        } else {
            currentPlayerIndex++;
        }
        player = allPlayers[currentPlayerIndex];
    };

    return {
        getName,
        getMark,
        changePlayer,
    }

})(players);


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
                currentPlayer.getMark(),
            );
            currentPlayer.changePlayer();
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
