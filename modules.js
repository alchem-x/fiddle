export const { h, render, Component, } = window['preact']
export const { useState, useRef, useEffect, useCallback } = window['preactHooks']

const htm = window['htm']
export const html = htm.bind(h)
