import {defineStore} from "pinia";

export const LayoutStore = defineStore('LayoutStore', {
    state: () => ({
        winHeight: 0,
        winWidth: 0,
        sidebarLeftPanelWidth: 100,
        sidebarRightPanelWidth: 0,
        stageBannerPanelHeight: 0,
        setterPanelWidth: 0
    }),
    getters: {
        sidebarPanelWidth: (state) => state.sidebarLeftPanelWidth + state.sidebarRightPanelWidth,
        sidebarPanelHeight: (state) => state.winHeight,
        stagePanelWidth: (state) => state.winWidth - state.sidebarLeftPanelWidth - state.sidebarRightPanelWidth - state.setterPanelWidth,
        stageMainPanelHeight: (state) => state.winHeight - state.stageBannerPanelHeight
    },
    actions: {
        /**
         *  window 窗口调整
         */
        resize() {
            this.winHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
            this.winWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
            // console.log('resize', this.winHeight, this.winWidth)
        }
    },
})
