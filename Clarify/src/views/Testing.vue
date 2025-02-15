<template>
  <div>
    <Header :isDarkMode="isDarkMode" @toggle-dark-mode="toggleDarkMode" />
    <main class="main-content">
      <h2 class="title">{{ questions[currentQuestionIndex].question }}</h2>
      <input
          type="text"
          v-model="userInput"
          :placeholder="questions[currentQuestionIndex].placeholder"
          class="text-input"
          @input="checkInputEntered"
      />
    </main>
    <footer class="footer">
      <button class="btn back-btn" @click="handleBack" :disabled="currentQuestionIndex === 0">Back</button>
      <button class="btn next-btn" @click="handleClick" :disabled="!isInputEntered">{{ nextButtonText }}</button>
    </footer>

    <!-- Popup Modal -->
    <div v-if="showPopup" class="popup-overlay">
      <div class="popup-content">
        <h3>Are you sure you want to start the test?</h3>
        <button class="popup-buttons" @click="startTestConfirmed">Start</button>
        <button class="popup-buttons" @click="closePopup">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, computed, defineEmits} from 'vue';
import {useRouter} from 'vue-router';
import Header from '@/components/Header.vue';

const isDarkMode = ref(localStorage.getItem('darkMode') === 'true');
const userInput = ref('');
const currentQuestionIndex = ref(0);
const isInputEntered = ref(false);
const userData = ref({name: '', age: ''});
const router = useRouter();
const emit = defineEmits(['user-data']);
const showPopup = ref(false);

const questions = [
  {question: 'What is your name?', placeholder: 'Please enter your name'},
  {question: 'What is your age?', placeholder: 'Please enter your age'},
];

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
  userInput.value = userData.value.name;
});

const checkInputEntered = () => {
  if (currentQuestionIndex.value === 0) {
    isInputEntered.value = userInput.value.trim().length > 0;
  } else if (currentQuestionIndex.value === 1) {
    isInputEntered.value = userInput.value.trim().length > 0 && !isNaN(userInput.value);
  }
};

const handleClick = () => {
  if (currentQuestionIndex.value === 0) {
    userData.value.name = userInput.value;
  } else if (currentQuestionIndex.value === 1) {
    userData.value.age = userInput.value;
  }

  if (currentQuestionIndex.value < questions.length - 1) {
    currentQuestionIndex.value++;
    userInput.value = currentQuestionIndex.value === 1 ? userData.value.age : '';
    checkInputEntered();
  } else {
    saveData();
    showPopup.value = true; // Show the popup before starting the test
  }
};

const startTest = () => {
  router.push({
    path: '/test',
    query: {
      name: userData.value.name,
      age: userData.value.age
    }
  });
};

const startTestConfirmed = () => {
  showPopup.value = false; // Close the popup
  startTest();
};

const closePopup = () => {
  showPopup.value = false; // Close the popup without starting the test
};

const handleBack = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
    userInput.value = currentQuestionIndex.value === 0 ? userData.value.name : userData.value.age;
    checkInputEntered();
  }
};

const saveData = () => {
  emit('user-data', userData.value);
};

const nextButtonText = computed(() => {
  return currentQuestionIndex.value === questions.length - 1 ? 'Start Test' : 'Next';
});
</script>

<style scoped>
/* Existing styles */
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

.title {
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.text-input {
  width: 80%;
  max-width: 400px;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid var(--color-input-border);
  background: var(--color-input-bg);
  color: var(--color-text);
  border-radius: 5px;
  box-sizing: border-box;
  transition: border-color 0.3s ease, background 0.3s ease;
}

.text-input:focus {
  border-color: var(--color-button-bg);
  outline: none;
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
  justify-content: space-between;
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

/* Popup styles */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-content {
  padding: 100px;
  background-color: var(--color-background);
  border-radius: 5px;
  text-align: center;
  width: 300px;
  position: relative;
  box-shadow: 0 0 100px var(--color-primary); /* Add glow effect with primary color */
}


.popup-content h3 {
  margin-bottom: 20px;
}

.popup-buttons {
  background-color: var(--color-button-bg);
  color: var(--color-button-text);
  border: none;
  padding: 10px 20px;
  margin: 7px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.3s, transform 0.3s;
}
</style>
