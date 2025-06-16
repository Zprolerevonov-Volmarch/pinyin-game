<script setup lang="ts">
// ... 你的 <script> 部分保持原样，无需任何改动 ...
import {onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import {allPinyins, type Pinyin} from '../script/pinyin'

const router = useRouter()

type GameStatus = 'playing' | 'correct' | 'wrong' | 'waiting'

interface GameState {
  score: number
  highScore: number
  currentPinyin: Pinyin | null
  options: Pinyin[]
  status: GameStatus
  remainingPinyins: Pinyin[]
  lastWrongChoice: string | null;
}

const gameState = ref<GameState>({
  score: 0,
  highScore: Number(localStorage.getItem('highScore-pinyin')) || 0,
  currentPinyin: null,
  options: [],
  status: 'waiting',
  remainingPinyins: [],
  lastWrongChoice: null,
})

const audio = new Audio()
let isPlayingAudio = false

function playCurrentAudio() {
  if (isPlayingAudio || !gameState.value.currentPinyin) return
  isPlayingAudio = true

  audio.src = `/audio/${gameState.value.currentPinyin.file}.wav`
  audio.play().catch(console.error)
  audio.onended = () => {
    isPlayingAudio = false
  }
  audio.onerror = () => {
    isPlayingAudio = false
  }
}

function getRandomOptions(correctAnswer: Pinyin, count: number = 4): Pinyin[] {
  const options = [correctAnswer]
  const availableOptions = allPinyins.filter(p => p.file !== correctAnswer.file)

  while (options.length < count) {
    const randomIndex = Math.floor(Math.random() * availableOptions.length)
    const option = availableOptions[randomIndex]
    if (!options.some(o => o.file === option.file)) {
      options.push(option)
    }
  }
  return options.sort(() => Math.random() - 0.5)
}

function checkAnswer(selectedPinyin: Pinyin) {
  if (gameState.value.status !== 'playing') return

  if (selectedPinyin.file === gameState.value.currentPinyin?.file) {
    gameState.value.status = 'correct'
    gameState.value.score += 10
    updateHighScore()
    setTimeout(nextQuestion, 1200)
  } else {
    gameState.value.status = 'wrong'
    gameState.value.lastWrongChoice = selectedPinyin.file;
    gameState.value.score = Math.max(0, gameState.value.score - 5)

    setTimeout(() => {
      gameState.value.status = 'playing';
      gameState.value.lastWrongChoice = null;
    }, 1200);
  }
}

function nextQuestion() {
  gameState.value.status = 'waiting'

  if (gameState.value.remainingPinyins.length === 0) {
    gameState.value.remainingPinyins = [...allPinyins]
  }

  const randomIndex = Math.floor(Math.random() * gameState.value.remainingPinyins.length)
  const nextPinyin = gameState.value.remainingPinyins[randomIndex]

  gameState.value.currentPinyin = nextPinyin
  gameState.value.remainingPinyins.splice(randomIndex, 1)
  gameState.value.options = getRandomOptions(nextPinyin)

  setTimeout(() => {
    gameState.value.status = 'playing'
    playCurrentAudio()
  }, 500)
}

function updateHighScore() {
  if (gameState.value.score > gameState.value.highScore) {
    gameState.value.highScore = gameState.value.score
    localStorage.setItem('highScore-pinyin', gameState.value.highScore.toString())
  }
}

function goHome() {
  router.push('/');
}

onMounted(() => {
  gameState.value.remainingPinyins = [...allPinyins]
  nextQuestion()
})
</script>

<template>
  <div class="game-container" :class="{ 'shake-it': gameState.status === 'wrong' }">
    <!-- 1. header 现在包含状态栏和播放按钮 -->
    <header class="game-header">
      <div class="top-bar">
        <button class="icon-btn home-btn" @click="goHome">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
        </button>
        <div class="score-board">
          <div class="score">
            <svg class="star-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
            <span>{{ gameState.score }}</span>
          </div>
          <div class="high-score">最高: {{ gameState.highScore }}</div>
        </div>
        <div class="placeholder"></div>
      </div>

      <!-- 播放按钮移到这里 -->
      <div class="audio-player">
        <button class="play-btn" @click="playCurrentAudio">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>
      </div>
    </header>

    <!-- 2. main 区域现在是空的，但保留用于 flex 布局占位 -->
    <main class="game-main"></main>

    <!-- 3. footer 和选项保持不变 -->
    <footer class="game-footer">
      <div class="options-grid">
        <button
            v-for="option in gameState.options"
            :key="option.file"
            class="option-btn"
            :class="{
            correct: gameState.status === 'correct' && option.file === gameState.currentPinyin?.file,
            wrong: gameState.status === 'wrong' && option.file === gameState.lastWrongChoice
          }"
            @click="checkAnswer(option)"
            :disabled="gameState.status !== 'playing'"
        >
          {{ option.display }}
        </button>
      </div>
    </footer>

    <!-- 4. 全屏反馈层保持不变 -->
    <div class="feedback-overlay">
      <!-- ... 对勾和叉号的 SVG 和 transition 保持不变 ... -->
      <transition name="feedback-anim">
        <div class="feedback-icon-wrapper" v-if="gameState.status === 'correct'">
          <svg class="feedback-svg correct-svg" viewBox="0 0 52 52">
            <circle class="circle" cx="26" cy="26" r="25" fill="none"/>
            <path class="check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
        </div>
      </transition>
      <transition name="feedback-anim">
        <div class="feedback-icon-wrapper" v-if="gameState.status === 'wrong'">
          <svg class="feedback-svg wrong-svg" viewBox="0 0 52 52">
            <circle class="circle" cx="26" cy="26" r="25" fill="none"/>
            <path class="cross" d="M16 16 36 36 M36 16 16 36"/>
          </svg>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* --- 解决蓝色点击高光 --- */
* {
  -webkit-tap-highlight-color: transparent;
}

/* --- 整体布局调整 --- */
.game-container {
  height: 100vh;
  max-height: 100vh;
  background: linear-gradient(180deg, #1f2a37, #111827);
  color: #e5e7eb;
  display: flex;
  flex-direction: column;
  font-family: '阿里妈妈东方大楷', sans-serif;
  overflow: hidden;

  &.shake-it {
    animation: shake 0.5s cubic-bezier(.36, .07, .19, .97) both;
  }
}

/* --- Header 区域现在是垂直布局，包含顶部栏和播放器 --- */
.game-header {
  padding: 15px 20px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column; /* 改为垂直排列 */
  align-items: center; /* 居中对齐 */
  gap: 20px; /* 增加顶部栏和播放器之间的间距 */
}

.top-bar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 主要操作区现在是占位，将选项推到底部 */
.game-main {
  flex-grow: 1;
}

.game-footer {
  padding: 20px;
  flex-shrink: 0;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

/* ... header 内的组件样式保持不变 ... */
.icon-btn {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color .2s, color .2s;

  svg {
    width: 28px;
    height: 28px
  }

  &:hover {
    background-color: rgba(255, 255, 255, .1);
    color: #fff
  }
}

.home-btn {
  width: 44px
}

.placeholder {
  width: 44px
}

.score-board {
  text-align: center;

  .score {
    font-size: 28px;
    font-weight: 700;
    color: #facc15;
    display: flex;
    align-items: center;
    gap: 8px;

    .star-icon {
      width: 24px;
      height: 24px
    }
  }

  .high-score {
    font-size: 14px;
    color: #6b7280
  }
}

/* 调整播放按钮大小和位置 */
.audio-player .play-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 140px; /* 可以适当调小一点 */
  height: 140px;
  color: #e5e7eb;
  cursor: pointer;
  transition: all 0.3s ease;

  svg {
    width: 60px;
    height: 60px;
    transition: transform 0.3s ease;
  }

  &:hover {
    transform: scale(1.05);
    background-color: rgba(76, 175, 80, 0.2);
    border-color: #4CAF50;

    svg {
      transform: scale(1.1);
    }
  }

  &:active {
    transform: scale(0.98);
  }
}

/* ... 选项按钮样式、反馈层样式和动画关键帧都保持原样 ... */
.options-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  animation: slide-up 0.5s ease-out backwards;
}

.option-btn {
  padding: 20px;
  font-size: 32px;
  font-family: inherit;
  background-color: #374151;
  border: none;
  border-bottom: 4px solid #4b5563;
  border-radius: 12px;
  color: #e5e7eb;
  cursor: pointer;
  transition: transform 0.1s ease, background-color 0.2s, border-color 0.2s, opacity 0.2s;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  &:not(:disabled):hover {
    background-color: #4b5563;
  }

  &:not(:disabled):active {
    transform: translateY(2px);
    border-bottom-width: 2px;
  }

  &.correct {
    background-color: #22c55e;
    border-color: #16a34a;
    color: white;
    animation: bounce 0.6s ease;
  }

  &.wrong {
    background-color: #ef4444;
    border-color: #dc2626;
    color: white;
    animation: wrong-shake 0.5s ease;
  }
}

.feedback-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
}

.feedback-icon-wrapper {
  width: 120px;
  height: 120px;
}

.feedback-svg {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  stroke-width: 4;
  stroke-miterlimit: 10;

  .circle {
    stroke-dasharray: 166;
    stroke-dashoffset: 166;
  }

  &.correct-svg {
    .circle {
      stroke: #22c55e;
      animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) 0.1s forwards;
    }

    .check {
      stroke: #22c55e;
      stroke-dasharray: 48;
      stroke-dashoffset: 48;
      animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.6s forwards;
    }
  }

  &.wrong-svg {
    .circle {
      stroke: #ef4444;
      animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) 0.1s forwards;
    }

    .cross {
      stroke: #ef4444;
      stroke-width: 4;
      stroke-linecap: round;
      stroke-dasharray: 48;
      stroke-dashoffset: 48;
      animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.6s forwards;
    }
  }
}

.feedback-anim-enter-active, .feedback-anim-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.feedback-anim-enter-from, .feedback-anim-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
}

@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }
  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
}

@keyframes wrong-shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-5px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(5px);
  }
}

@keyframes stroke {
  to {
    stroke-dashoffset: 0;
  }
}
</style>
