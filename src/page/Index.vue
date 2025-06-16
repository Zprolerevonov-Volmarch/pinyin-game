<script setup lang="ts">
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import {type Pinyin, pinyinData} from '../script/pinyin'

const router = useRouter()
const audio = new Audio()
const activeTabIndex = ref(0)

function playAudio(pinyin: Pinyin) {
  audio.src = `/audio/${pinyin.file}.wav`
  audio.play()
}

function startGame() {
  router.push('/game')
}
</script>

<template>
  <div class="container">
    <h1 class="title">拼音学习</h1>

    <div class="start-game">
      <!-- 替换为原生按钮，并应用新的样式 -->
      <button class="start-btn" @click="startGame">
        开始游戏
      </button>
    </div>

    <div class="native-tabs">
      <div class="tabs-nav">
        <button
            v-for="(tab, index) in pinyinData"
            :key="tab.key"
            :class="['tab-button', { active: activeTabIndex === index }]"
            @click="activeTabIndex = index"
        >
          {{ tab.title }}
        </button>
      </div>

      <div class="tabs-content">
        <div
            v-for="(tab, index) in pinyinData"
            :key="tab.key"
            v-show="activeTabIndex === index"
            class="tab-panel"
        >
          <div class="grid">
            <button
                v-for="pinyin in tab.pinyins"
                :key="pinyin.file"
                class="pinyin-btn"
                @click="playAudio(pinyin)"
            >
              {{ pinyin.display }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* --- 1. 去掉蓝色点击高光 --- */
button {
  -webkit-tap-highlight-color: transparent;
}

.container {
  min-height: 100vh;
  padding: 20px;
  /* 使用和游戏页一致的背景，保持风格统一 */
  background: linear-gradient(180deg, #1f2a37, #111827);
  color: #e5e7eb;
  font-family: '阿里妈妈东方大楷', sans-serif;
}

.title {
  text-align: center;
  font-size: 38px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 25px;
}

.start-game {
  text-align: center;
  margin-bottom: 25px;
}

/* 重新设计“开始游戏”按钮，使其更美观 */
.start-btn {
  padding: 12px 30px;
  font-size: 20px;
  font-family: inherit;
  color: white;
  background-color: #4CAF50;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.5);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 10px rgba(76, 175, 80, 0.3);
  }
}

.native-tabs {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 10px;
}

.tabs-nav {
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.tab-button {
  padding: 12px 20px;
  font-size: 18px; /* Tab 标题字体也稍大一点 */
  font-family: inherit;
  color: #9ca3af;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.3s ease;
  position: relative;
  font-weight: bold;

  &:hover {
    color: #e5e7eb;
  }

  &.active {
    color: #4CAF50;
  }

  &.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 3px; /* 下划线加粗一点更明显 */
    border-radius: 3px;
    background-color: #4CAF50;
  }
}

.tabs-content {
  padding: 20px 10px 10px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(50px, 1fr)); /* 按钮最小宽度也增大 */
  gap: 12px; /* 间距也稍大一点 */
}

/* --- 2. 增大拼音按钮字体并优化样式 --- */
.pinyin-btn {
  width: 100%;
  height: 48px; /* 增加高度以容纳更大的字体 */
  font-size: 22px; /* 显著增大字体 */
  font-family: inherit;
  font-weight: bold;
  background: #374151;
  border: 1px solid #4b5563;
  border-radius: 8px; /* 更圆润的圆角 */
  color: #e5e7eb;
  padding: 0;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #4b5563;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.98);
  }
}
</style>
