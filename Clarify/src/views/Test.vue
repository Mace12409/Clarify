<template>
  <div>
    <Header :isDarkMode="isDarkMode" @toggle-dark-mode="toggleDarkMode" />
    <main class="main-content">
      <h2>Estimate 30 Seconds</h2>
      <p v-if="countdown > 0">{{ countdown }}</p>
      <p v-if="result !== null && !hideResults">You estimated: {{ result }} seconds</p>
      <p v-if="result !== null && !hideResults">Test Result: You were {{ difference }} seconds off from 30 seconds.</p>
    </main>
    <footer class="footer">
      <button class="btn start-btn" @click="toggleTest" :disabled="isCountdownRunning">
        {{ isRunning ? 'Stop' : 'Start' }}
      </button>
    </footer>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import Header from '@/components/Header.vue';
import axios from 'axios';

const isDarkMode = ref(localStorage.getItem('darkMode') === 'true');
const isRunning = ref(false);
const isCountdownRunning = ref(false);
const hideResults = ref(false);
const startTime = ref(null);
const result = ref(null);
const difference = ref(null);
const countdown = ref(0);
let countdownInterval = null;

const route = useRoute();
const router = useRouter();

// Store user data received from testing.vue
const userName = ref(route.query.name || 'Unknown');
const userAge = ref(route.query.age || 'Unknown');

const applyDarkMode = () => {
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark-mode');
  } else {
    document.documentElement.classList.remove('dark-mode');
  }
  localStorage.setItem('darkMode', isDarkMode.value);
};

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  applyDarkMode();
};

onMounted(() => {
  applyDarkMode();
});

const toggleTest = () => {
  if (isRunning.value) {
    stopTest();
  } else {
    startCountdown();
  }
};

const startCountdown = () => {
  isCountdownRunning.value = true;
  hideResults.value = true;
  countdown.value = 3;
  countdownInterval = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(countdownInterval);
      isCountdownRunning.value = false;
      startTest();
    }
  }, 1000);
};

const startTest = () => {
  isRunning.value = true;
  startTime.value = Date.now();
  result.value = null;
  difference.value = null;

  // Save session start time
  const userData = {
    name: userName.value,
    age: userAge.value,
    sessionStart: new Date().toISOString()
  };
  localStorage.setItem('userData', JSON.stringify(userData));
};

const stopTest = async () => {
  if (!startTime.value) return;

  isRunning.value = false;
  clearInterval(countdownInterval);

  const elapsedTime = (Date.now() - startTime.value) / 1000;
  result.value = elapsedTime.toFixed(2);
  difference.value = Math.abs(30 - elapsedTime).toFixed(2);

  // Update user data with test result
  const userData = JSON.parse(localStorage.getItem('userData'));
  userData.testResult = difference.value;
  userData.stopTime = result.value; // Capture the stop time as the elapsed time
  localStorage.setItem('userData', JSON.stringify(userData));

  hideResults.value = false;
  await navigateToViewData();
};

const navigateToViewData = async () => {
  const userData = JSON.parse(localStorage.getItem('userData'));
  try {
    await axios.post('http://localhost:3000/api/save-session', {
      user_id: 1, // Replace with actual user ID if available
      username: userData.name,
      age: userData.age,
      start_time: userData.sessionStart,
      stop_time: userData.stopTime,
      test_result: userData.testResult
    });
    router.push('/view-data'); // Ensure this navigates to the correct route
  } catch (error) {
    console.error('Error logging data:', error);
  }
};

window.addEventListener('beforeunload', (event) => {
  if (isRunning.value) {
    event.preventDefault();
    event.returnValue = 'Are you sure you want to exit? Your session will end.';
  }
});
</script>

<style scoped>
.main-content {
  padding: 80px 20px;
  text-align: center;
  font-size: 1.2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 140px);
}

p {
  font-size: 1.2rem;
  margin-top: 20px;
}

.footer {
  background: var(--color-footer-bg);
  text-align: center;
  padding: 20px;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  border-top: 1px solid var(--color-text);
  display: flex;
  justify-content: center;
  box-sizing: border-box;
}

.btn {
  background-color: var(--color-button-bg);
  color: var(--color-button-text);
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.3s, transform 0.3s;
}

.btn:hover {
  background-color: #003d82;
  transform: scale(1.05);
}

.btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>