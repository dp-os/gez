import Vue from 'vue';

export const Logo = Vue.extend({
    render() {
        return (
            <img
                src={require('./images/logo.svg')}
                alt="LOGO"
                height="100"
                width="100"
            />
        );
    }
});
