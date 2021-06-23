// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAo4Na0QTmAiovJD6CdPf5gpQ5hYVEnfTs",
  authDomain: "chat-vuejs-a7058.firebaseapp.com",
  databaseURL: "https://chat-vuejs-a7058-default-rtdb.firebaseio.com",
  projectId: "chat-vuejs-a7058",
  storageBucket: "chat-vuejs-a7058.appspot.com",
  messagingSenderId: "529377433100",
  appId: "1:529377433100:web:144b6df980efdd5d630029",
};
// Initialize Firebase
const fire = firebase.initializeApp(firebaseConfig);
let provider = null;
let audiotick = new Audio("./public/audio/tick.mp3");
let finishGame = new Audio("./public/audio/finishGame.mp3");
new Vue({
  el: "#app",
  /*username : Biến dùng để nhận dữ liệu username
    showMessage : Biến dùng để nhận dữ liệu message do người chơi nhập thông qua input
    messages[] : Mảng dùng để chứa các message người chơi nhập và dùng for để hiện thị trên khung chat
    cards[] : Mảng cards chứa các phần tử (name, img) là dữ liệu gốc
    memoryCard[] : Mảng memoryCards chứa các pt từ mảng cards(x2) + hàm shuffle dùng để hiển thị làm dữ liệu màn chơi
    flippedCards[] : Mảng flippedCards dùng để chứa các pt mà người dùng click trên các card trên màn chơi (tối đa 2 pt)
    finish : Biến dùng để kiểm tra việc hoàn thành màn chơi
    start : Biến dùng để kiểm tra việc bắt đầu màn chơi
    turn : Biến dùng để hiển thị mỗi lượt click chọn của người chơi (click 2 card = 1 turn)
    totalTime : Đối tượng totalTime(minutes, seconds) dùng để hiển  thị thời gian chơi
    */
  data: {
    alertChat: "hide",
    login: localStorage.login === undefined ? 'true' : localStorage.login,
    selected: "1",
    isGameStarted: false,
    isGameEnded: false,
    computerHtml: '<i class="far fa-hand-paper"></i>',
    userPicked: 0,
    computerPicked: 0,
    whoWin: "",
    userWins: 0,
    computerWins: 0,
    result: "",
    rounds: 0,
    records: [],
    resultCssClass: "",
    showMiniGame: "optionsMiniGame",
    //Default Player start
    activePlayer: "x",
    //Arr cells
    cells: [null, null, null, null, null, null, null, null, null],
    //CountClicks >= 5(Check)
    countClicks: 0,
    //Arr win conditions
    winningConditions: [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ],
    //winner (Check in cells(Function Check Game))
    winner: null,
    turnsProfile: 0,
    totalTimeProfile: {
      minutes: 0,
      seconds: 0,
    },
    finishGameGif: false,
    soundEffect: true,
    soundtrack: true,
    canNotFind: "Can't find player",
    doesNotExist: false,
    namePlayer: "",
    arrPlayer: [],
    isFullPlayer: false,
    randomImg: false,
    numberOfPlayer: 3,
    createdAt: "",
    positionMessText: "",
    positionText: "",
    bestScore: null,
    linkImg: localStorage.login === undefined ? 'test link img' : localStorage.linkImg,
    rank: "",
    uid: localStorage.login === undefined ? 'test uid' : localStorage.uid,
    darkMode: false,
    show: "game",
    name: localStorage.login === undefined ? 'test user name' : localStorage.name,
    showMessage: "",
    messages: [],
    cards: [
      {
        name: "apple",
        img: "./public/images/apple.png",
      },
      {
        name: "banana",
        img: "./public/images/banana.png",
      },
      {
        name: "orange",
        img: "./public/images/orange.png",
      },
      {
        name: "pineapple",
        img: "./public/images/pineapple.png",
      },
      {
        name: "strawberry",
        img: "./public/images/strawberry.png",
      },
      {
        name: "watermelon",
        img: "./public/images/watermelon.png",
      }
    ],
    memoryCards: [],
    flippedCards: [],
    finish: false,
    start: false,
    turns: 0,
    totalTime: {
      minutes: 0,
      seconds: 0,
    },
    animate: true,
    isFullChat: false,
    partMessage: [],
    numberOfMess: 3,
    selectedLevel: "1",
    partCard: [],
    numberOfCard: 4
  },
  methods: {
    chooseLevel() {
      switch (this.selectedLevel) {
        case "1":
          this.numberOfCard = 4
          this.rdImg()
          break;
        case "2":
          this.numberOfCard = 5
          this.rdImg()
          break;
        case "3":
          this.numberOfCard = 6
          this.rdImg()
          break;
        default:
          break;
      }
    },
    loadMoreChat() {
      this.partMessage = this.messages.slice(0, this.numberOfMess)
      this.numberOfMess += 3
      if (this.partMessage.length == this.messages.length)
        this.isFullChat = true
    },
    setAlertChat() {
      this.alertChat = "hide"
    },
    showMiniGameOanTuXi() {
      this.showMiniGame = "game_oan_tu_xi";
    },
    //Restart game
    restart() {
      this.isGameStarted = false;
      this.isGameEnded = false;
      this.computerHtml = '<i class="far fa-hand-paper"></i>';
      this.userPicked = 0;
      this.computerPicked = 0;
      this.whoWin = "";
      this.userWins = 0;
      this.computerWins = 0;
      this.result = "";
      this.rounds = 0;
      this.records = [];
      this.resultCssClass = "";
    },
    //Random bao bua keo
    didPicked(picked) {
      this.userPicked = picked;
      let random_from_1_to_3 = Math.floor(Math.random() * 3) + 1; //bao ke bua
      this.computerPicked = random_from_1_to_3;
      //tao mot mang bao bua keo
      let symbolHtml = {
        1: "paper", //bao
        2: "peace", //Keo
        3: "rock", //Bua
      };
      //Thực hiện gan icon để may random
      this.computerHtml = `<i class="far fa-hand-${symbolHtml[random_from_1_to_3]}"></i>`;

      // Logic
      if (this.userPicked == this.computerPicked) {
        this.whoWin = "Hòa";
      } else {
        //Xét các trường hợp không bị hòa nhau
        switch (this.userPicked) {
          case 1:
            if (this.computerPicked == 2) {
              this.whoWin = "computer";
            } else {
              this.whoWin = "user";
            }

            break;

          case 2:
            //nếu máy bằng bua thì may se th
            if (this.computerPicked == 3) {
              this.whoWin = "computer";
            } else {
              this.whoWin = "user";
            }

            break;

          case 3:
            if (this.computerPicked == 1) {
              this.whoWin = "computer";
            } else {
              this.whoWin = "user";
            }

            break;

          default:
        }
      } // If
      this.rounds++;
    },
    changetypesort() {
      let vue = this;
      items = Array.prototype.slice.call(
        document.querySelectorAll(".one-person")
      );
      vue.doesNotExist = false;
      typesort = document.getElementById("items").value;
      let tbody = document.querySelector("tbody");
      if (typesort == "none") {
        items.sort(function (a, b) {
          let minutes1 = Number(a.querySelector(".minutes").innerText);
          let seconds1 = Number(a.querySelector(".seconds").innerText);
          let totaltime1 = minutes1 * 60 + seconds1;
          let minute2 = Number(b.querySelector(".minutes").innerText);
          let seconds2 = Number(b.querySelector(".seconds").innerText);
          let totaltime2 = minute2 * 60 + seconds2;
          let check = totaltime1 - totaltime2;
          if (check > 0) {
            return 1;
          } else if (check < 0) {
            return -1;
          } else if (check == 0) {
            let turn1 = Number(a.querySelector(".turn").innerText);
            let turn2 = Number(b.querySelector(".turn").innerText);
            let check2 = turn1 - turn2;
            if (check2 > 0) {
              return 1;
            } else {
              return -1;
            }
          }
        });
        tbody.innerHTML = "";
        items.forEach((element) => {
          tbody.appendChild(element);
        });
      } else if (typesort == "Minute") {
        let haveEqual = true;
        for (let index = 0; index < items.length; index++) {
          if (
            items[0].getElementsByTagName("td")[2].innerHTML !=
            items[index].getElementsByTagName("td")[2].innerHTML
          ) {
            haveEqual = false;
            break;
          }
        }
        if (haveEqual) {
          items.sort(function (a, b) {
            let minutes1 = Number(a.querySelector(".minutes").innerText);
            let seconds1 = Number(a.querySelector(".seconds").innerText);
            let totaltime1 = minutes1 * 60 + seconds1;
            let minute2 = Number(b.querySelector(".minutes").innerText);
            let seconds2 = Number(b.querySelector(".seconds").innerText);
            let totaltime2 = minute2 * 60 + seconds2;
            let check = totaltime1 - totaltime2;
            if (check < 0) {
              return 1;
            } else if (check > 0) {
              return -1;
            } else if (check == 0) {
              let turn1 = Number(a.querySelector(".turn").innerText);
              let turn2 = Number(b.querySelector(".turn").innerText);
              let check2 = turn1 - turn2;
              if (check2 > 0) {
                return 1;
              } else {
                return -1;
              }
            }
          });
          tbody.innerHTML = "";
          items.forEach((element) => {
            tbody.appendChild(element);
          });
        } else {
          items.sort(function (a, b) {
            return (
              Number(b.querySelector(".minutes").innerText) -
              Number(a.querySelector(".minutes").innerText)
            );
          });
          tbody.innerHTML = "";
          items.forEach((element) => {
            tbody.appendChild(element);
          });
        }
      } else if (typesort == "Seconds") {
        let haveEqual = true;
        for (let i = 0; i < items.length; i++) {
          let numperson1 = Number(
            items[0].getElementsByTagName("td")[3].innerText
          );
          let number2 = Number(
            items[i].getElementsByTagName("td")[3].innerText
          );
          if (numperson1 != number2) {
            haveEqual = false;

            break;
          }
        }
        if (haveEqual) {
          items.sort(function (a, b) {
            let minutes1 = Number(a.querySelector(".minutes").innerText);
            let seconds1 = Number(a.querySelector(".seconds").innerText);
            let totaltime1 = minutes1 * 60 + seconds1;
            let minute2 = Number(b.querySelector(".minutes").innerText);
            let seconds2 = Number(b.querySelector(".seconds").innerText);
            let totaltime2 = minute2 * 60 + seconds2;
            let check = totaltime1 - totaltime2;
            if (check < 0) {
              return 1;
            } else if (check > 0) {
              return -1;
            } else if (check == 0) {
              let turn1 = Number(a.querySelector(".turn").innerText);
              let turn2 = Number(b.querySelector(".turn").innerText);
              let check2 = turn1 - turn2;
              if (check2 > 0) {
                return 1;
              } else {
                return -1;
              }
            }
          });
          tbody.innerHTML = "";
          items.forEach((element) => {
            tbody.appendChild(element);
          });
        } else {
          items.sort(function (a, b) {
            return (
              Number(b.querySelector(".seconds").innerText) -
              Number(a.querySelector(".seconds").innerText)
            );
          });
          tbody.innerHTML = "";
          items.forEach((element) => {
            tbody.appendChild(element);
          });
        }
      } else if (typesort == "Turns") {
        let haveEqual = true;
        for (let i = 0; i < items.length; i++) {
          if (
            items[0].getElementsByTagName("td")[4].innerHTML !=
            items[i].getElementsByTagName("td")[4].innerHTML
          ) {
            haveEqual = false;
            break;
          }
        }
        if (haveEqual) {
          items.sort(function (a, b) {
            let minutes1 = Number(a.querySelector(".minutes").innerText);
            let seconds1 = Number(a.querySelector(".seconds").innerText);
            let totaltime1 = minutes1 * 60 + seconds1;
            let minute2 = Number(b.querySelector(".minutes").innerText);
            let seconds2 = Number(b.querySelector(".seconds").innerText);
            let totaltime2 = minute2 * 60 + seconds2;
            let check = totaltime1 - totaltime2;
            if (check < 0) {
              return 1;
            } else if (check > 0) {
              return -1;
            } else if (check == 0) {
              let turn1 = Number(a.querySelector(".turn").innerText);
              let turn2 = Number(b.querySelector(".turn").innerText);
              let check2 = turn1 - turn2;
              if (check2 > 0) {
                return 1;
              } else {
                return -1;
              }
            }
          });
          tbody.innerHTML = "";
          items.forEach((element) => {
            tbody.appendChild(element);
          });
        } else {
          items.sort(function (a, b) {
            return (
              Number(b.querySelector(".turn").innerText) -
              Number(a.querySelector(".turn").innerText)
            );
          });
          tbody.innerHTML = "";
          items.forEach((element) => {
            tbody.appendChild(element);
          });
        }
      }
    },
    backToOptionsMiniGameScreen() {
      this.showMiniGame = "optionsMiniGame";
    },
    showMiniGameTicTacToe() {
      this.showMiniGame = "game_tic_tac_toe";
    },
    //Function Fill in Cell
    //Function Fill in Cell
    fillInCell(id) {
      let cellName = "cell_" + id;
      let cell = document.querySelector("#" + cellName);
      if (this.cells[id] == null) {
        this.countClicks += 1;
        if (this.activePlayer == "x")
          cell.innerHTML = "<i class='fas fa-times' style = 'color:#545454'></i>";
        else
          cell.innerHTML = "<i class='far fa-circle' style = 'color:#f2ebd3'></i>";
        this.cells[id] = this.activePlayer;
        this.activePlayer = (this.activePlayer == "x") ? "o" : "x";
        if (this.countClicks >= 5)
          this.checkGame();
      }
    },
    //Function Check Game
    checkGame() {
      for (let i = 0; i < this.winningConditions.length; i++) {
        let winningCondition = this.winningConditions[i];
        let a = this.cells[winningCondition[0]];
        let b = this.cells[winningCondition[1]];
        let c = this.cells[winningCondition[2]];
        if (a == null || b == null || c == null)
          continue;
        //Case Win
        if (a == b && b == c) {
          if (b == 'x') {
            this.xWin += 1;
          } else {
            this.oWin += 1;
          }
          this.winner = b;
          break;
        }
      }
      let el = document.querySelector("#result-overlay");
      if (this.winner) {
        el.style.display = "block";
      }
      else {
        //Case Draw
        if (this.countClicks == 9) {
          this.winner = "draw"
          el.style.display = "block";
        }
      }
    },
    //Function btn Replay
    replay() {
      let el = document.querySelector("#result-overlay");
      el.style.display = "none";
      //
      this.countClicks = 0;
      this.winner = null;
      this.cells = [null, null, null, null, null, null, null, null, null];
      this.activePlayer = "x";
      for (let i = 0; i <= 8; i++) {
        let cellName = "cell_" + i;
        let cell = document.querySelector("#" + cellName);
        cell.innerHTML = "";
      }
      let p = document.querySelector("#p-overlay");
      p.innerHTML;
    },
    showBuy() {
      this.show = "buy";
    },
    findPlayer() {
      let vue = this;
      vue.rank = ""
      let showDataToTable = null;
      vue.arrPlayer.forEach((val) => {
        if (val[1].name.indexOf(vue.namePlayer) != -1) {
          // showDataToTable = val[1];
          // return;
          vue.rank += `<tr><td style="line-height: 75px !important;"> <img src="${val[1].linkImg}" style="border-radius: 5px;"></td> <td style="line-height: 75px !important; ">${val[1].name}</td> 
      <td style="line-height: 75px !important; ">${val[1].totalTime.minutes}</td> <td style="line-height: 75px !important; ">${val[1].totalTime.seconds}</td >
      <td style="line-height: 75px !important; ">${val[1].turns} </td>
       </tr>`;
        }
      });
      // if (showDataToTable !== null) {
      //   vue.doesNotExist = false;

      // } else {
      //   vue.doesNotExist = true;
      // }
    },
    loadMoreRank() {
      this.numberOfPlayer += 3;
      this.showRank();
    },
    async addAndUpdateResult() {
      let vue = this;
      let totalTime = await fire
        .database()
        .ref(`player/${this.uid}/totalTime`)
        .get();
      totalTime = totalTime.val();
      if (vue.totalTime.minutes <= totalTime.minutes)
        if (vue.totalTime.seconds < totalTime.seconds) {
          fire.database().ref(`player/${this.uid}/turns`).set(this.turns);
          fire
            .database()
            .ref(`player/${this.uid}/totalTime`)
            .set(this.totalTime);
        }
    },
    switchSoundEffect() {
      this.soundEffect = !this.soundEffect;
      fire
        .database()
        .ref(`player/${this.uid}/soundEffect`)
        .set(this.soundEffect);
    },
    switchSoundtrack() {
      let vue = this;
      vue.soundtrack = !vue.soundtrack;
      fire.database().ref(`player/${vue.uid}/soundtrack`).set(vue.soundtrack);
      if (vue.soundtrack) {
        vue.playAudio();
      } else {
        vue.pauseAudio();
      }
    },
    switchAnimate() {
      this.animate = !this.animate;
      fire.database().ref(`player/${this.uid}/animate`).set(this.animate);
    },
    switchDarkMode() {
      this.darkMode = !this.darkMode;
      fire.database().ref(`player/${this.uid}/darkMode`).set(this.darkMode);
    },
    rdImg() {
      let vue = this;
      if (vue.randomImg) {
        vue.cards.forEach((card) => {
          let rd = Math.floor(Math.random() * 1000);
          card.img = `https://picsum.photos/500/700?random=${rd}`; //kiếm hình ảnh để random
        })
        vue.partCard = _.cloneDeep(vue.cards).slice(0, vue.numberOfCard)
      } else {
        vue.partCard = [
          {
            name: "apple",
            img: "./public/images/apple.png",
          },
          {
            name: "banana",
            img: "./public/images/banana.png",
          },
          {
            name: "orange",
            img: "./public/images/orange.png",
          },
          {
            name: "pineapple",
            img: "./public/images/pineapple.png",
          },
          {
            name: "strawberry",
            img: "./public/images/strawberry.png",
          },
          {
            name: "watermelon",
            img: "./public/images/watermelon.png",
          }
        ].slice(0, vue.numberOfCard)
      }
      vue.reset();
    },
    switchRandomImg() {
      this.randomImg = !this.randomImg;
      this.rdImg();
      fire.database().ref(`player/${this.uid}/randomImg`).set(this.randomImg);
    },
    showAbout() {
      this.show = "about";
    },
    showSetting() {
      this.show = "setting";
    },
    showChat() {
      this.show = "chat";
    },
    showGame() {
      this.show = "game";
      this.reset();
    },
    showOptionsMiniGame() {
      this.show = "miniGame";
    },
    showRank() {
      this.show = "rank";
      let b = "";
      let vue = this;
      vue.doesNotExist = false;
      firebase.database().ref("player").get().then(function (dataSnapshot) {
        vue.arrPlayer = Object.entries(dataSnapshot.val());
        a = vue.arrPlayer;
        //sort by totalTime
        let temp = 0;
        let minutes = 0;
        let seconds = 0;
        let totalTime = 0,
          totalTimee = 0;
        for (let i = 0; i < a.length - 1; i++)
          for (let j = i + 1; j < a.length; j++) {
            turns = a[i][1].turns;
            minutes = a[i][1].totalTime.minutes;
            seconds = a[i][1].totalTime.seconds;
            totalTime = minutes * 60 + seconds;
            turns = a[j][1].turns;
            minutes = a[j][1].totalTime.minutes;
            seconds = a[j][1].totalTime.seconds;
            totalTimee = minutes * 60 + seconds;
            if (totalTime > totalTimee) {
              temp = a[i];
              a[i] = a[j];
              a[j] = temp;
            }
            if (totalTime == totalTimee) {
              if (a[i][1].turns > a[j][1].turns) {
                temp = a[i];
                a[i] = a[j];
                a[j] = temp;
              }
            }
          }
        //show player
        if (vue.numberOfPlayer > a.length) {
          vue.numberOfPlayer = a.length;
        }
        if (vue.numberOfPlayer == a.length) {
          vue.isFullPlayer = true;
        }
        for (let i = 0; i < vue.numberOfPlayer; i++) {
          b += `<tr class = "one-person" ><td style="line-height: 75px !important;"> <img src="${a[i][1].linkImg}" style="border-radius: 5px;"></td> <td style="line-height: 75px !important; ">${a[i][1].name}</td> 
            <td class="minutes" style="line-height: 75px !important; ">${a[i][1].totalTime.minutes}</td> <td class="seconds" style="line-height: 75px !important; ">${a[i][1].totalTime.seconds}</td>
            <td class="turn" style="line-height: 75px !important; ">${a[i][1].turns} </td>
             </tr>`;
        }
        vue.rank = b;
      });
    },
    showProfile() {
      this.show = "profile";
      let vue = this;
      firebase.database().ref(`player/${vue.uid}`).get().then((data) => {
        vue.turnsProfile = data.val().turns;
        vue.totalTimeProfile.minutes = data.val().totalTime.minutes;
        vue.totalTimeProfile.seconds = data.val().totalTime.seconds;
      })
        .catch((error) => {
          console.log(error);
        });
    },
    btnLogout() {
      //localStorage
      localStorage.login = 'true'
      location.reload();
    },
    playAudio() {
      let vue = this;
      if (vue.audio == undefined) {
        vue.audio.play();
        vue.audio.loop = true;
      } else {
        vue.audio.play();
        vue.audio.loop = true;
      }
    },
    pauseAudio() {
      let vue = this;
      if (vue.audio != undefined) vue.audio.pause();
    },
    loginFbAndGg(s) {
      let vue = this;
      if (s === "gg") provider = new firebase.auth.GoogleAuthProvider();
      if (s === "fb") provider = new firebase.auth.FacebookAuthProvider();
      if (s === "github") provider = new firebase.auth.GithubAuthProvider();
      if (s === "yahoo")
        provider = new firebase.auth.OAuthProvider("yahoo.com");
      firebase.auth().signInWithPopup(provider).then(async function (result) {
        // The signed-in user info.
        user = result.user;
        vue.login = 'false'
        if (user.displayName == null) vue.name = "Anonymous player";
        else vue.name = user.displayName;
        vue.uid = user.uid;
        vue.linkImg = user.photoURL;
        //localStorage
        localStorage.login = 'false';
        localStorage.name = vue.name
        localStorage.uid = vue.uid
        localStorage.linkImg = vue.linkImg
        //
        let data = await firebase.database().ref(`player/${vue.uid}`).get();
        if (data.val() == null) {
          fire.database().ref(`player/${vue.uid}/name`).set(vue.name);
          fire.database().ref(`player/${vue.uid}/turns`).set(9999);
          fire.database().ref(`player/${vue.uid}/totalTime`).set({
            minutes: 9999,
            seconds: 9999,
          });
          fire.database().ref(`player/${vue.uid}/linkImg`).set(vue.linkImg);
          fire.database().ref(`player/${vue.uid}/darkMode`).set(false);
          fire.database().ref(`player/${vue.uid}/randomImg`).set(false);
          fire.database().ref(`player/${vue.uid}/animate`).set(true);
          fire.database().ref(`player/${vue.uid}/soundtrack`).set(true);
          vue.playAudio();
          fire.database().ref(`player/${vue.uid}/soundEffect`).set(true);
        } else {
          firebase.database().ref(`player/${vue.uid}/darkMode`).get().then((data) => {
            vue.darkMode = data.val();
          });
          firebase.database().ref(`player/${vue.uid}/randomImg`).get().then((data) => {
            vue.randomImg = data.val();
            vue.rdImg();
          });
          firebase.database().ref(`player/${vue.uid}/animate`).get().then((data) => {
            vue.animate = data.val();
          });
          firebase.database().ref(`player/${vue.uid}/soundtrack`).get().then((data) => {
            vue.soundtrack = data.val();
            if (vue.soundtrack) {
              vue.playAudio();
            } else {
              vue.pauseAudio();
            }
          });
          firebase.database().ref(`player/${vue.uid}/soundEffect`).get().then((data) => {
            vue.soundEffect = data.val();
          });
        }
      })
        .catch(function (error) {
          console.log(error);
        });
    },
    playSoundEffect(isPlay) {
      if (isPlay)
        setTimeout(() => {
          audiotick.play();
          setTimeout(() => {
            audiotick.pause();
            audiotick.currentTime = 0;
          }, 300);
        }, 5);
    },
    /*Hàm send message
    Với Text là input(showMessage) và name*/
    sendMessage() {
      if (this.showMessage != "") {
        const message = {
          id: this.uid,
          linkImg: this.linkImg,
          text: this.showMessage,
          name: this.name,
          createdAt: moment().format("LLL"),
        };
        fire
          .database()
          /*Truy cập tới DOM message thông qua hàm ref
          Và dùng hàm push để đưa phần const message vào mảng message và dùng for để hiển thị */
          .ref("messages")
          .push(message);
        /*Gán showMessage lại bằng ""*/
        this.showMessage = "";
      } else {
        this.alertChat = "show"
      }
      const allMessage = document.querySelector(".all-message")
      allMessage.scrollTop = allMessage.scrollTo(0, 0)
    },
    /*Hàm flipCard dùng để gán biến isFlipped = true (Đang lật) 
    Với tham số truyền vào là card vừa click*/
    // xin phép đóng hàm này vì nó trùng và hình như là ko đụng gì tới hàm này luôn
    // flipCard(card) {
    //   card.isFlipped = true;

    // },

    /*Hàm reset được gọi khi ấn button Restart
     */
    reset() {
      clearInterval(this.interval);
      /*Gán isFlipped(Đang lật), isMatched(Trùng nhau) của tất cả các card thông qua mảng card bằng false*/
      this.partCard.forEach((card) => {
        Vue.set(card, "isFlipped", false);
        Vue.set(card, "isMatched", false);
      });

      /*Gán lại thông số ban đầu để bắt đầu lại màn chơi mới*/
      setTimeout(() => {
        /*set mảng memoryCards bằng rỗng*/
        this.memoryCards = [];

        /*Đặt lại mảng memoryCard
        Hàm shuffle để xáo trộn các phần tử card trong mảng memoryCard
        Hàm cloneDeep để sao chép mảng card
        Hàm concat để nối 2 mảng card vừa sao chép vào mảng memoryCard*/
        this.memoryCards = _.shuffle(
          this.memoryCards.concat(
            _.cloneDeep(this.partCard),
            _.cloneDeep(this.partCard)
          )
        );

        /*Set totalTime(minute và second) lại băng 0*/
        this.totalTime.minutes = 0;
        this.totalTime.seconds = 0;

        /*Gán biến start và finish bằng false
        Biến finish để làm điều kiện hiển thị style(badge-success || badge-light) cho biến turn
        Biến start để làm điều kiện (disabled) cho phép click button Restart*/
        this.start = false;
        this.finish = false;

        /*Gán biến turns bằng 0*/
        this.turns = 0;

        /*Gán mảng fiippedCards bằng rỗng*/
        this.flippedCards = [];
      }, 600);
    },

    // Hàm này dùng để start game
    // Đặt biến cho hàm setInterval -> để lát gọi mà xóa
    // Và hàm setInterval() là hàm thực hiện cái hàm tick sau 1s thời gian chờ
    _startGame() {
      this._tick();
      this.interval = setInterval(this._tick, 1000);
      this.start = true;
    },

    // Hàm tick này chỉ đơn giản là đếm thời gian thôi -> nếu thời gian !=59 thì cho chạy giây tiếp nếu = thì phút++
    // Còn giây cho về = 0
    _tick() {
      if (this.totalTime.seconds !== 59) {
        this.totalTime.seconds++;
        return;
      }
      this.totalTime.minutes++;
      this.totalTime.seconds = 0;
    },

    /*Hàm flipCard được gọi khi click vào card trên màn chơi với tham số truyền vào là card tương ứng*/
    flipCard(card) {
      if (card.isMatched || card.isFlipped || this.flippedCards.length === 2)
        return;

      /*Nếu biến start bằng true thì gọi hàm startGame()*/
      if (!this.start) {
        this._startGame();
      }

      card.isFlipped = true;
      // Khi bấm vào card bất kì nó tạo ra cái Audio và đưa link vào
      // t lồng 2 cái settimeout vì sau 1s nó chạy cái nhạc lên
      // thì tới cái settimeout bên trong cũng sau 1s nó dừng nhạc và cho thời gian chạy về =0 -> coi như bắt đầuo
      this.playSoundEffect(this.soundEffect);

      /*Nếu mảng flippedCards.length < 2 thì push card vừa click vào mảng*/
      if (this.flippedCards.length < 2) this.flippedCards.push(card);

      /*Nếu mảng flippedCards.length = 2 thì thì gọi hàm _match(card vừa click)*/
      if (this.flippedCards.length === 2) this._match(card);
    },
    playSoundFinishGame(play) {
      if (play) {
        finishGame.play();
      }
    },
    // Nếu như 2 card giống nhau ấy thì nó sẽ đặt biến isMatched của 2 card này là true
    // Nếu như tất cả các card đều dc nối thì nó sẽ dừng đếm thời gian và đặt biến isfinish = true
    _match(card) {
      /*Biến turns += 1*/
      this.turns++;

      let vue = this;

      /*Kiểm tra mảng flippedCards gồm 2 card
      Nếu (object)card(1) == (object)card(2)
      Thì gán cho 2 phần tử thuộc tính isMatched bằng true và gán mảng flippedCards bằng rỗng*/
      if (this.flippedCards[0].name === this.flippedCards[1].name) {
        setTimeout(() => {
          this.flippedCards.forEach((card) => (card.isMatched = true));
          this.flippedCards = [];

          //Nếu tất cả các card trong mảng memoryCard đều có thuộc tính isMatched bằng true
          if (this.memoryCards.every((card) => card.isMatched === true)) {
            /*Dừng đếm thời gian*/
            clearInterval(this.interval);

            /*Đặt biến finish bằng true*/
            this.finish = true;
            //chạy nhạc kết thúc game
            this.playSoundFinishGame(this.soundEffect);
            //chạy hiệu ứng bóng bay kết thúc game trong 1.5s
            this.finishGameGif = true;
            setTimeout(() => {
              vue.finishGameGif = false;
            }, 1500);
          }
        }, 400);
      } else {
        /*Nếu (object)card(1) != (object)card(2)
        Thì gán cho 2 phần tử thuộc tính isFlipped bằng false và gán mảng flippedCards bằng rỗng*/
        setTimeout(() => {
          this.flippedCards.forEach((card) => {
            card.isFlipped = false;
          });
          this.flippedCards = [];
        }, 800);
      }
    },
  },
  // Hook của Vuejs khi khởi tạo nó thì nó gọi hàm này
  created() {
    this.reset();
    this.audio = new Audio("./public/audio/soundtrack.mp3");
    let vue = this
    if (vue.login == 'false') {
      vue.name = localStorage.name
      vue.uid = localStorage.uid
      vue.linkImg = localStorage.linkImg
      firebase.database().ref(`player/${vue.uid}/darkMode`).get().then((data) => {
        vue.darkMode = data.val();
      });
      firebase.database().ref(`player/${vue.uid}/randomImg`).get().then((data) => {
        vue.randomImg = data.val();
        vue.rdImg();
      });
      firebase.database().ref(`player/${vue.uid}/animate`).get().then((data) => {
        vue.animate = data.val();
      });
      firebase.database().ref(`player/${vue.uid}/soundtrack`).get().then((data) => {
        vue.soundtrack = data.val();
        if (vue.soundtrack) {
          vue.playAudio();
        } else {
          vue.pauseAudio();
        }
      });
      firebase.database().ref(`player/${vue.uid}/soundEffect`).get().then((data) => {
        vue.soundEffect = data.val();
      });
    }
  },
  /*format hiển thị thời gian chơi*/
  computed: {
    sec() {
      /*Nếu seconds < 10
      Thì return thêm 0 phía trước (0 + (1..9))*/
      if (this.totalTime.seconds < 10) {
        return "0" + this.totalTime.seconds;
      }

      /*Nếu seconds > 10
      Thì return về seconds*/
      return this.totalTime.seconds;
    },
    min() {
      /*Nếu min < 10
      Thì return thêm 0 phía trước (0 + (1..9))*/
      if (this.totalTime.minutes < 10) {
        return "0" + this.totalTime.minutes;
      }

      /*Nếu min > 10
      Thì return về min*/
      return this.totalTime.minutes;
    },
  },
  mounted() {
    let vue = this;
    const itemsRef = fire.database().ref("messages");
    itemsRef.on("value", (snapshot) => {
      let data = snapshot.val();
      let messages = [];
      Object.keys(data).forEach((key) => {
        if (data[key].id === vue.uid) {
          messages.unshift({
            name: data[key].name,
            text: data[key].text,
            createdAt: moment(data[key].createdAt, "LLL").fromNow(),
            linkImg: data[key].linkImg,
            positionMessText: "message-text-right",
            positionText: "text-right img-and-name-right",
          });
        } else {
          messages.unshift({
            name: data[key].name,
            text: data[key].text,
            createdAt: moment(data[key].createdAt, "LLL").fromNow(),
            linkImg: data[key].linkImg,
            positionMessText: "message-text-left",
            positionText: "text-left img-and-name-left",
          });
        }
      });
      vue.messages = messages;
      vue.partMessage = vue.messages.slice(0, vue.numberOfMess)
      if (vue.partMessage.length == vue.messages.length)
        vue.isFullChat = true
      //
      vue.partCard = vue.cards.slice(0, vue.numberOfCard)
    });
  },
  watch: {
    //Hien thi qua trinh choi
    rounds: function () {
      //Nếu người dùng thắng thì phương thức sẻ trả lại chiều dài mảng
      if (this.whoWin == "user") {
        this.records.unshift({
          message: "Bạn thắng rồi nha!!!",
          type: "win",
        });
        //Tang diểm khi người dùng thắng
        this.userWins++;

        // Và ngược lại đối với máy
      } else if (this.whoWin == "computer") {
        this.records.unshift({
          message: "Máy thắng rồi nè!!!",
          type: "win",
        });

        this.computerWins++;
      } else if (this.whoWin == "Hòa") {
        this.records.unshift({
          message: "Hòa rồi nha!!",
          type: "Hòa",
        });
      }
      //Nếu người dùng mà lớn 2 hoặc bằng 2 thì xem như người chơi chiến thắng và end game
      if (this.userWins >= 2) {
        this.result = "Người chơi chiến thắng!!!";
        this.isGameEnded = true;

        //Và Ngược lại với máy
      } else if (this.computerWins >= 2) {
        this.result = "Máy đã chiến  thắng";
        this.isGameEnded = true;
      }
    },
  },
});
$(document).ready(function () {
  $("#app").show();
  $("#msg").hide();
  $(window).scroll(function () {
    if ($(this).scrollTop() > 50) {
      $("#back-to-top").fadeIn();
    } else {
      $("#back-to-top").fadeOut();
    }
  });
  // scroll body to 0px on click
  $("#back-to-top").click(function () {
    $("body,html").animate(
      {
        scrollTop: 0,
      },
      400
    );
    return false;
  });
});
