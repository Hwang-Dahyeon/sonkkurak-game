// 점수 변수 초기화
let score = 0;

// DOM 요소 가져오기
const coinButton = document.getElementById('coinButton');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('startButton');
const gradeInput = document.getElementById('grade');
const classInput = document.getElementById('class');
const userInfoDiv = document.getElementById('userInfo');
const gameDiv = document.getElementById('game');

// 학년, 반 이름 입력받고 게임 시작
startButton.addEventListener('click', function() {
    const grade = gradeInput.value;
    const className = classInput.value;

    if (grade && className) {
        // 입력 값이 있으면 게임 시작
        userInfoDiv.style.display = 'none';  // 학년, 반 입력창 숨기기
        gameDiv.style.display = 'block';     // 게임 화면 보이기
        alert(`${grade}학년 ${className}반 게임 시작!`);
    } else {
        alert("학년과 반을 입력하세요.");
    }
});

// 코인 클릭 시 점수 증가
coinButton.addEventListener('click', function() {
    score += 1; // 점수 1 증가
    scoreDisplay.textContent = score; // 화면에 점수 표시
});
