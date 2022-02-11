const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "Edgar's Music PLayer";


// const element html
const playList = $(".playlist");
const heading = $("header h2");
const cdThump = $(".cd-thumb");
const cd = $(".cd");
const playBtn = $(".btn-toggle-play")
const audio = $("#audio");
const processBar = $("#progress")
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");


// config default
audio.volume = 0.6;

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,    

    // save config 
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

    // set config
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },

    // load config
    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
        this.currentIndex = this.config.indexSong;
    },

    songs: [
        {
            name: "Fight Back 👊 🔥",
            singer: "NEFFEX",
            path: "./assets/database/songs/FightBack.mp3",
            image: "./assets/database/img/FightBack.jpg"
        },
        {
            name: "Till I Let Go 🌙",
            singer: "NEFFEX",
            path: "./assets/database/songs/Till I Let Go.mp3",
            image: "./assets/database/img/Till I Let Go.png"
        },
        {
            name: "Pro 👠",
            singer: "NEFFEX",
            path: "./assets/database/songs/Pro.mp3",
            image: "./assets/database/img/Pro.jpg"
        },
        {
            name: "Cold ❄️",
            singer: "NEFFEX",
            path: "./assets/database/songs/Cold.mp3",
            image: "./assets/database/img/Cold.jpg"
        },
        {
            name: "Never Give Up ☝️",
            singer: "NEFFEX",
            path: "./assets/database/songs/NeverGiveUp.mp3",
            image: "./assets/database/img/NeverGiveUp.jpg"
        },        {
            name: "Things Are Gonna Get Better 👊",
            singer: "NEFFEX",
            path: "./assets/database/songs/ThingsAreGonnaGetBetter.mp3",
            image: "./assets/database/img/ThingsAreGonnaGetBetter.jpg"
        },
        {   
            name: "Let Me Down 🤘",
            singer: "NEFFEX",
            path: "./assets/database/songs/Let Me Down.mp3",
            image: "./assets/database/img/Let Me Down.jpg"
        },
    ],

    // get value from database (Local)
    // Loading 
    
    // define Obj
    defineProperties: function() {
        // khởi tạo this cho currentSong
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },

    // render song 
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}"">
                    <div class="thumb"style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `;
        });

        playList.innerHTML = htmls.join('');
    },

    // Load Current Song When Log into page
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThump.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    // Next/Prev
    nextSong: function() {
        this.currentIndex++;

        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }

        // sau khi currentIndex tăng 1
        // thì hàm hàm loadCurrentSong sẽ gọi lại currentIndex của đối tượng kế tiếp
        this.loadCurrentSong();
        this.render();
    },

    prevSong: function() {
        this.currentIndex--;

        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }

        // sau khi currentIndex tăng 1
        // thì hàm hàm loadCurrentSong sẽ gọi lại currentIndex của đối tượng kế tiếp
        this.loadCurrentSong();
        this.render();
    },

    // random song
    randomSong: function() {
        var randomCurent;
        do {
            randomCurent = Math.floor(Math.random() * (this.songs.length - 1));
        }while(randomCurent === this.currentIndex)

        this.currentIndex = randomCurent;
        this.loadCurrentSong();
        this.render();
    },

    // repeat song
    repeatSong: function() {
        this.loadCurrentSong();
        this.render();
    },

    // Scroll to Active Song
    scrollToActiveSong: function() {
        setTimeout(()=> {
            $(".song.active").scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }, 250)
    },

    // StartUp Process Button
    startUpProcess: function() {
        // load lại giao diện
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    },

    // Hanle Event
    handleEvents: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // Xử lí CD quay / dừng
        const cdThumpAnimate = cdThump.animate([{transform: 'rotate(360deg)'}], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumpAnimate.pause();

        // xử lý thu phóng image song khi scroll
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWitdh = cdWidth - scrollTop;

            // thay đổi kích thước của image song khi scroll
            cd.style.width = newCdWitdh > 0 ? newCdWitdh + 'px' : 0;
            cd.style.opacity = newCdWitdh / cdWidth;
        }

        // Play/Pause/Stop
        // xử lí thay đổi nút pause khi ấn vào nút play và ngược lại
        playBtn.addEventListener('click', () => {
            if(_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        })

        // khi song được playing
        audio.onplay = function() {
            _this.isPlaying = true;
            cdThumpAnimate.play();
            $(".player").classList.add('playing');
        }

        // khi song được plause
        audio.onpause = function() {
            _this.isPlaying = false;
            cdThumpAnimate.pause();
            $(".player").classList.remove('playing');
        }

        // khi process song thay đổi (Animation)
        audio.ontimeupdate = function() {
            const TimeUpdate = (audio.currentTime / audio.duration) * 100;
            if(audio.duration) {
                const ProcessCurrent = Math.floor(TimeUpdate); // làm tròn số thập phân
                processBar.value = ProcessCurrent;
            }
        }

        // Xử lí khi tua song
        processBar.onchange = function(e) {
            const PersentProcess = e.target.value;
            const seekTime = (audio.duration / 100) * PersentProcess;
            audio.currentTime = seekTime;
        }

        // xử lí sự kiện next song
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.randomSong();

            }else {
                _this.nextSong();
            }
            audio.play();
            _this.scrollToActiveSong()
        }

        // xử lí sự kiện prev song
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.randomSong();

            }else {
                _this.prevSong();
            }
            audio.play();
            _this.scrollToActiveSong()
        }

        // xử lí sự kiện bật tắt random song
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom); // save config
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        // xử lí sự kiện repeat bài hát
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat); // save config
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        // xử lí next song sau khi endsong
        audio.onended = function() {
            audio.style.value = 0;

            if(_this.isRepeat) {
                _this.repeatSong();
            } else {
                _this.nextSong();
            }

            setTimeout(() => {
                audio.play();
            }, 1000)
        }

        // lắng nghe hành vi click vào playlist
        playList.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            if(songNode || e.target.closest('.option')) {
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.setConfig('indexSong', _this.currentIndex)
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
            }
        }
    },

    // Start
    start: function() {
        // load config từ local Storage
        this.loadConfig();

        // định nghĩa các thuộc tính cho obj
        this.defineProperties(); // define Properties

        // lắng nghe / xử lí các sự kiện DOM Event
        this.handleEvents();

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();
    
        // Render lại playlist
        this.render();

        // Render lại các chi tiết nhỏ
        this.startUpProcess();
    },
}

app.start();