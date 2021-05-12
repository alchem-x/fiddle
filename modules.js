const htm = window.htm
const { h, render, Component, } = window.preact
const { useState, useRef, useEffect,useCallback } = window.preactHooks

const html = htm.bind(h)

export {
    h,
    html,
    render,
    useState,
    useEffect,
    useRef,
    useCallback,
    Component,
}
