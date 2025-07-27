<template>
  <div class="p-4 max-w-xl mx-auto">
    <h1 class="text-xl font-bold mb-4">Japanese Grammar Checker</h1>
    <textarea v-model="text" rows="4" class="w-full p-2 border rounded" placeholder="Nhập câu tiếng Nhật..."></textarea>
    <button @click="checkGrammar" class="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Kiểm tra</button>

    <div v-if="loading" class="mt-2">Đang kiểm tra...</div>

    <div v-if="result">
      <h2 class="mt-4 font-semibold">Kết quả:</h2>
      <div v-if="result.matched.length">
        <ul class="mt-2 list-disc pl-5">
          <li v-for="(item, index) in result.matched" :key="index">
            <strong>{{ item.name }}</strong> ({{ item.level }}) - {{ item.meaning }}
            <div class="text-sm text-gray-600">Ví dụ: {{ item.example }}</div>
          </li>
        </ul>
      </div>
      <div v-else class="text-red-600 mt-2">{{ result.suggestion }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const text = ref('')
const result = ref(null)
const loading = ref(false)

const checkGrammar = async () => {
  loading.value = true
  result.value = null
  try {
    const res = await axios.post('http://localhost:3001/check', { text: text.value })
    result.value = res.data
  } catch (err) {
    result.value = { suggestion: 'Lỗi khi kiểm tra ngữ pháp.' }
  } finally {
    loading.value = false
  }
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
