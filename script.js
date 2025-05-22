<script>
  // 점수 및 클릭 관련 변수 초기화
  let score = 0;
  let lastClickTime = 0;
  let clickTimestamps = [];
  let clickPositions = [];
  let suspiciousClicks = 0;
  const maxSuspiciousClicks = 5;

  // 사용자 정보
  let userName = '';
  let userGrade = '';
  let userClass = '';

  // 마우스 이동 추적
  let lastMouseMoveTime = Date.now();

  // DOM 요소
  const coinButton = document.getElementById('coinButton');
  const scoreDisplay = document.getElementById('score');
  const startButton = document.getElementById('startButton');
  const gradeInput = document.getElementById('grade');
  const classInput = document.getElementById('class');
  const nameInput = document.getElementById('name');
  const userInfoDiv = document.getElementById('userInfo');
  const gameDiv = document.getElementById('game');

  // 마우스 이동 기록
  document.addEventListener('mousemove', () => {
    lastMouseMoveTime = Date.now();
  });

  function detectAutoClicker(now, clickX, clickY) {
    clickTimestamps.push(now);
    clickPositions.push({ x: clickX, y: clickY });

    if (clickTimestamps.length > 10) clickTimestamps.shift();
    if (clickPositions.length > 10) clickPositions.shift();

    const intervals = clickTimestamps.slice(1).map((time, i) => time - clickTimestamps[i]);
    const allSameInterval = intervals.every(v => v === intervals[0]);
    const allTooFast = intervals.every(v => v < 80);

    const noMouseMove = now - lastMouseMoveTime > 3000;

    const positionDiffs = clickPositions.slice(1).map((pos, i) => {
      const dx = Math.abs(pos.x - clickPositions[i].x);
      const dy = Math.abs(pos.y - clickPositions[i].y);
      return dx + dy;
    });
    const allSamePosition = positionDiffs.every(diff => diff < 5);

    if ((allSameInterval || allTooFast) && noMouseMove && allSamePosition) {
      suspiciousClicks++;
      updateWarningInFirebase(suspiciousClicks);

      if (suspiciousClicks >= maxSuspiciousClicks) {
        alert("❌ 오토마우스 의심으로 퇴장 처리됩니다.");

        if (userGrade && userClass && userName) {
          const userKey = `${userGrade}_${userClass}_${userName}`;
          firebase.database().ref("scores/" + userKey).remove();
        }

        // 퇴장 페이지 URL 수정 가능
        window.location.href = "https://www.naver.com";
      } else {
        alert(`⚠️ 오토마우스 의심 ${suspiciousClicks}/${maxSuspiciousClicks}`);
      }
    } else {
      suspiciousClicks = 0; // 의심 조건 충족하지 않으면 초기화
    }
  }

  // Firebase에 경고 횟수 기록
  function updateWarningInFirebase(warningCount) {
    if (userGrade && userClass && userName) {
      const userKey = `${userGrade}_${userClass}_${userName}`;
      firebase.database().ref("warnings/" + userKey).set({
        warnings: warningCount,
        timestamp: new Date().toISOString()
      });
    }
  }

  // 게임 시작
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
      alert("학년, 반, 이름을 모두 입력해주세요.");
    }
  });

  // 클릭 이벤트 처리
  coinButton.addEventListener('click', function (e) {
    const now = Date.now();
    if (now - lastClickTime < 100) return;
    lastClickTime = now;

    detectAutoClicker(now, e.clientX, e.clientY);

    score += 1;
    scoreDisplay.textContent = score;
  });
</script>
