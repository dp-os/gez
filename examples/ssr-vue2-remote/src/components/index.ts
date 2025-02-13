// 组件导出
export { default as UiButton } from './ui-button.vue';
export { default as UiCard } from './ui-card.vue';

// 类型导出
import type UiButtonComponent from './ui-button.vue';
import type UiCardComponent from './ui-card.vue';

export type ButtonProps = InstanceType<typeof UiButtonComponent>['$props'];
export type ButtonEmits = InstanceType<typeof UiButtonComponent>['$emit'];

export type CardProps = InstanceType<typeof UiCardComponent>['$props'];
export type CardEmits = InstanceType<typeof UiCardComponent>['$emit'];
