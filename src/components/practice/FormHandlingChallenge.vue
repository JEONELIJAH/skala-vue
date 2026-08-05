<script setup>
import { computed, ref } from 'vue'

const form = ref({
  name: '',
  age: null,
  agree: false,
  interests: [],
  role: 'student',
  city: '',
  lazyNote: '',
})

const formPreview = computed(() => JSON.stringify(form.value, null, 2))
</script>

<template>
  <div class="form-demo">
    <form class="form-grid" @submit.prevent>
      <!-- v-model을 사용하여 양방향 데이터 바인딩을 설정합니다. -->
      <label>
        <span>text + .trim</span>
        <!-- .trim은 입력된 값의 양끝 공백을 제거합니다. -->
        <input v-model.trim="form.name" type="text" placeholder="이름 양끝 공백 제거" />
      </label>

      <label>
        <span>number + .number</span>
        <!-- .number는 입력된 값을 숫자로 변환합니다. -->
        <input v-model.number="form.age" type="number" min="0" placeholder="나이" />
      </label>

      <fieldset>
        <legend>단일 checkbox</legend>
        <label class="choice"><input v-model="form.agree" type="checkbox" /> 약관 동의</label>
      </fieldset>

      <fieldset>
        <legend>복수 checkbox</legend>
        <div class="choice-row">
          <label class="choice">
            <input v-model="form.interests" type="checkbox" value="Vue" /> Vue
          </label>
          <label class="choice">
            <input v-model="form.interests" type="checkbox" value="Pinia" /> Pinia
          </label>
          <label class="choice">
            <input v-model="form.interests" type="checkbox" value="Axios" /> Axios
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend>radio</legend>
        <div class="choice-row">
          <label class="choice">
            <input v-model="form.role" type="radio" value="student" /> 학습자
          </label>
          <label class="choice">
            <input v-model="form.role" type="radio" value="developer" /> 개발자
          </label>
        </div>
      </fieldset>

      <label>
        <span>select</span>
        <select v-model="form.city">
          <!-- disabled는 선택할 수 없는 옵션을 나타냅니다. -->
          <option disabled value="">지역 선택</option>
          <option>서울</option>
          <option>수원</option>
          <option>부산</option>
        </select>
      </label>

      <label>
        <span>text + .lazy</span>
        <!-- .lazy는 포커스를 벗어나거나 Enter를 눌렀을 때만 값이 갱신됩니다. -->
        <input v-model.lazy="form.lazyNote" type="text" placeholder="포커스를 벗어나면 갱신" />
      </label>
    </form>

    <section class="form-preview">
      <header>
        <h3>v-model 결과</h3>
        <span>양방향 데이터 바인딩</span>
      </header>
      <pre>{{ formPreview }}</pre>
    </section>
  </div>
</template>

<style scoped>
.form-demo {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(17rem, 0.8fr);
  gap: 1rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.form-grid > label,
.form-grid fieldset {
  min-width: 0;
  margin: 0;
  padding: 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: rgb(7 48 88 / 24%);
}

.form-grid label > span,
.form-grid legend {
  display: block;
  margin-bottom: 0.45rem;
  color: var(--color-text-muted);
  font-size: 0.72rem;
  font-weight: 750;
}

.form-grid input[type='text'],
.form-grid input[type='number'],
.form-grid select {
  width: 100%;
  min-height: 2.5rem;
  padding: 0.55rem 0.65rem;
  border: 1px solid var(--color-border-hover);
  border-radius: var(--radius-control);
  background: var(--glass-control);
  color: var(--color-heading);
}

.choice-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.choice {
  color: var(--color-text);
  font-size: 0.8rem;
}

.choice input {
  margin-right: 0.3rem;
}

.form-preview {
  min-width: 0;
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: rgb(5 35 67 / 42%);
}

.form-preview header {
  display: flex;
  gap: 0.5rem;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.form-preview h3 {
  font-size: 0.92rem;
}

.form-preview span {
  color: var(--color-text-muted);
  font-size: 0.68rem;
}

.form-preview pre {
  margin: 0;
  color: #c9f1ff;
  font-size: 0.76rem;
  line-height: 1.65;
  white-space: pre-wrap;
}

@media (max-width: 48rem) {
  .form-demo,
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
