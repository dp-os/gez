<template>
  <button 
    :class="[
      'button',
      `button--${type}`,
      `button--${size}`,
      { 'is-loading': loading }
    ]" 
    :disabled="loading || disabled"
    @click="handleClick"
  >
    <div class="button__content">
      <span v-if="loading" class="button__loading">
        <svg class="animate-spin" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
        </svg>
      </span>
      <slot></slot>
    </div>
  </button>
</template>

<script setup lang="ts">
export type ButtonType =
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'text';
export type ButtonSize = 'small' | 'medium' | 'large';

interface Props {
    type?: ButtonType;
    size?: ButtonSize;
    loading?: boolean;
    disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    type: 'primary',
    size: 'medium',
    loading: false,
    disabled: false
});

const emit = defineEmits<(e: 'click', event: MouseEvent) => void>();

const handleClick = (event: MouseEvent) => {
    if (!props.loading && !props.disabled) {
        emit('click', event);
    }
};
</script>

<style>
.button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
  border: none;
  outline: none;
  min-width: 5rem;
  padding: 0.5rem 1rem;
}

.button__content {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.button__loading {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
}

.button__loading svg {
  width: 100%;
  height: 100%;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.opacity-25 {
  opacity: 0.25;
}

.opacity-75 {
  opacity: 0.75;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.button--primary {
  background-color: var(--color-primary);
  color: white;
}

.button--primary:hover {
  background-color: var(--color-primary-dark);
}

.button--secondary {
  background-color: white;
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.button--secondary:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.button--text {
  background-color: transparent;
  color: var(--color-primary);
  padding-left: 0;
  padding-right: 0;
}

.button--text:hover {
  color: var(--color-primary-dark);
  text-decoration: underline;
}

.button--small {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}

.button--medium {
  padding: 0.5rem 1rem;
  font-size: 1rem;
}

.button--large {
  padding: 0.625rem 1.25rem;
  font-size: 1.125rem;
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
