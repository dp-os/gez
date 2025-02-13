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
    <span v-if="loading" class="button__loading">
      <svg class="animate-spin" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
      </svg>
    </span>
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
type ButtonType = 'primary' | 'secondary' | 'danger' | 'warning' | 'success';
type ButtonSize = 'small' | 'medium' | 'large';

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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
  border: none;
  outline: none;
}

.button--primary {
  background-color: var(--color-primary);
  color: white;
}

.button--primary:hover {
  background-color: var(--color-primary-dark);
}

.button--secondary {
  background-color: var(--color-secondary);
  color: white;
}

.button--secondary:hover {
  background-color: var(--color-secondary-dark);
}

.button--danger {
  background-color: var(--color-danger);
  color: white;
}

.button--danger:hover {
  background-color: var(--color-danger-dark);
}

.button--warning {
  background-color: var(--color-warning);
  color: white;
}

.button--warning:hover {
  background-color: var(--color-warning-dark);
}

.button--success {
  background-color: var(--color-success);
  color: white;
}

.button--success:hover {
  background-color: var(--color-success-dark);
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

.button__loading {
  margin-right: 0.5rem;
  width: 1em;
  height: 1em;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
