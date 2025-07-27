<template>
  <div class="container">
    <h1>📝 Kiểm tra ngữ pháp tiếng Nhật</h1>
    <textarea v-model="text" placeholder="Nhập câu tiếng Nhật..." rows="4"></textarea>
    <button @click="checkGrammar">Kiểm tra</button>

    <div v-if="results.length">
      <h2>Kết quả:</h2>
      <ul>
        <li v-for="(r, index) in results" :key="index">
          <strong>{{ r.name }} ({{ r.level }})</strong>: {{ r.meaning }}<br />
          Ví dụ: {{ r.example }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const text = ref('')
const results = ref([])

async function checkGrammar() {
  const res = await axios.post('http://localhost:3001/check', { text: text.value })
  results.value = res.data.results
}
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
  padding: 1rem;
  font-family: sans-serif;
}
textarea {
  width: 100%;
  font-size: 16px;
  margin-bottom: 1rem;
}
button {
  padding: 0.5rem 1rem;
  font-size: 16px;
}
</style>
