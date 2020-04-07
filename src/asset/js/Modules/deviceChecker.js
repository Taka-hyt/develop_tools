const breakPoint = {
    pc: 1001,
    tab: 1000,
    sp: 576,
};

export const isSp = window.matchMedia(`screen and (max-width: ${breakPoint.sp}px)`).matches;
export const isPc = window.matchMedia(`screen and (min-width: ${breakPoint.tab + 1}px)`).matches;
export const isTablet = window.matchMedia(`screen and (max-width: ${breakPoint.tab}px)`).matches;
