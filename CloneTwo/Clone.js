import { createElement } from "./Element";
import { reconcile } from "./Reconcile";
import { useState } from "./CreateInstance";
import { Component } from "./Component";

let rootInstance = null;

function render(element, container) {

  rootInstance = reconcile(container, rootInstance, element);
}

const Clone = { createElement, render, useState, Component };

export default Clone;



