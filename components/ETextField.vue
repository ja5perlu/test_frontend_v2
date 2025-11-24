<template>
  <div class="e-textfield">
    <label v-if="label" :for="id" class="e-textfield__label">{{ label }}</label>
    <input
      :id="id"
      class="e-textfield__input"
      :placeholder="placeholder"
      :type="type"
      :value="value"
      @input="onInput($event)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  id?: string // 若使用者有輸入，以使用者輸入的為主，若沒有請產出一個唯一 ID
  label?: string
  value?: string | number
  placeholder?: string
  type?: string
}

const props = withDefaults(defineProps<Props>(), { type: 'text' })
const emit = defineEmits<{
  (e: 'update:value', val: string | number): void
}>()

const id = computed(() => props.id ?? `e-tf-${Math.random().toString(36).slice(2, 9)}`)

function onInput(e: Event) {
  const target = e.target as HTMLInputElement
  emit('update:value', target.value)
}
</script>

<style scoped lang="scss">
.e-textfield {
  display: flex;
  flex-direction: column;

  &__label {
    margin-bottom: 0.25rem;
    font-size: 0.9rem;
    color: #eee;
  }

  &__input {
    background: transparent;
    border: 1px solid rgba(255,255,255,0.15);
    padding: 0.6rem 0.75rem;
    border-radius: 6px;
    color: #fff;
    outline: none;
    transition: box-shadow .08s ease, border-color .08s ease;

    &:focus {
      border-color: rgba(255,255,255,0.35);
      box-shadow: 0 6px 14px rgba(0,0,0,0.3);
    }
  }
}
</style>
