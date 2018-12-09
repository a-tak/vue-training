import { shallowMount, Wrapper, createLocalVue, mount } from '@vue/test-utils';
import HelloWorld from '@/components/HelloWorld.vue';
import Vuetify from 'vuetify';
import Vue from 'vue';

describe('HelloWorld.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message';
    const wrapper = shallowMount(HelloWorld, {
      propsData: { msg },
    });
    expect(wrapper.text()).toMatch(msg);
  });

  it('click!テストこれはいける', () => {
    let wrapper: Wrapper<HelloWorld>;
    wrapper = shallowMount(HelloWorld);
    const cancelStub = jest.fn();
    wrapper.setMethods( { clickHandler: cancelStub});

    const cancelBtn = wrapper.find('button');
    cancelBtn.trigger('click');
    expect(cancelStub.mock.calls.length).toBe(1);

  });

  it('click!テスト2 idで探してもいけるはず', () => {
    let wrapper: Wrapper<HelloWorld>;
    wrapper = shallowMount(HelloWorld);
    const cancelStub = jest.fn();
    wrapper.setMethods( { clickHandler: cancelStub});

    const cancelBtn = wrapper.find('#click-btn-hoge1234');
    cancelBtn.trigger('click');
    expect(cancelStub.mock.calls.length).toBe(1);

  });

  it('click!テスト3 vuetifyでどうか?', () => {
    let wrapper: Wrapper<HelloWorld>;
    wrapper = shallowMount(HelloWorld, {
      mocks: {
        $vuetify: { breakpoint: {} },
      },
    });

    const cancelStub = jest.fn();
    wrapper.setMethods( { clickHandler: cancelStub});

    const cancelBtn = wrapper.find('#task-edit-cancelbtn-test123');
    cancelBtn.trigger('click');
    expect(cancelStub.mock.calls.length).toBe(1);

  });

  it('click!テスト4 そもそもvuetifyのボタン押せてる?押せてればalertが実装されていないエラーになるはず', () => {
    let wrapper: Wrapper<HelloWorld>;
    wrapper = shallowMount(HelloWorld, {
      mocks: {
        $vuetify: { breakpoint: {} },
      },
    });

    // const cancelStub = jest.fn();
    // wrapper.setMethods( { clickHandler: cancelStub});

    const cancelBtn = wrapper.find('#task-edit-cancelbtn-test123');
    cancelBtn.trigger('click');
    // expect(cancelStub.mock.calls.length).toBe(1);

  });

  // 想定通り止まった
  // ● HelloWorld.vue › click!テスト5 ID違うので止まるはず
  // [vue-test-utils]: find did not return #task-edit-cancelbtn-test123AAAA, cannot call trigger() on empty Wrapper
  it('click!テスト5 ID違うので止まるはず', () => {
    let wrapper: Wrapper<HelloWorld>;
    wrapper = shallowMount(HelloWorld, {
      mocks: {
        $vuetify: { breakpoint: {} },
      },
    });

    // const cancelStub = jest.fn();
    // wrapper.setMethods( { clickHandler: cancelStub});

    const cancelBtn = wrapper.find('#task-edit-cancelbtn-test123AAAA');
    cancelBtn.trigger('click');
    // expect(cancelStub.mock.calls.length).toBe(1);

  });

  // XPath指定。これだと見つからないエラーになる
  it('click!テスト6 パスの指定を変えてみる', () => {
    let wrapper: Wrapper<HelloWorld>;
    wrapper = shallowMount(HelloWorld, {
      mocks: {
        $vuetify: { breakpoint: {} },
      },
    });

    const cancelBtn = wrapper.find('//*[@id="task-edit-cancelbtn-test123"]');
    cancelBtn.trigger('click');

  });

  // 要素が見つからないエラーになった
  // ● HelloWorld.vue › click!テスト7 chromeのEventlitenerのclickに書いてある文字列そのまま入れてみる
  // [vue-test-utils]: find did not return button#task-edit-cancelbtn-test123.v-btn.theme--light,
  //  cannot call trigger() on empty Wrapper
  it('click!テスト7 chromeのEventlitenerのclickに書いてある文字列そのまま入れてみる', () => {
    let wrapper: Wrapper<HelloWorld>;
    wrapper = shallowMount(HelloWorld, {
      mocks: {
        $vuetify: { breakpoint: {} },
      },
    });

    const cancelBtn = wrapper.find('button#task-edit-cancelbtn-test123.v-btn.theme--light');
    cancelBtn.trigger('click');

  });

  // これも要素がみつからないになる
  it('click!テスト8 buttonを指定してみる', () => {
    let wrapper: Wrapper<HelloWorld>;
    wrapper = shallowMount(HelloWorld, {
      mocks: {
        $vuetify: { breakpoint: {} },
      },
    });

    const cancelBtn = wrapper.find('button#task-edit-cancelbtn-test123');
    cancelBtn.trigger('click');

  });

  // Vuetifyがjestで読めていないのでは?
  // router使う場合はそれも読み込む
  // https://fernandobasso.github.io/javascript/unit-testing-vue-vuetify-with-jest-and-vue-test-utils.html
  // しかし↓
  //     [Vuetify] Multiple instances of Vue detected
  // See https://github.com/vuetifyjs/vuetify/issues/4068
  // If you're seeing "$attrs is readonly", it's caused by this
  // it('click!テスト9 localvueというのを使うみたい', () => {
  //   const localvue = createLocalVue();
  //   localvue.use(Vuetify);

  //   let wrapper: Wrapper<HelloWorld>;
  //   wrapper = shallowMount(HelloWorld, {
  //     localVue: localvue,
  //     mocks: {
  //       $vuetify: { breakpoint: {} },
  //     },
  //   });

  //   const cancelBtn = wrapper.find('#task-edit-cancelbtn-test123');
  //   cancelBtn.trigger('click');

  // });

  // https://stackoverflow.com/questions/51990753/vue-js-vuetify-issue-running-my-first-unit-test-with-jest
  // →通った!!!いや、通っちゃ駄目だ。alertでエラーになってもらわねば
  it('click!テスト10 localvue使うなだって😀', () => {
    Vue.use(Vuetify);

    let wrapper: Wrapper<HelloWorld>;
    wrapper = shallowMount(HelloWorld, {
      mocks: {
        $vuetify: { breakpoint: {} },
      },
    });

    const cancelBtn = wrapper.find('#task-edit-cancelbtn-test123');
    cancelBtn.trigger('click');

  });

  // V-BTN-STUBというのが取れてしまっている
  // shallowMountだからか!
  it('click!テスト11 いったい今なんの要素が取れているのか?', () => {
    Vue.use(Vuetify);

    let wrapper: Wrapper<HelloWorld>;
    wrapper = shallowMount(HelloWorld, {
      mocks: {
        $vuetify: { breakpoint: {} },
      },
    });

    const cancelBtn = wrapper.find('#task-edit-cancelbtn-test123');
    expect(cancelBtn.element.tagName).toBe('BUTTON');

  });

  it('click!テスト12 普通のボタンは何のタグがとれる?', () => {
    let wrapper: Wrapper<HelloWorld>;
    wrapper = shallowMount(HelloWorld);
    const cancelStub = jest.fn();
    wrapper.setMethods( { clickHandler: cancelStub});

    const cancelBtn = wrapper.find('#click-btn-hoge1234');
    expect(cancelBtn.element.tagName).toBe('BUTTON');

  });

  it('click!テスト13 mount指定すればVuetifyも使えるのでは?', () => {
    Vue.use(Vuetify);

    let wrapper: Wrapper<HelloWorld>;
    wrapper = mount(HelloWorld, {
      mocks: {
        $vuetify: { breakpoint: {} },
      },
    });

    const cancelBtn = wrapper.find('#task-edit-cancelbtn-test123');
    expect(cancelBtn.element.tagName).toBe('BUTTON');

  });

  // やっといけた
  it('click!テスト14 mount指定すればVuetifyでメソッド呼ばれるはず!!', () => {
    Vue.use(Vuetify);

    let wrapper: Wrapper<HelloWorld>;
    wrapper = mount(HelloWorld, {
      mocks: {
        $vuetify: { breakpoint: {} },
      },
    });

    const cancelStub = jest.fn();
    wrapper.setMethods( { clickHandler: cancelStub});

    const cancelBtn = wrapper.find('#task-edit-cancelbtn-test123');
    cancelBtn.trigger('click');

  });
});
