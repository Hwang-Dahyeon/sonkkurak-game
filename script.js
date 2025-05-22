<script>
    // 점수 변수 초기화
    let score = 0;
    let lastClickTime = 0;
    let clickTimestamps = [];
    let suspiciousClicks = 0;
    const maxSuspiciousClicks = 5;

    // 사용자 식별 정보
    let userName = '';
    let userGrade = '';
    let userClass = '';

    // DOM 요소 가져오기
    const coinButton = document.getElementById('coinButton');
    const scoreDisplay = document.getElementById('score');
    const startButton = document.getElementById('startButton');
    const gradeInput = document.getElementById('grade');
    const classInput = document.getElementById('class');
    const nameInput = document.getElementById('name');
    const userInfoDiv = document.getElementById('userInfo');
    const gameDiv = document.getElementById('game');

    // 패턴 기반 오토마우스 감지 함수
    function detectAutoClicker(now) {
        clickTimestamps.push(now);
        if (clickTimestamps.length > 10) clickTimestamps.shift();

        if (clickTimestamps.length < 10) return; // 아직 데이터 부족

        const intervals = clickTimestamps.slice(1).map((time, i) => time - clickTimestamps[i]);

        const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const stdDev = Math.sqrt(intervals.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / intervals.length);

        const isFast = avg < 120;
        const isConsistent = stdDev < 10;

        if (isFast && isConsistent) {
            suspiciousClicks++;
            if (suspiciousClicks >= maxSuspiciousClicks) {
                alert("경고 누적! 기존의 데이터를 모두 삭제하고 사이트에서 퇴장 조치합니다.");
                if (userGrade && userClass && userName) {
                    const userKey = `${userGrade}_${userClass}_${userName}`;
                    firebase.database().ref("scores/" + userKey).remove();
                }
                window.location.href = "https://google.com";
            } else {
                alert(`⚠️ 경고! 너무 빠르고 일정한 클릭 패턴이 감지되었습니다.\n오토마우스 의심 ${suspiciousClicks}/${maxSuspiciousClicks}`);
            }
        } else {
            suspiciousClicks = 0;
        }
    }

    // 학년, 반, 이름 입력받고 게임 시작
    startButton.addEventListener('click', function () {
        userGrade = gradeInput.value;
        userClass = classInput.value;
        userName = nameInput.value.trim();

        if (userGrade && userClass && userName) {
            localStorage.setItem('userGrade', userGrade);
            localStorage.setItem('userClass', userClass);
            localStorage.setItem('userName', userName);

            userInfoDiv.style.display = 'none';
            gameDiv.style.display = 'block';
            alert(`${userGrade}학년 ${userClass}반 ${userName}님, 게임 시작!`);
        } else {
            alert("학년과 반, 이름을 입력하세요.");
        }
    });

    // 코인 클릭 시 점수 증가 및 오토마우스 감지
    coinButton.addEventListener('click', function () {
        const now = Date.now();
        lastClickTime = now;
        detectAutoClicker(now);

        score += 1;
        scoreDisplay.textContent = score;
    });
</script>
