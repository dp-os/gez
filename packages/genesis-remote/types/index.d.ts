import Vue from 'vue';
export default class RemoteView {
    static install<T>(_Vue: typeof Vue, options?: T): void;
}
