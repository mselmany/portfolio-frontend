import getters from "./getters";
import actions from "./actions";
import mutations from "./mutations";

export default {
  namespaced: true,
  state: {
    all: {},
    playlist: [],
    current: {}
  },
  getters,
  actions,
  mutations
};

/*
TODO@5: yenile!!; sounditem ları ve player ı direk storedan yönet,
 storeda tüm media listesini dizi ve map olarak sakla(birbirine reference vererek), duruma göre 2sinden birinden çek (preformans için),
 media stateleri sadece stora da olacak, componentte hiç bişey olmayacak, component statei storedan almalı
*/
