import { clipboard } from 'electron';
import _ from 'underscore';
import loadTemplate from '../../../utils/loadTemplate';
import baseVw from '../../baseVw';
import qr from 'qr-encode';

export default class extends baseVw {
  constructor(options = {}) {
    super(options);

    this._state = {
      ...options.initialState || {},
    };
  }

  className() {
    return 'receiveMoney';
  }

  events() {
    return {
      'click .js-receiveAddress': 'onClickReceiveAddress',
      'mouseleave .js-receiveAddress': 'onAddressLeave',
    };
  }

  getState() {
    return this._state;
  }

  setState(state, replace = false) {
    let newState;

    if (replace) {
      this._state = {};
    } else {
      newState = _.extend({}, this._state, state);
    }

    if (!_.isEqual(this._state, newState)) {
      this._state = newState;
      this.render();
    }

    return this;
  }

  onClickReceiveAddress() {
    clipboard.writeText(this.getState().address);
    this.$copiedText.fadeIn(600);
  }

  onAddressLeave() {
    this.$copiedText.fadeOut(600);
  }

  get $copiedText() {
    return this._$copiedText ||
      (this._$copiedText = this.$('.js-copiedText'));
  }

  render() {
    loadTemplate('modals/wallet/receiveMoney.html', (t) => {
      // defaulting to an empty image - needed for proper spacing
      // when the spinner is showing
      let qrDataUri = 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';

      if (this.getState().address) {
        qrDataUri = qr(`bitcoin:${qrDataUri}`,
          { type: 6, size: 5, level: 'Q' });
      }

      this.$el.html(t({
        ...this._state,
        qrDataUri,
        errors: {},
      }));

      this._$copiedText = null;
    });

    return this;
  }
}
