import Vue from 'vue'

const DanMessageBoxConstructor = Vue.extend(require('./DanMessageBox.vue').default);

const DanMessageBox = (showMessage, okHandle, cancelForbid) => {
  const DanMessageBoxInstance = new DanMessageBoxConstructor({
    data: {
      showMessage: showMessage,
      cancelForbid: cancelForbid
    },
    methods: {
      ok: okHandle
    }
  });

  DanMessageBoxInstance.id = 'dan-message-box';
  DanMessageBoxInstance.vm = DanMessageBoxInstance.$mount();
  DanMessageBoxInstance.vm.visible = true;
  DanMessageBoxInstance.dom = DanMessageBoxInstance.vm.$el;
  document.body.appendChild(DanMessageBoxInstance.dom);
  return DanMessageBoxInstance.vm
};

const DanNoticeConstructor = Vue.extend(require('./DanNotice.vue').default);

const DanNotice = (showMessage, time = 0) => {
  const DanNoticeInstance = new DanNoticeConstructor({
    data: {
      showMessage: showMessage,
      time: time
    },
  });

  DanNoticeInstance.id = 'dan-notice';
  DanNoticeInstance.vm = DanNoticeInstance.$mount();
  DanNoticeInstance.vm.visible = true;
  DanNoticeInstance.dom = DanNoticeInstance.vm.$el;
  document.body.appendChild(DanNoticeInstance.dom);
  return DanNoticeInstance.vm
};

export default {
  install: Vue => {
    Vue.prototype.$danMessageBox = DanMessageBox
    Vue.prototype.$danNotice = DanNotice
  }
}
