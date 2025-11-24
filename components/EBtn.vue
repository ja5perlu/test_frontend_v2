<template>
  <button
    :class="['e-btn', `e-btn--${color}`]"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot>{{ text }}</slot>
  </button>
</template>

<script setup lang="ts">
interface Props {
  text?: string // 若有輸入時以此為主，若沒有就顯示 slot
  color?: 'success' | 'error' | 'warn' // 預設為 success
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), { color: 'success', disabled: false })
</script>

<style scoped lang="scss">
.e-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.06s ease, box-shadow 0.06s ease, opacity 0.06s ease;

  &--success {
    background: #198754;
    color: #fff;
  }

  &--error {
    background: #dc3545;
    color: #fff;
  }

  &--warn {
    background: #ffc107;
    color: #222;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.25);
    opacity: 0.98;
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
    opacity: 0.9;
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    transform: none;
    box-shadow: none;
  }
}
</style>
