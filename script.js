// 关卡数据
const levels = [
    {
        pairs: 5,
        words: [
            { chinese: "苹果", english: "apple" },
            { chinese: "猫", english: "cat" },
            { chinese: "狗", english: "dog" },
            { chinese: "书", english: "book" },
            { chinese: "汽车", english: "car" }
        ],
        layout: "2" // 第1关使用2列布局
    },
    {
        pairs: 7,
        words: [
            { chinese: "大象", english: "elephant" },
            { chinese: "长颈鹿", english: "giraffe" },
            { chinese: "电脑", english: "computer" },
            { chinese: "老师", english: "teacher" },
            { chinese: "医院", english: "hospital" },
            { chinese: "香蕉", english: "banana" },
            { chinese: "山", english: "mountain" }
        ],
        layout: "3" // 第2关使用3列布局
    },
    {
        pairs: 9,
        words: [
            { chinese: "蝴蝶", english: "butterfly" },
            { chinese: "图书馆", english: "library" },
            { chinese: "餐厅", english: "restaurant" },
            { chinese: "电话", english: "telephone" },
            { chinese: "自行车", english: "bicycle" },
            { chinese: "海洋", english: "ocean" },
            { chinese: "巧克力", english: "chocolate" },
            { chinese: "大象", english: "elephant" },
            { chinese: "卧室", english: "bedroom" }
        ],
        layout: "3" // 第3关使用3列布局
    },
    {
        pairs: 11,
        words: [
            { chinese: "袋鼠", english: "kangaroo" },
            { chinese: "望远镜", english: "telescope" },
            { chinese: "火山", english: "volcano" },
            { chinese: "直升机", english: "helicopter" },
            { chinese: "菠萝", english: "pineapple" },
            { chinese: "章鱼", english: "octopus" },
            { chinese: "日历", english: "calendar" },
            { chinese: "雨伞", english: "umbrella" },
            { chinese: "龙", english: "dragon" },
            { chinese: "彩虹", english: "rainbow" },
            { chinese: "吉他", english: "guitar" }
        ],
        layout: "4" // 第4关使用4列布局
    },
    {
        pairs: 13,
        words: [
            { chinese: "犀牛", english: "rhinoceros" },
            { chinese: "显微镜", english: "microscope" },
            { chinese: "水族馆", english: "aquarium" },
            { chinese: "潜水艇", english: "submarine" },
            { chinese: "墨镜", english: "sunglasses" },
            { chinese: "地震", english: "earthquake" },
            { chinese: "铁路", english: "railway" },
            { chinese: "榴莲", english: "durian" },
            { chinese: "海星", english: "starfish" },
            { chinese: "成功的", english: "successful" },
            { chinese: "蘑菇", english: "mushroom" },
            { chinese: "例子", english: "example" },
            { chinese: "提醒", english: "remind" }
        ],
        layout: "5" // 第5关使用5列布局
    }
];

let currentLevel = 0;
let score = 0;
let time = 0;
let timerInterval;
let selectedChineseCard = null;
let selectedEnglishCard = null;

// 打乱数组顺序
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 初始化游戏
function startGame() {
    currentLevel = 0;
    score = 0;
    time = 0;
    document.getElementById("score").textContent = score;
    document.getElementById("timer").textContent = time;
    document.getElementById("start-button").classList.add("hidden");
    document.getElementById("next-level-button").classList.add("hidden");
    loadLevel();
    startTimer();
}

// 加载关卡
function loadLevel() {
    const level = levels[currentLevel];
    const words = level.words;

    // 打乱中文卡片的顺序
    const shuffledChinese = shuffleArray(words.map(word => word.chinese));
    // 打乱英文卡片的顺序
    const shuffledEnglish = shuffleArray(words.map(word => word.english));

    // 清空卡片
    const chineseCards = document.getElementById("chinese-cards");
    const englishCards = document.getElementById("english-cards");
    chineseCards.innerHTML = "";
    englishCards.innerHTML = "";

    // 设置布局
    const gameBoard = document.querySelector(".game-board");
    gameBoard.style.gridTemplateColumns = `repeat(${level.layout}, 1fr)`;

    // 创建中文卡片
    shuffledChinese.forEach((chinese, index) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.textContent = chinese;
        card.dataset.index = index;
        card.addEventListener("click", () => selectCard(card, "chinese"));
        chineseCards.appendChild(card);
    });

    // 创建英文卡片
    shuffledEnglish.forEach((english, index) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.textContent = english;
        card.dataset.index = index;
        card.addEventListener("click", () => selectCard(card, "english"));
        englishCards.appendChild(card);
    });
}

// 选择卡片
function selectCard(card, type) {
    if (card.classList.contains("matched")) return;

    if (type === "chinese") {
        if (selectedChineseCard) selectedChineseCard.classList.remove("selected");
        selectedChineseCard = card;
        card.classList.add("selected");
    } else if (type === "english") {
        if (selectedEnglishCard) selectedEnglishCard.classList.remove("selected");
        selectedEnglishCard = card;
        card.classList.add("selected");
    }

    // 检查是否匹配
    if (selectedChineseCard && selectedEnglishCard) {
        checkMatch();
    }
}

// 检查是否匹配
function checkMatch() {
    const chineseText = selectedChineseCard.textContent;
    const englishText = selectedEnglishCard.textContent;

    // 找到对应的中英文词汇
    const matchedWord = levels[currentLevel].words.find(
        word => word.chinese === chineseText && word.english === englishText
    );

    if (matchedWord) {
        selectedChineseCard.classList.add("matched");
        selectedEnglishCard.classList.add("matched");
        score += 10;
        document.getElementById("score").textContent = score;

        // 检查是否完成关卡
        if (document.querySelectorAll(".card.matched").length === levels[currentLevel].pairs * 2) {
            endLevel();
        }
    } else {
        setTimeout(() => {
            selectedChineseCard.classList.remove("selected");
            selectedEnglishCard.classList.remove("selected");
        }, 1000);
    }

    selectedChineseCard = null;
    selectedEnglishCard = null;
}

// 结束关卡
function endLevel() {
    clearInterval(timerInterval);
    document.getElementById("message").textContent = `恭喜你通过了第${currentLevel + 1}关！`;
    document.getElementById("next-level-button").classList.remove("hidden");
}

// 下一关
function nextLevel() {
    currentLevel++;
    if (currentLevel < levels.length) {
        document.getElementById("message").textContent = "";
        document.getElementById("next-level-button").classList.add("hidden");
        loadLevel();
        startTimer();
    } else {
        document.getElementById("message").textContent = "恭喜你完成了所有关卡！";
        document.getElementById("next-level-button").classList.add("hidden");
    }
}

// 计时器
function startTimer() {
    time = 0;
    timerInterval = setInterval(() => {
        time++;
        document.getElementById("timer").textContent = time;
    }, 1000);
}