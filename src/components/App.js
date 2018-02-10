import '../helpers';

import {getApiUrl} from '../utils';
import apiSettings from '../urlConfig';
import {getVapidKey} from '../utils/storageUtils';

import Message from './Message/Message';
import './App.css';
import emitter from '../emitter';
import state from '../state';
import appTemplate from './app.tpl.html';
import List from "./list/List";
import Router from './Router';
import Subscribe from "./subscribe/Subscribe";

class App {
  constructor() {
    emitter.on('search', this.getSearchResult.bind(this));
  }

  async getSearchResult(headerState) {
    try {
      state.status = 'loading';
      new Message().render('search_results');
      const resp = await fetch(getApiUrl(headerState));
      const json = await resp.json();
      state.data = {...json};
      state.status = json.resultCount ? 'init' : 'noContent';
      new List().render();
    } catch (e) {
      state.status = 'error';
    }
  }

  render() {
    let appContainer = document.querySelector('#itunes-search');
    appContainer.innerHTML = appTemplate();
    new Router();
    new Subscribe();
  }
}

export default App;
